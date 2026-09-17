import { getQuery, sendWebResponse, setHeader, toWebRequest } from "h3";
import type { H3Event } from "h3";
import { HTML_CACHE_CONTROL, matchCachedHtml } from "../utils/catalog-cache";
import {
  getApiDelayMs,
  parseSearchParams,
  type RawSearchParams,
} from "../../shared/url-state";

const UNCACHED_HTML = "private, no-store";

function isHtmlRequest(event: H3Event) {
  const path = event.path || "";
  return (
    !path.startsWith("/api") &&
    !path.startsWith("/_nuxt") &&
    !path.startsWith("/__nuxt")
  );
}

function htmlCacheControl(event: H3Event) {
  const delay = getApiDelayMs(
    parseSearchParams(getQuery(event) as RawSearchParams),
  );
  return delay > 0 ? UNCACHED_HTML : HTML_CACHE_CONTROL;
}

function applyHtmlCacheControl(event: H3Event) {
  if (!isHtmlRequest(event)) return;
  const cacheControl = htmlCacheControl(event);
  setHeader(event, "Cache-Control", cacheControl);
  setHeader(event, "CDN-Cache-Control", cacheControl);
  setHeader(event, "Vercel-CDN-Cache-Control", cacheControl);
  setHeader(event, "Netlify-CDN-Cache-Control", cacheControl);
}

export default defineNitroPlugin((nitroApp) => {
  // Streaming commits headers with the shell. Set Cache-Control before flush:
  // request runs early; render:route runs after routeRules and still before the stream.
  nitroApp.hooks.hook("request", async (event) => {
    applyHtmlCacheControl(event);
    if (!isHtmlRequest(event) || htmlCacheControl(event) === UNCACHED_HTML) return;

    const cached = await matchCachedHtml(toWebRequest(event));
    if (cached) {
      await sendWebResponse(event, cached);
    }
  });
  nitroApp.hooks.hook("render:route", (_ctx, { event }) => {
    applyHtmlCacheControl(event);
  });
});
