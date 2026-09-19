<script setup vapor lang="ts">
useHead({ title: "Page not found · Nuxt Books" });
setResponseStatus(404);
</script>

<template>
  <UiEmptyState body="That page isn't in the catalog." title="Page not found">
    <UiButton class="mt-1" href="/" variant="secondary">
      Back to the shelf
    </UiButton>
  </UiEmptyState>
</template>
