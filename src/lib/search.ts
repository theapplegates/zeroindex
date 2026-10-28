import { render } from "astro:content";
import { getPosts, postHref, tagLabel } from "@/lib/posts";

export type SearchDocument = {
  id: string;
  title: string;
  description: string;
  category: string;
  href: string;
  headings: string[];
  content: string;
};

const headingPattern = /^(#{1,3})\s+(.+?)\s*#*\s*$/;
const attributePattern = /(?:^|\s)(?:alt|title|name)=["']([^"']*)["']/g;
const entities: Record<string, string> = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
  "&nbsp;": " ",
};

const decode = (text: string) => text.replace(/&(?:amp|lt|gt|quot|#39|nbsp);/g, (entity) => entities[entity] ?? entity);

/* Inline Markdown to the text someone would search for. */
const cleanInline = (text: string) =>
  decode(
    text
      .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
      .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
      .replace(/<\/?[A-Za-z][^>]*>/g, " ")
      .replace(/[*_~`]/g, "")
      .replace(/\s+/g, " ")
      .trim(),
  );

/* Headings in a body, ignoring anything inside a fenced code block. */
export function headingsOf(markdown: string) {
  const headings: string[] = [];
  let fence: string | null = null;

  for (const line of markdown.split("\n")) {
    const opening = line.match(/^\s*(```|~~~)/);
    if (opening) {
      fence = fence ? null : opening[1];
      continue;
    }
    if (fence) continue;

    const heading = line.match(headingPattern);
    if (heading) headings.push(cleanInline(heading[2]));
  }

  return headings;
}

/* A body as one line of plain text. Code is kept, but out of the way of the prose. */
export function toPlainText(markdown: string) {
  const prose: string[] = [];
  const code: string[] = [];
  let fence: string | null = null;

  for (const line of markdown.split("\n")) {
    const opening = line.match(/^\s*(```|~~~)/);
    if (opening) {
      fence = fence ? null : opening[1];
      continue;
    }
    if (fence) code.push(line);
    else prose.push(line);
  }

  const text = prose
    .join("\n")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, " ")
    .replace(/<(https?:\/\/[^>]+)>/g, "$1")
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/<\/?[A-Za-z][^>]*>/g, (tag) => {
      const values = [...tag.matchAll(attributePattern)].map((match) => match[1]);
      return values.length ? ` ${values.join(" ")} ` : " ";
    })
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^[ \t]*>[ \t]?/gm, "")
    .replace(/^[ \t]*(?:[-*+]|\d+\.)[ \t]+/gm, "")
    .replace(/[*_~`]/g, "");

  return decode([text, ...code].join(" ").replace(/\s+/g, " ").trim());
}

export async function getSearchDocuments(): Promise<SearchDocument[]> {
  const pages = [
    { id: "page:home", title: "Home", description: "The latest field notes", href: "/" },
    { id: "page:posts", title: "All posts", description: "Every post, newest first", href: "/posts" },
    { id: "page:topics", title: "Topics", description: "Browse posts by topic", href: "/topics" },
    { id: "page:about", title: "About", description: "About Paul and Field notes", href: "/about" },
  ].map((page) => ({ ...page, category: "Page", headings: [], content: "" }));
  const posts = await getPosts();
  return [...pages, ...(await Promise.all(posts.map(async (post) => ({
    id: `post:${post.id}`,
    title: post.data.title,
    description: post.data.description,
    category: post.data.tags.map(tagLabel).join(", ") || "Post",
    href: postHref(post.id),
    headings: (await render(post)).headings.filter((heading) => heading.depth <= 3).map((heading) => heading.text),
    content: toPlainText(post.body ?? ""),
  }))))];
}
