import tailwindcss from '@tailwindcss/vite';
import { defineNuxtConfig } from 'nuxt/config';

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  vue: {
    vapor: true,
  },
  experimental: {
    ssrStreaming: true,
  },
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [tailwindcss()],
  },
  nitro: {
    // Only force Workers when CLOUDFLARE/WORKERS_CI is set. Vercel and Netlify auto-detect.
    preset:
      process.env.CLOUDFLARE || process.env.WORKERS_CI
        ? 'cloudflare_module'
        : undefined,
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
