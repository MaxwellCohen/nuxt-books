<script setup lang="ts">
import { stringifySearchParams } from "#shared/url-state";

const { searchParams } = useCatalogParams();
const queryKey = computed(() => stringifySearchParams(searchParams.value));

const { data: totalResults, pending } = await useAsyncData<number>(
  () => `books-count-${queryKey.value}`,
  () =>
    $fetch<number>("/api/books/count", {
      query: { ...searchParams.value },
    }),
  { watch: [queryKey] },
);
</script>

<template>
  <div
    :aria-busy="pending ? 'true' : undefined"
    :data-pending="pending ? '' : undefined"
    class="transition-opacity duration-200 ease-out data-[pending]:opacity-60"
  >
    <BookPagination
      :search-params="searchParams"
      :total-results="totalResults ?? 0"
    />
  </div>
</template>
