# ZeroIndex

A developer documentation theme for teams shipping an API or SDK, built
with Astro and Tailwind CSS by [Lexington Themes](https://lexingtonthemes.com).
A warm ground, a white panel that scrolls on its own, a sidebar on the left
and the table of contents on the right, in light and dark.

The demo product is ZeroIndex, a search API. Every guide, endpoint, SDK and
release is there to be replaced with your own.

## Commands

| Command           | Action                                   |
| :---------------- | :--------------------------------------- |
| `npm install`     | Install dependencies                     |
| `npm run dev`     | Start the dev server at `localhost:4321` |
| `npm run build`   | Build the site to `./dist/`              |
| `npm run preview` | Preview the build locally                |

## Pages

Open `/system/overview` in the dev server for a list of every page.

- **Static:** home, status, 404.
- **Collections (MDX in `src/content/`):**
  - **Docs:** guides grouped as Getting started, Concepts, Guides and
    Writing docs.
  - **API reference:** an introduction, errors, and one page per endpoint
    with its method, path, parameters, request tabs and response.
  - **SDKs:** an index and one page per library.
  - **Changelog:** an index and one page per release.
- **System:** overview, colours, typography, buttons, links.

Every docs, API and SDK page is also served as Markdown at the same URL
with `.md` on the end, for people and AI tools that want the plain text.

## Structure

```
src/
├── components/
│   ├── fundations/    Text, Button, Wrapper, icons, head tags
│   ├── global/        Navigation, Sidebar, Search, Assistant, Footer, theme toggle
│   ├── doc/           The docs shell: header, Copy page menu, TOC, footer, pagination
│   ├── docs/          MDX components (Callout, Card, CodeGroup, Tabs, Steps...)
│   ├── api/           Method badges and the request and response column
│   └── <page>/        The sections of each page (landing, status, changelog, sdks, system)
├── content/           docs, api, sdks, changelog (MDX)
├── layouts/           BaseLayout, DocsLayout, ApiLayout, SdksLayout, ChangelogLayout
├── lib/               Ordering, grouping and links for each collection
├── pages/             Routes; each page only composes its sections
├── scripts/           Copy buttons, tabs, theme switching
├── styles/            colors.css, fonts.css, global.css
└── config.ts          Switches for the assistant and page feedback
```

## Writing docs

- **Docs:** one MDX file per page in `src/content/docs/<category>/`, with a
  `title`, `description`, `category`, `order` and `lastUpdated`. The
  categories and their labels live in `src/lib/docs.ts`.
- **API reference:** one file per endpoint in `src/content/api/`. Give it a
  `group`, `method`, `path`, `request` (`curl`, `javascript`, `python`) and
  `response`, and the page lays out the request and response beside the
  text. Pages without a method (Introduction, Errors) read like a guide.
- **SDKs:** `src/content/sdks/`, with the package name, version,
  requirements and install command shown in the header.
- **Changelog:** `src/content/changelog/`, with a `version`, `date` and a
  one line `summary`.
- **Components:** Callout, Card, CardGroup, CodeGroup, Tabs, Steps,
  Accordion, ParamField, ResponseField, Badge, Frame (images) and Video
  work in every MDX file without imports. `/docs/writing/components` shows
  each one with its code.
- **Images and video:** put files in `public/images/`. `Frame` takes a
  `darkSrc` for a dark mode screenshot; `Video` plays your own file, or a
  YouTube or Vimeo id that only loads when someone presses play.

## Customising

- **Colours:** `src/styles/colors.css`. Ten tokens, each with a light and a
  dark value: `background`, `surface` (the content panel), `foreground`,
  `muted` (soft fills and every line), `muted-foreground`, `accent`
  (ultramarine), and `warning`, `info`, `success` and `danger` for
  callouts, states and HTTP methods.
- **Code colours:** the `--astro-code-*` variables at the top of
  `src/styles/global.css`.
- **Fonts:** Switzer and IBM Plex Mono, loaded in
  `src/components/fundations/head/Fonts.astro` and set in
  `src/styles/fonts.css`.
- **Navigation:** the links are at the top of
  `src/components/global/Navigation.astro` and
  `src/components/global/MobileMenu.astro`.
- **Site URL:** set `site` in `astro.config.mjs` for canonical URLs and the
  sitemap.

## Assistant and feedback

Both are interface only, ready for you to connect. Turn either off in
`src/config.ts`.

- **Assistant:** a chat panel opened from the sidebar, the code blocks, the
  Copy page menu or ⌘I. When someone asks, it fires an `assistant:ask`
  event with the question, any code snippets and the page. Dispatch
  `assistant:answer` with `{ text }` to show the reply.
- **Feedback:** "Was this page helpful?" in the page footer fires a
  `feedback` event with `{ helpful, page }`. Send it to your analytics.

## Integrations

- [@astrojs/mdx](https://docs.astro.build/en/guides/integrations-guide/mdx/)
- [@astrojs/sitemap](https://docs.astro.build/en/guides/integrations-guide/sitemap/)
- [@lexingtonthemes/seo](https://www.npmjs.com/package/@lexingtonthemes/seo)
- [Tailwind CSS typography](https://github.com/tailwindlabs/tailwindcss-typography)
- [Tailwind CSS forms](https://github.com/tailwindlabs/tailwindcss-forms)
- [Lenis](https://lenis.darkroom.engineering/)

## Learn more

Read the Lexington [documentation](https://lexingtonthemes.com/documentation/quick-start/).
