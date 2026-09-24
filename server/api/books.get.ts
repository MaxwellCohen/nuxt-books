import type { H3Event } from "h3";
import { toBookQuery } from "../../shared/features/book/book-utils";
import { applyApiDelay } from "../utils/api-delay";
import { getBooksCatalog } from "../utils/book-queries";
import { hostDocumentCacheControl } from "../utils/catalog-cache";
import {
  booksPageCacheKey,
  CATALOG_HTTP_CACHE_MAX_AGE,
  shouldBypassCatalogHttpCache,
} from "../utils/catalog-http-cache";

async function booksHandler(event: H3Event) {
  const params = await applyApiDelay(getQuery(event));
  return getBooksCatalog(toBookQuery(params));
}

const cachedBooksHandler = defineCachedEventHandler(booksHandler, {
  getKey: booksPageCacheKey,
  maxAge: CATALOG_HTTP_CACHE_MAX_AGE,
  swr: true,
});

export default defineEventHandler(async (event) => {
  const result = shouldBypassCatalogHttpCache(event)
    ? await booksHandler(event)
    : await cachedBooksHandler(event);
  // Keep Nitro's in-process cache, but don't advertise s-maxage to clients.
  setHeader(event, "Cache-Control", hostDocumentCacheControl());
  return result;
});
