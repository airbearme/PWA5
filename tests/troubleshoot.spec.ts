import { test, expect } from '@playwright/test';

test('troubleshoot', async ({ page }) => {
  await page.goto('/');
  await page.screenshot({ path: 'screenshot.png' });
});
