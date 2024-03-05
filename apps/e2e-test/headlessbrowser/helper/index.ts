/**
 * playwright helper
 * https://playwright.dev/docs/library
 * https://playwright.dev/docs/api/class-playwright
 */
import { test, expect } from '@playwright/test';

//test.describe.configure({ mode: 'serial' });

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
