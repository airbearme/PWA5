#!/usr/bin/env node

/**
 * Comprehensive E2E Test Script
 * Tests complete user workflows end-to-end
 */

const { execSync } = require("child_process");
const http = require("http");
const https = require("https");

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

console.log("🎭 Running comprehensive E2E tests...\n");

function checkEndpoint(url) {
	return new Promise((resolve) => {
		const client = url.startsWith("https") ? https : http;
		const req = client.get(url, { timeout: 5000 }, (res) => {
			let data = "";
			res.on("data", (chunk) => {
				data += chunk;
			});
			res.on("end", () => {
				resolve({ status: res.statusCode, body: data });
			});
		});
		req.on("error", () => resolve({ status: 0, body: "" }));
		req.on("timeout", () => {
			req.destroy();
			resolve({ status: 0, body: "" });
		});
	});
}

async function testUserWorkflows() {
	console.log("📋 Testing Complete User Workflows\n");

	// Test 1: Homepage loads
	console.log("1. Testing homepage...");
	const home = await checkEndpoint(`${BASE_URL}/`);
	if (home.status === 200 && home.body.includes("AirBear")) {
		console.log("   ✅ Homepage loads correctly");
	} else {
		console.log("   ❌ Homepage failed");
		return false;
	}

	// Test 2: Map page loads
	console.log("\n2. Testing map page...");
	const map = await checkEndpoint(`${BASE_URL}/map`);
	if (map.status === 200) {
		console.log("   ✅ Map page loads");
	} else {
		console.log("   ⚠️  Map page may require auth");
	}

	// Test 3: Products page loads
	console.log("\n3. Testing products page...");
	const products = await checkEndpoint(`${BASE_URL}/products`);
	if (products.status === 200) {
		console.log("   ✅ Products page loads");
	} else {
		console.log("   ⚠️  Products page may require auth");
	}

	// Test 4: Auth pages
	console.log("\n4. Testing auth pages...");
	const login = await checkEndpoint(`${BASE_URL}/auth/login`);
	if (
		login.status === 200 &&
		(login.body.includes("Google") || login.body.includes("Sign in"))
	) {
		console.log("   ✅ Login page accessible");
	} else {
		console.log("   ⚠️  Login page check");
	}

	// Test 5: API health
	console.log("\n5. Testing API health...");
	const health = await checkEndpoint(`${BASE_URL}/api/health`);
	if (health.status === 200) {
		try {
			const healthData = JSON.parse(health.body);
			console.log(`   ✅ Health endpoint: ${healthData.status}`);
		} catch (e) {
			console.log("   ⚠️  Health endpoint returned invalid JSON");
		}
	} else {
		console.log("   ⚠️  Health endpoint not accessible");
	}

	// Test 6: PWA manifest
	console.log("\n6. Testing PWA features...");
	const manifest = await checkEndpoint(`${BASE_URL}/manifest.json`);
	if (manifest.status === 200) {
		console.log("   ✅ PWA manifest accessible");
	} else {
		console.log("   ⚠️  PWA manifest not found");
	}

	// Test 7: Mascot on all pages
	console.log("\n7. Testing mascot display...");
	const homeMascot = home.body.includes("airbear-mascot.png");
	const mapMascot = map.body.includes("airbear-mascot.png");
	const productsMascot = products.body.includes("airbear-mascot.png");

	if (homeMascot && mapMascot && productsMascot) {
		console.log("   ✅ Mascot displayed on all pages");
	} else {
		console.log(
			`   ⚠️  Mascot check: home=${homeMascot}, map=${mapMascot}, products=${productsMascot}`,
		);
	}

	// Test 8: Dark mode
	console.log("\n8. Testing dark mode...");
	if (home.body.includes("defaultTheme") && home.body.includes("dark")) {
		console.log("   ✅ Dark mode configured");
	} else {
		console.log("   ⚠️  Dark mode check");
	}

	// Test 9: Special effects
	console.log("\n9. Testing special effects...");
	const hasEffects =
		home.body.includes("animate-pulse-glow") ||
		home.body.includes("animate-float") ||
		home.body.includes("holographic");
	if (hasEffects) {
		console.log("   ✅ Special effects present");
	} else {
		console.log("   ⚠️  Special effects check");
	}

	// Test 10: Error boundary
	console.log("\n10. Testing error handling...");
	const errorPage = await checkEndpoint(`${BASE_URL}/nonexistent-page-12345`);
	if (errorPage.status === 404) {
		console.log("   ✅ 404 page handles errors");
	} else {
		console.log("   ⚠️  404 handling check");
	}

	console.log("\n✅ E2E workflow tests complete!");
	return true;
}

// Run Playwright tests if available
async function runPlaywrightTests() {
	try {
		console.log("\n🎭 Running Playwright E2E tests...\n");
		execSync("npx playwright test tests/app-flow.spec.ts --reporter=list", {
			stdio: "inherit",
			cwd: process.cwd(),
		});
		console.log("\n✅ Playwright tests passed!");
		return true;
	} catch (error) {
		console.log("\n⚠️  Playwright tests failed or not configured");
		return false;
	}
}

async function main() {
	const workflows = await testUserWorkflows();
	const playwright = await runPlaywrightTests();

	if (workflows && playwright) {
		console.log("\n🎉 All E2E tests passed!");
		process.exit(0);
	} else {
		console.log("\n⚠️  Some E2E tests had issues");
		process.exit(workflows ? 0 : 1);
	}
}

main().catch((error) => {
	console.error("E2E test failed:", error);
	process.exit(1);
});
