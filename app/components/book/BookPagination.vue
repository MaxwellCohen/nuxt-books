<script setup lang="ts">
import {
  buildHref,
  getCurrentPage,
  getTotalPages,
  withPage,
  type SearchParams,
} from "#shared/url-state";
import { cn } from "#shared/utils";
import { ChevronLeftIcon, ChevronRightIcon } from "../ui/icons";

const props = defineProps<{
  searchParams: SearchParams;
  totalResults: number;
}>();

const stepClass =
  "text-muted hover:bg-card dark:hover:bg-card-dark focus-visible:ring-action/40 inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-sm font-medium transition-colors hover:text-black focus-visible:ring-2 focus-visible:outline-none dark:hover:text-white";

const totalPages = computed(() => getTotalPages(props.totalResults));
const currentPage = computed(() =>
  getCurrentPage(props.searchParams, totalPages.value),
);
const hasPrevious = computed(() => currentPage.value > 1);
const hasNext = computed(() => currentPage.value < totalPages.value);
</script>

<template>
  <nav aria-label="Pagination" class="flex items-center justify-between gap-4">
    <NuxtLink
      v-if="hasPrevious"
      aria-label="Previous page"
      :class="stepClass"
      :to="buildHref(withPage(searchParams, currentPage - 1))"
    >
      <ChevronLeftIcon class="size-4" />
      Previous
    </NuxtLink>
    <span
      v-else
      aria-disabled="true"
      :class="cn(stepClass, 'pointer-events-none opacity-40')"
    >
      <ChevronLeftIcon class="size-4" />
      Previous
    </span>

    <p class="text-muted flex items-center gap-2 text-xs tabular-nums sm:text-sm">
      <span class="hidden sm:inline">
        <span class="font-medium text-black dark:text-white">
          {{ totalResults.toLocaleString() }}
        </span>
        books
      </span>
      <span
        aria-hidden="true"
        class="bg-divider dark:bg-divider-dark hidden h-3 w-px sm:block"
      />
      <span>
        Page {{ currentPage.toLocaleString() }} of
        {{ totalPages.toLocaleString() }}
      </span>
    </p>

    <NuxtLink
      v-if="hasNext"
      aria-label="Next page"
      :class="stepClass"
      :to="buildHref(withPage(searchParams, currentPage + 1))"
    >
      Next
      <ChevronRightIcon class="size-4" />
    </NuxtLink>
    <span
      v-else
      aria-disabled="true"
      :class="cn(stepClass, 'pointer-events-none opacity-40')"
    >
      Next
      <ChevronRightIcon class="size-4" />
    </span>
  </nav>
</template>
