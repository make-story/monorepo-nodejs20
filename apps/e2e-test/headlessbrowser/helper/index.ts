/**
 * playwright helper
 * https://playwright.dev/docs/library
 * https://playwright.dev/docs/api/class-playwright
 */
import assert from 'node:assert';
import {
  chromium,
  firefox,
  webkit,
  request,
  devices,
  errors,
  selectors,
} from 'playwright';

import { test, expect } from '@playwright/test';

//test.describe.configure({ mode: 'serial' });

const setup = async () => {
  // https://playwright.dev/docs/api/class-browsertype#browser-type-launch
  const browser = await chromium.launch({ headless: false });
  // https://playwright.dev/docs/api/class-browser#browser-new-context
  const context = await browser.newContext({});
  // https://playwright.dev/docs/api/class-browser#browser-new-page
  const page = await context.newPage();
};

test.beforeAll(async ({ browser }) => {
  // ...
});

test.afterAll(async () => {
  // ...
});

test.describe(() => {
  // All tests in this describe group will get 2 retry attempts.
  test.describe.configure({ retries: 2 });

  test('test 1', async ({ page }) => {
    // ...
  });

  test('test 2', async ({ page }) => {
    // ...
  });
});
