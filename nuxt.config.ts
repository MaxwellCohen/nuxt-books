import tailwindcss from '@tailwindcss/vite';

const isCloudflare = Boolean(
  process.env.CLOUDFLARE || process.env.WORKERS_CI || process.env.CF_PAGES,
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
  devtools: { enabled: true },
  future: {
    compatibilityVersion: 5,
  },
  experimental: {
    // https://nuxt.com/blog/v4-5#%EF%B8%8F-forwarded-preload-hints-on-prefetch
    prefetchPreloadTags: true,
    early404: true,
  },
  features: {
    // Production SSR embeds entry and component CSS in the HTML.
    // Nuxt keeps this off in dev so stylesheet HMR still works.
    inlineStyles: true,
  },
  image: {
    // Cloudflare Workers can't run IPX / sharp — skip optimization there.
    provider: isCloudflare ? 'none' : 'auto',
    domains: ['images.gr-assets.com', 's.gr-assets.com'],
    quality: 82,
  },
  modules: [
    '@nuxt/image',
    '@nuxtjs/color-mode',
    '@nuxt/eslint',
    '@vercel/analytics',
    '@vercel/speed-insights',
  ],
  nitro: {
    // Only force Workers when CLOUDFLARE/WORKERS_CI/CF_PAGES is set.
    // Vercel and Netlify auto-detect their presets.
    preset: isCloudflare ? 'cloudflare_module' : undefined,
    future: {
      nativeSWR: true,
    },
    storage: {
      cache: cacheStorage(),
    },
  },
  // Nuxt requires a cache route rule to generate runtime _payload.json routes.
  routeRules: {
    '/**': { cache: { headersOnly: true, maxAge: 3600 } },
    '/api/**': { cache: false },
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
