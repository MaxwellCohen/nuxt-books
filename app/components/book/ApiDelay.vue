<script setup vapor lang="ts">
import {
  API_DELAY_VALUES,
  formatApiDelay,
  getApiDelayMs,
} from "#shared/url-state";

defineProps<{ idPrefix: string }>();

const { searchParams, setDelay } = useCatalogParams();
const draft = ref<number>();

const committed = computed(() => getApiDelayMs(searchParams.value));
const value = computed(() => draft.value ?? committed.value);
</script>

<template>
  <UiRange
    :id="`${idPrefix}-api-delay`"
    label="API delay"
    :readout="formatApiDelay(value)"
    :value="value"
    :values="API_DELAY_VALUES"
    @commit="
      draft = undefined;
      setDelay($event);
    "
    @value-change="draft = $event"
  >
    <template #hint>
      <span>Off</span>
      <span>3s</span>
    </template>
  </UiRange>
</template>
