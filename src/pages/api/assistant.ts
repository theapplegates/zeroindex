import type { APIRoute } from "astro";
import { getAssistantChunks, keywordSearch, type Chunk } from "@/lib/assistant";

/*
 * The assistant backend.
 *
 * Retrieval: Gemini Embedding 2 (`gemini-embedding-2`) embeds the post chunks
 * and the question. If the model is unavailable, a plain term search is used.
 * Generation: Gemma 4 (`gemma-4-26b-a4b-it`) writes the answer from the
 * retrieved passages. Without a key the endpoint still answers with an excerpt.
 */
export const prerender = false;

const API_ROOT = "https://generativelanguage.googleapis.com/v1beta";
const CHAT_MODEL = "gemma-4-26b-a4b-it";
const EMBEDDING_MODEL = "gemini-embedding-2";

const env = (name: string) =>
  (typeof process !== "undefined" ? process.env[name] : undefined) ??
  (import.meta.env as Record<string, string | undefined>)[name];

const apiKey = () => env("GEMINI_API_KEY") ?? env("GOOGLE_API_KEY");
const chatModel = () => env("ASSISTANT_CHAT_MODEL") ?? CHAT_MODEL;
const embeddingModel = () => env("ASSISTANT_EMBEDDING_MODEL") ?? EMBEDDING_MODEL;

type Ranked = { chunk: Chunk; score: number };

const cosine = (a: number[], b: number[]) => {
  let dot = 0;
  let left = 0;
  let right = 0;
  for (let index = 0; index < a.length; index += 1) {
    dot += a[index] * b[index];
    left += a[index] * a[index];
    right += b[index] * b[index];
  }
  return dot / (Math.sqrt(left) * Math.sqrt(right) || 1);
};

const embeddingCache = new Map<string, number[]>();

async function requestJson(url: string, init: RequestInit) {
  const response = await fetch(url, { ...init, signal: AbortSignal.timeout(20000) });
  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`Gemini ${response.status}: ${detail.slice(0, 300)}`);
  }
  return response.json();
}

async function embedTexts(texts: string[], key: string, model: string) {
  const missing = texts.filter((text) => !embeddingCache.has(text));
  if (missing.length > 0) {
    for (let start = 0; start < missing.length; start += 100) {
      const batch = missing.slice(start, start + 100);
      const data = await requestJson(`${API_ROOT}/models/${model}:batchEmbedContents`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": key },
        body: JSON.stringify({
          requests: batch.map((text) => ({
            model: `models/${model}`,
            content: { parts: [{ text }] },
          })),
        }),
      });
      const embeddings = data.embeddings as { values?: number[] }[] | undefined;
      if (!embeddings || embeddings.length !== batch.length) {
        throw new Error("The embedding response did not include one vector per chunk.");
      }
      batch.forEach((text, index) => {
        const values = embeddings[index]?.values;
        if (values) embeddingCache.set(text, values);
      });
    }
  }
  return texts.map((text) => embeddingCache.get(text)!);
}

async function embedQuestion(question: string, key: string, model: string) {
  const data = await requestJson(`${API_ROOT}/models/${model}:embedContent`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": key },
    body: JSON.stringify({
      content: { parts: [{ text: `task: question answering | query: ${question}` }] },
    }),
  });
  const values = data.embedding?.values as number[] | undefined;
  if (!values) throw new Error("The embedding response did not include a vector.");
  return values;
}

async function rank(question: string, page: string | undefined, key: string | undefined) {
  const chunks = getAssistantChunks();
  let ranked: Ranked[] | null = null;

  if (key) {
    try {
      const model = embeddingModel();
      const documentTexts = chunks.map((chunk) => `title: ${chunk.title} | text: ${chunk.heading}. ${chunk.text}`);
      const vectors = await embedTexts(documentTexts, key, model);
      const questionVector = await embedQuestion(question, key, model);
      ranked = chunks.map((chunk, index) => ({
        chunk,
        score: cosine(questionVector, vectors[index] ?? []),
      }));
    } catch (error) {
      console.error("Assistant embeddings unavailable, using term search.", error);
    }
  }

  if (!ranked) {
    ranked = keywordSearch(question, chunks, 8);
  }

  if (page) {
    ranked = ranked.map((entry) =>
      entry.chunk.href === page ? { ...entry, score: entry.score + 0.2 } : entry,
    );
  }

  return ranked.sort((a, b) => b.score - a.score);
}

