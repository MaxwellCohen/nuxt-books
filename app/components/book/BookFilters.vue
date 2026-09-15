<script setup lang="ts">
import {
  LANGUAGES,
  LISTS,
  MAX_PAGES,
  MAX_RATING,
  MAX_YEAR,
  MIN_PAGES,
  MIN_RATING,
  MIN_YEAR,
  PAGE_FILTER_VALUES,
  RATING_FILTER_VALUES,
  YEAR_FILTER_VALUES,
} from "#shared/features/book/book-constants";
import type { SearchParams } from "#shared/url-state";

defineProps<{ idPrefix: string }>();

const { searchParams, patchFilters, commit } = useCatalogParams();

const filters = ref<SearchParams>({ ...searchParams.value });
const filtering = ref(false);

watch(
  searchParams,
  (next) => {
    filters.value = { ...next };
    filtering.value = false;
  },
  { deep: true },
);

const activeCount = computed(
  () =>
    Object.entries(filters.value).filter(
      ([key, value]) => key !== "page" && key !== "delay" && Boolean(value),
    ).length,
);

async function apply(patch: Partial<SearchParams>) {
  filtering.value = true;
  const next = { ...filters.value, ...patch };
  delete next.page;
  for (const key of ["search", "year", "rating", "pages", "language", "list"] as const) {
    if (next[key] === undefined || next[key] === "") delete next[key];
  }
  filters.value = next;
  await patchFilters(patch);
}

async function reset() {
  filtering.value = true;
  const delay = filters.value.delay;
  filters.value = delay ? { delay } : {};
  await commit(delay ? { delay } : {});
}
</script>

<template>
  <div
    class="flex min-h-0 flex-1 flex-col"
    :data-filtering="filtering ? '' : undefined"
  >
    <div
      class="min-h-0 flex-1 touch-pan-y [scrollbar-gutter:stable] overflow-x-hidden overflow-y-auto overscroll-contain px-1 pb-6"
    >
      <div class="flex flex-col gap-6">
        <UiRange
          :id="`${idPrefix}-filter-year`"
          label="Published before"
          :readout="filters.year ? filters.year : 'Any year'"
          :value="Number(filters.year ?? MAX_YEAR)"
          :values="YEAR_FILTER_VALUES"
          @value-change="
            apply({ year: $event === MAX_YEAR ? undefined : String($event) })
          "
        >
          <template #hint>
            <span>{{ MIN_YEAR }}</span>
            <span>{{ MAX_YEAR }}</span>
          </template>
        </UiRange>

        <UiRange
          :id="`${idPrefix}-filter-rating`"
          label="Minimum rating"
          :readout="
            Number(filters.rating) > 0
              ? `${filters.rating}+ stars`
              : 'Any rating'
          "
          :value="Number(filters.rating ?? MIN_RATING)"
          :values="RATING_FILTER_VALUES"
          @value-change="
            apply({
              rating: $event === MIN_RATING ? undefined : String($event),
            })
          "
        >
          <template #hint>
            <span>Any</span>
            <span>{{ MAX_RATING }} stars</span>
          </template>
        </UiRange>

        <UiRange
          :id="`${idPrefix}-filter-pages`"
          label="Max pages"
          :readout="
            filters.pages
              ? `${Number(filters.pages).toLocaleString()} pages`
              : 'Any length'
          "
          :value="Number(filters.pages ?? MAX_PAGES)"
          :values="PAGE_FILTER_VALUES"
          @value-change="
            apply({
              pages: $event === MAX_PAGES ? undefined : String($event),
            })
          "
        >
          <template #hint>
            <span>{{ MIN_PAGES }}</span>
            <span>{{ MAX_PAGES.toLocaleString() }}</span>
          </template>
        </UiRange>

        <div class="flex flex-col gap-2">
          <label
            class="text-muted text-xs font-semibold tracking-wide uppercase"
            :for="`${idPrefix}-filter-language`"
          >
            Language
          </label>
          <UiSelect
            :id="`${idPrefix}-filter-language`"
            :model-value="filters.language ?? 'en'"
            @update:model-value="apply({ language: $event || undefined })"
          >
            <option
              v-for="language in LANGUAGES"
              :key="language.value"
              :value="language.value"
            >
              {{ language.label }}
            </option>
          </UiSelect>
        </div>

        <fieldset class="flex flex-col gap-2">
          <legend
            class="text-muted mb-2 text-xs font-semibold tracking-wide uppercase"
          >
            Book lists
          </legend>
          <label
            v-for="list in LISTS"
            :key="list.slug"
            class="hover:bg-card dark:hover:bg-card-dark -mx-2 flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-1.5 text-sm transition-colors"
          >
            <UiInput
              :checked="filters.list === list.slug"
              type="checkbox"
              variant="checkbox"
              @change="
                apply({
                  list: filters.list === list.slug ? undefined : list.slug,
                })
              "
            />
            {{ list.name }}
          </label>
        </fieldset>
      </div>
    </div>

    <div
      v-if="activeCount > 0"
      class="border-divider dark:border-divider-dark border-t pt-3"
    >
      <UiButton class="w-full" variant="secondary" @click="reset">
        Clear all filters
      </UiButton>
    </div>
  </div>
</template>
