#!/usr/bin/env node

const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

/**
 * Environment Variable Validation
 * Ensures all required environment variables are set
 */

const requiredEnvVars = [
	"NEXT_PUBLIC_SUPABASE_URL",
	"NEXT_PUBLIC_SUPABASE_ANON_KEY",
	"STRIPE_SECRET_KEY",
	"STRIPE_PUBLISHABLE_KEY",
];

const optionalEnvVars = ["STRIPE_WEBHOOK_SECRET", "NEXT_PUBLIC_SITE_URL"];

function validateEnv() {
	console.log("🔍 Validating environment variables...\\n");

	let allValid = true;
	const missing = [];
	const present = [];

	requiredEnvVars.forEach((varName) => {
		if (process.env[varName]) {
			present.push(varName);
			console.log(`✅ ${varName}: Set`);
		} else {
			missing.push(varName);
			console.log(`❌ ${varName}: Missing`);
			allValid = false;
		}
	});

	console.log("\\n📋 Optional variables:");
	optionalEnvVars.forEach((varName) => {
		if (process.env[varName]) {
			console.log(`✅ ${varName}: Set`);
		} else {
			console.log(`⚠️  ${varName}: Not set (optional)`);
		}
	});

	if (!allValid) {
		console.log("\\n❌ Validation failed. Missing required variables:");
		missing.forEach((v) => console.log(`  - ${v}`));
		process.exit(1);
	} else {
		console.log("\\n✅ All required environment variables are set");
		process.exit(0);
	}
}

validateEnv();
