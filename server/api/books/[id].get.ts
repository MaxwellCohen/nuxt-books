import type { H3Event } from "h3";
import { applyApiDelay } from "../../utils/api-delay";
import { getBookById } from "../../utils/book-queries";
import {
  bookByIdCacheKey,
  CATALOG_HTTP_CACHE_MAX_AGE,
  shouldBypassCatalogHttpCache,
} from "../../utils/catalog-http-cache";

async function bookByIdHandler(event: H3Event) {
  const id = getRouterParam(event, "id");
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: "Invalid book ID" });
  }

  await applyApiDelay(getQuery(event));

  try {
    return await getBookById(id);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Can't load book";
    if (message === "Book not found" || message === "Invalid book ID") {
      throw createError({ statusCode: 404, statusMessage: message });
    }
    throw createError({ statusCode: 500, statusMessage: message });
  }
}

const cachedBookByIdHandler = defineCachedEventHandler(bookByIdHandler, {
  getKey: bookByIdCacheKey,
  maxAge: CATALOG_HTTP_CACHE_MAX_AGE,
  swr: true,
});

export default defineEventHandler((event) => {
  if (shouldBypassCatalogHttpCache(event)) {
    setHeader(event, "Cache-Control", "private, no-store");
    return bookByIdHandler(event);
  }
  return cachedBookByIdHandler(event);
});
