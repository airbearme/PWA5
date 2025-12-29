import { test, expect } from "@playwright/test";

test.describe("AirBear Critical User Flows", () => {
  test.beforeEach(async ({ page }) => {
    // Go to home page
    await page.goto("/");
    await page.waitForLoadState("networkidle");
  });

  test("Homepage Validation", async ({ page }) => {
    await expect(page).toHaveTitle(/AirBear/i);

    // Check key visible elements
    await expect(page.getByTestId("img-mascot")).toBeVisible();
    await expect(page.getByText(/AirBear/i).first()).toBeVisible();
    await expect(page.getByText(/Solar/i).first()).toBeVisible();

    // Verify Stats are present (even if loading)
    await expect(page.getByTestId("stat-rides")).toBeVisible();
    await expect(page.getByTestId("stat-co2")).toBeVisible();
  });

  test("Booking Flow Navigation", async ({ page }) => {
    // Click 'Book Your AirBear'
    const bookBtn = page.getByTestId("button-book-airbear");
    await expect(bookBtn).toBeVisible();
    await bookBtn.click();

    // Should navigate to Map
    await expect(page).toHaveURL(/.*\/map/);

    // Wait for map page to load - check for any map-related content
    await expect(
      page
        .getByText("Scanning Binghamton...")
        .or(page.getByText("Real-Time AirBear Hub"))
        .or(page.getByText("Initializing AirBear HUD"))
    ).toBeVisible();
  });

  test("CEO T-Shirt Promo Interaction", async ({ page }) => {
    const promoBtn = page.getByTestId("button-ceo-tshirt");
    await expect(promoBtn).toBeVisible();

    // Scroll to the button
    await promoBtn.scrollIntoViewIfNeeded();

    // Check for the text in the section (it's not a dialog anymore)
    await expect(page.getByText(/CEO-Signed.*AirBear T-Shirt/i)).toBeVisible();
    await expect(page.getByText("$100")).toBeVisible();
  });

  test("Auth Guard Protection", async ({ page }) => {
    // Try to go to dashboard directly
    await page.goto("/dashboard", { timeout: 10000 });

    // Should redirect to Auth page if not logged in
    // Or show Auth UI
    await expect(page).toHaveURL(/.*\/auth/);
    await expect(page.getByTestId("tab-signin")).toBeVisible();
  });

  test("Footer Navigation", async ({ page }) => {
    // Scroll to bottom
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    // Check Privacy Policy link availability using test ID
    const privacyLink = page.getByTestId("footer-support-privacy-policy");
    await expect(privacyLink).toBeVisible();
    await privacyLink.click();

    await expect(page).toHaveURL(/.*\/privacy/);
    await expect(page.getByText(/Privacy/i).first()).toBeVisible();
  });
});
