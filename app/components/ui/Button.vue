<script setup lang="ts">
import { cn } from "#shared/utils";

type Variant = "ghost" | "primary" | "secondary";
type Size = "default" | "icon" | "sm";

const props = withDefaults(
  defineProps<{
    ariaLabel?: string;
    class?: string;
    href?: string;
    size?: Size;
    type?: "button" | "submit";
    variant?: Variant;
  }>(),
  {
    size: "default",
    type: "button",
    variant: "primary",
  },
);

const emit = defineEmits<{ click: [MouseEvent] }>();

const base =
  "focus-visible:ring-action/40 inline-flex items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50";

const sizes: Record<Size, string> = {
  default: "h-9 px-4 text-sm",
  icon: "size-9",
  sm: "h-8 px-3 text-xs",
};

const variants: Record<Variant, string> = {
  ghost:
    "text-muted hover:bg-card hover:text-black dark:hover:bg-card-dark dark:hover:text-white",
  primary: "bg-action text-white hover:bg-action-hover",
  secondary:
    "border-divider hover:border-gray/40 hover:bg-card dark:border-divider-dark dark:hover:border-gray/30 dark:hover:bg-card-dark border bg-white text-black dark:bg-transparent dark:text-white",
};

const classes = computed(() =>
  cn(base, sizes[props.size], variants[props.variant], props.class),
);
</script>

<template>
  <NuxtLink v-if="href" :aria-label="ariaLabel" :class="classes" :to="href">
    <slot />
  </NuxtLink>
  <button
    v-else
    :aria-label="ariaLabel"
    :class="classes"
    :type="type"
    @click="emit('click', $event)"
  >
    <slot />
  </button>
</template>
