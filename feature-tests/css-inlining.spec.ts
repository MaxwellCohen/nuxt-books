import { expect, test } from '@playwright/test';
import { evidence } from './helpers';

test('route CSS is inlined in a <style> tag and not linked', async ({ page, request }, testInfo) => {
  const html = await (await request.get('/feature-tests/css-inlining')).text();

  const styles = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map(match => match[1]!);
  const inlineWithMarker = styles.filter(css => css.includes('.ft-css-inline-marker'));
  expect(inlineWithMarker.length, 'inline <style> containing the route CSS').toBeGreaterThan(0);

  const linkHrefs = [...html.matchAll(/<link[^>]*rel="?stylesheet"?[^>]*>/g)].map(
    match => match[0].match(/href="([^"]+)"/)?.[1] ?? '',
  );
  for (const href of linkHrefs) {
    const css = await (await request.get(href)).text();
    expect(css, `linked stylesheet ${href} must not carry the route CSS`).not.toContain('ft-css-inline-marker');
  }

  await page.goto('/feature-tests/css-inlining');
  await expect(page.locator('.ft-css-inline-marker')).toHaveCSS('color', 'rgb(1, 2, 3)');

  evidence(
    testInfo,
    `SSR HTML has ${styles.length} inline <style> tag(s), route CSS in ${inlineWithMarker.length}; ${linkHrefs.length} <link rel=stylesheet> (none with route CSS); computed color applied`,
  );
});
