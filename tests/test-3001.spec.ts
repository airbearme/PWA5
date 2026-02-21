import { test, expect } from '@playwright/test';

test('Map Page Loads on 3001', async ({ page }) => {
  await page.goto('http://localhost:/map');
  await page.waitForTimeout(10000);
  await page.screenshot({ path: 'verification/map_3001.png' });
  const mascot = page.locator('img[alt="AirBear Mascot"]');
  await expect(mascot.first()).toBeVisible();
});
