import { getCollection } from "astro:content";

export const sdkHref = (id: string) => `/sdks/${id}`;

/* Every SDK, in the order set by `order`. */
export async function getSdks() {
  const sdks = await getCollection("sdks");
  return sdks.sort((a, b) => a.data.order - b.data.order);
}
