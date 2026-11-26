import { expect, test } from '@playwright/test';
import { evidence } from './helpers';

test('Inter is self-hosted with font-display and a preload hint', async ({ page, request }, testInfo) => {
  const thirdPartyFontRequests: string[] = [];
  const sameOriginFontRequests: string[] = [];
  page.on('request', req => {
    const url = req.url();
    if (/fonts\.(googleapis|gstatic)\.com/.test(url)) thirdPartyFontRequests.push(url);
    else if (req.resourceType() === 'font') sameOriginFontRequests.push(url);
  });

  await page.goto('/feature-tests/font-optimization');
  await page.evaluate(() => document.fonts.ready);
  const interLoaded = await page.evaluate(() => document.fonts.check('16px Inter'));
  expect(interLoaded, 'Inter face loaded').toBe(true);
  expect(thirdPartyFontRequests).toEqual([]);
  expect(sameOriginFontRequests.length).toBeGreaterThan(0);
  for (const url of sameOriginFontRequests) expect(new URL(url).host).toBe(new URL(page.url()).host);

  const html = await (await request.get('/feature-tests/font-optimization')).text();
  const interFaces = [...html.matchAll(/@font-face\s*\{([^}]*)\}/g)]
    .map(match => match[1]!)
    .filter(body => /font-family:\s*["']?Inter["']?\s*;/.test(body));
  expect(interFaces.length, '@font-face for Inter').toBeGreaterThan(0);
  for (const body of interFaces) {
    expect(body).toMatch(/font-display:\s*swap/);
    expect(body).not.toMatch(/fonts\.gstatic\.com/);
  }
  const fallback = [...html.matchAll(/@font-face\s*\{([^}]*)\}/g)].find(match =>
    /font-family:\s*["']?Inter Fallback/.test(match[1]!),
  );
  expect(fallback?.[1], 'metric-adjusted fallback face').toMatch(/size-adjust/);

  const preloads = [...html.matchAll(/<link[^>]*rel="preload"[^>]*as="font"[^>]*>/g)].map(m => m[0]);
  expect(preloads.length, '<link rel=preload as=font>').toBeGreaterThan(0);
  const preloadHref = preloads[0]!.match(/href="([^"]+)"/)![1]!;
  expect(preloadHref.startsWith('/')).toBe(true);
  const fontResponse = await request.get(preloadHref);
  expect(fontResponse.status()).toBe(200);

  evidence(
    testInfo,
    `${interFaces.length} Inter @font-face (font-display: swap, local URLs) + "Inter Fallback" with size-adjust; preload ${preloadHref.slice(0, 40)}… (${fontResponse.headers()['content-type']}); 0 Google Fonts requests, ${sameOriginFontRequests.length} same-origin font request(s)`,
  );
});
