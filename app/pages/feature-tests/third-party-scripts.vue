<script setup lang="ts">
// 1st-party (official module): @nuxt/scripts useScript.
definePageMeta({ layout: false });

// Main thread, loaded only once Nuxt has hydrated (not parser-blocking).
const { status } = useScript('/feature-tests/fake-3p.js', { trigger: 'onNuxtReady' });

// Worker offload: useScript's partytown option only emits <script type="text/partytown">;
// the Partytown runtime that executes it comes from the separate @nuxtjs/partytown module.
useScript({ src: '/feature-tests/fake-3p-worker.js' }, { partytown: true });
</script>

<template>
  <main class="p-6">
    <h1>Third-party scripts</h1>
    <p>Main-thread script status: <span id="status">{{ status }}</span></p>
  </main>
</template>
