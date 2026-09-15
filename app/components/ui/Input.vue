<script setup lang="ts">
import { cn } from "#shared/utils";

type Variant = "checkbox" | "default" | "search" | "unstyled";

const props = withDefaults(
  defineProps<{
    checked?: boolean;
    class?: string;
    id?: string;
    modelValue?: string;
    name?: string;
    placeholder?: string;
    type?: string;
    variant?: Variant;
  }>(),
  {
    type: "text",
    variant: "default",
  },
);

const emit = defineEmits<{
  "update:modelValue": [string];
  change: [Event];
  input: [Event];
}>();

const field =
  "border-divider placeholder-gray focus:border-accent focus:ring-accent/25 dark:border-divider-dark disabled:bg-card disabled:text-muted dark:disabled:bg-card-dark w-full border bg-white text-black transition-colors focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 dark:bg-[#1c1c1c] dark:text-white";

const variants: Record<Variant, string> = {
  checkbox:
    "accent-action size-4 w-auto cursor-pointer disabled:cursor-not-allowed disabled:opacity-60",
  default: `${field} rounded-md px-3 py-2 text-sm`,
  search: `${field} h-11 rounded-lg py-2 pr-10 pl-10 text-base sm:text-sm`,
  unstyled: "",
};

const resolvedVariant = computed(() =>
  props.type === "hidden" ? "unstyled" : props.variant,
);
</script>

<template>
  <input
    :id="id"
    :checked="checked"
    :class="cn(variants[resolvedVariant], props.class)"
    :name="name"
    :placeholder="placeholder"
    :type="type"
    :value="modelValue"
    @change="emit('change', $event)"
    @input="
      emit('update:modelValue', ($event.target as HTMLInputElement).value);
      emit('input', $event);
    "
  />
</template>
