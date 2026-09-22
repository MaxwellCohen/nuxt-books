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
  // IPX needs Node; skip optimization on Cloudflare Workers builds.
  image: {
    provider: isCloudflare ? 'none' : 'ipx',
    domains: ['images.gr-assets.com', 's.gr-assets.com'],
    format: ['webp'],
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
