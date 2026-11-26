<script setup lang="ts">
definePageMeta({ layout: false });
useHead({ title: 'Feature tests' });

const features = [
  'css-inlining',
  'font-optimization',
  'image-pipeline',
  'caching',
  'route-prefetching',
  'islands',
  'render-modes',
  'reactivity',
  'bundle-analysis',
  'third-party-scripts',
  'multi-host-deployment',
];
</script>

<template>
  <main class="mx-auto max-w-2xl p-6">
    <h1 class="mb-4 text-2xl font-bold">Framework Compare feature tests (Nuxt)</h1>
    <p class="mb-4">Each page implements one feature; <code>feature-tests/*.spec.ts</code> proves it against a production build.</p>
    <ul class="list-disc pl-6">
      <li v-for="id in features" :key="id">
        <NuxtLink :to="`/feature-tests/${id}`" class="text-primary underline">{{ id }}</NuxtLink>
      </li>
    </ul>
  </main>
</template>
