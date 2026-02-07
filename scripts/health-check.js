#!/usr/bin/env node

/**
 * Health Check Script
 * Checks all critical endpoints and services
 */

import https from "https";
import http from "http";

const checks = [
	{
		name: "Production Site",
		url: "https://airbear.me",
		method: "GET",
	},
	{
		name: "API Health",
		url: "https://airbear.me/api/health",
		method: "GET",
	},
];

async function checkEndpoint(name, url) {
	return new Promise((resolve) => {
		const client = url.startsWith("https") ? https : http;
		const req = client.get(url, { timeout: 5000 }, (res) => {
			const isHealthy = res.statusCode >= 200 && res.statusCode < 400;
			resolve({ name, healthy: isHealthy, statusCode: res.statusCode });
		});

		req.on("error", () => {
			resolve({ name, healthy: false, statusCode: 0 });
		});

		req.on("timeout", () => {
			req.destroy();
			resolve({ name, healthy: false, statusCode: 0, timeout: true });
		});
	});
}

async function runHealthChecks() {
	console.log("🏥 Running health checks...\n");

	const results = await Promise.all(
		checks.map((check) => checkEndpoint(check.name, check.url)),
	);

	let allHealthy = true;

	results.forEach((result) => {
		const status = result.healthy ? "✅" : "❌";
		console.log(`${status} ${result.name}: ${result.statusCode || "FAILED"}`);
		if (!result.healthy) allHealthy = false;
	});

	console.log(
		"\n" + (allHealthy ? "✅ All checks passed" : "❌ Some checks failed"),
	);

	process.exit(allHealthy ? 0 : 1);
}

runHealthChecks().catch((error) => {
	console.error("Health check failed:", error);
	process.exit(1);
});


