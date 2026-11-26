# Framework Compare feature tests (Nuxt)

Validates the 11 Framework Compare labels for Nuxt against a **production build**.
Pages live under `/feature-tests` (`app/pages/feature-tests/`), specs here.

```sh
pnpm test:features          # PORT=4103 by default; CHROME_PATH overrides the Chrome binary
```

`run.mjs` runs the build-time specs first (they rewrite build output), then `nuxt build`
(node preset, preview catalog, no database), serves `.output/server/index.mjs` on `PORT`, runs
the runtime specs, and writes `results.json`. `label-notes.json` holds hand-written label notes
merged into the results.

| Spec | Checks |
| --- | --- |
| css-inlining | SSR HTML has an inline `<style>` with the route's scoped CSS; no `<link rel=stylesheet>` carries it; computed style applies (`features.inlineStyles: true`). |
| font-optimization | `@nuxt/fonts`: no Google Fonts requests, Inter loads from same origin, `@font-face` has `font-display: swap`, `Inter Fallback` face has `size-adjust`, `<link rel=preload as=font>` (routeRules `fonts.preload`). |
| image-pipeline | `<NuxtImg>`: srcset with ≥2 `w` widths, width/height, offscreen `loading=lazy`, every srcset URL served as `image/webp` by IPX. |
| caching | `defineCachedEventHandler` (maxAge 5s): two requests + SSR page share one value, a new value after 5.5s, handler call count +1. |
| route-prefetching | `<NuxtLink prefetch-on>`: the target page chunk (found by a unique marker string) is fetched on hover / on scroll into view, not before, and before the click. |
| islands | `*.server.vue` marker is in SSR HTML but in no JS response and no built client chunk; `<LazyX hydrate-on-visible>` counter works. |
| render-modes | `routeRules`: prerendered HTML file exists and timestamp is stable; SSR route timestamp changes per request; `ssr: false` route has no SSR markup and renders on the client. |
| reactivity | Page owns a `ref`, a child reads it: after 3 clicks text = 3, page setup and render ran once, child setup once (the child's render effect does re-run: Vue 3.5 is VDOM). |
| bundle-analysis | `nuxt analyze --no-serve` writes client and Nitro HTML reports under `<buildDir>/analyze` (`node_modules/.cache/nuxt/.nuxt/analyze` with Nuxt 5 compat). |
| third-party-scripts | `useScript(..., { trigger: 'onNuxtReady' })` is absent from SSR HTML and runs after hydration; `useScript({ partytown: true })` emits `type="text/partytown"` and the `@nuxtjs/partytown` runtime executes it (`text/partytown-x`, DOM write proxied back). |
| multi-host-deployment | `NITRO_PRESET` = vercel, netlify, cloudflare_module, node_server each build, produce the preset's output dirs, and `nitro.json` records the preset. Cloudflare needs the app-level `pg-native` stub alias (the `pg` driver's optional native addon), same as the optimized-max branch. |
