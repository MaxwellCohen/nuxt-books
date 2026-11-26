<script setup lang="ts">
definePageMeta({ layout: false });
</script>

<template>
  <main class="p-6">
    <h1>Multi-host deployment</h1>
    <p>Build-time feature. <code>feature-tests/multi-host-deployment.spec.ts</code> builds with the Nitro presets <code>node_server</code>, <code>vercel</code>, <code>netlify</code> and <code>cloudflare_module</code> (via <code>NITRO_PRESET</code>) and asserts each preset's output directory.</p>
  </main>
</template>
