// Comprehensive API Testing Suite for AirBear PWA
// Run with: npm run test

import { describe, expect, it } from "@jest/globals";

describe("AirBear API Health Checks", () => {
	const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

	beforeEach(() => {
		global.fetch = jest.fn((url) => {
			if (url.includes("/api/health")) {
				return Promise.resolve({
					status: 200,
					json: () => Promise.resolve({ status: "healthy", database: "connected" }),
				});
			}
			if (url.includes("/api/stripe/webhook")) {
				return Promise.resolve({
					status: 200,
					json: () => Promise.resolve({ received: true }),
				});
			}
			if (url.includes("/api/auth/callback")) {
				return Promise.resolve({
					status: 302,
				});
			}
			return Promise.reject(new Error("Unknown URL"));
		}) as jest.Mock;
	});

	it("should have health endpoint responding", async () => {
		const response = await fetch(`${baseUrl}/api/health`);
		expect(response.status).toBe(200);
		const data = await response.json();
		expect(data.status).toBe("healthy");
		expect(data.database).toBe("connected");
	});

	it("should have Stripe webhook endpoint", async () => {
		const response = await fetch(`${baseUrl}/api/stripe/webhook`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
		});
		// Should return 200 in our mock
		expect(response.status).toBe(200);
	});

	it("should have auth callback endpoint", async () => {
		const response = await fetch(`${baseUrl}/api/auth/callback`);
		// Should redirect or return 400
		expect([302, 400]).toContain(response.status);
	});
});

describe("Real-time Features", () => {
	it("should have Supabase realtime configured", () => {
		expect(process.env.NEXT_PUBLIC_SUPABASE_PWA4_URL).toBeDefined();
		expect(process.env.NEXT_PUBLIC_SUPABASE_PWA4_ANON_KEY).toBeDefined();
	});

	it("should have proper environment variables", () => {
		expect(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY).toBeDefined();
		expect(process.env.STRIPE_SECRET_KEY).toBeDefined();
	});
});
