<script setup vapor lang="ts">
const { searchParams } = useCatalogParams();
const { data: catalog, pending } = await useCatalogBooks();

const totalResults = computed(() => catalog.value?.total ?? 0);
</script>

<template>
  <div
    :aria-busy="pending ? 'true' : undefined"
    :data-pending="pending ? '' : undefined"
    class="transition-opacity duration-200 ease-out data-[pending]:opacity-60"
  >
    <BookPagination
      :search-params="searchParams"
      :total-results="totalResults"
    />
  </div>
</template>
