import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { expect, test } from '@playwright/test';
import { evidence, ROOT } from './helpers';

const STATIC_MARKER = 'FT_ISLAND_STATIC_MARKER_93f2';

test('server component ships no JS; lazy-hydrated island is interactive', async ({ page, request }, testInfo) => {
  const scripts: { body: string; url: string }[] = [];
  page.on('response', async response => {
    if (response.request().resourceType() !== 'script' && !response.url().endsWith('.js')) return;
    scripts.push({ body: await response.text().catch(() => ''), url: response.url() });
  });

  const html = await (await request.get('/feature-tests/islands')).text();
  expect(html).toContain(STATIC_MARKER);

  await page.goto('/feature-tests/islands');
  await expect(page.locator('#static-card')).toContainText(STATIC_MARKER);
  const button = page.locator('#island-counter');
  await expect(async () => {
    await button.click();
    await expect(button).toHaveText(/Clicked [1-9]/, { timeout: 500 });
  }).toPass({ timeout: 15_000 });
  await page.waitForLoadState('networkidle');

  const leaking = scripts.filter(s => s.body.includes(STATIC_MARKER)).map(s => s.url);
  expect(leaking, 'static component code must not reach the client').toEqual([]);

  // Also scan every client chunk in the build output, not just the ones this page requested.
  const clientDir = join(ROOT, '.output/public/_nuxt');
  const chunks = readdirSync(clientDir).filter(name => name.endsWith('.js'));
  const leakingChunks = chunks.filter(name => readFileSync(join(clientDir, name), 'utf8').includes(STATIC_MARKER));
  expect(leakingChunks, 'no client chunk contains the static component').toEqual([]);

  evidence(
    testInfo,
    `server component marker in SSR HTML but in 0 of ${scripts.length} JS responses and 0 of ${chunks.length} built client chunks; LazyFtCounter hydrate-on-visible became interactive`,
  );
});
