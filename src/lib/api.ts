import { getCollection, type CollectionEntry } from "astro:content";

export const groups = [
  { id: "overview", label: "Overview" },
  { id: "indexes", label: "Indexes" },
  { id: "documents", label: "Documents" },
  { id: "search", label: "Search" },
  { id: "keys", label: "Keys" },
] as const;

export const apiHref = (id: string) => `/api/${id}`;

/* Every API page in reading order: by group, then by `order`. */
export async function getEndpoints() {
  const endpoints = await getCollection("api");
  const rank = (entry: CollectionEntry<"api">) => groups.findIndex((group) => group.id === entry.data.group);
  return endpoints.sort((a, b) => rank(a) - rank(b) || a.data.order - b.data.order);
}

/* Groups that have at least one page, each with its pages. */
export async function getEndpointGroups() {
  const endpoints = await getEndpoints();
  return groups
    .map((group) => ({
      ...group,
      endpoints: endpoints.filter((entry) => entry.data.group === group.id),
    }))
    .filter((group) => group.endpoints.length > 0);
}
