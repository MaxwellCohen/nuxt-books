<script setup vapor lang="ts">
import { cn } from "#shared/utils";
import { SpinnerIcon } from "./icons";

defineProps<{ class?: string }>();
</script>

<template>
  <SpinnerIcon :class="cn('size-4 shrink-0', $props.class)" />
</template>
