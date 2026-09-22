<script setup vapor lang="ts">
import type { BookDetails } from "#shared/features/book/book-types";
import {
  formatCount,
  getLanguageLabel,
} from "#shared/features/book/book-utils";
import {
  BookOpenIcon,
  Building2Icon,
  CalendarDaysIcon,
  GlobeIcon,
  HashIcon,
} from "../ui/icons";

const props = defineProps<{ book: BookDetails }>();

const DETAIL_SIZES = "60vw md:288px";

const rating = computed(() => Number(props.book.average_rating));
const hasRating = computed(
  () => props.book.average_rating !== null && !Number.isNaN(rating.value),
);

useHead({
  title: `${props.book.title} · Nuxt Books`,
});
</script>

<template>
  <article class="flex flex-col gap-8 md:flex-row md:gap-10">
    <div class="mx-auto w-40 shrink-0 sm:w-48 md:mx-0 md:w-72">
      <BookCover
        class="shadow-soft ring-divider/70 dark:ring-divider-dark/70 ring-1"
        priority
        :sizes="DETAIL_SIZES"
        :src="book.image_url"
        :thumbhash="book.thumbhash"
        :title="book.title"
      />
    </div>

    <div class="min-w-0 flex-1">
      <h1>{{ book.title }}</h1>
      <p v-if="book.authors.length > 0" class="text-muted mt-2 text-base sm:text-lg">
        {{ book.authors.join(", ") }}
      </p>

      <div
        v-if="hasRating"
        class="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1"
      >
        <UiStarRating :rating="rating" />
        <span class="text-sm font-semibold tabular-nums">
          {{ rating.toFixed(1) }}
        </span>
        <span v-if="book.ratings_count" class="text-muted text-sm tabular-nums">
          {{ formatCount(book.ratings_count ?? 0) }} ratings
        </span>
      </div>

      <p
        v-if="book.description"
        class="text-muted mt-6 max-w-prose text-sm leading-7"
      >
        {{ book.description }}
      </p>

      <dl
        class="border-divider dark:border-divider-dark mt-8 grid grid-cols-1 gap-x-8 gap-y-4 border-t pt-6 sm:grid-cols-2"
      >
        <div class="flex items-start gap-3">
          <span class="text-muted mt-0.5 shrink-0">
            <BookOpenIcon class="size-4" />
          </span>
          <div class="min-w-0">
            <dt class="text-muted text-xs font-semibold tracking-wide uppercase">
              Pages
            </dt>
            <dd class="mt-0.5 truncate text-sm">
              {{ book.num_pages ? book.num_pages.toLocaleString() : "Unknown" }}
            </dd>
          </div>
        </div>
        <div class="flex items-start gap-3">
          <span class="text-muted mt-0.5 shrink-0">
            <GlobeIcon class="size-4" />
          </span>
          <div class="min-w-0">
            <dt class="text-muted text-xs font-semibold tracking-wide uppercase">
              Language
            </dt>
            <dd class="mt-0.5 truncate text-sm">
              {{ getLanguageLabel(book.language_code) }}
            </dd>
          </div>
        </div>
        <div class="flex items-start gap-3">
          <span class="text-muted mt-0.5 shrink-0">
            <CalendarDaysIcon class="size-4" />
          </span>
          <div class="min-w-0">
            <dt class="text-muted text-xs font-semibold tracking-wide uppercase">
              Published
            </dt>
            <dd class="mt-0.5 truncate text-sm">
              {{ book.publication_year ?? "Unknown" }}
            </dd>
          </div>
        </div>
        <div class="flex items-start gap-3">
          <span class="text-muted mt-0.5 shrink-0">
            <Building2Icon class="size-4" />
          </span>
          <div class="min-w-0">
            <dt class="text-muted text-xs font-semibold tracking-wide uppercase">
              Publisher
            </dt>
            <dd class="mt-0.5 truncate text-sm">
              {{ book.publisher ?? "Unknown" }}
            </dd>
          </div>
        </div>
        <div class="flex items-start gap-3">
          <span class="text-muted mt-0.5 shrink-0">
            <HashIcon class="size-4" />
          </span>
          <div class="min-w-0">
            <dt class="text-muted text-xs font-semibold tracking-wide uppercase">
              ISBN
            </dt>
            <dd class="mt-0.5 truncate text-sm">
              <span class="font-mono text-xs">{{ book.isbn ?? "None" }}</span>
            </dd>
          </div>
        </div>
      </dl>
    </div>
  </article>
</template>
