<script setup lang="ts">
// 1st-party (official module): @nuxt/image <NuxtImg> resizes through IPX in production.
definePageMeta({ layout: false });
</script>

<template>
  <main class="p-6">
    <h1>Image pipeline</h1>
    <NuxtImg
      id="hero-img"
      src="/feature-tests/sample.png"
      alt="Hero"
      width="800"
      height="500"
      sizes="400px md:800px"
      format="webp"
      preload
      loading="eager"
    />
    <div style="height: 3000px" aria-hidden="true" />
    <NuxtImg
      id="offscreen-img"
      src="/feature-tests/sample.png"
      alt="Offscreen"
      width="800"
      height="500"
      sizes="400px md:800px"
      format="webp"
      loading="lazy"
    />
  </main>
</template>
