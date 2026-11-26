<script setup lang="ts">
import { FT_COUNT_KEY, ftStats } from '~/lib/feature-tests/reactivity-stats';

const count = inject(FT_COUNT_KEY)!;
ftStats.boundSetup += 1;
ftStats.boundRenders = 1;
onUpdated(() => (ftStats.boundRenders += 1));
</script>

<template>
  <p>Count: <span id="bound-text">{{ count }}</span></p>
</template>
