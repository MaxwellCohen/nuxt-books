import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import type { Page, TestInfo } from '@playwright/test';

export const ROOT = fileURLToPath(new URL('..', import.meta.url));

/** One-line evidence string copied into results.json by run.mjs. */
export function evidence(testInfo: TestInfo, text: string) {
  testInfo.annotations.push({ description: text, type: 'evidence' });
}

/** Wait until the Nuxt app has mounted on the client. */
export async function waitForHydration(page: Page) {
  await page.waitForFunction(() => {
    const root = document.querySelector('#__nuxt') as (Element & { __vue_app__?: unknown }) | null;
    return Boolean(root?.__vue_app__);
  });
}

/** Run a build command in the repo root with the preview catalog (no database). */
export function run(command: string, env: Record<string, string> = {}) {
  return execSync(command, {
    cwd: ROOT,
    encoding: 'utf8',
    env: { ...process.env, DATABASE_URL: '', POSTGRES_URL: '', ...env },
    stdio: 'pipe',
  });
}
