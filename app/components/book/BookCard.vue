<script setup vapor lang="ts">
import type { BookSummary } from "#shared/features/book/book-types";
import { buildHref, type SearchParams } from "#shared/url-state";

const props = defineProps<{
  book: BookSummary;
  searchParams: SearchParams;
  priority: boolean;
}>();

const GRID_SIZES = "33vw sm:25vw md:20vw lg:16vw xl:14vw";

const href = computed(() => {
  const back = buildHref(props.searchParams);
  return back === "/"
    ? `/${props.book.id}`
    : `/${props.book.id}?${back.slice(2)}`;
});
</script>

<template>
  <NuxtLink
    class="focus-visible:ring-action focus-visible:ring-offset-surface dark:focus-visible:ring-offset-surface-dark group relative block rounded-md transition-transform duration-200 ease-out hover:z-10 hover:scale-[1.04] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
    :to="href"
  >
    <BookCover
      class="group-hover:shadow-soft transition-shadow"
      :priority="priority"
      :sizes="GRID_SIZES"
      :src="book.image_url"
      :thumbhash="book.thumbhash"
      :title="book.title"
    />
    <span class="sr-only">{{ book.title }}</span>
  </NuxtLink>
</template>
