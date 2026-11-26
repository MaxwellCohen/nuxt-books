import { existsSync, readdirSync, rmSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { expect, test } from '@playwright/test';
import { evidence, ROOT, run } from './helpers';

const walk = (dir: string): string[] =>
  existsSync(dir)
    ? readdirSync(dir).flatMap(name => {
        const path = join(dir, name);
        return statSync(path).isDirectory() ? walk(path) : [path];
      })
    : [];

test('nuxt analyze writes client and Nitro bundle reports', async ({}, testInfo) => {
  test.setTimeout(10 * 60_000);
  // Nuxt 5 compat puts buildDir at node_modules/.cache/nuxt/.nuxt; analyzeDir = <buildDir>/analyze.
  const analyzeDir = join(ROOT, 'node_modules/.cache/nuxt/.nuxt/analyze');
  rmSync(analyzeDir, { force: true, recursive: true });

  run('npx nuxt analyze --no-serve');

  const files = walk(analyzeDir);
  const client = files.find(f => /client\.html$/.test(f));
  const nitro = files.find(f => /nitro\.html$/.test(f));
  expect(client, `client report in ${files.map(f => relative(ROOT, f)).join(', ')}`).toBeTruthy();
  expect(nitro, 'nitro report').toBeTruthy();
  expect(statSync(client!).size).toBeGreaterThan(1000);

  evidence(
    testInfo,
    `\`nuxt analyze --no-serve\` (CLI labels it experimental) wrote ${relative(ROOT, client!)} (${statSync(client!).size} B) and ${relative(ROOT, nitro!)} (${statSync(nitro!).size} B)`,
  );
});
