/* Theme switches.
   assistant: the AI assistant panel and every button that opens it (sidebar, code blocks, Copy page menu, ⌘I).
   The panel is UI only. Listen for the `assistant:ask` event to send questions to your provider, and dispatch
   `assistant:answer` with `{ text }` to show the reply. */
export const config = {
  assistant: true,
};
