/* Theme switches.
   assistant: the AI assistant panel and every button that opens it (sidebar, navigation, code blocks,
   Copy page menu, ⌘I). The panel posts to /api/assistant, which answers from the posts.
   feedback: the "Was this page helpful?" buttons in the page footer. A click fires a `feedback` event
   with `{ helpful, page }`; send it to your analytics. */
export const config = {
  assistant: true,
  feedback: true,
};
