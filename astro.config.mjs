import { defineConfig, svgoOptimizer } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";
import vercel from "@astrojs/vercel";
import rehypeCloudinaryPicture from "./src/plugins/rehype-cloudinary-picture.mjs";
export default defineConfig({
  experimental: {
    svgOptimizer: svgoOptimizer(),
  },
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    rehypePlugins: [[rehypeCloudinaryPicture, { cloudName: process.env.PUBLIC_CLOUDINARY_CLOUD_NAME }]],
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
  adapter: vercel(),
  integrations: [
    sitemap({
      // The blog is the site. The old documentation, API, SDK, changelog and
      // system pages stay reachable but are not advertised.
      filter: (page) => !/\/(docs|api|sdks|changelog|status|system)(\/|$)/.test(new URL(page).pathname),
    }),
    mdx(),
  ],
});
