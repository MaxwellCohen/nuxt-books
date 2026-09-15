import type { SearchParams } from "#shared/url-state";
import {
  parseSearchParams,
  withFilters,
  withPage,
} from "#shared/url-state";

function toQueryObject(params: SearchParams): Record<string, string> {
  const query: Record<string, string> = {};
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") query[key] = value;
  }
  return query;
}

export function useCatalogParams() {
  const route = useRoute();

  const searchParams = computed(() =>
    parseSearchParams(
      route.query as Record<string, string | string[] | undefined>,
    ),
  );

  async function commit(
    next: SearchParams,
    options: { replace?: boolean; path?: string } = {},
  ) {
    await navigateTo(
      {
        path: options.path ?? route.path,
        query: toQueryObject(next),
      },
      { replace: options.replace ?? true },
    );
  }

  async function patchFilters(
    patch: Partial<SearchParams>,
    options: { replace?: boolean } = {},
  ) {
    await commit(withFilters(searchParams.value, patch), options);
  }

  async function setPage(page: number) {
    await commit(withPage(searchParams.value, page), { replace: false });
  }

  async function setDelay(ms: number) {
    const next = { ...searchParams.value };
    if (ms <= 0) delete next.delay;
    else next.delay = String(ms);
    await commit(next);
  }

  return {
    searchParams,
    commit,
    patchFilters,
    setPage,
    setDelay,
    toQueryObject,
  };
}
