#!/usr/bin/env node

/**
 * Environment Variable Validation
 * Ensures all required environment variables are set
 */

const requiredEnvVars = [
	"NEXT_PUBLIC_SUPABASE_PWA4_URL",
	"NEXT_PUBLIC_SUPABASE_PWA4_ANON_KEY",
	"SUPABASE_PWA4_SERVICE_ROLE_KEY",
	"NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
	"STRIPE_SECRET_KEY",
];

const optionalEnvVars = ["STRIPE_WEBHOOK_SECRET", "NEXT_PUBLIC_SITE_URL"];

function validateEnv() {
	console.log("🔍 Validating environment variables...\n");

	let allValid = true;
	const missing = [];
	const present = [];

	requiredEnvVars.forEach((varName) => {
		const value = process.env[varName];
		if (value && value.length > 0) {
			present.push(varName);
			console.log(`✅ ${varName}: Set`);
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
		console.log("\n❌ Validation failed. Missing required variables:");
		missing.forEach((v) => console.log(`  - ${v}`));
		process.exit(1);
	} else {
		console.log("\n✅ All required environment variables are set");
		process.exit(0);
	}
}

validateEnv();
