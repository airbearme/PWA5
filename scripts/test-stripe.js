#!/usr/bin/env node

/**
 * Stripe Configuration Testing Script
 * Validates Stripe API keys and configuration
 */

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const STRIPE_PUBLISHABLE_KEY =
	process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ||
	process.env.STRIPE_PUBLISHABLE_KEY;

console.log("💳 Testing Stripe configuration...\n");

if (!STRIPE_SECRET_KEY || !STRIPE_PUBLISHABLE_KEY) {
	console.log("❌ Stripe keys not found in environment variables");
	console.log(
		"   Required: STRIPE_SECRET_KEY, NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
	);
	process.exit(1);
}

// Validate key formats
if (!STRIPE_SECRET_KEY.startsWith("sk_")) {
	console.log("❌ Invalid STRIPE_SECRET_KEY format (should start with sk_)");
	process.exit(1);
}

if (!STRIPE_PUBLISHABLE_KEY.startsWith("pk_")) {
	console.log(
		"❌ Invalid STRIPE_PUBLISHABLE_KEY format (should start with pk_)",
	);
	process.exit(1);
}

console.log("✅ Stripe key formats are valid");

// Test Stripe API connection
async function testStripe() {
	try {
		const Stripe = require("stripe");
		const stripe = new Stripe(STRIPE_SECRET_KEY);

		console.log("📡 Testing Stripe API connection...");

		// Test API connection by retrieving account balance
		const balance = await stripe.balance.retrieve();

		console.log("✅ Stripe API connection successful");
		console.log(
			`   Account currency: ${balance.available[0]?.currency || "N/A"}`,
		);

		// Check if in test mode
		const isTestMode = STRIPE_SECRET_KEY.startsWith("sk_test_");
		console.log(`   Mode: ${isTestMode ? "TEST" : "LIVE"}`);

		if (!isTestMode) {
			console.log("⚠️  WARNING: Using LIVE Stripe keys!");
		}

		console.log("\n✅ Stripe configuration is valid!");
		process.exit(0);
	} catch (error) {
		console.error(`❌ Stripe API test failed: ${error.message}`);
		process.exit(1);
	}
}

testStripe();

