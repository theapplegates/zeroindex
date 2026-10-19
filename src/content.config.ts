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

export const collections = {
  docs,
};
