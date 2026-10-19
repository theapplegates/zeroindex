import type { APIRoute, GetStaticPaths } from "astro";
import { getEndpoints } from "@/lib/api";
import { toMarkdown } from "@/lib/api-markdown";

export const getStaticPaths = (async () => {
  const endpoints = await getEndpoints();
  return endpoints.map((entry) => ({ params: { slug: entry.id }, props: { entry } }));
}) satisfies GetStaticPaths;

export const GET: APIRoute = ({ props }) =>
  new Response(toMarkdown(props.entry), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
