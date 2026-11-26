<script setup lang="ts">
// 1st-party: routeRules pick the mode per route (see nuxt.config.ts).
definePageMeta({ layout: false });
</script>

<template>
  <main class="p-6">
    <h1>Render modes</h1>
    <ul>
      <li><a href="/feature-tests/render-modes/prerendered">prerendered</a> (routeRules prerender: true)</li>
      <li><a href="/feature-tests/render-modes/ssr">ssr</a> (default: rendered per request)</li>
      <li><a href="/feature-tests/render-modes/spa">spa</a> (routeRules ssr: false)</li>
    </ul>
  </main>
</template>
