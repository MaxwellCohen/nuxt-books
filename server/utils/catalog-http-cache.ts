import type { H3Event } from "h3";
import {
  getApiDelayMs,
  parseSearchParams,
  type RawSearchParams,
} from "../../shared/url-state";

export const CATALOG_HTTP_CACHE_MAX_AGE = 3600;

export function getRequestDelayMs(event: H3Event): number {
  return getApiDelayMs(
    parseSearchParams(getQuery(event) as RawSearchParams),
  );
}

export function shouldBypassCatalogHttpCache(event: H3Event): boolean {
  return getRequestDelayMs(event) > 0;
}

function queryParam(query: Record<string, unknown>, key: string): string {
  const value = query[key];
  if (Array.isArray(value)) return String(value[0] ?? "");
  return value == null ? "" : String(value);
}

// Nitro's cached-handler getKey runs escapeKey, which strips non-word chars.
function encodeCacheKey(parts: Record<string, string>): string {
  return Object.entries(parts)
    .map(([key, value]) => `${key}_${encodeURIComponent(value).replace(/%/g, "_")}`)
    .join("__");
}

export function booksPageCacheKey(event: H3Event): string {
  const query = getQuery(event);
  return encodeCacheKey({
    language: queryParam(query, "language"),
    list: queryParam(query, "list"),
    page: queryParam(query, "page"),
    pages: queryParam(query, "pages"),
    rating: queryParam(query, "rating"),
    search: queryParam(query, "search"),
    year: queryParam(query, "year"),
  });
}

export function bookByIdCacheKey(event: H3Event): string {
  return encodeCacheKey({
    id: getRouterParam(event, "id") ?? "",
  });
}
