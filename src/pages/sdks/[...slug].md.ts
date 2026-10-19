import type { APIRoute, GetStaticPaths } from "astro";
import { getSdks } from "@/lib/sdks";

export const getStaticPaths = (async () => {
  const sdks = await getSdks();
  return sdks.map((sdk) => ({ params: { slug: sdk.id }, props: { sdk } }));
}) satisfies GetStaticPaths;

export const GET: APIRoute = ({ props }) => {
  const { data, body } = props.sdk;
  return new Response(`# ${data.title} SDK\n\n${data.description}\n\n${body ?? ""}`, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
};
