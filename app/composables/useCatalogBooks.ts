import type { BooksCatalogPage } from "#shared/features/book/book-types";
import { stringifySearchParams } from "#shared/url-state";

/** Shared catalog fetch for grid + pagination (one `/api/books` round-trip). */
export function useCatalogBooks() {
  const { searchParams } = useCatalogParams();
  const queryKey = computed(() => stringifySearchParams(searchParams.value));

  return useAsyncData<BooksCatalogPage>(
    () => `books-catalog-${queryKey.value}`,
    () =>
      $fetch<BooksCatalogPage>("/api/books", {
        query: { ...searchParams.value },
      }),
    { watch: [queryKey] },
  );
}
