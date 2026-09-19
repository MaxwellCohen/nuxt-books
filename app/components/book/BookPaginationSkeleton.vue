<script setup vapor lang="ts">
import { cn } from "#shared/utils";
import { ChevronLeftIcon, ChevronRightIcon } from "../ui/icons";

const stepClass =
  "text-muted hover:bg-card dark:hover:bg-card-dark focus-visible:ring-action/40 inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-sm font-medium transition-colors hover:text-black focus-visible:ring-2 focus-visible:outline-none dark:hover:text-white";
</script>

<template>
  <div aria-hidden="true" class="flex items-center justify-between gap-4">
    <span :class="cn(stepClass, 'pointer-events-none opacity-40')">
      <ChevronLeftIcon class="size-4" />
      Previous
    </span>
    <div class="flex items-center gap-2">
      <UiSkeleton class="skeleton-subtle hidden h-4 w-20 sm:block" />
      <span class="bg-divider dark:bg-divider-dark hidden h-3 w-px sm:block" />
      <UiSkeleton class="skeleton-subtle h-4 w-20" />
    </div>
    <span :class="cn(stepClass, 'pointer-events-none opacity-40')">
      Next
      <ChevronRightIcon class="size-4" />
    </span>
  </div>
</template>
