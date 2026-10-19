/* Tabs and code groups: each [data-tabs] has [data-tab-button]s and, inside
   [data-tab-panels], one direct child per button. */
document.querySelectorAll<HTMLElement>("[data-tabs]").forEach((tabs) => {
  const buttons = [...tabs.querySelectorAll<HTMLButtonElement>(":scope > [role='tablist'] [data-tab-button]")];
  const panels = [...(tabs.querySelector(":scope > [data-tab-panels]")?.children ?? [])] as HTMLElement[];

  const select = (index: number) => {
    buttons.forEach((button, i) => button.setAttribute("aria-selected", String(i === index)));
    panels.forEach((panel, i) => (panel.hidden = i !== index));
  };

  buttons.forEach((button, index) => button.addEventListener("click", () => select(index)));
  select(0);
});
