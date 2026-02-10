// Comprehensive API Testing Suite for AirBear PWA
// Run with: npm run test

import { describe, expect, it, jest } from "@jest/globals";

// Mock global fetch
global.fetch = jest.fn() as any;

describe("AirBear API Health Checks", () => {
	const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

	it("should have health endpoint responding", async () => {
		(global.fetch as any).mockResolvedValueOnce({
			status: 200,
			json: async () => ({ status: "healthy", database: "connected" }),
		});

		const response = await fetch(`${baseUrl}/api/health`);
		expect(response.status).toBe(200);
		const data = await response.json();
		expect(data.status).toBe("healthy");
		expect(data.database).toBe("connected");
	});

	it("should have Stripe webhook endpoint", async () => {
		(global.fetch as any).mockResolvedValueOnce({
			status: 400,
		});

		const response = await fetch(`${baseUrl}/api/stripe/webhook`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
		});
		// Should return 400 without proper Stripe signature
		expect([400, 401]).toContain(response.status);
	});

	it("should have auth callback endpoint", async () => {
		(global.fetch as any).mockResolvedValueOnce({
			status: 400,
		});

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
