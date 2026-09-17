<script setup lang="ts">
useHead({ title: "Book · Nuxt Books" });
</script>

<template>
  <div class="flex flex-1 flex-col px-4 py-5 sm:px-6">
    <BookBackToBooksLink class="mb-6" />

    <Suspense>
      <BookDetailContent />
      <template #fallback>
        <BookDetailSkeleton />
      </template>
    </Suspense>
  </div>
</template>
