import { setHeader } from "h3";
import type { H3Event } from "h3";
import { hostDocumentCacheControl } from "../utils/catalog-cache";

function isHtmlRequest(event: H3Event) {
  const path = event.path || "";
  return (
    !path.startsWith("/api") &&
    !path.startsWith("/_nuxt") &&
    !path.startsWith("/__nuxt")
  );
}

function applyHtmlCacheControl(event: H3Event) {
  if (!isHtmlRequest(event)) return;
  setHeader(event, "Cache-Control", hostDocumentCacheControl());
}

export default defineNitroPlugin((nitroApp) => {
  // Streaming commits headers with the shell. Set Cache-Control before flush:
  // request runs early; render:route runs after routeRules and still before the stream.
  nitroApp.hooks.hook("request", (event) => {
    applyHtmlCacheControl(event);
  });
  nitroApp.hooks.hook("render:route", (_ctx, { event }) => {
    applyHtmlCacheControl(event);
  });
});
