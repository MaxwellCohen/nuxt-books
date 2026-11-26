import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { expect, test } from '@playwright/test';
import { evidence, ROOT } from './helpers';

const renderedAt = (html: string) => html.match(/<p id="rendered-at">([^<]*)<\/p>/)?.[1];

test('routeRules give prerendered, per-request SSR and client-only routes', async ({ page, request }, testInfo) => {
  const prerenderFile = join(ROOT, '.output/public/feature-tests/render-modes/prerendered/index.html');
  expect(existsSync(prerenderFile), 'prerendered HTML in build output').toBe(true);

  const get = async (path: string) => (await request.get(path)).text();
  const pre1 = renderedAt(await get('/feature-tests/render-modes/prerendered'));
  await page.waitForTimeout(20);
  const pre2 = renderedAt(await get('/feature-tests/render-modes/prerendered'));
  expect(pre1).toMatch(/on server$/);
  expect(pre2).toBe(pre1);

  const ssr1 = renderedAt(await get('/feature-tests/render-modes/ssr'));
  await page.waitForTimeout(20);
  const ssr2 = renderedAt(await get('/feature-tests/render-modes/ssr'));
  expect(ssr1).toMatch(/on server$/);
  expect(ssr2).not.toBe(ssr1);

  const spaHtml = await get('/feature-tests/render-modes/spa');
  expect(renderedAt(spaHtml), 'client-only route has no SSR markup').toBeUndefined();
  await page.goto('/feature-tests/render-modes/spa');
  await expect(page.locator('#rendered-at')).toHaveText(/on client$/);

  evidence(
    testInfo,
    `prerendered: build file exists, stable "${pre1}" across requests; ssr: "${ssr1}" then "${ssr2}"; spa (ssr:false): no SSR markup, rendered in browser`,
  );
});
