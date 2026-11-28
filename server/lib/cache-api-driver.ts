/**
 * unstorage driver for Nitro's `cache` mount on Cloudflare Workers, backed by the
 * Cache API (`caches.default`). Workers KV's free tier allows only 1,000 writes a
 * day; the Cache API is free with no write cap. Entries live per data center and
 * can be evicted early, which Nitro treats as a miss. The Cache API can't list
 * keys, so `getKeys` returns none (Nitro's cache never lists them).
 */
type Options = { base?: string; ttl?: number };

/** Nitro's SWR handlers write without a TTL; keep those entries a day so stale hits still serve. */
const DEFAULT_TTL_SECONDS = 86_400;

export default function cacheApiDriver({ base = 'nitro', ttl = DEFAULT_TTL_SECONDS }: Options = {}) {
  const cache = () => (globalThis.caches as CacheStorage & { default: Cache }).default;
  // Cache API keys must be https URLs.
  const url = (key: string) => `https://nitro-cache.example.com/${base}/${encodeURIComponent(key)}`;

  return {
    name: 'cloudflare-cache-api',
    async hasItem(key: string) {
      return (await cache().match(url(key))) !== undefined;
    },
    async getItem(key: string) {
      const hit = await cache().match(url(key));
      return hit ? hit.text() : null;
    },
    async setItem(key: string, value: string, opts?: { ttl?: number }) {
      const headers = { 'Cache-Control': `max-age=${opts?.ttl ?? ttl}` };
      await cache().put(url(key), new Response(value, { headers }));
    },
    async removeItem(key: string) {
      await cache().delete(url(key));
    },
    getKeys() {
      return [];
    },
  };
}
