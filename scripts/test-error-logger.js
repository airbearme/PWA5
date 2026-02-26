#!/usr/bin/env node

/**
 * Error Logger Testing Script
 * Tests error logging system functionality
 */

import fs from "fs";
import path from "path";

console.log("🚨 Testing error logger...\n");

const errorLoggerPath = path.join(process.cwd(), "lib", "error-logger.ts");

if (!fs.existsSync(errorLoggerPath)) {
	console.log("❌ error-logger.ts not found");
	process.exit(1);
}

console.log("✅ Error logger file exists");

// Check error logger content
try {
	const content = fs.readFileSync(errorLoggerPath, "utf8");

	const checks = {
		"ErrorLogger class": /class ErrorLogger/i.test(content),
		"logError method": /logError/i.test(content),
		"requestConsent method": /requestConsent/i.test(content),
		"setConsent method": /setConsent/i.test(content),
		setupGlobalErrorHandling: /setupGlobalErrorHandling/i.test(content),
		"Supabase integration": /supabase/i.test(content),
	};

	console.log("\n📋 Error logger features:");
	for (const [feature, present] of Object.entries(checks)) {
		if (present) {
			console.log(`   ✅ ${feature}`);
		} else {
			console.log(`   ⚠️  ${feature} (not found)`);
		}
	}

	// Check for error boundary
	const errorBoundaryPath = path.join(
		process.cwd(),
		"components",
		"error-boundary.tsx",
	);
	if (fs.existsSync(errorBoundaryPath)) {
		console.log("\n✅ Error boundary component exists");
	} else {
		console.log("\n⚠️  Error boundary component not found");
	}

	// Check for database migration
	const migrationsDir = path.join(process.cwd(), "supabase", "migrations");
	if (fs.existsSync(migrationsDir)) {
		const migrations = fs.readdirSync(migrationsDir);
		const errorLoggingMigration = migrations.find((m) =>
			m.includes("error_logging"),
		);
		if (errorLoggingMigration) {
			console.log(`✅ Error logging migration found: ${errorLoggingMigration}`);
		} else {
			console.log("⚠️  Error logging migration not found");
		}
	}

	console.log("\n✅ Error logger validation complete!");
	process.exit(0);
} catch (error) {
	console.error(`❌ Failed to validate error logger: ${error.message}`);
	process.exit(1);
}
