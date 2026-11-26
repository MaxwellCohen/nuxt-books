// Runs the Framework Compare feature tests and writes feature-tests/results.json.
// 1. "build" project: build-time specs (nuxt analyze, multi-preset builds).
// 2. Production node build, served on PORT (default 4103).
// 3. "runtime" project against that server.
import { execSync, spawn } from 'node:child_process';
import { readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const DIR = join(ROOT, 'feature-tests');
const PORT = process.env.PORT ?? '4103';
const env = { ...process.env, DATABASE_URL: '', POSTGRES_URL: '', PORT };

// featureId → [claimed label on Framework Compare, method used here]
const FEATURES = {
  'css-inlining': ['first-party', 'features.inlineStyles: true (nuxt.config.ts); scoped SFC <style> on the route'],
  'font-optimization': ['first-party', '@nuxt/fonts (official module) resolving `font-family: Inter`; routeRules fonts.preload'],
  'image-pipeline': ['first-party', '@nuxt/image (official module) <NuxtImg sizes format="webp"> served by IPX'],
  caching: ['first-party', 'Nitro defineCachedEventHandler({ maxAge: 5, swr: false })'],
  'route-prefetching': ['first-party', '<NuxtLink prefetch-on="interaction"> and prefetch-on="visibility"'],
  islands: ['experimental', 'experimental.componentIslands: *.server.vue server component + <LazyX hydrate-on-visible> island'],
  'render-modes': ['first-party', 'routeRules { prerender: true } and { ssr: false } plus default per-request SSR'],
  reactivity: ['first-party', 'Vue ref provided by the page and read only in a child component'],
  'bundle-analysis': ['experimental', '`nuxt analyze --no-serve` (built-in CLI command marked experimental)'],
  'third-party-scripts': ['first-party', '@nuxt/scripts useScript (trigger onNuxtReady) + useScript partytown:true with @nuxtjs/partytown'],
  'multi-host-deployment': ['first-party', 'Nitro presets via NITRO_PRESET: vercel, netlify, cloudflare_module, node_server'],
};

function playwright(project) {
  const out = join(DIR, `.report-${project}.json`);
  rmSync(out, { force: true });
  try {
    execSync(`npx playwright test -c feature-tests/playwright.config.ts --project=${project} --reporter=list,json`, {
      cwd: ROOT,
      env: { ...env, PLAYWRIGHT_JSON_OUTPUT_NAME: out },
      stdio: 'inherit',
    });
  } catch {
    // Failures are recorded in the JSON report.
  }
  return JSON.parse(readFileSync(out, 'utf8'));
}

async function waitForServer(url, timeoutMs = 30_000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      if ((await fetch(url)).ok) return;
    } catch {}
    await new Promise(resolve => setTimeout(resolve, 300));
  }
  throw new Error(`server did not start at ${url}`);
}

function specsOf(suite) {
  return [
    ...(suite.specs ?? []).map(spec => ({ file: spec.file ?? suite.file, spec })),
    ...(suite.suites ?? []).flatMap(specsOf),
  ];
}

const clean = text => text?.replace(/\u001b\[[0-9;]*m/g, '').split('\n').map(l => l.trim()).filter(Boolean).slice(0, 3).join(' ');

const results = {};
function record(report) {
  for (const { file, spec } of report.suites.flatMap(specsOf)) {
    const featureId = file.replace(/^.*\//, '').replace(/\.spec\.ts$/, '');
    const test = spec.tests[0];
    const result = test.results.at(-1);
    const passed = result?.status === 'passed';
    const evidence = (test.annotations ?? result?.annotations ?? []).find(a => a.type === 'evidence')?.description;
    const [claimedLabel, method] = FEATURES[featureId];
    results[featureId] = {
      claimedLabel,
      status: passed ? 'pass' : 'fail',
      method,
      evidence: passed ? evidence : `FAILED: ${clean(result?.error?.message) ?? result?.status}`,
      test: `feature-tests/${featureId}.spec.ts`,
    };
  }
}

record(playwright('build'));

execSync('npx nuxt build', { cwd: ROOT, env, stdio: 'inherit' });
const server = spawn('node', ['.output/server/index.mjs'], {
  cwd: ROOT,
  env: { ...env, HOST: '127.0.0.1' },
  stdio: 'inherit',
});
try {
  await waitForServer(`http://127.0.0.1:${PORT}/feature-tests`);
  record(playwright('runtime'));
} finally {
  server.kill();
}

// Hand-written label notes (suggestedLabel / extra context) justified by what the specs observed.
const notes = JSON.parse(readFileSync(join(DIR, 'label-notes.json'), 'utf8'));

const ordered = Object.fromEntries(
  Object.entries(FEATURES).map(([id, [claimedLabel, method]]) => [
    id,
    {
      ...(results[id] ?? {
        claimedLabel,
        status: 'blocked',
        method,
        evidence: 'spec did not run',
        test: `feature-tests/${id}.spec.ts`,
      }),
      ...notes[id],
    },
  ]),
);

writeFileSync(
  join(DIR, 'results.json'),
  `${JSON.stringify(
    {
      framework: 'nuxt',
      repo: 'nuxt-books',
      commit: execSync('git rev-parse HEAD', { cwd: ROOT, encoding: 'utf8' }).trim(),
      ranAt: new Date().toISOString(),
      results: ordered,
    },
    null,
    2,
  )}\n`,
);
console.log(Object.entries(ordered).map(([id, r]) => `${r.status.padEnd(5)} ${id}`).join('\n'));
if (Object.values(ordered).some(r => r.status !== 'pass')) process.exitCode = 1;
