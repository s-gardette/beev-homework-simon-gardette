import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  // Remove not to pass the test.
  await expect(page).not.toHaveTitle(/Beev Homework/);
});

