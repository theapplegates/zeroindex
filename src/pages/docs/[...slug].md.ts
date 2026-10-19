import type { APIRoute, GetStaticPaths } from "astro";
import { getDocs } from "@/lib/docs";

export const getStaticPaths = (async () => {
  const docs = await getDocs();
  return docs.map((doc) => ({ params: { slug: doc.id }, props: { doc } }));
}) satisfies GetStaticPaths;

export const GET: APIRoute = ({ props }) => {
  const { data, body } = props.doc;
  return new Response(`# ${data.title}\n\n${data.description}\n\n${body ?? ""}`, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
};
