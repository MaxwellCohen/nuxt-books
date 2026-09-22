import tailwindcss from '@tailwindcss/vite';
import { defineNuxtConfig } from 'nuxt/config';

const isCloudflare = Boolean(process.env.CLOUDFLARE || process.env.WORKERS_CI);

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  vue: {
    vapor: true,
  },
  experimental: {
    ssrStreaming: true,
  },
  modules: ['@nuxt/image'],
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [tailwindcss()],
  },
  // Auto-detects vercel/netlify providers in those deploys; IPX locally.
  // Cloudflare Workers can't run IPX — skip optimization there.
  image: {
    provider: isCloudflare ? 'none' : 'auto',
    domains: ['images.gr-assets.com', 's.gr-assets.com'],
    format: ['webp'],
    // Book covers use small vw sizes; Vercel only serves listed widths.
    screens: {
      cover: 160,
      cover2x: 320,
      cover3x: 480,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      '2xl': 1536,
    },
  },
  nitro: {
    // Only force Workers when CLOUDFLARE/WORKERS_CI is set. Vercel and Netlify auto-detect.
    preset: isCloudflare ? 'cloudflare_module' : undefined,
  },
  runtimeConfig: {
    apiDelayMs: 0,
    databaseUrl: '',
  },
  devServer: {
    port: 3001,
  },
  app: {
    head: {
      title: 'Nuxt Books',
      htmlAttrs: { lang: 'en' },
      script: [
        {
          innerHTML: `(function(){try{var t=localStorage.getItem("theme");var d=t==="dark"||((t==="system"||!t)&&window.matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.classList.toggle("dark",d);}catch(e){}})();`,
        },
      ],
    },
  },
});
