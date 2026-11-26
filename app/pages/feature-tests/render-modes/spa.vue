<script setup lang="ts">
definePageMeta({ layout: false });
const { data: renderedAt } = await useAsyncData('ft-render-spa', () =>
  Promise.resolve(`${new Date().toISOString()} on ${import.meta.server ? 'server' : 'client'}`),
);
</script>

<template>
  <main class="p-6">
    <h1>Render mode: spa</h1>
    <p id="rendered-at">{{ renderedAt }}</p>
  </main>
</template>
