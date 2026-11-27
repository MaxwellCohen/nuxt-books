import { fileURLToPath } from 'node:url';
import tailwindcss from '@tailwindcss/vite';

// Cloudflare builds: `deploy:cloudflare` sets CLOUDFLARE=1, Workers Builds sets
// WORKERS_CI=1, and feature-tests/multi-host-deployment sets NITRO_PRESET.
const isCloudflare = Boolean(
  process.env.CLOUDFLARE ||
    process.env.WORKERS_CI ||
    process.env.CF_PAGES ||
    process.env.NITRO_PRESET?.startsWith('cloudflare'),
);
const isNetlify = Boolean(process.env.NETLIFY) && !isCloudflare;
const isVercel = Boolean(process.env.VERCEL) && !isCloudflare;

const CACHE_BASE = 'nuxt-books:v1';

function cacheStorage() {
  if (isVercel) {
    return {
      driver: 'vercel-runtime-cache' as const,
      base: CACHE_BASE,
    };
  }

  if (isNetlify) {
    return {
      driver: 'netlify-blobs' as const,
      name: 'nuxt-books-cache',
      base: CACHE_BASE,
    };
  }

  if (isCloudflare) {
    return {
      driver: 'cloudflare-kv-binding' as const,
      binding: 'CACHE',
      base: CACHE_BASE,
    };
  }

  return {
    driver: 'memory' as const,
    base: CACHE_BASE,
  };
}

export default defineNuxtConfig({
  compatibilityDate: '2026-09-01',
  css: ['~/assets/css/main.css'],
  build: {
    // @lucide/vue's CommonJS build require()s Vue's ESM server entry, which
    // fails on Netlify's Node runtime (ERR_REQUIRE_ESM). Bundle it instead.
    transpile: ['@lucide/vue'],
  },
  features: {
    // feature-tests/css-inlining: production SSR embeds entry + component CSS in the HTML.
    // Nuxt keeps this off in dev so stylesheet HMR still works.
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
    early404: true,
    // Nuxt 4.7 turns Nitro/h3 auto-imports off under compatibilityVersion 5;
    // the server routes (defineCachedEventHandler, getQuery, ...) still rely on them.
    nitroAutoImports: true,
  },
  // @nuxt/fonts finds Geist in the Tailwind --font-* variables, downloads it at build
  // time, serves it from /_nuxt/fonts with @font-face + a size-adjusted fallback face,
  // and preloads the variable Geist face.
  fonts: {
    defaults: { subsets: ['latin'] },
    families: [
      { name: 'Geist', provider: 'google', weights: ['100 900'], styles: ['normal'], preload: true },
      { name: 'Geist Mono', provider: 'google', weights: [400], styles: ['normal'] },
    ],
  },
  image: {
    // Cloudflare Workers can't run IPX / sharp — skip optimization there.
    provider: isCloudflare ? 'none' : 'auto',
    domains: ['images.gr-assets.com', 's.gr-assets.com'],
    quality: 82,
  },
  modules: [
    '@nuxt/fonts',
    '@nuxt/image',
    '@nuxtjs/color-mode',
    '@nuxt/eslint',
    '@vercel/analytics',
    '@vercel/speed-insights',
    // feature-tests: official modules exercised by /feature-tests/*.
    '@nuxt/scripts',
    '@nuxtjs/partytown',
  ],
  nitro: {
    // Only force Workers when CLOUDFLARE/WORKERS_CI/CF_PAGES is set (or NITRO_PRESET
    // already picks a Cloudflare preset). Vercel and Netlify auto-detect their presets.
    preset: isCloudflare ? (process.env.NITRO_PRESET ?? 'cloudflare_module') : undefined,
    // Workers can't bundle pg's optional native addon.
    alias: isCloudflare
      ? { 'pg-native': fileURLToPath(new URL('./server/lib/db/pg-native-stub.cjs', import.meta.url)) }
      : undefined,
    future: {
      nativeSWR: true,
    },
    // Rules live under nitro.routeRules: with this Nuxt nightly, the top-level
    // routeRules type is built from Nitro's augmented route types and drops
    // cache/prerender, while nitro.routeRules uses Nitro's own types.
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
    storage: {
      cache: cacheStorage(),
    },
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
