import { defineConfig } from '@playwright/test';

// Driven by feature-tests/run.mjs: the "build" project runs build-time specs first
// (they rewrite build output), then run.mjs builds + serves the node app on PORT and
// runs the "runtime" project against it.
const BUILD_SPECS = /(bundle-analysis|multi-host-deployment)\.spec\.ts$/;

export default defineConfig({
  fullyParallel: false,
  projects: [
    { name: 'build', testMatch: BUILD_SPECS },
    { name: 'runtime', testIgnore: BUILD_SPECS, testMatch: /\.spec\.ts$/ },
  ],
  retries: 0,
  testDir: '.',
  timeout: 60_000,
  use: {
    baseURL: `http://127.0.0.1:${process.env.PORT ?? 4103}`,
    launchOptions: { executablePath: process.env.CHROME_PATH ?? '/home/maxc/.local/bin/google-chrome' },
  },
  workers: 1,
});
