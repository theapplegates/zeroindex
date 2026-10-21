# AGENTS.md

Guidance for AI agents working in this repository. Field notes is Paul
Applegate's blog, built with Astro 7 and Tailwind CSS 4 on the ZeroIndex
theme: a static site with posts, topics, an about page, RSS, search and an
assistant that answers from the posts, in light and dark. Read
`.cursor/skills/zeroindex-design/SKILL.md` before changing any page, section
or copy.

## Commands

- `npm run dev`: dev server at `localhost:4321`. After changing
  `src/content.config.ts`, adding a collection or deleting content, stop
  it, delete `.astro/data-store.json`, then start it again.
- `npm run build`: only when a change can affect the build (config,
  integrations, content schemas) or before shipping. Delete `dist/` and
  `.vercel/` after.

## Where things live

- `src/pages/`: routes only. A page composes section components; no
  sections are written inline in a page. `[...slug].astro` files only build
  paths and pass data (and `<Content />`) to their layout. The `.md.ts`
  files serve each post as Markdown.
- `src/layouts/`: `BaseLayout` (Lenis, theme script), `PostLayout`
  (post header, prose and the table of contents).
- `src/components/doc/DocShell.astro`: the app frame. Sidebar on the left,
  the page in a rounded `surface` panel that scrolls on its own. Used by
  the home page, posts, topics and about.
- `src/components/doc/`: `CopyPage` (Markdown, ChatGPT, Claude,
  assistant), `DocToc` (sliding marker), `DocPagination`, `PageFeedback`.
- `src/components/blog/`: the blog sections: `HomeHero`, `FeaturedPost`,
  `LatestPosts`, `TopicsStrip`, `PostsHero`, `PostsArchive`, `PostCard`,
  `PostCover`, `PostImage`, `PostMeta`, `Tag`, `PostHeader`, `PostFooter`,
  `AboutContent`.
- `src/components/global/`: `Navigation`, `Sidebar`, `SidebarNav` (posts,
  latest, topics, elsewhere; the theme's original docs nav on legacy
  paths), `SearchDialog` (⌘K, indexes the posts and pages),
  `AssistantPanel` (⌘I), `MobileMenu`, `ThemeToggle`, `Footer`.
- `src/components/fundations/`: the shared building blocks.
  - `containers/Wrapper.astro`: `standard` (pages outside the shell),
    `panel` (inside the shell), `prose` (MDX bodies).
  - `elements/Text.astro`: every piece of text. `display*` for headings,
    `text*` for body copy and labels. Only takes the tags in its `Props`;
    anything else (`div`, `dt`, `dd`, `li`) is the plain tag with classes.
  - `elements/Button.astro`: `primary`, `accent`, `muted`, `none`; sizes
    `sm`, `base`, `lg`; `iconOnly`; `isLink` for anchors.
- `src/lib/`: `posts.ts` (querying, dates, tags, reading time), `site.ts`
  (name, author, URL, email, GitHub), `assistant.ts` (corpus and search),
  Cloudinary helpers.
- `src/content/posts/`: the posts, one MDX file each. Schema in
  `src/content.config.ts`.
- `src/pages/api/assistant.ts`: Gemini Embedding 2 retrieval plus Gemma 4
  generation, with a term-search fallback when `GEMINI_API_KEY` is missing.
  It is server rendered, so the site needs the `@astrojs/vercel` adapter.
- `src/styles/`: `colors.css` (tokens, light and dark), `fonts.css`,
  `global.css` (code colours, prose, focus, menu animation).
- `src/config.ts`: `assistant` and `feedback` switches.

The theme's original `docs`, `api`, `sdks`, `changelog` and `status` pages
still exist under `src/content/` and `src/pages/`. They are unlisted and
excluded from the sitemap. Do not delete them without asking.

## Conventions

- Colours only through the tokens in `colors.css`. `muted` does both soft
  fills and every line (`border-muted`). Every token is a distinct colour.
- Dark mode is the `.dark` class on `<html>`; tokens switch, so components
  rarely need `dark:` classes.
- Mono (IBM Plex Mono) only where it is code: code blocks, field names and
  types, HTTP methods, paths. Never for labels or decoration.
- Radii are concentric: an inner radius is the outer radius minus the
  inset (`rounded-xl` with `p-1` holds `rounded-lg`).
- One action per block. No kickers above headings; a subtitle goes under
  its heading.
- Focus rings are keyboard only, in the ink colour, set once in
  `global.css`.
- Keep one `h1` per page. Every image has real alt text. Write sentence
  case, and do not use em dashes.
- No arbitrary Tailwind values (`[...]`), no `@apply`, no `mb-*`.
- Two expressions in a row lose their space (`{count} {label}` renders as
  `5posts`). Use a template literal.
- Keep changes small. No new dependencies without a clear reason.
