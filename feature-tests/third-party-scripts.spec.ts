import { expect, test } from '@playwright/test';
import { evidence } from './helpers';

test('useScript loads a non-blocking script after hydration and a Partytown worker script', async ({ page, request }, testInfo) => {
  const html = await (await request.get('/feature-tests/third-party-scripts')).text();
  const head = html.slice(0, html.indexOf('</head>'));
  const mainTags = [...html.matchAll(/<script[^>]*fake-3p\.js[^>]*>/g)].map(m => m[0]);
  for (const tag of mainTags) expect(tag, 'not parser-blocking').toMatch(/async|defer|type="module"/);
  expect(head).toMatch(/<script[^>]*src="\/feature-tests\/fake-3p-worker\.js"[^>]*type="text\/partytown"/);
  expect(head, 'Partytown runtime snippet from @nuxtjs/partytown').toContain('id="partytown"');

  const workerScriptRequests: { frame: string; type: string }[] = [];
  page.on('request', req => {
    if (!req.url().endsWith('/fake-3p-worker.js')) return;
    let frame = 'none';
    try {
      frame = new URL(req.frame().url()).pathname;
    } catch {}
    workerScriptRequests.push({ frame, type: req.resourceType() });
  });

  const warmup = html.match(/<link[^>]*href="\/feature-tests\/fake-3p\.js"[^>]*>/)?.[0];

  await page.goto('/feature-tests/third-party-scripts');
  await expect.poll(() => page.evaluate(() => (window as unknown as { __fake3p?: number }).__fake3p)).toBe(1);
  const timing = await page.evaluate(() => {
    const [nav] = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
    return { dcl: nav!.domContentLoadedEventEnd, ranAt: (window as unknown as { __fake3pAt: number }).__fake3pAt };
  });
  expect(timing.ranAt, 'executed after the document was parsed').toBeGreaterThan(timing.dcl);

  await expect(page.locator('html')).toHaveAttribute('data-fake3p-worker', 'ran', { timeout: 15_000 });
  const workers = page.workers().map(w => w.url().split(':')[0]);
  // Fetched by Partytown's worker (fetch from its sandbox frame), never as a main-thread <script>.
  expect(workerScriptRequests.length).toBeGreaterThan(0);
  for (const r of workerScriptRequests) {
    expect(r.type).toBe('fetch');
    expect(r.frame).toContain('partytown');
  }
  await expect(page.locator('script[type="text/partytown-x"]')).toHaveCount(1);

  evidence(
    testInfo,
    `onNuxtReady: no <script> in SSR HTML (only ${warmup ? 'a low-priority rel=preload warmup' : 'nothing'}), executed at ${timing.ranAt.toFixed(0)}ms after DCL ${timing.dcl.toFixed(0)}ms; partytown:true emitted type=text/partytown, fetched only as a fetch() from ${workerScriptRequests[0]!.frame} (worker: ${workers.join(',') || 'n/a'}), DOM write proxied back, tag became text/partytown-x — worker runtime comes from separately installed @nuxtjs/partytown`,
  );
});
