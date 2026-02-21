import { test, expect } from '@playwright/test';

test('Map Page Loads and Map is Visible', async ({ page }) => {
  // Go to the map page
  await page.goto('http://localhost:3000/map');

  // Wait for the map container to be visible
  const mapContainer = page.locator('.leaflet-container');
  await expect(mapContainer).toBeVisible({ timeout: 15000 });

  // Take a screenshot
  await page.screenshot({ path: 'verification/map_page_final.png' });
});
