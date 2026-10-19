import { getCollection } from "astro:content";

export const releaseHref = (id: string) => `/changelog/${id}`;

export const formatDate = (date: Date) =>
  date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });

/* Every release, newest first. */
export async function getReleases() {
  const releases = await getCollection("changelog");
  return releases.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}
