<script setup vapor lang="ts">
import { PRIORITY_COVER_COUNT } from "#shared/features/book/book-constants";
import type { BookSummary } from "#shared/features/book/book-types";
import type { SearchParams } from "#shared/url-state";

defineProps<{
  books: BookSummary[];
  searchParams: SearchParams;
}>();

const gridClass =
  "grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7";
</script>

<template>
  <UiEmptyState
    v-if="books.length === 0"
    body="Nothing matched these filters. Try widening the year range or clearing the search."
    title="No books found"
  />
  <div v-else :class="gridClass">
    <BookCard
      v-for="(book, index) in books"
      :key="book.id"
      :book="book"
      :priority="index < PRIORITY_COVER_COUNT"
      :search-params="searchParams"
    />
  </div>
</template>
