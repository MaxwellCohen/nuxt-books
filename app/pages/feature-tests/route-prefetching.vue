<script setup lang="ts">
// 1st-party: <NuxtLink prefetch-on="interaction" | "visibility">.
definePageMeta({ layout: false });
</script>

<template>
  <main class="p-6">
    <h1>Route prefetching</h1>
    <p>
      <NuxtLink id="hover-link" to="/feature-tests/prefetch-hover" prefetch-on="interaction">
        Hover me (prefetch-on="interaction")
      </NuxtLink>
    </p>
    <div style="height: 3000px" aria-hidden="true" />
    <p>
      <NuxtLink id="visible-link" to="/feature-tests/prefetch-visible" prefetch-on="visibility">
        Scroll me into view (prefetch-on="visibility")
      </NuxtLink>
    </p>
  </main>
</template>
