import type { InjectionKey, Ref } from 'vue';

export const FT_COUNT_KEY: InjectionKey<Ref<number>> = Symbol('ft-count');
// Plain (non-reactive) counters so recording them never triggers renders.
export const ftStats = { boundRenders: 0, boundSetup: 0, pageRenders: 0, pageSetup: 0 };
