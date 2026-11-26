<script setup lang="ts">
// 1st-party: the data comes from a Nitro defineCachedEventHandler (server/api/feature-tests/cached-time.get.ts).
definePageMeta({ layout: false });
const { data } = await useFetch('/api/feature-tests/cached-time');
</script>

<template>
  <main class="p-6">
    <h1>Caching</h1>
    <p>Cached value (5s TTL): <span id="cached">{{ data?.value }}</span></p>
  </main>
</template>
