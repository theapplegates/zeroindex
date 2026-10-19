/* Copy buttons on code blocks: each [data-code-copy] copies the <pre> next to it. */
document.querySelectorAll<HTMLButtonElement>("[data-code-copy]").forEach((button) => {
  button.addEventListener("click", async () => {
    const code = button.parentElement?.querySelector("pre")?.innerText ?? "";
    await navigator.clipboard.writeText(code);
    const idle = button.querySelector("[data-copy-idle]");
    const done = button.querySelector("[data-copy-done]");
    idle?.classList.add("hidden");
    done?.classList.remove("hidden");
    setTimeout(() => {
      idle?.classList.remove("hidden");
      done?.classList.add("hidden");
    }, 1500);
  });
});
