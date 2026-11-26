<script setup lang="ts">
// Server component (experimental componentIslands): rendered on the server only, no client JS.
const marker = 'FT_ISLAND_STATIC_MARKER_93f2';
const rendered = ['static', 'server', 'component'].map(word => word.toUpperCase()).join(' ');
</script>

<template>
  <section id="static-card" class="rounded border p-4">
    <p>{{ marker }}</p>
    <p>{{ rendered }}</p>
  </section>
</template>
