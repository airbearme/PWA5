import { test, expect } from "@playwright/test";

test.describe("AirBear Ultimate System Validation", () => {
  const SITE_URL = process.env.SITE_URL || "https://airbear.me";

  test.beforeEach(async ({ page }) => {
    await page.goto(SITE_URL);
    await page.waitForLoadState("networkidle");
  });

  test("1. Core Branding & Landing Presence", async ({ page }) => {
    await expect(page).toHaveTitle(/AirBear/i);
    const mascot = page.getByTestId("img-mascot");
    await expect(mascot).toBeVisible();

    const heroText = page.getByText(/Solar/i).or(page.getByText(/AirBear/i));
    await expect(heroText.first()).toBeVisible();
  });

  test("2. Navigation & Map Functionality", async ({ page }) => {
    const bookBtn = page.getByTestId("button-book-airbear");
    await bookBtn.click();

    await expect(page).toHaveURL(/.*\/map/);
    // Wait for map container or loading state
    await expect(
      page
        .locator("#map-container")
        .or(page.getByText(/Scanning Binghamton/i))
        .or(page.getByText(/Initializing AirBear/i))
    ).toBeVisible();
  });

  test("3. Bodega & Commerce Flow Architecture", async ({ page }) => {
    // Navigate to products
    await page.goto(`${SITE_URL}/products`);
    await expect(
      page
        .getByText(/Mobile Bodega/i)
        .or(page.getByText(/Local Goodies/i))
        .first()
    ).toBeVisible();

    // Check for product items (mock products in the page use card component)
    const products = page
      .locator(".product-card")
      .or(page.locator(".glass-morphism"));
    await expect(products.first()).toBeVisible();
  });

  test("4. Authentication Interface Integrity", async ({ page }) => {
    await page.goto(`${SITE_URL}/auth`);
    await expect(page.getByTestId("tab-signin")).toBeVisible();
    await expect(page.getByTestId("tab-signup")).toBeVisible();

    // Verify input fields are present
    await expect(page.locator('input[type="email"]').first()).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test("5. Mobile Responsiveness & PWA Manifest", async ({ page }) => {
    // Check manifest link
    const manifestLink = page.locator('link[rel="manifest"]');
    await expect(manifestLink).toHaveAttribute("href", /manifest\.json/);

    // Resize to mobile
    await page.setViewportSize({ width: 375, height: 812 });
    // Check if main UI elements still visible/usable
    await expect(page.getByTestId("img-mascot")).toBeVisible();
  });

  test("6. Driver Interface Accessibility", async ({ page }) => {
    await page.goto(`${SITE_URL}/driver`);
    // Should redirect to auth if not logged in
    await expect(page.url()).toContain("/auth");
  });
});
