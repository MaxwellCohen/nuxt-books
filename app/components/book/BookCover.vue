<script setup vapor lang="ts">
import { thumbHashToDataURL } from "thumbhash";
import {
  EMPTY_IMAGE_URL,
  getLargeBookImageUrl,
} from "#shared/features/book/book-constants";
import { cn } from "#shared/utils";

const props = defineProps<{
  title: string;
  src: string | null;
  thumbhash: string | null;
  sizes: string;
  class?: string;
  priority?: boolean;
}>();

const failedSrc = ref<string | null>(null);

const readySrc = computed(() =>
  getLargeBookImageUrl(props.src ?? EMPTY_IMAGE_URL),
);

const placeholder = computed(() => {
  if (!props.thumbhash) return undefined;
  try {
    const binary = atob(props.thumbhash);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return thumbHashToDataURL(bytes);
  } catch {
    return undefined;
  }
});

const showImage = computed(() =>
  readySrc.value !== failedSrc.value ? readySrc.value : null,
);

function onImageError() {
  failedSrc.value = readySrc.value;
}
</script>

<template>
  <div
    :class="
      cn(
        'bg-card dark:bg-card-dark relative aspect-[2/3] w-full overflow-hidden rounded-md',
        props.class,
      )
    "
  >
    <NuxtImg
      v-if="showImage"
      :alt="title"
      class="absolute inset-0 h-full w-full object-cover"
      decoding="async"
      fit="cover"
      format="webp"
      :loading="priority ? 'eager' : 'lazy'"
      :placeholder="placeholder"
      :preload="priority ? { fetchPriority: 'high' } : false"
      :sizes="sizes"
      :src="showImage"
      @error="onImageError"
    />
    <div
      v-else
      role="img"
      :aria-label="`Cover unavailable for ${title}`"
      class="text-muted absolute inset-0 flex items-center justify-center p-3 text-center text-sm"
    >
      Cover unavailable
    </div>
  </div>
</template>
