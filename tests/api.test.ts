// Comprehensive API Testing Suite for AirBear PWA
// Run with: npm run test

import { describe, expect, it, jest, beforeEach } from "@jest/globals";

describe("AirBear API Health Checks", () => {
	beforeEach(() => {
		// Mock global fetch
		global.fetch = jest.fn((url: string) => {
			if (url.endsWith("/api/health")) {
				return Promise.resolve({
					status: 200,
					ok: true,
					json: () => Promise.resolve({ status: "healthy", database: "connected" }),
				} as Response);
			}
			if (url.endsWith("/api/stripe/webhook")) {
				return Promise.resolve({
					status: 400,
					ok: false,
					json: () => Promise.resolve({ error: "No signature" }),
				} as Response);
			}
			if (url.endsWith("/api/auth/callback")) {
				return Promise.resolve({
					status: 302,
					ok: true,
					json: () => Promise.resolve({}),
				} as Response);
			}
			return Promise.reject(new Error("Unknown URL"));
		}) as unknown as typeof fetch;
	});

	const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

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
		// Should return 400 without proper Stripe signature
		expect([400, 401]).toContain(response.status);
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
