---
name: zeroindex-design
description: >-
  Design rules for the ZeroIndex documentation theme. Read before creating or
  changing any page, section, docs component, copy or visual style in this
  repository.
---

# ZeroIndex design rules

Documentation for a product developers actually use: calm, fast to scan,
every page there because someone needs it. Written for ZeroIndex, a search
API that takes your content and gives back instant, typo tolerant search.

## Ground and colour

- Warm paper ground (`background`), a white content panel (`surface`),
  graphite ink (`foreground`), one grey (`muted`) for soft fills and every
  line, and a darker grey (`muted-foreground`) for descriptions and body
  copy.
- Dark mode swaps every token for graphite values; nothing else changes.
- `accent` is ultramarine: card icons, the TOC marker, POST badges, the
  assistant sparkle. Never on navigation or the active sidebar item, which
  is a plain `bg-muted` row.
- `warning` (amber), `info` (sky), `success` (green) and `danger` (red)
  only carry meaning: callouts, status, HTTP methods, error badges.
- Code blocks sit on a slightly darker mix of ground and panel in light
  mode and on the panel colour in dark mode, always with a `muted` border.
- No gradients and no decorative shapes. Shadows only as the soft lift on
  linked cards and the pagination card.

## Type

- Switzer for everything you read. Headings are `font-semibold` with tight
  tracking, never on base or smaller text.
- IBM Plex Mono only where it is code: code blocks, inline code, field
  names and types, paths, HTTP methods.
- Body paragraphs are `text-pretty`; short centred or hero lines can use
  `text-balance`.
- Sentence case always. No uppercase, no wide tracking, no kickers.

## Layout

- The top bar sits on the ground. Inside the shell it runs full width;
  outside it matches `Wrapper variant="standard"`.
- The sidebar holds search with an Ask AI icon button beside it, the
  section's pages as plain titles, and the theme toggle at the bottom.
- Docs pages: header (title, description, Copy page), prose at
  `max-w-2xl`, then the footer row (last updated, feedback), the
  pagination bar and the copyright line. The TOC sits to the right from
  `xl`.
- Endpoint pages: method and path under the title, prose on seven columns,
  the request tabs and response in a sticky column beside it.
- Cards are `rounded-xl border border-muted bg-surface p-5`, icon on top,
  `gap-12` to the title and description. Linked cards lift with
  `shadow-xs` on hover.
- Radii are concentric. Images and videos have a `rounded-xl` border and
  no extra padding.

## Pages

- **Home:** inside the shell. A left aligned title and line, the agent
  skill box, four Start here cards, a code sample with language tabs, the
  SDKs and the latest releases.
- **Docs:** Getting started, Concepts, Guides and Writing docs, ordered in
  `src/lib/docs.ts`.
- **API reference:** Introduction and Errors read like guides; every
  endpoint has a method, path, parameters, request tabs (cURL,
  JavaScript, Python) and a response.
- **SDKs:** an index of cards and one page per library with package,
  version, requirements and install in the header.
- **Changelog:** dated releases with a version badge, and a page per
  release with older and newer links.
- **Status:** overall state, services with uptime, regions with response
  times, recent incidents.
- **404:** an API style JSON error, search and one button back to the docs.

## Components

- MDX components work without imports: Callout (note, tip, warning,
  danger), Card and CardGroup, CodeGroup, Tabs, Steps, Accordion,
  ParamField, ResponseField, Badge, Frame, Video.
- Every code block has a copy button and, with the assistant on, an ask
  button that sends the snippet to the assistant.
- Copy page offers Markdown, the `.md` URL, ChatGPT, Claude and the
  assistant.

## Motion

- Lenis smooth scroll.
- The assistant panel and the mobile menu slide and fade in; the TOC marker
  slides to the active heading.
- Nothing else moves, and nothing moves for reduced motion.

## Copy

- Real, specific developer copy for ZeroIndex: endpoints, parameters,
  limits and errors that hang together across pages.
- People get Spanish, Nordic or Italian names; demo brands too.
- Placeholder emails end in `.test`, API hosts use `.test`, phone numbers
  are all zeros, placeholder links use `#_`. No em dashes or middle dots.
