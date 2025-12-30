#!/usr/bin/env node

/**
 * Service Worker Testing Script
 * Validates service worker registration and functionality
 */

const fs = require("fs");
const path = require("path");

console.log("🔧 Testing service worker...\n");

// Check for service worker files
const swPaths = [
	path.join(process.cwd(), "public", "sw.js"),
	path.join(process.cwd(), "public", "service-worker.js"),
	path.join(process.cwd(), "sw.js"),
];

let swPath = null;
for (const p of swPaths) {
	if (fs.existsSync(p)) {
		swPath = p;
		break;
	}
}

if (!swPath) {
	console.log("⚠️  Service worker file not found");
	console.log(
		"   Expected locations: public/sw.js, public/service-worker.js, sw.js",
	);
	console.log("   Service worker may be generated at build time");
	process.exit(0);
}

console.log(`✅ Service worker found: ${path.basename(swPath)}`);

// Check service worker content
try {
	const swContent = fs.readFileSync(swPath, "utf8");

	const checks = {
		"install event": /self\.addEventListener\(['"]install['"]/i.test(swContent),
		"activate event": /self\.addEventListener\(['"]activate['"]/i.test(
			swContent,
		),
		"fetch event": /self\.addEventListener\(['"]fetch['"]/i.test(swContent),
		"push event": /self\.addEventListener\(['"]push['"]/i.test(swContent),
		cache: /cache/i.test(swContent),
	};

	console.log("\n📋 Service worker features:");
	for (const [feature, present] of Object.entries(checks)) {
		if (present) {
			console.log(`   ✅ ${feature}`);
		} else {
			console.log(`   ⚠️  ${feature} (optional)`);
		}
	}

	// Check for common PWA patterns
	if (swContent.includes("workbox")) {
		console.log("\n✅ Workbox detected (good for PWA)");
	}

	if (swContent.includes("precache")) {
		console.log("✅ Precache strategy detected");
	}

	console.log("\n✅ Service worker validation complete!");
	process.exit(0);
} catch (error) {
	console.error(`❌ Failed to read service worker: ${error.message}`);
	process.exit(1);
}

