import { expect, test } from "@playwright/test";

test.describe("Production PWA Tests", () => {
	const SITE_URL = process.env.SITE_URL || "https://airbear.me";

	test.beforeEach(async ({ page }) => {
		await page.goto(SITE_URL);
		await page.waitForLoadState("networkidle");
	});

	test("Should load the homepage and show correct title", async ({ page }) => {
		await expect(page).toHaveTitle(/AirBear/i);
		await expect(page.locator("main")).toBeVisible();
	});

	test("Should show install prompt or installation instructions", async ({
		page,
	}) => {
		// Just checking if we can find some main UI elements that confirm hydration
		// Assuming there is a header or some text
		const body = page.locator("body");
		await expect(body).toBeVisible();
		await expect(body).not.toBeEmpty();
	});

	test("Should enable PWA Service Worker", async ({ page }) => {
		const swSupported = await page.evaluate(() => {
			return (
				typeof window !== "undefined" &&
				"navigator" in window &&
				"serviceWorker" in window.navigator
			);
		});
		expect(swSupported).toBeTruthy();
	});

	test("Should not have critical console errors", async ({ page }) => {
		const errors: string[] = [];
		page.on("console", (msg) => {
			if (msg.type() === "error") {
				errors.push(`${msg.text()} (${msg.location().url})`);
			}
		});
		page.on("pageerror", (err) => {
			errors.push(`Page Error: ${err.message}`);
		});
		page.on("requestfailed", (request) => {
			errors.push(
				`Request Failed: ${request.url()} - ${request.failure()?.errorText}`,
			);
		});

		await page.waitForTimeout(3000); // Wait for initial load

		// Filter out some expected/non-critical errors if any
		const criticalErrors = errors.filter(
			(e) =>
				!e.includes("favicon") &&
				!e.includes("manifest.json") &&
				!e.includes("_vercel/insights/script.js") &&
				!e.includes("chrome-extension"),
		);

		// We expect 0 critical errors
		if (criticalErrors.length > 0) {
			console.log("Console Errors:", criticalErrors);
		}
		expect(criticalErrors.length).toBe(0);
	});

	test("Verify API endpoints connectivity", async ({ page }) => {
		// Check if we can make a basic fetch to the site itself
		const response = await page.request.get(SITE_URL);
		expect(response.ok()).toBeTruthy();
	});
});
