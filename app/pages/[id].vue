<script setup lang="ts">
import type { BookDetails } from "#shared/features/book/book-types";
import { getApiDelayMs } from "#shared/url-state";

const route = useRoute();
const { searchParams } = useCatalogParams();

const id = computed(() => String(route.params.id));

const {
  data: book,
  pending,
  error,
  refresh,
} = await useAsyncData<BookDetails>(
  () => `book-${id.value}-${getApiDelayMs(searchParams.value)}`,
  () =>
    $fetch<BookDetails>(`/api/books/${id.value}`, {
      query: { ...searchParams.value },
    }),
  { watch: [id, () => searchParams.value.delay] },
);

useHead({
  title: computed(() =>
    book.value ? `${book.value.title} · Nuxt Books` : "Book · Nuxt Books",
  ),
});
</script>

<template>
  <div class="flex flex-1 flex-col px-4 py-5 sm:px-6">
    <BookBackToBooksLink class="mb-6" />

    <UiEmptyState
      v-if="error && (error.statusCode === 404 || error.statusMessage?.includes('not found') || error.statusMessage?.includes('Invalid'))"
      body="We couldn't find a book with that id."
      title="Book not found"
    >
      <UiButton class="mt-1" href="/" variant="secondary">
        Back to the shelf
      </UiButton>
    </UiEmptyState>

    <UiErrorState
      v-else-if="error"
      body="We couldn't load this book's details."
      title="Can't load book"
    >
      <UiButton class="mt-1" size="sm" variant="secondary" @click="refresh()">
        Try again
      </UiButton>
    </UiErrorState>

    <BookDetailSkeleton v-else-if="pending && !book" />
    <BookDetail v-else-if="book" :book="book" />
  </div>
</template>
