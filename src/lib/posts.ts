import { getCollection, type CollectionEntry } from "astro:content";

export type Post = CollectionEntry<"posts">;

export const postHref = (id: string) => `/posts/${id}`;
export const tagHref = (tag: string) => `/topics/${tag}`;

export const tagLabel = (tag: string) =>
  tag
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

export const formatPostDate = (date: Date) =>
  date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });

/* A rough reading time is enough for a post header. */
export const readingTime = (body?: string) => {
  if (!body) return 1;
  const words = body
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/<[^>]+>/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
};

/* Every published post, newest first. */
export async function getPosts() {
  const posts = await getCollection("posts", ({ data }) => !data.draft);
  return posts.sort(
    (a, b) =>
      b.data.date.getTime() - a.data.date.getTime() ||
      a.data.title.localeCompare(b.data.title),
  );
}

/* Every tag that has at least one published post, with its count. */
export async function getPostTags() {
  const posts = await getPosts();
  const counts = new Map<string, number>();
  for (const post of posts) {
    for (const tag of post.data.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, label: tagLabel(tag), count }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
}

export async function getPostsByTag(tag: string) {
  const posts = await getPosts();
  return posts.filter((post) => post.data.tags.includes(tag));
}