function sourceList(ranked: Ranked[]) {
  const seen = new Set<string>();
  const sources: { title: string; href: string }[] = [];
  for (const { chunk } of ranked) {
    if (seen.has(chunk.href)) continue;
    seen.add(chunk.href);
    sources.push({ title: chunk.title, href: chunk.href });
    if (sources.length === 3) break;
  }
  return sources;
}

function excerpt(text: string, limit = 520) {
  if (text.length <= limit) return text;
  const cut = text.slice(0, limit);
  const boundary = Math.max(cut.lastIndexOf(". "), cut.lastIndexOf("\n"));
  return `${(boundary > 240 ? cut.slice(0, boundary + 1) : cut).trim()}...`;
}

function retrievalAnswer(ranked: Ranked[]) {
  const top = ranked[0];
  if (!top) {
    return "I could not find a post about that. Try the topics page, or ask about Astro, Cloudinary or image performance.";
  }
  return `Here is the closest passage I found in “${top.chunk.title}”:\n\n${excerpt(top.chunk.text)}\n\nOpen the post below for the full context.`;
}

function buildPrompt(question: string, page: string | undefined, snippets: { label: string; code: string }[], ranked: Ranked[]) {
  const sources = ranked
    .slice(0, 4)
    .map(({ chunk }, index) => `[${index + 1}] ${chunk.title} (${chunk.heading})\n${excerpt(chunk.text, 1500)}\nURL: ${chunk.href}`)
    .join("\n\n");

  const selected = snippets
    .slice(0, 3)
    .map((snippet) => `Snippet ${snippet.label}:\n${snippet.code.slice(0, 1200)}`)
    .join("\n\n");

  return `Current page: ${page ?? "unknown"}
Question: ${question}

${selected ? `Code the reader is looking at:\n${selected}\n\n` : ""}Sources:
${sources}`;
}

async function generate(question: string, page: string | undefined, snippets: { label: string; code: string }[], ranked: Ranked[], key: string) {
  const model = chatModel();
  const body = {
    systemInstruction: {
      parts: [
        {
          text: "You are the assistant for Paul Applegate's blog, Field notes. Answer only from the sources provided. If the answer is not there, say so plainly and point to the posts page. Write in calm, plain English, in two to four sentences. Do not invent facts, dates or personal details. Do not use markdown headings or links.",
        },
      ],
    },
    contents: [{ role: "user", parts: [{ text: buildPrompt(question, page, snippets, ranked) }] }],
    generationConfig: {
      temperature: 0.25,
      maxOutputTokens: 700,
      thinkingConfig: { thinkingLevel: "minimal" },
    },
  };

  const send = (payload: typeof body) =>
    requestJson(`${API_ROOT}/models/${model}:generateContent`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": key },
      body: JSON.stringify(payload),
    });

  let data;
  try {
    data = await send(body);
  } catch (error) {
    // Older or local Gemma endpoints may not accept thinkingConfig.
    const { thinkingConfig, ...generationConfig } = body.generationConfig;
    data = await send({ ...body, generationConfig }).catch(() => {
      throw error;
    });
  }

  const parts = data.candidates?.[0]?.content?.parts as { text?: string; thought?: boolean }[] | undefined;
  const text = parts
    ?.filter((part) => !part.thought && typeof part.text === "string")
    .map((part) => part.text)
    .join("\n")
    .trim();

  if (!text) throw new Error("The model returned an empty answer.");
  return text;
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });

export const POST: APIRoute = async ({ request }) => {
  let payload: { question?: string; page?: string; snippets?: { label?: string; code?: string }[] };
  try {
    payload = await request.json();
  } catch {
    return json({ error: "Send a JSON body with a question." }, 400);
  }

  const question = payload.question?.trim().slice(0, 1000);
  if (!question) return json({ error: "A question is required." }, 400);

  const page = payload.page?.startsWith("/") ? payload.page : undefined;
  const snippets = (payload.snippets ?? [])
    .filter((snippet) => snippet.code)
    .slice(0, 3)
    .map((snippet) => ({
      label: (snippet.label ?? "Code").slice(0, 80),
      code: (snippet.code ?? "").slice(0, 1200),
    }));

  const ranked = await rank(question, page, apiKey());
  const sources = sourceList(ranked);
  const key = apiKey();

  if (!key) {
    return json({ text: retrievalAnswer(ranked), sources, mode: "retrieval" });
  }

  try {
    const text = await generate(question, page, snippets, ranked, key);
    return json({ text, sources, mode: "generated" });
  } catch (error) {
    console.error("Assistant generation failed, using retrieval.", error);
    return json({ text: retrievalAnswer(ranked), sources, mode: "retrieval" });
  }
};

export const GET: APIRoute = () => json({ error: "Use POST." }, 405);
