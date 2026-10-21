import { defineConfig, svgoOptimizer } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";
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
  integrations: [sitemap(), mdx()],
});
