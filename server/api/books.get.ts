import type { H3Event } from "h3";
import { toBookQuery } from "../../shared/features/book/book-utils";
import { applyApiDelay } from "../utils/api-delay";
import { getBooksPage } from "../utils/book-queries";
import {
  booksPageCacheKey,
  CATALOG_HTTP_CACHE_MAX_AGE,
  shouldBypassCatalogHttpCache,
} from "../utils/catalog-http-cache";

async function booksHandler(event: H3Event) {
  const params = await applyApiDelay(getQuery(event));
  return getBooksPage(toBookQuery(params));
}

const cachedBooksHandler = defineCachedEventHandler(booksHandler, {
  getKey: booksPageCacheKey,
  maxAge: CATALOG_HTTP_CACHE_MAX_AGE,
  swr: true,
});

export default defineEventHandler((event) => {
  if (shouldBypassCatalogHttpCache(event)) {
    setHeader(event, "Cache-Control", "private, no-store");
    return booksHandler(event);
  }
  return cachedBooksHandler(event);
});
