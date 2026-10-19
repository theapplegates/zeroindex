import { getCollection, type CollectionEntry } from "astro:content";

export const categories = [
  { id: "getting-started", label: "Getting started" },
  { id: "concepts", label: "Concepts" },
  { id: "guides", label: "Guides" },
  { id: "writing", label: "Writing docs" },
] as const;

export const docHref = (id: string) => `/docs/${id}`;

/* Every doc in reading order: by category, then by `order`. */
export async function getDocs() {
  const docs = await getCollection("docs");
  const rank = (doc: CollectionEntry<"docs">) =>
    categories.findIndex((category) => category.id === doc.data.category);
  return docs.sort((a, b) => rank(a) - rank(b) || a.data.order - b.data.order);
}

/* Categories that have at least one doc, each with its docs. */
export async function getDocGroups() {
  const docs = await getDocs();
  return categories
    .map((category) => ({
      ...category,
      docs: docs.filter((doc) => doc.data.category === category.id),
    }))
    .filter((group) => group.docs.length > 0);
}
