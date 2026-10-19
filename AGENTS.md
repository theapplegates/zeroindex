# AGENTS.md

Guidance for AI agents working in this repository. ZeroIndex is a
developer documentation theme built with Astro 7 and Tailwind CSS 4: a
static site with guides, an API reference, SDKs, a changelog, a status page
and a 404, in light and dark. Read `.cursor/skills/zeroindex-design/SKILL.md`
before changing any page, section or copy.

## Commands

- `npm run dev`: dev server at `localhost:4321`. After changing
  `src/content.config.ts`, adding a collection or deleting content, stop
  it, delete `.astro/data-store.json`, then start it again.
- `npm run build`: only when a change can affect the build (config,
  integrations, content schemas) or before shipping. Delete `dist/` after.

## Where things live

- `src/pages/`: routes only. A page composes section components; no
  sections are written inline in a page. `[...slug].astro` files only build
  paths and pass data (and `<Content />`) to their layout. The `.md.ts`
  files serve each page as Markdown.
- `src/layouts/`: `BaseLayout` (Lenis, theme script), `DocsLayout`,
  `ApiLayout` (prose beside a sticky request and response column on
  endpoint pages), `SdksLayout`, `ChangelogLayout`.
- `src/components/doc/DocShell.astro`: the app frame. Sidebar on the left,
  the page in a rounded `surface` panel that scrolls on its own. Used by
  the home page, docs, API and SDK pages.
- `src/components/doc/`: `DocHeader`, `CopyPage` (Markdown, ChatGPT, Claude,
  assistant), `DocToc` (sliding marker), `DocFooter`, `DocPagination`,
  `PageFeedback`.
- `src/components/docs/`: the MDX components, registered in `index.ts` so
  MDX files use them without imports. Add new ones there.
- `src/components/global/`: `Navigation`, `Sidebar`, `SidebarNav` (switches
  between docs, API and SDKs by path), `SearchDialog` (⌘K, indexes every
  collection), `AssistantPanel` (⌘I), `MobileMenu`, `ThemeToggle`, `Footer`.
- `src/components/<page>/`: sections for `landing/`, `status/`,
  `changelog/`, `sdks/`, `notfound/`, `system/`.
- `src/components/fundations/`: the shared building blocks.
  - `containers/Wrapper.astro`: `standard` (pages outside the shell),
    `panel` (inside the shell), `prose` (MDX bodies).
  - `elements/Text.astro`: every piece of text. `display*` for headings,
    `text*` for body copy and labels. Only takes the tags in its `Props`;
    anything else (`div`, `dt`, `dd`, `li`) is the plain tag with classes.
  - `elements/Button.astro`: `primary`, `accent`, `muted`, `none`; sizes
    `sm`, `base`, `lg`; `iconOnly`; `isLink` for anchors.
- `src/lib/`: ordering, grouping and links for each collection, plus the
  Markdown version of API pages.
- `src/content/`: MDX collections (`docs`, `api`, `sdks`, `changelog`).
  Schemas in `src/content.config.ts`.
- `src/styles/`: `colors.css` (tokens, light and dark), `fonts.css`,
  `global.css` (code colours, prose, focus, menu animation).
- `src/config.ts`: `assistant` and `feedback` switches.

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
- Keep one `h1` per page. Every image has real alt text.
- New pages go into `src/components/system/SystemOverview.astro`.
- No arbitrary Tailwind values (`[...]`), no `@apply`, no `mb-*`.
- Keep changes small. No new dependencies without a clear reason.
