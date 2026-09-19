<script setup vapor lang="ts">
import type { BookSummary } from "#shared/features/book/book-types";
import { stringifySearchParams } from "#shared/url-state";

const { searchParams } = useCatalogParams();
const queryKey = computed(() => stringifySearchParams(searchParams.value));

const {
  data: books,
  pending,
  error,
  refresh,
} = await useAsyncData<BookSummary[]>(
  () => `books-${queryKey.value}`,
  () =>
    $fetch<BookSummary[]>("/api/books", {
      query: { ...searchParams.value },
    }),
  { watch: [queryKey] },
);
</script>

<template>
  <UiErrorState
    v-if="error"
    body="The catalog query failed. Check your database connection and try again."
    title="Can't load books"
  >
    <UiButton class="mt-1" size="sm" variant="secondary" @click="refresh()">
      Try again
    </UiButton>
  </UiErrorState>

  <div
    v-else
    :aria-busy="pending ? 'true' : undefined"
    :data-pending="pending ? '' : undefined"
    class="transition-opacity duration-200 ease-out data-[pending]:opacity-60 group-has-[[data-filtering]]:opacity-60"
  >
    <BookGrid :books="books ?? []" :search-params="searchParams" />
  </div>
</template>
