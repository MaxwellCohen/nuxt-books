<script setup lang="ts">
import { buildHref, withFilters } from "#shared/url-state";
import { SearchIcon, XIcon } from "../ui/icons";

const DEBOUNCE_MS = 220;

const route = useRoute();
const { searchParams } = useCatalogParams();

const draft = ref<string>();
const inputId = useId();
const pending = ref(false);
let timer: ReturnType<typeof setTimeout> | undefined;

const committed = computed(() => searchParams.value.search ?? "");
const value = computed(() => draft.value ?? committed.value);

watch(committed, () => {
  draft.value = undefined;
  pending.value = false;
});

onBeforeUnmount(() => {
  if (timer) clearTimeout(timer);
});

async function navigate(nextValue: string) {
  const query = nextValue.trim();
  const href = buildHref(
    withFilters(searchParams.value, { search: query || undefined }),
  );
  pending.value = true;
  await navigateTo(href, {
    replace: route.path === "/",
  });
}

function schedule(nextValue: string) {
  draft.value = nextValue;
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => navigate(nextValue), DEBOUNCE_MS);
}
</script>

<template>
  <form
    :aria-busy="pending ? 'true' : undefined"
    class="relative flex-1"
    :data-filtering="pending ? '' : undefined"
    role="search"
    @submit.prevent="
      () => {
        if (timer) clearTimeout(timer);
        navigate(value);
      }
    "
  >
    <label class="sr-only" :for="inputId">Search books</label>
    <span
      aria-hidden="true"
      class="text-muted pointer-events-none absolute top-1/2 left-3.5 flex size-4 -translate-y-1/2 items-center justify-center"
    >
      <UiSpinner v-if="pending" class="size-4" />
      <SearchIcon v-else class="size-4" />
    </span>
    <UiInput
      :id="inputId"
      class="peer"
      name="search"
      placeholder="Search books…"
      type="search"
      :model-value="value"
      variant="search"
      @update:model-value="schedule"
    />
    <UiIconButton
      class="absolute top-1/2 right-1.5 -translate-y-1/2 peer-placeholder-shown:hidden"
      label="Clear search"
      @click="
        () => {
          if (timer) clearTimeout(timer);
          draft = '';
          navigate('');
        }
      "
    >
      <XIcon class="size-4" />
    </UiIconButton>
  </form>
</template>
