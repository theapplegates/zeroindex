# Field notes

Paul Applegate's blog, built with Astro 7 and Tailwind CSS 4 from the
ZeroIndex theme by [Lexington Themes](https://lexingtonthemes.com).
A warm ground, a white panel that scrolls on its own, the index on the left
and the table of contents on the right, in light and dark.

## Commands

| Command           | Action                                   |
| :---------------- | :--------------------------------------- |
| `npm install`     | Install dependencies                     |
| `npm run dev`     | Start the dev server at `localhost:4321` |
| `npm run build`   | Build the site to `./dist/`              |
| `npm run preview` | Preview the build locally                |

## Pages

- `/` to the latest post, a few recent notes and the topic strip.
- `/posts` the archive, newest first.
- `/posts/<slug>` a post, with the table of contents beside it.
- `/topics` and `/topics/<tag>` every tag and the posts under it.
- `/about` who writes here.
- `/rss.xml` the feed.
- `/posts/<slug>.md` every post as plain Markdown.
- `/assistant-index.json` the post text the assistant reads in the browser.
- `/404` the not found page.

## Writing a post

One MDX file per post in `src/content/posts/`. The file name is the URL:
`the-game-show.mdx` becomes `/posts/the-game-show`.

```yaml
---
title: The Game Show
description: One sentence for cards, search and social previews.
date: 2026-09-26
tags: ["personal", "new-york"]
cover: images/blog/bY2vbO99zv-3840
coverAlt: A photograph of the Junior Pyramid set
featured: false
draft: false
---
```

- `updated` is optional. `author` defaults to Paul Applegate. `featured`
  puts the post in the home page slot. `draft` keeps it out of every list
  and route.
- Tags are lower case and become `/topics/<tag>`. Their labels are tidied
  up for display, so `new-york` reads as "New York".
- MDX can use the same blocks as before without imports: Callout, Card,
  CardGroup, CodeGroup, Tabs, Steps, Accordion, Badge, Frame and Video.
  They live in `src/components/docs/` and are registered in its `index.ts`.
- Images: `npm run cloudinary:breakpoints -- "src/images/blog/photo.jpg"
  --alt="Describe your photo"` writes the widths to
  `src/data/cloudinary-images.json`. Use the printed `cover` value in the
  frontmatter. The build reads the manifest, so no API key is needed to
  serve images.

## The assistant

The panel opens from the sidebar, the navigation, a code block, the Copy
page menu or `⌘I`. It answers only from the posts.

- `src/pages/api/assistant.ts` is the backend (`POST /api/assistant`). It
  embeds the post chunks and the question with **Gemini Embedding 2**
  (`gemini-embedding-2`), then asks **Gemma 4** (`gemma-4-26b-a4b-it`) for a
  short answer with sources.
- Without `GEMINI_API_KEY` it still answers: retrieval falls back to a term
  search and the reply is the closest passage with a link to the post.
- Retune it with `ASSISTANT_CHAT_MODEL` and `ASSISTANT_EMBEDDING_MODEL`.
- The endpoint is server rendered, so the site needs an adapter. It ships
  with `@astrojs/vercel`; swap it in `astro.config.mjs` for another host.
- Copy `.env.example` to `.env` and fill in the keys.

## Structure

```
src/
├── components/
│   ├── fundations/    Text, Button, Wrapper, icons, head tags
│   ├── blog/          Home, posts, topics, about, post header and footer
│   ├── global/        Navigation, Sidebar, Search, Assistant, Footer, theme toggle
│   ├── doc/           The shell: Copy page menu, TOC, pagination, feedback
│   ├── docs/          MDX components (Callout, Card, CodeGroup, Tabs, Steps...)
│   └── <page>/        The sections of each page
├── content/posts/     The posts
├── layouts/           BaseLayout, PostLayout
├── lib/               Post queries, the site identity, the assistant index
├── pages/             Routes; each page only composes its sections
├── styles/            colors.css, fonts.css, global.css
└── config.ts          Switches for the assistant and page feedback
```

The theme's original documentation, API, SDK, changelog and system pages
are still in `src/content/` and still build, but they are not linked and are
excluded from the sitemap. Delete them and their routes when they are no
longer useful.

## Customising

- **Identity:** `src/lib/site.ts` holds the name, author, description, URL,
  email and GitHub link.
- **Colours:** `src/styles/colors.css`. Ten tokens, each with a light and a
  dark value: `background`, `surface` (the content panel), `foreground`,
  `muted` (soft fills and every line), `muted-foreground`, `accent`
  (ultramarine), and `warning`, `info`, `success` and `danger`.
- **Code colours:** the `--astro-code-*` variables at the top of
  `src/styles/global.css`.
- **Fonts:** Switzer and IBM Plex Mono, loaded in
  `src/components/fundations/head/Fonts.astro` and set in
  `src/styles/fonts.css`.
- **Navigation:** the links are at the top of
  `src/components/global/Navigation.astro` and
  `src/components/global/MobileMenu.astro`; the sidebar is
  `src/components/global/SidebarNav.astro`.
- **Site URL:** set `site` in `astro.config.mjs` for canonical URLs, the
  sitemap and the RSS links.

## Deploying

Builds with `npm run build` and deploys to Vercel as is. Set
`PUBLIC_CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`,
`CLOUDINARY_API_SECRET` and `GEMINI_API_KEY` in the project environment.

## Credits

The design is the ZeroIndex theme by
[Lexington Themes](https://lexingtonthemes.com), used under its licence.

## Search

Search uses Orama in the browser. At build time, `src/pages/search-index.json.ts`
creates a local index of published posts and the main blog pages using
`src/lib/search.ts`. The search dialog loads it on first use, ranks titles and
headings higher, tolerates typos, and highlights matching text. No search service
or API key is needed. Add new searchable content in `getSearchDocuments`.

