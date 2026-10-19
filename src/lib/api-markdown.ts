import type { CollectionEntry } from "astro:content";

/* The page as Markdown, with the endpoint, examples and response included. */
export function toMarkdown(entry: CollectionEntry<"api">) {
  const { title, description, method, path, request, response, status } = entry.data;
  const parts = [`# ${title}`, description];
  if (method && path) parts.push(`\`${method} ${path}\``);
  parts.push(entry.body?.trim() ?? "");
  if (request) {
    parts.push(
      "## Request",
      `\`\`\`bash\n${request.curl.trim()}\n\`\`\``,
      `\`\`\`js\n${request.javascript.trim()}\n\`\`\``,
      `\`\`\`python\n${request.python.trim()}\n\`\`\``,
    );
  }
  if (response) parts.push(`## Response (${status})`, `\`\`\`json\n${response.trim()}\n\`\`\``);
  return parts.filter(Boolean).join("\n\n");
}
