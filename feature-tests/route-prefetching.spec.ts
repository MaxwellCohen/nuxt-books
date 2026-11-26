import { expect, test, type Response } from '@playwright/test';
import { evidence, waitForHydration } from './helpers';

const HOVER_MARKER = 'FT_PREFETCH_HOVER_TARGET_5d1';
const VISIBLE_MARKER = 'FT_PREFETCH_VISIBLE_TARGET_8a4';

test('NuxtLink prefetches target route code on hover and on visibility, before click', async ({ page }, testInfo) => {
  const seen: { at: string; marker: string; url: string }[] = [];
  let phase = 'load';
  const payloads: string[] = [];
  page.on('response', async (response: Response) => {
    const url = response.url();
    if (url.includes('_payload.json')) payloads.push(`${phase}:${new URL(url).pathname}`);
    if (!url.endsWith('.js')) return;
    const body = await response.text().catch(() => '');
    for (const marker of [HOVER_MARKER, VISIBLE_MARKER]) {
      if (body.includes(marker)) seen.push({ at: phase, marker, url });
    }
  });

  await page.goto('/feature-tests/route-prefetching');
  await waitForHydration(page);
  await page.waitForLoadState('networkidle');
  expect(seen, 'no target chunk before interaction').toEqual([]);

  phase = 'hover';
  await page.locator('#hover-link').hover();
  await expect.poll(() => seen.filter(s => s.marker === HOVER_MARKER).length).toBeGreaterThan(0);
  expect(seen.some(s => s.marker === VISIBLE_MARKER), 'visibility link not prefetched while offscreen').toBe(false);

  phase = 'scroll';
  await page.locator('#visible-link').scrollIntoViewIfNeeded();
  await expect.poll(() => seen.filter(s => s.marker === VISIBLE_MARKER).length).toBeGreaterThan(0);

  phase = 'click';
  await page.locator('#visible-link').click();
  await expect(page.locator('#target')).toHaveText(VISIBLE_MARKER);

  const hoverHit = seen.find(s => s.marker === HOVER_MARKER)!;
  const visibleHit = seen.find(s => s.marker === VISIBLE_MARKER)!;
  expect(hoverHit.at).toBe('hover');
  expect(visibleHit.at).toBe('scroll');
  evidence(
    testInfo,
    `hover fetched ${new URL(hoverHit.url).pathname} (prefetch-on=interaction), scrolling into view fetched ${new URL(visibleHit.url).pathname} (prefetch-on=visibility), both before click; payload requests: ${payloads.join(' ') || 'none'}`,
  );
});
