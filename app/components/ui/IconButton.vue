<script setup lang="ts">
import { cn } from "#shared/utils";

type Size = "default" | "sm";

const props = withDefaults(
  defineProps<{
    class?: string;
    label: string;
    size?: Size;
  }>(),
  { size: "default" },
);

const emit = defineEmits<{ click: [MouseEvent] }>();

const base =
  "text-muted hover:bg-card focus-visible:ring-accent/40 dark:hover:bg-card-dark inline-flex shrink-0 items-center justify-center rounded-md transition-colors hover:text-black focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:hover:text-white";

const sizes: Record<Size, string> = {
  default: "size-8",
  sm: "size-7",
};
</script>

<template>
  <button
    :aria-label="label"
    :class="cn(base, sizes[props.size], props.class)"
    type="button"
    @click="emit('click', $event)"
  >
    <slot />
  </button>
</template>
