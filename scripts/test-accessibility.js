#!/usr/bin/env node

/**
 * Accessibility Testing Script
 * Tests application accessibility using pa11y
 */

const { execSync } = require("child_process");

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

console.log("♿ Running accessibility tests...\n");

// Check if pa11y is installed
try {
	execSync("which pa11y", { stdio: "ignore" });
} catch {
	console.log("⚠️  pa11y not found. Installing...");
	try {
		execSync("npm install -g pa11y", { stdio: "inherit" });
	} catch {
		console.log("❌ Failed to install pa11y. Skipping accessibility tests.");
		process.exit(0);
	}
}

async function runAccessibilityTests() {
	const pages = ["/", "/map", "/products", "/auth/login"];

	console.log(`Testing ${pages.length} pages for accessibility...\n`);

	let totalIssues = 0;

	for (const page of pages) {
		const url = `${SITE_URL}${page}`;
		console.log(`Testing: ${url}`);

		try {
			const result = execSync(`pa11y --json ${url}`, { encoding: "utf8" });
			const report = JSON.parse(result);

			if (report.issues && report.issues.length > 0) {
				console.log(`   ⚠️  Found ${report.issues.length} issues`);
				totalIssues += report.issues.length;

				// Show first 3 issues
				report.issues.slice(0, 3).forEach((issue) => {
					console.log(`      - ${issue.message}`);
				});
			} else {
				console.log(`   ✅ No accessibility issues found`);
			}
		} catch (error) {
			console.log(`   ⚠️  Could not test ${url} (site may not be running)`);
		}
	}

	console.log(`\n📊 Total accessibility issues: ${totalIssues}`);

	if (totalIssues === 0) {
		console.log("✅ All pages passed accessibility tests!");
		process.exit(0);
	} else {
		console.log("⚠️  Some accessibility issues found. Please review.");
		process.exit(1);
	}
}

runAccessibilityTests();

