<script setup lang="ts">
const count = ref(0);
</script>

<template>
  <button id="island-counter" type="button" class="rounded border px-3 py-1" @click="count++">
    Clicked {{ count }}
  </button>
</template>
