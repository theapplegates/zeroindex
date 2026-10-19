/* Theme switching: every [data-theme-value] button sets the theme, and [data-theme-icon] shows the current choice. */
const media = matchMedia("(prefers-color-scheme: dark)");

const apply = (value: string) => {
  if (value === "system") localStorage.removeItem("theme");
  else localStorage.setItem("theme", value);
  document.documentElement.classList.toggle("dark", value === "dark" || (value === "system" && media.matches));
  document.querySelectorAll<HTMLButtonElement>("[data-theme-value]").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.themeValue === value));
  });
  document.querySelectorAll<HTMLElement>("[data-theme-icon]").forEach((icon) => {
    icon.classList.toggle("hidden", icon.dataset.themeIcon !== value);
  });
};

document.querySelectorAll<HTMLButtonElement>("[data-theme-value]").forEach((button) => {
  button.addEventListener("click", () => apply(button.dataset.themeValue ?? "system"));
});
apply(localStorage.getItem("theme") ?? "system");

media.addEventListener("change", () => {
  if (!localStorage.getItem("theme")) apply("system");
});
