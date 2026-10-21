import type { APIRoute } from "astro";
import { getAssistantChunks } from "@/lib/assistant";

export const prerender = true;

/* A plain JSON copy of the post corpus, used by the assistant's browser fallback. */
export const GET: APIRoute = () =>
  new Response(JSON.stringify(getAssistantChunks()), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
