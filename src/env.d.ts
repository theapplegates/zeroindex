/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

/** Published types omit `AstroSeo`; runtime re-exports it from `index.ts`. */
declare module "@lexingtonthemes/seo" {
  export const AstroSeo: import("astro").AstroComponentFactory;
}
