<script setup lang="ts">
definePageMeta({ layout: false });
</script>

<template>
  <main class="p-6">
    <h1>Bundle analysis</h1>
    <p>Build-time feature. <code>feature-tests/bundle-analysis.spec.ts</code> runs <code>nuxt analyze --no-serve</code> (experimental command) and asserts the client and Nitro reports are written to <code>node_modules/.cache/nuxt/.nuxt/analyze</code> (the Nuxt 5 buildDir).</p>
  </main>
</template>
