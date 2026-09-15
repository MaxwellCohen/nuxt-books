<script setup lang="ts">
import { cn } from "#shared/utils";
import { StarIcon } from "./icons";

const props = defineProps<{ class?: string; rating: number }>();

const rounded = computed(() => Math.round(props.rating * 2) / 2);
</script>

<template>
  <span
    :aria-label="`Rated ${rating.toFixed(1)} out of 5`"
    :class="cn('inline-flex items-center gap-0.5', $props.class)"
    role="img"
  >
    <StarIcon
      v-for="index in 5"
      :key="index"
      :class="
        index <= rounded || index - 0.5 === rounded
          ? 'text-warning fill-current'
          : 'text-divider dark:text-divider-dark fill-current'
      "
    />
  </span>
</template>
