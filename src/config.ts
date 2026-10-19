/* Theme switches.
   assistant: the AI assistant panel and every button that opens it (sidebar, code blocks, Copy page menu, ⌘I).
   The panel is UI only. Listen for the `assistant:ask` event to send questions to your provider, and dispatch
   `assistant:answer` with `{ text }` to show the reply.
   feedback: the "Was this page helpful?" buttons in the page footer. A click fires a `feedback` event
   with `{ helpful, page }`; send it to your analytics. */
export const config = {
  assistant: true,
  feedback: true,
};
