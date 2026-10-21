/*
 * Builds a small, static corpus of the posts for the assistant.
 * The raw MDX is bundled at build time, so the endpoint and the browser
 * fallback can both search it without touching the content layer.
 */
export interface Chunk {
  id: string;
  title: string;
  href: string;
  heading: string;
  text: string;
  date: string;
  tags: string[];
}

interface Frontmatter {
  title: string;
  description: string;
  date: string;
  tags: string[];
  draft: boolean;
}

const rawPosts = import.meta.glob("../content/posts/**/*.{md,mdx}", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>;

const unquote = (value: string) => value.trim().replace(/^["']|["']$/g, "");

function parseFrontmatter(raw: string) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(raw);
  if (!match) return { data: {} as Partial<Frontmatter>, body: raw };

  const data: Partial<Frontmatter> = {};
  for (const line of match[1].split(/\r?\n/)) {
    const entry = /^([A-Za-z][\w-]*):\s*(.*)$/.exec(line);
    if (!entry) continue;
    const [, key, value] = entry;
    if (key === "tags") {
      data.tags = value
        .replace(/^\[|\]$/g, "")
        .split(",")
        .map(unquote)
        .filter(Boolean);
    } else if (key === "title" || key === "description" || key === "date") {
      data[key] = unquote(value);
    } else if (key === "draft") {
      data.draft = value.trim() === "true";
    }
  }
  return { data, body: match[2] };
}

/* Markdown and MDX are noisy for retrieval. Keep the prose and code, drop the markup. */
function clean(body: string) {
  return body
    .replace(/^import\s.+$/gm, "")
    .replace(/^export\s.+$/gm, "")
    .replace(/```[\w-]*\r?\n([\s\S]*?)```/g, "$1")
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function splitLongText(text: string, limit = 1100) {
  if (text.length <= limit) return [text];
  const parts: string[] = [];
  let current = "";
  for (const paragraph of text.split(/\n{2,}/)) {
    if (current && current.length + paragraph.length + 2 > limit) {
      parts.push(current.trim());
      current = "";
    }
    if (paragraph.length > limit) {
      for (let index = 0; index < paragraph.length; index += limit) {
        parts.push(paragraph.slice(index, index + limit).trim());
      }
    } else {
      current = `${current}\n\n${paragraph}`.trim();
    }
  }
  if (current) parts.push(current.trim());
  return parts.filter(Boolean);
}

function buildCorpus() {
  const chunks: Chunk[] = [];
  for (const [path, raw] of Object.entries(rawPosts)) {
    const slug =
      path
        .split("/")
        .pop()
        ?.replace(/\.(md|mdx)$/, "") ?? "post";
    const { data, body } = parseFrontmatter(raw);
    if (!data.title || data.draft) continue;

    const sections = clean(body).split(/\n(?=#{2,3}\s)/);
    sections.forEach((section, index) => {
      const headingMatch = /^#{2,3}\s+(.+)$/m.exec(section);
      const heading = headingMatch ? unquote(headingMatch[1]) : "Introduction";
      const text = clean(section.replace(/^#{2,3}\s+.+$/m, "")).trim();
      if (!text) return;

      for (const part of splitLongText(text)) {
        chunks.push({
          id: `${slug}-${index}-${chunks.length}`,
          title: data.title!,
          href: `/posts/${slug}`,
          heading,
          text: part,
          date: data.date ?? "",
          tags: data.tags ?? [],
        });
      }
    });
  }
  return chunks;
}

let corpus: Chunk[] | null = null;

export function getAssistantChunks() {
  if (!corpus) corpus = buildCorpus();
  return corpus;
}

const stopwords = new Set([
  "a", "about", "an", "and", "are", "as", "at", "be", "but", "by", "can", "do", "does", "for", "from",
  "had", "has", "have", "he", "her", "his", "how", "i", "if", "in", "is", "it", "its", "me", "my", "of",
  "on", "or", "our", "she", "so", "that", "the", "their", "them", "then", "there", "these", "they", "this",
  "to", "was", "we", "were", "what", "when", "where", "which", "who", "why", "will", "with", "you", "your",
]);

function termsOf(question: string) {
  return (
    question
      .toLowerCase()
      .match(/[a-z0-9]+/g)
      ?.filter((term) => term.length > 2 && !stopwords.has(term)) ?? []
  );
}

/* A plain term overlap score. Good enough when the embedding service is unavailable. */
export function keywordSearch(question: string, chunks: Chunk[], limit = 4) {
  const terms = termsOf(question);
  const phrase = question.toLowerCase().trim();
  return chunks
    .map((chunk) => {
      const title = chunk.title.toLowerCase();
      const heading = chunk.heading.toLowerCase();
      const text = chunk.text.toLowerCase();
      let score = 0;
      for (const term of terms) {
        if (title.includes(term)) score += 6;
        if (heading.includes(term)) score += 4;
        score += Math.min(text.split(term).length - 1, 4);
      }
      if (phrase.length > 8 && text.includes(phrase)) score += 5;
      return { chunk, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || a.chunk.title.localeCompare(b.chunk.title))
    .slice(0, limit);
}
