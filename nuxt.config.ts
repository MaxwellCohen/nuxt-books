import tailwindcss from '@tailwindcss/vite';

export default defineNuxtConfig({
  compatibilityDate: '2026-09-01',
  css: ['~/assets/css/main.css'],
  features: {
    // feature-tests/css-inlining: embed entry + component CSS in SSR HTML.
    inlineStyles: true,
  },
  devtools: { enabled: true },
  future: {
    compatibilityVersion: 5,
  },
  experimental: {
    // feature-tests/islands: server components (*.server.vue) / <NuxtIsland>.
    componentIslands: true,
    // https://nuxt.com/blog/v4-5#%EF%B8%8F-forwarded-preload-hints-on-prefetch
    prefetchPreloadTags: true,
    early404: true
  },
  image: {
    domains: ['images.gr-assets.com', 's.gr-assets.com'],
    quality: 82,
  },
  modules: [
    '@nuxt/image',
    '@nuxtjs/color-mode',
    '@nuxt/eslint',
    '@vercel/analytics',
    '@vercel/speed-insights',
    // feature-tests: official modules exercised by /feature-tests/*.
    '@nuxt/fonts',
    '@nuxt/scripts',
    '@nuxtjs/partytown',
  ],
  nitro: {
    future: {
      nativeSWR: true,
    },
    storage: {
      cache: {
        base: 'nuxt-books:v1',
        driver: process.env.VERCEL ? 'vercel-runtime-cache' : 'memory',
      },
    }
  },
  // Nuxt requires a cache route rule to generate runtime _payload.json routes.
  routeRules: {
    '/**': { cache: { headersOnly: true, maxAge: 3600 } },
    '/api/**': { cache: false },
    // feature-tests/font-optimization: preload the Inter face used on that route only.
    '/feature-tests/font-optimization': { fonts: { preload: { Inter: true } } },
    // feature-tests/render-modes: one prerendered, one per-request SSR (default), one client-only.
    '/feature-tests/render-modes/prerendered': { prerender: true },
    '/feature-tests/render-modes/spa': { ssr: false },
  },
  runtimeConfig: {
    databaseUrl: process.env.DATABASE_URL ?? process.env.POSTGRES_URL,
    public: {
      baseUrl:
        process.env.NUXT_PUBLIC_BASE_URL ??
        (process.env.VERCEL_PROJECT_PRODUCTION_URL
          ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
          : 'http://localhost:3000'),
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
