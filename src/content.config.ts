import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const docs = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/docs" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.enum(["getting-started", "concepts", "guides", "writing"]),
    order: z.number(),
    lastUpdated: z.date(),
  }),
});

const api = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/api" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    group: z.enum(["overview", "indexes", "documents", "search", "keys"]),
    order: z.number(),
    lastUpdated: z.date(),
    method: z.enum(["GET", "POST", "PATCH", "DELETE"]).optional(),
    path: z.string().optional(),
    request: z.object({ curl: z.string(), javascript: z.string(), python: z.string() }).optional(),
    response: z.string().optional(),
    status: z.number().default(200),
  }),
});

const sdks = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/sdks" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    order: z.number(),
    lastUpdated: z.date(),
    package: z.string(),
    version: z.string(),
    requires: z.string(),
    install: z.string(),
  }),
});

const changelog = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/changelog" }),
  schema: z.object({
    title: z.string(),
    version: z.string(),
    date: z.date(),
    summary: z.string(),
  }),
});

export const collections = {
  docs,
  api,
  sdks,
  changelog,
};
