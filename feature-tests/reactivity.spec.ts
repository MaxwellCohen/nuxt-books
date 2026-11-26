import { expect, test } from '@playwright/test';
import { evidence, waitForHydration } from './helpers';

type Stats = { boundRenders: number; boundSetup: number; pageRenders: number; pageSetup: number };

test('ref update re-runs only the effect that reads it', async ({ page }, testInfo) => {
  await page.goto('/feature-tests/reactivity');
  await waitForHydration(page);
  for (let i = 0; i < 3; i++) await page.locator('#increment').click();
  await expect(page.locator('#bound-text')).toHaveText('3');

  const stats = await page.evaluate(() => (window as unknown as { __ftReactivity: Stats }).__ftReactivity);
  expect(stats.pageSetup).toBe(1);
  expect(stats.pageRenders, 'state-owning page component never re-rendered').toBe(1);
  expect(stats.boundSetup).toBe(1);

  evidence(
    testInfo,
    `after 3 updates text=3; page (owns ref) setup=${stats.pageSetup} renders=${stats.pageRenders}; bound child setup=${stats.boundSetup} renders=${stats.boundRenders} (Vue 3.5 VDOM: the reading component's render effect re-runs, component-level granularity)`,
  );
});
