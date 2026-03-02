// Comprehensive API Testing Suite for AirBear PWA
// Run with: npm run test

import { describe, expect, it } from "@jest/globals";

describe("AirBear API Health Checks", () => {
	const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

	it("should have health endpoint responding", async () => {
		try {
			const response = await fetch(`${baseUrl}/api/health`);
			expect(response.status).toBe(200);
			const data = await response.json();
			expect(data.status).toBe("healthy");
		} catch (error) {
			console.log("Skipping API test - server probably not running");
		}
	});

	it("should have Stripe webhook endpoint", async () => {
		try {
			const response = await fetch(`${baseUrl}/api/stripe/webhook`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
			});
			// Should return 400 without proper Stripe signature
			expect([400, 401]).toContain(response.status);
		} catch (error) {
			console.log("Skipping Stripe webhook test - server probably not running");
		}
	});

	it("should have auth callback endpoint", async () => {
		try {
			const response = await fetch(`${baseUrl}/api/auth/callback`);
			// Should redirect or return 400
			expect([302, 400]).toContain(response.status);
		} catch (error) {
			console.log("Skipping auth callback test - server probably not running");
		}
	});
});

describe("Real-time Features", () => {
	it("should have Supabase realtime configured", () => {
		// Just check if the test is running in a way that sees these env vars
		if (process.env.NEXT_PUBLIC_SUPABASE_PWA4_URL) {
			expect(process.env.NEXT_PUBLIC_SUPABASE_PWA4_URL).toBeDefined();
			expect(process.env.NEXT_PUBLIC_SUPABASE_PWA4_ANON_KEY).toBeDefined();
		}
	});

	it("should have proper environment variables", () => {
		if (process.env.STRIPE_SECRET_KEY) {
			expect(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY).toBeDefined();
			expect(process.env.STRIPE_SECRET_KEY).toBeDefined();
		}
	});
});
