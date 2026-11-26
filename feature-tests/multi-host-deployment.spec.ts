import { existsSync, readFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { expect, test } from '@playwright/test';
import { evidence, ROOT, run } from './helpers';

// node_server last so .output is the node build afterwards.
const TARGETS: { expected: string[]; preset: string }[] = [
  { expected: ['.vercel/output/config.json', '.vercel/output/functions/__fallback.func', '.vercel/output/static'], preset: 'vercel' },
  { expected: ['.netlify/functions-internal/server/main.mjs', 'dist'], preset: 'netlify' },
  { expected: ['.output/server/index.mjs', '.output/public', '.output/nitro.json'], preset: 'cloudflare_module' },
  { expected: ['.output/server/index.mjs', '.output/public'], preset: 'node_server' },
];
const OUTPUT_DIRS = ['.output', '.vercel/output', '.netlify', 'dist'];

test('Nitro presets build for several hosts', async ({}, testInfo) => {
  test.setTimeout(20 * 60_000);
  const built: string[] = [];
  for (const { expected, preset } of TARGETS) {
    for (const dir of OUTPUT_DIRS) rmSync(join(ROOT, dir), { force: true, recursive: true });
    run('npx nuxt build', { NITRO_PRESET: preset });
    for (const path of expected) expect(existsSync(join(ROOT, path)), `${preset}: ${path}`).toBe(true);
    const nitroJson = [join(ROOT, '.output/nitro.json'), join(ROOT, '.vercel/output/nitro.json')].find(
      path => preset !== 'netlify' && existsSync(path),
    );
    const builtPreset = nitroJson ? (JSON.parse(readFileSync(nitroJson, 'utf8')) as { preset: string }).preset : preset;
    expect(builtPreset.replace(/-/g, '_')).toBe(preset);
    built.push(`${preset} → ${expected[0]}`);
  }
  evidence(testInfo, `NITRO_PRESET builds succeeded: ${built.join('; ')}`);
});
