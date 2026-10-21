import type { APIRoute, GetStaticPaths } from "astro";
import { getPosts } from "@/lib/posts";
import { postMarkdown } from "@/lib/post-markdown";

export const getStaticPaths = (async () => {
  const posts = await getPosts();
  return posts.map((post) => ({ params: { slug: post.id }, props: { post } }));
}) satisfies GetStaticPaths;

export const GET: APIRoute = ({ props }) =>
  new Response(postMarkdown(props.post), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
