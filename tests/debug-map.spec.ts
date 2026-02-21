import { test, expect } from '@playwright/test';

test('Map Page Debug', async ({ page }) => {
  await page.goto('http://localhost:3000/map');
  await page.waitForTimeout(10000);
  await page.screenshot({ path: 'verification/map_debug.png' });
});
