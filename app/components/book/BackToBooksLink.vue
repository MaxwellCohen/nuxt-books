<script setup lang="ts">
import { cn } from "#shared/utils";
import { ArrowLeftIcon } from "../ui/icons";

defineProps<{ class?: string }>();

const linkClass =
  "text-muted hover:bg-card dark:hover:bg-card-dark -ml-1.5 inline-flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium transition-colors hover:text-black dark:hover:text-white";

function goBack() {
  const canGoBack = (
    window as Window & { navigation?: { canGoBack?: boolean } }
  ).navigation?.canGoBack;
  if (canGoBack || (import.meta.client && window.history.length > 1)) {
    useRouter().back();
  } else {
    navigateTo("/");
  }
}
</script>

<template>
  <button :class="cn(linkClass, $props.class)" type="button" @click="goBack">
    <ArrowLeftIcon class="size-4" />
    Back to books
  </button>
</template>
