<script setup vapor lang="ts">
import { cn } from "#shared/utils";

defineProps<{ class?: string }>();
</script>

<template>
  <div aria-hidden="true" :class="cn('skeleton-animation', $props.class)" />
</template>
