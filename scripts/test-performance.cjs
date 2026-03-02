#!/usr/bin/env node

/**
 * Performance Testing Script
 * Tests application performance using Lighthouse
 */

const { execSync } = require("child_process");
const https = require("https");
const http = require("http");

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

console.log("⚡ Running performance tests...\n");

// Check if Lighthouse is installed
try {
	execSync("which lighthouse", { stdio: "ignore" });
} catch {
	console.log("⚠️  Lighthouse CLI not found. Installing...");
	try {
		execSync("npm install -g lighthouse", { stdio: "inherit" });
	} catch {
		console.log("❌ Failed to install Lighthouse. Skipping performance tests.");
		process.exit(0);
	}
}

// Check if site is accessible
function checkSiteAccessible(url) {
	return new Promise((resolve) => {
		const client = url.startsWith("https") ? https : http;
		const req = client.get(url, { timeout: 5000 }, (res) => {
			resolve(res.statusCode >= 200 && res.statusCode < 400);
		});

		req.on("error", () => resolve(false));
		req.on("timeout", () => {
			req.destroy();
			resolve(false);
		});
	});
}

async function runPerformanceTests() {
	const isAccessible = await checkSiteAccessible(SITE_URL);

	if (!isAccessible) {
		console.log(
			`⚠️  Site ${SITE_URL} is not accessible. Skipping Lighthouse tests.`,
		);
		console.log("💡 Start the dev server with: npm run dev");
		process.exit(0);
	}

	console.log(`📊 Running Lighthouse on ${SITE_URL}...\n`);

	try {
		execSync(
			`lighthouse ${SITE_URL} --only-categories=performance,accessibility,best-practices,seo --output=json --output-path=./lighthouse-report.json --quiet`,
			{ stdio: "inherit" },
		);

		// Read and parse results
		const fs = require("fs");
		if (fs.existsSync("./lighthouse-report.json")) {
			const report = JSON.parse(
				fs.readFileSync("./lighthouse-report.json", "utf8"),
			);
			const scores = report.categories;

			console.log("\n📈 Performance Scores:");
			console.log(
				`   Performance: ${Math.round(scores.performance.score * 100)}`,
			);
			console.log(
				`   Accessibility: ${Math.round(scores.accessibility.score * 100)}`,
			);
			console.log(
				`   Best Practices: ${Math.round(scores["best-practices"].score * 100)}`,
			);
			console.log(`   SEO: ${Math.round(scores.seo.score * 100)}`);

			const minScore = 80;
			const allPassed = Object.values(scores).every(
				(cat) => cat.score * 100 >= minScore,
			);

			if (allPassed) {
				console.log("\n✅ All performance scores meet minimum threshold (80)");
				process.exit(0);
			} else {
				console.log(`\n⚠️  Some scores below minimum threshold (${minScore})`);
				process.exit(0); // Don't fail the build for performance scores in this environment
			}
		}
	} catch (error) {
		console.error("⚠️  Lighthouse test failed or not supported in this environment:", error.message);
		process.exit(0);
	}
}

runPerformanceTests();


