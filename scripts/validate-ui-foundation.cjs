#!/usr/bin/env node

/**
 * Core UI/UX Foundation Validation Script
 * Ensures all beautiful UI features are permanently present in the codebase
 */

const { readFileSync } = require("fs");
const { join } = require("path");

const PROJECT_ROOT = process.cwd();

console.log("🎨 Validating Core UI/UX Foundation...\n");

const errors = [];
const warnings = [];

// Required keyframes
const REQUIRED_KEYFRAMES = [
	"pulse-glow",
	"float",
	"shimmer",
	"particle",
	"rickshaw-bounce",
	"wheel-spin",
	"neon-glow",
	"holographic-shift",
	"plasma-flow",
	"solar-rays",
	"eco-breeze",
	"god-rays",
];

// Required utility classes
const REQUIRED_UTILITY_CLASSES = [
	"animate-pulse-glow",
	"animate-float",
	"animate-shimmer",
	"animate-particle",
	"animate-rickshaw-bounce",
	"animate-wheel-spin",
	"animate-neon-glow",
	"animate-holographic",
	"animate-plasma",
	"animate-solar-rays",
	"animate-eco-breeze",
	"animate-god-rays",
];

// Required component classes
const REQUIRED_COMPONENT_CLASSES = [
	"hover-lift",
	"glass-morphism",
	"ripple-effect",
	"airbear-holographic",
	"airbear-plasma",
	"airbear-solar-rays",
	"airbear-eco-breeze",
	"airbear-god-rays",
	"eco-gradient",
];

// Required Tailwind safelist entries
const REQUIRED_SAFELIST_ENTRIES = [
	"animate-pulse-glow",
	"animate-float",
	"hover-lift",
	"glass-morphism",
	"airbear-holographic",
];

function checkFile(filePath, checks) {
	try {
		const content = readFileSync(filePath, "utf-8");
		checks.forEach(({ name, pattern, required = true }) => {
			const found = pattern.test(content);
			if (found) {
				console.log(`  ✅ ${name}`);
			} else {
				const message = `${name} - ${required ? "MISSING" : "Not found"}`;
				if (required) {
					errors.push(`${filePath}: ${message}`);
					console.log(`  ❌ ${message}`);
				} else {
					warnings.push(`${filePath}: ${message}`);
					console.log(`  ⚠️  ${message}`);
				}
			}
		});
	} catch (error) {
		errors.push(`${filePath}: File not found or unreadable`);
		console.log(`  ❌ File not found: ${filePath}`);
	}
}

// Check globals.css
console.log("📄 Checking app/globals.css...");
const globalsCssPath = join(PROJECT_ROOT, "app", "globals.css");
const globalsChecks = [
	...REQUIRED_KEYFRAMES.map((name) => ({
		name: `@keyframes ${name}`,
		pattern: new RegExp(`@keyframes\\s+${name.replace(/-/g, "\\-")}`),
	})),
	...REQUIRED_UTILITY_CLASSES.map((name) => ({
		name: `.${name}`,
		pattern: new RegExp(`\\.${name.replace(/-/g, "\\-")}\\s*\\{`),
	})),
	...REQUIRED_COMPONENT_CLASSES.map((name) => ({
		name: `.${name}`,
		pattern: new RegExp(`\\.${name.replace(/-/g, "\\-")}\\s*\\{`),
	})),
];

checkFile(globalsCssPath, globalsChecks);

// Check tailwind.config.ts
console.log("\n📄 Checking tailwind.config.ts...");
const tailwindConfigPath = join(PROJECT_ROOT, "tailwind.config.ts");
const tailwindChecks = [
	...REQUIRED_SAFELIST_ENTRIES.map((name) => ({
		name: `Safelist: "${name}"`,
		pattern: new RegExp(`"${name.replace(/-/g, "\\-")}"`),
	})),
	{
		name: "Safelist array exists",
		pattern: /safelist:\s*\[/,
	},
	{
		name: "Animation keyframes defined",
		pattern: /keyframes:\s*\{/,
	},
	{
		name: "Animation utilities defined",
		pattern: /animation:\s*\{/,
	},
];

checkFile(tailwindConfigPath, tailwindChecks);

// Check layout.tsx for dark mode
console.log("\n📄 Checking app/layout.tsx...");
const layoutPath = join(PROJECT_ROOT, "app", "layout.tsx");
const layoutChecks = [
	{
		name: "Dark mode default enabled",
		pattern: /defaultTheme\s*=\s*["']dark["']/,
	},
	{
		name: "System theme disabled",
		pattern: /enableSystem\s*=\s*\{?false\}?/,
	},
	{
		name: "globals.css imported",
		pattern: /import\s+["'].*globals\.css["']/,
	},
];

checkFile(layoutPath, layoutChecks);

// Check homepage for core features
console.log("\n📄 Checking app/page.tsx...");
const homepagePath = join(PROJECT_ROOT, "app", "page.tsx");
const homepageChecks = [
	{
		name: "Uses animate-float",
		pattern: /animate-float/,
	},
	{
		name: "Uses animate-pulse-glow",
		pattern: /animate-pulse-glow/,
	},
	{
		name: "Uses hover-lift",
		pattern: /hover-lift/,
	},
	{
		name: "Uses dark gradient",
		pattern: /from-emerald-950.*via-lime-950.*to-amber-950/,
	},
];

checkFile(homepagePath, homepageChecks);

// Summary
console.log("\n" + "=".repeat(50));
console.log("📊 Validation Summary\n");

if (errors.length === 0 && warnings.length === 0) {
	console.log("✅ All core UI/UX features are present!");
	console.log("🎨 Beautiful UI foundation is intact.");
	process.exit(0);
} else {
	if (errors.length > 0) {
		console.log(`❌ ${errors.length} critical error(s) found:\n`);
		errors.forEach((error, i) => {
			console.log(`  ${i + 1}. ${error}`);
		});
	}

	if (warnings.length > 0) {
		console.log(`\n⚠️  ${warnings.length} warning(s):\n`);
		warnings.forEach((warning, i) => {
			console.log(`  ${i + 1}. ${warning}`);
		});
	}

	console.log("\n📚 See CORE_UI_FOUNDATION.md for required features.");
	process.exit(errors.length > 0 ? 1 : 0);
}


