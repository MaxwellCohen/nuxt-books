import { expect, test } from '@playwright/test';
import { evidence } from './helpers';

const widthsOf = (srcset: string) =>
  srcset.split(',').map(candidate => candidate.trim().split(/\s+/)).map(([url, descriptor]) => ({ descriptor, url: url! }));

test('<NuxtImg> emits responsive, sized, lazy, modern-format images', async ({ page, request }, testInfo) => {
  await page.goto('/feature-tests/image-pipeline');
  const hero = page.locator('#hero-img');
  const offscreen = page.locator('#offscreen-img');

  const srcset = (await hero.getAttribute('srcset')) ?? '';
  const candidates = widthsOf(srcset);
  const widths = new Set(candidates.map(c => c.descriptor).filter(d => d?.endsWith('w')));
  expect(widths.size, `srcset widths in "${srcset}"`).toBeGreaterThanOrEqual(2);
  await expect(hero).toHaveAttribute('width', '800');
  await expect(hero).toHaveAttribute('height', '500');
  await expect(offscreen).toHaveAttribute('loading', 'lazy');
  await expect(offscreen).toHaveAttribute('width', '800');

  const offscreenLoadedBeforeScroll = await offscreen.evaluate(img => (img as HTMLImageElement).complete && (img as HTMLImageElement).naturalWidth > 0);

  const types: string[] = [];
  for (const candidate of candidates) {
    const response = await request.get(candidate.url);
    expect(response.status()).toBe(200);
    types.push(response.headers()['content-type'] ?? '');
  }
  for (const type of types) expect(type).toMatch(/image\/(avif|webp)/);

  await offscreen.scrollIntoViewIfNeeded();
  await expect.poll(() => offscreen.evaluate(img => (img as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);

  evidence(
    testInfo,
    `srcset ${[...widths].join('/')} via ${new URL(candidates[0]!.url, page.url()).pathname.split('/').slice(0, 3).join('/')}…, width/height 800x500, offscreen loading=lazy (loaded before scroll: ${offscreenLoadedBeforeScroll}), srcset URLs served as ${[...new Set(types)].join(',')}`,
  );
});
