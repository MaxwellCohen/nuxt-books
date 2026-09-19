<script setup vapor lang="ts">
import { AlertTriangleIcon } from "./icons";

defineProps<{
  body?: string;
  compact?: boolean;
  title?: string;
}>();
</script>

<template>
  <div
    v-if="compact"
    class="flex flex-col items-center gap-2 px-4 py-6 text-center"
  >
    <AlertTriangleIcon class="text-danger size-4" />
    <p class="text-muted text-xs">{{ title ?? "Something went wrong" }}</p>
    <p v-if="body" class="text-muted text-xs leading-5">{{ body }}</p>
    <slot />
  </div>
  <div
    v-else
    class="grid flex-1 place-items-center px-6 py-20 text-center"
  >
    <div class="flex max-w-sm flex-col items-center gap-3">
      <AlertTriangleIcon class="text-danger size-6" />
      <p class="text-sm font-medium text-black dark:text-white">
        {{ title ?? "Something went wrong" }}
      </p>
      <p v-if="body" class="text-muted text-sm leading-6">{{ body }}</p>
      <slot />
    </div>
  </div>
</template>
