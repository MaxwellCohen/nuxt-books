<script setup vapor lang="ts">
import { buildHref } from "#shared/url-state";

defineProps<{ idPrefix: string; mobile?: boolean }>();

const { searchParams } = useCatalogParams();

const homeHref = computed(() =>
  buildHref({ delay: searchParams.value.delay }),
);
</script>

<template>
  <div class="flex items-center justify-between gap-2">
    <NuxtLink
      aria-label="Nuxt Books home"
      class="inline-flex items-center gap-2 text-base font-semibold tracking-tight"
      :to="homeHref"
    >
      <UiBookMark class="text-action size-5" />
      Nuxt Books
    </NuxtLink>
  </div>
  <div class="border-divider dark:border-divider-dark mt-6 border-b pb-5">
    <BookCatalogSize />
  </div>
  <div class="mt-5 mb-4">
    <BookApiDelay :id-prefix="idPrefix" />
  </div>
  <p class="text-muted mb-4 text-xs font-semibold tracking-wide uppercase">
    Filters
  </p>
  <BookFilters :id-prefix="idPrefix" />
  <div
    v-if="!mobile"
    class="border-divider dark:border-divider-dark mt-4 flex items-center justify-between gap-2 border-t pt-4"
  >
    <ThemeToggle variant="inline" />
    <a
      aria-label="View source on GitHub"
      class="text-muted rounded-full p-1.5 transition-colors hover:text-black dark:hover:text-white"
      href="https://github.com/nuxt/nuxt"
      rel="noopener noreferrer"
      target="_blank"
    >
      <UiGitHubIcon class="size-4" />
    </a>
  </div>
</template>
