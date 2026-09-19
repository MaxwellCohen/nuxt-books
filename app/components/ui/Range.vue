<script setup vapor lang="ts">
const props = defineProps<{
  id: string;
  label: string;
  readout?: string;
  value: number;
  values: readonly number[];
}>();

const emit = defineEmits<{
  commit: [number];
  valueChange: [number];
}>();

const index = computed(() => {
  const exact = props.values.indexOf(props.value);
  if (exact >= 0) return exact;
  let closest = 0;
  let distance = Number.POSITIVE_INFINITY;
  props.values.forEach((candidate, i) => {
    const next = Math.abs(candidate - props.value);
    if (next < distance) {
      closest = i;
      distance = next;
    }
  });
  return closest;
});

function pick(event: Event) {
  const target = event.currentTarget as HTMLInputElement;
  return props.values[Number(target.value)] ?? props.value;
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <div class="flex items-baseline justify-between gap-2">
      <label
        class="text-muted text-xs font-semibold tracking-wide uppercase"
        :for="id"
      >
        {{ label }}
      </label>
      <span class="text-sm font-medium text-black tabular-nums dark:text-white">
        <slot name="readout">{{ readout ?? value }}</slot>
      </span>
    </div>
    <input
      :id="id"
      class="focus-visible:ring-accent/30 cursor-pointer rounded-full focus-visible:ring-2 focus-visible:outline-none"
      :max="values.length - 1"
      :min="0"
      step="1"
      type="range"
      :value="index"
      @change="emit('commit', pick($event))"
      @input="emit('valueChange', pick($event))"
    />
    <div class="text-muted flex justify-between text-[11px] tabular-nums">
      <slot name="hint" />
    </div>
  </div>
</template>
