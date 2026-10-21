import { defineConfig, svgoOptimizer } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";
export default defineConfig({
  experimental: {
    svgOptimizer: svgoOptimizer(),
  },
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    shikiConfig: {
      theme: "css-variables",
      wrap: true,
    },
  },
  redirects: {
    "/docs": "/docs/getting-started/introduction",
    "/api": "/api/introduction",
  },
  site: "https://zero.paulapplegate.com",
  integrations: [sitemap(), mdx()],
});
