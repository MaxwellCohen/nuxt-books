<script setup lang="ts">
import { SlidersHorizontalIcon } from "../ui/icons";

const sidebar = inject<{ open: () => void }>("mobileBookSidebar");
</script>

<template>
  <UiButton
    aria-label="Open filters"
    class="md:hidden"
    size="icon"
    variant="ghost"
    @click="sidebar?.open()"
  >
    <SlidersHorizontalIcon class="size-4" />
  </UiButton>
</template>
