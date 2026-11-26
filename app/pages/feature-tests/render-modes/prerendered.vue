<script setup lang="ts">
definePageMeta({ layout: false });
const { data: renderedAt } = await useAsyncData('ft-render-prerendered', () =>
  Promise.resolve(`${new Date().toISOString()} on ${import.meta.server ? 'server' : 'client'}`),
);
</script>

<template>
  <main class="p-6">
    <h1>Render mode: prerendered</h1>
    <p id="rendered-at">{{ renderedAt }}</p>
  </main>
</template>
