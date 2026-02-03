#!/usr/bin/env node

/**
 * Environment Variable Validation
 * Ensures all required environment variables are set
 * Synchronized with lib/env.ts
 */

const requiredEnvVars = [
	"NEXT_PUBLIC_SUPABASE_PWA4_URL",
	"NEXT_PUBLIC_SUPABASE_PWA4_ANON_KEY",
	"SUPABASE_PWA4_SERVICE_ROLE_KEY",
	"NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
	"STRIPE_SECRET_KEY",
];

const optionalEnvVars = [
	"STRIPE_WEBHOOK_SECRET",
	"NEXT_PUBLIC_SITE_URL",
	"NODE_ENV"
];

function validateEnv() {
	console.log("🔍 Validating environment variables...\n");

	let allValid = true;
	const missing = [];
	const present = [];

	requiredEnvVars.forEach((varName) => {
		if (process.env[varName]) {
			// Basic validation for formats
			let isValid = true;
			const value = process.env[varName];

			if (varName.endsWith("_URL") && !value.startsWith("http")) {
				isValid = false;
				console.log(`❌ ${varName}: Invalid URL format`);
			}

			if (varName.endsWith("_KEY") && varName.includes("ANON") && !value.startsWith("eyJ")) {
				console.log(`⚠️  ${varName}: Format looks unusual (expected JWT)`);
			}

			if (isValid) {
				present.push(varName);
				console.log(`✅ ${varName}: Set`);
			} else {
				missing.push(varName);
				allValid = false;
			}
		} else {
			missing.push(varName);
			console.log(`❌ ${varName}: Missing`);
			allValid = false;
		}
	});

	console.log("\n📋 Optional variables:");
	optionalEnvVars.forEach((varName) => {
		if (process.env[varName]) {
			console.log(`✅ ${varName}: Set`);
		} else {
			console.log(`⚠️  ${varName}: Not set (optional)`);
		}
	});

	if (!allValid) {
		console.log("\n❌ Validation failed. Missing or invalid required variables:");
		missing.forEach((v) => console.log(`  - ${v}`));
		process.exit(1);
	} else {
		console.log("\n✅ All required environment variables are set correctly");
		process.exit(0);
	}
}

validateEnv();
