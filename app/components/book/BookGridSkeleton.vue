<script setup lang="ts">
import { ITEMS_PER_PAGE } from "#shared/features/book/book-constants";

defineProps<{ count?: number }>();

const gridClass =
  "grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7";
</script>

<template>
  <div aria-hidden="true" :class="gridClass">
    <BookCoverSkeleton
      v-for="index in count ?? ITEMS_PER_PAGE"
      :key="index"
    />
  </div>
</template>
