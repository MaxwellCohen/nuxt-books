<script setup lang="ts">
// 1st-party: Vue ref. The page owns the state but never reads it in its own template,
// so only the effect that reads it (FtBoundText's render) re-runs.
import { FT_COUNT_KEY, ftStats } from '~/lib/feature-tests/reactivity-stats';

definePageMeta({ layout: false });
ftStats.pageSetup += 1;
ftStats.pageRenders = 1;
onUpdated(() => (ftStats.pageRenders += 1));

const count = ref(0);
provide(FT_COUNT_KEY, count);
const increment = () => (count.value += 1);
if (import.meta.client) (window as unknown as { __ftReactivity: typeof ftStats }).__ftReactivity = ftStats;
</script>

<template>
  <main class="p-6">
    <h1>Reactivity</h1>
    <button id="increment" type="button" class="rounded border px-3 py-1" @click="increment">+1</button>
    <FeatureTestsFtBoundText />
  </main>
</template>
