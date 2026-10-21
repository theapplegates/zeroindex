import type { APIRoute } from "astro";
import { getPosts, postHref } from "@/lib/posts";
import { site } from "@/lib/site";

const escapeXml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

export const GET: APIRoute = async ({ site: astroSite }) => {
  const posts = await getPosts();
  const base = astroSite ?? new URL(site.url);
  const home = new URL("/", base).href;

  const items = posts
    .map((post) => {
      const url = new URL(postHref(post.id), base).href;
      return `<item>
  <title>${escapeXml(post.data.title)}</title>
  <link>${url}</link>
  <guid isPermaLink="true">${url}</guid>
  <pubDate>${post.data.date.toUTCString()}</pubDate>
  <description>${escapeXml(post.data.description)}</description>
  ${post.data.tags.map((tag) => `<category>${escapeXml(tag)}</category>`).join("\n  ")}
</item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>${escapeXml(site.name)}</title>
  <link>${home}</link>
  <description>${escapeXml(site.description)}</description>
  <language>en-us</language>
  <atom:link href="${new URL("/rss.xml", base).href}" rel="self" type="application/rss+xml" />
  ${items}
</channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
