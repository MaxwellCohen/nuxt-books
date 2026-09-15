<script setup lang="ts">
import type { BookSummary } from "#shared/features/book/book-types";
import { stringifySearchParams } from "#shared/url-state";

useHead({ title: "Books · Nuxt Books" });

const { searchParams } = useCatalogParams();
const queryKey = computed(() => stringifySearchParams(searchParams.value));

const {
  data: books,
  pending: booksPending,
  error: booksError,
  refresh: refreshBooks,
} = await useAsyncData<BookSummary[]>(
  () => `books-${queryKey.value}`,
  () =>
    $fetch<BookSummary[]>("/api/books", {
      query: { ...searchParams.value },
    }),
  { watch: [queryKey] },
);

const {
  data: totalResults,
  pending: countPending,
  refresh: refreshCount,
} = await useAsyncData<number>(
  () => `books-count-${queryKey.value}`,
  () =>
    $fetch<number>("/api/books/count", {
      query: { ...searchParams.value },
    }),
  { watch: [queryKey] },
);

const pending = computed(() => booksPending.value || countPending.value);

async function retry() {
  await Promise.all([refreshBooks(), refreshCount()]);
}
</script>

<template>
  <UiErrorState
    v-if="booksError"
    body="The catalog query failed. Check your database connection and try again."
    title="Can't load books"
  >
    <UiButton class="mt-1" size="sm" variant="secondary" @click="retry">
      Try again
    </UiButton>
  </UiErrorState>

  <div v-else class="flex min-h-0 flex-1 flex-col">
    <div
      class="flex-1 px-4 py-5 transition-opacity duration-200 ease-out group-has-[[data-filtering]]:opacity-60 sm:px-6"
    >
      <BookGridSkeleton v-if="booksPending && !books" />
      <div
        v-else
        :aria-busy="pending ? 'true' : undefined"
        :data-pending="pending ? '' : undefined"
        class="transition-opacity duration-200 ease-out data-[pending]:opacity-60 group-has-[[data-filtering]]:opacity-60"
      >
        <BookGrid
          :books="books ?? []"
          :search-params="searchParams"
        />
      </div>
    </div>
    <footer
      class="border-divider dark:border-divider-dark mt-auto border-t px-4 py-3 sm:px-6"
    >
      <BookPaginationSkeleton v-if="countPending && totalResults == null" />
      <BookPagination
        v-else
        :search-params="searchParams"
        :total-results="totalResults ?? 0"
      />
    </footer>
  </div>
</template>
