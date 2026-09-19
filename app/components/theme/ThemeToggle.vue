<script setup vapor lang="ts">
import { cn } from "#shared/utils";
import { MonitorIcon, MoonIcon, SunIcon } from "../ui/icons";
import type { Theme } from "../../composables/useTheme";

const props = withDefaults(
  defineProps<{ variant?: "inline" | "pill" }>(),
  { variant: "pill" },
);

const { theme, setTheme } = useTheme();

const options: { value: Theme; label: string; icon: typeof SunIcon }[] = [
  { value: "light", label: "Light mode", icon: SunIcon },
  { value: "dark", label: "Dark mode", icon: MoonIcon },
  { value: "system", label: "System theme", icon: MonitorIcon },
];
</script>

<template>
  <div
    :class="
      props.variant === 'inline'
        ? 'inline-flex items-center gap-0.5'
        : 'border-divider dark:border-divider-dark inline-flex items-center rounded-full border p-0.5'
    "
  >
    <button
      v-for="option in options"
      :key="option.value"
      :aria-label="option.label"
      :aria-pressed="theme === option.value ? 'true' : 'false'"
      :class="
        cn(
          'rounded-full p-1.5 transition-colors',
          theme === option.value
            ? 'bg-card dark:bg-card-dark text-black dark:text-white'
            : 'text-muted hover:text-black dark:hover:text-white',
        )
      "
      type="button"
      @click="setTheme(option.value)"
    >
      <component :is="option.icon" class="size-4" />
    </button>
  </div>
</template>
