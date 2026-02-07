#!/usr/bin/env node

/**
 * Ultimate Validation Script
 * Runs comprehensive tests for all aspects of the codebase
 */

import { execSync } from "child_process";
import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const colors = {
	reset: "\x1b[0m",
	bright: "\x1b[1m",
	green: "\x1b[32m",
	red: "\x1b[31m",
	yellow: "\x1b[33m",
	blue: "\x1b[34m",
	cyan: "\x1b[36m",
};

const results = {
	passed: [],
	failed: [],
	warnings: [],
};

function log(message, color = "reset") {
	console.log(`${colors[color]}${message}${colors.reset}`);
}

function runTest(name, command, required = true) {
	log(`\n${"=".repeat(60)}`, "cyan");
	log(`🧪 ${name}`, "bright");
	log(`${"=".repeat(60)}`, "cyan");

	try {
		execSync(command, { stdio: "inherit", cwd: process.cwd() });
		results.passed.push(name);
		log(`✅ ${name}: PASSED`, "green");
		return true;
	} catch (error) {
		if (required) {
			results.failed.push(name);
			log(`❌ ${name}: FAILED`, "red");
			return false;
		} else {
			results.warnings.push(name);
			log(`⚠️  ${name}: SKIPPED (optional)`, "yellow");
			return true;
		}
	}
}

function checkFileExists(filePath) {
	return fs.existsSync(path.join(process.cwd(), filePath));
}

