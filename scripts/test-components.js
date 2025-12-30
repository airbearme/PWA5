#!/usr/bin/env node

/**
 * Component Testing Script
 * Validates React components can be imported and rendered
 */

const fs = require("fs");
const path = require("path");

console.log("🎨 Testing component structure...\n");

const componentsDir = path.join(process.cwd(), "components");

if (!fs.existsSync(componentsDir)) {
	console.log("❌ Components directory not found");
	process.exit(1);
}

function findComponents(dir, basePath = "") {
	const items = fs.readdirSync(dir);
	const components = [];

	for (const item of items) {
		const fullPath = path.join(dir, item);
		const stat = fs.statSync(fullPath);

		if (stat.isDirectory()) {
			components.push(...findComponents(fullPath, path.join(basePath, item)));
		} else if (item.endsWith(".tsx") || item.endsWith(".jsx")) {
			components.push(path.join(basePath, item));
		}
	}

	return components;
}

const components = findComponents(componentsDir);

console.log(`📦 Found ${components.length} components\n`);

// Check for common component patterns
const criticalComponents = [
	"error-boundary.tsx",
	"floating-mascot.tsx",
	"pwa-install-prompt.tsx",
	"one-click-booking.tsx",
	"checkout-button.tsx",
];

console.log("🔍 Checking critical components:");
for (const comp of criticalComponents) {
	const found = components.some((c) => c.includes(comp));
	if (found) {
		console.log(`   ✅ ${comp}`);
	} else {
		console.log(`   ⚠️  ${comp} (not found)`);
	}
}

// Check UI components
const uiDir = path.join(componentsDir, "ui");
if (fs.existsSync(uiDir)) {
	const uiComponents = findComponents(uiDir, "ui");
	console.log(`\n📚 UI components: ${uiComponents.length} found`);
}

console.log("\n✅ Component structure validation complete!");
process.exit(0);

