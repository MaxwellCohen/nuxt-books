<script setup lang="ts">
// 1st-party: features.inlineStyles (nuxt.config.ts) embeds this SFC's CSS in the SSR HTML.
definePageMeta({ layout: false });
</script>

<template>
  <main class="p-6">
    <h1>CSS inlining</h1>
    <p class="ft-css-inline-marker">This text is styled by route CSS that should arrive inline in a &lt;style&gt; tag.</p>
  </main>
</template>

<style scoped>
.ft-css-inline-marker {
  color: rgb(1, 2, 3);
  border-left: 4px solid rgb(4, 5, 6);
}
</style>
