<script setup vapor lang="ts">
useHead({ title: "Books · Nuxt Books" });
</script>

<template>
  <div class="flex min-h-0 flex-1 flex-col">
    <div
      class="flex-1 px-4 py-5 transition-opacity duration-200 ease-out group-has-[[data-filtering]]:opacity-60 sm:px-6"
    >
      <Suspense>
        <BookResults />
        <template #fallback>
          <BookGridSkeleton />
        </template>
      </Suspense>
    </div>
    <footer
      class="border-divider dark:border-divider-dark mt-auto border-t px-4 py-3 sm:px-6"
    >
      <Suspense>
        <BookPaginationResults />
        <template #fallback>
          <BookPaginationSkeleton />
        </template>
      </Suspense>
    </footer>
  </div>
</template>