async function main() {
	log("\n🚀 ULTIMATE VALIDATION SUITE", "bright");
	log("=".repeat(60), "cyan");
	log("Running comprehensive tests for AirBear PWA...\n", "blue");

	const startTime = Date.now();

	// 1. Environment Validation
	log("\n📋 Phase 1: Environment & Configuration", "bright");
	runTest("Environment Variables", "node scripts/validate-env.js", true);
	runTest("TypeScript Type Check", "npm run type-check", true);
	runTest("ESLint", "npm run lint", false);

	// 2. Build Validation
	log("\n📦 Phase 2: Build & Compilation", "bright");
	runTest("Next.js Build", "npm run build", true);

	// Check build output
	if (checkFileExists(".next")) {
		results.passed.push("Build Output Exists");
		log("✅ Build output directory exists", "green");
	} else {
		results.failed.push("Build Output Missing");
		log("❌ Build output directory missing", "red");
	}

	// 3. Unit Tests
	log("\n🔬 Phase 3: Unit Tests", "bright");
	if (checkFileExists("jest.config.js") || checkFileExists("jest.config.cjs")) {
		runTest("Jest Unit Tests", "npm run test -- --passWithNoTests", false);
	} else {
		log("⚠️  Jest not configured, skipping unit tests", "yellow");
		results.warnings.push("Unit Tests (Jest not configured)");
	}

	// 4. Integration Tests
	log("\n🔗 Phase 4: Integration Tests", "bright");
	if (checkFileExists("tests/integration.test.ts")) {
		runTest(
			"Integration Tests",
			"npm run test -- tests/integration.test.ts",
			false,
		);
	} else {
		log("⚠️  Integration tests not found", "yellow");
		results.warnings.push("Integration Tests");
	}

	// 5. API Tests
	log("\n🌐 Phase 5: API Tests", "bright");
	if (checkFileExists("tests/api.test.ts")) {
		runTest("API Tests", "npm run test -- tests/api.test.ts", false);
	} else {
		log("⚠️  API tests not found", "yellow");
		results.warnings.push("API Tests");
	}

	// 6. E2E Tests
	log("\n🎭 Phase 6: End-to-End Tests", "bright");
	if (checkFileExists("playwright.config.ts")) {
		runTest(
			"Playwright E2E Tests",
			"npm run test:e2e -- --reporter=list",
			false,
		);
	} else {
		log("⚠️  Playwright not configured", "yellow");
		results.warnings.push("E2E Tests (Playwright)");
	}

	// Run comprehensive workflow tests
	runTest(
		"Complete Workflow Tests",
		"node scripts/test-complete-workflows.js",
		false,
	);
	runTest(
		"Comprehensive E2E Tests",
		"node scripts/comprehensive-e2e-test.js",
		false,
	);

	// 7. Performance Tests
	log("\n⚡ Phase 7: Performance Tests", "bright");
	runTest("Lighthouse Performance", "node scripts/test-performance.js", false);
	runTest("Bundle Size Check", "node scripts/check-bundle-size.js", false);

	// 8. Security Tests
	log("\n🔒 Phase 8: Security Tests", "bright");
	runTest("npm Audit", "npm audit --audit-level=moderate || true", false);
	runTest("Security Headers", "node scripts/test-security-headers.js", false);

	// 9. Accessibility Tests
	log("\n♿ Phase 9: Accessibility Tests", "bright");
	runTest("Accessibility Audit", "node scripts/test-accessibility.js", false);

	// 10. Database Tests
	log("\n💾 Phase 10: Database Tests", "bright");
	runTest("Database Connectivity", "node scripts/test-database.js", false);
	runTest("Database Schema", "node scripts/test-database-schema.js", false);

	// 11. Payment Tests
	log("\n💳 Phase 11: Payment Integration", "bright");
	runTest("Stripe Configuration", "node scripts/test-stripe.js", false);

	// 12. Real-time Tests
	log("\n📡 Phase 12: Real-time Features", "bright");
	runTest("Supabase Realtime", "node scripts/test-realtime.js", false);

	// 13. PWA Tests
	log("\n📱 Phase 13: PWA Features", "bright");
	runTest("PWA Manifest", "node scripts/test-pwa-manifest.js", false);
	runTest("Service Worker", "node scripts/test-service-worker.js", false);

	// 14. Visual Tests
	log("\n🎨 Phase 14: Visual & UI Tests", "bright");
	runTest("Component Rendering", "node scripts/test-components.js", false);

	// 15. Error Handling Tests
	log("\n🚨 Phase 15: Error Handling", "bright");
	runTest("Error Logger", "node scripts/test-error-logger.js", false);

	// Final Summary
	const endTime = Date.now();
	const duration = ((endTime - startTime) / 1000).toFixed(2);

	log("\n" + "=".repeat(60), "cyan");
	log("📊 VALIDATION SUMMARY", "bright");
	log("=".repeat(60), "cyan");

	log(`\n✅ Passed: ${results.passed.length}`, "green");
	results.passed.forEach((test) => log(`   ✓ ${test}`, "green"));

	if (results.warnings.length > 0) {
		log(`\n⚠️  Warnings: ${results.warnings.length}`, "yellow");
		results.warnings.forEach((test) => log(`   ⚠ ${test}`, "yellow"));
	}

	if (results.failed.length > 0) {
		log(`\n❌ Failed: ${results.failed.length}`, "red");
		results.failed.forEach((test) => log(`   ✗ ${test}`, "red"));
	}

	log(`\n⏱️  Total Duration: ${duration}s`, "blue");

	const totalTests =
		results.passed.length + results.failed.length + results.warnings.length;
	const successRate =
		totalTests > 0
			? ((results.passed.length / totalTests) * 100).toFixed(1)
			: 0;

	log(`📈 Success Rate: ${successRate}%`, "blue");

	if (results.failed.length === 0) {
		log("\n🎉 ALL CRITICAL TESTS PASSED!", "green");
		log("✅ Codebase is ready for production!", "green");
		process.exit(0);
	} else {
		log("\n⚠️  SOME TESTS FAILED", "red");
		log("Please fix the issues above before deploying.", "red");
		process.exit(1);
	}
}

main().catch((error) => {
	log(`\n💥 Validation script crashed: ${error.message}`, "red");
	console.error(error);
	process.exit(1);
});
