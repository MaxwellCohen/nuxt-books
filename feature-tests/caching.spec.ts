import { expect, test } from '@playwright/test';
import { evidence } from './helpers';

test('defineCachedEventHandler reuses the value within maxAge and refreshes after', async ({ page, request }, testInfo) => {
  const get = async () => (await (await request.get('/api/feature-tests/cached-time')).json()) as { calls: number; value: string };

  const first = await get();
  const second = await get();
  expect(second.value).toBe(first.value);

  await page.goto('/feature-tests/caching');
  await expect(page.locator('#cached')).toHaveText(first.value);

  await page.waitForTimeout(5_500);
  const third = await get();
  expect(third.value).not.toBe(first.value);
  expect(third.calls).toBe(first.calls + 1);

  evidence(
    testInfo,
    `2 API requests + SSR page within 5s TTL all got "${first.value}" (handler ran once); after 5.5s got "${third.value}" (handler call #${third.calls})`,
  );
});
