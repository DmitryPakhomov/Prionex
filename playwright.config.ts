import { defineConfig } from '@playwright/test';
import { existsSync } from 'node:fs';
import { loadEnvFile } from 'node:process';

if (existsSync('.env')) {
  loadEnvFile('.env');
}

for (const [key, fallback] of [['TOOLSHOP_UI_URL', 'http://localhost:4200'], ['TOOLSHOP_API_URL', 'http://localhost:8091']]) {
  const url = new URL(process.env[key] || fallback);
  if (!['localhost', '127.0.0.1', '[::1]'].includes(url.hostname) || !['http:', 'https:'].includes(url.protocol)) {
    throw new Error(`${key} must point to a local Toolshop instance`);
  }
  process.env[key] = url.origin;
}

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  workers: 3,
  reporter: [['list'], ['html', { outputFolder: 'reports/html', open: 'never' }]],
  outputDir: 'reports/results',
  use: {
    baseURL: process.env.TOOLSHOP_UI_URL,
    testIdAttribute: 'data-test',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
});
