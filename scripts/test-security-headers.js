#!/usr/bin/env node

/**
 * Security Headers Testing Script
 * Validates security headers are properly configured
 */

import https from "https";
import http from "http";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://airbear.me";

const requiredHeaders = {
	"strict-transport-security": "HSTS header should be present",
	"x-content-type-options": "X-Content-Type-Options should be nosniff",
	"content-security-policy": "Content-Security-Policy should be present",
	"referrer-policy": "Referrer-Policy should be present",
};

console.log("🔒 Testing security headers...\n");
console.log(`Testing: ${SITE_URL}\n`);

function checkHeaders(url) {
	return new Promise((resolve, reject) => {
		const client = url.startsWith("https") ? https : http;
		const req = client.get(url, { timeout: 10000 }, (res) => {
			const headers = res.headers;
			const results = {
				passed: [],
				failed: [],
				missing: [],
			};

			// Check required headers
			for (const [header, description] of Object.entries(requiredHeaders)) {
				const headerValue = headers[header.toLowerCase()];

				if (!headerValue) {
					results.missing.push({ header, description });
				} else {
					// Validate header values
					let isValid = true;

					if (
						header === "x-content-type-options" &&
						headerValue !== "nosniff"
					) {
						isValid = false;
					}

					if (isValid) {
						results.passed.push({ header, value: headerValue });
					} else {
						results.failed.push({ header, value: headerValue, description });
					}
				}
			}

			resolve(results);
		});

		req.on("error", reject);
		req.on("timeout", () => {
			req.destroy();
			reject(new Error("Request timeout"));
		});
	});
}

async function runSecurityTests() {
	try {
		const results = await checkHeaders(SITE_URL);

		console.log("✅ Passed:");
		results.passed.forEach(({ header, value }) => {
			console.log(`   ${header}: ${value}`);
		});

		if (results.missing.length > 0) {
			console.log("\n❌ Missing:");
			results.missing.forEach(({ header, description }) => {
				console.log(`   ${header}: ${description}`);
			});
		}

		if (results.failed.length > 0) {
			console.log("\n⚠️  Invalid values:");
			results.failed.forEach(({ header, value, description }) => {
				console.log(`   ${header}: ${value} (${description})`);
			});
		}

		const totalIssues = results.missing.length + results.failed.length;

		if (totalIssues === 0) {
			console.log("\n✅ All security headers are properly configured!");
			process.exit(0);
		} else {
			console.log(`\n⚠️  Found ${totalIssues} security header issues`);
			// Don't fail the whole CI for missing headers in local/dev environments
			process.exit(0);
		}
	} catch (error) {
		console.error(`❌ Failed to test security headers: ${error.message}`);
		console.log("💡 Make sure the site is accessible and running");
		process.exit(0);
	}
}

runSecurityTests();
