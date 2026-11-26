<script setup lang="ts">
// Experimental: server component (no client JS) + a lazily hydrated interactive island.
definePageMeta({ layout: false });
</script>

<template>
  <main class="p-6">
    <h1>Islands</h1>
    <FeatureTestsFtStaticCard />
    <LazyFeatureTestsFtCounter hydrate-on-visible />
  </main>
</template>
