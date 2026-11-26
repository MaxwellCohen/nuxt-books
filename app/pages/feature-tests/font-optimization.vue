<script setup lang="ts">
// 1st-party: @nuxt/fonts sees `font-family: Inter` below, downloads Inter at build time,
// serves it from /_fonts, injects @font-face (+ metric-adjusted fallback) and, via the
// route rule in nuxt.config.ts, a <link rel="preload" as="font">.
definePageMeta({ layout: false });
</script>

<template>
  <main class="p-6">
    <h1 class="ft-font">Font optimization</h1>
    <p class="ft-font">The quick brown fox jumps over the lazy dog.</p>
  </main>
</template>

<style scoped>
.ft-font {
  font-family: Inter, sans-serif;
}
</style>
