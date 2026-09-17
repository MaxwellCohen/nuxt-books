import type { H3Event } from "h3";
import {
  toBookFilters,
  toBookQuery,
} from "../../../shared/features/book/book-utils";
import { applyApiDelay } from "../../utils/api-delay";
import { getBooksCount } from "../../utils/book-queries";
import {
  booksCountCacheKey,
  CATALOG_HTTP_CACHE_MAX_AGE,
  shouldBypassCatalogHttpCache,
} from "../../utils/catalog-http-cache";

async function booksCountHandler(event: H3Event) {
  const params = await applyApiDelay(getQuery(event));
  return getBooksCount(toBookFilters(toBookQuery(params)));
}

const cachedBooksCountHandler = defineCachedEventHandler(booksCountHandler, {
  getKey: booksCountCacheKey,
  maxAge: CATALOG_HTTP_CACHE_MAX_AGE,
  swr: true,
});

export default defineEventHandler((event) => {
  if (shouldBypassCatalogHttpCache(event)) {
    setHeader(event, "Cache-Control", "private, no-store");
    return booksCountHandler(event);
  }
  return cachedBooksCountHandler(event);
});
