#!/usr/bin/env node

/**
 * PWA Manifest Testing Script
 * Validates PWA manifest file and configuration
 */

import fs from "fs";
import path from "path";

console.log("📱 Testing PWA manifest...\n");

const manifestPath = path.join(process.cwd(), "public", "manifest.json");

if (!fs.existsSync(manifestPath)) {
	console.log("❌ manifest.json not found in public/ directory");
	process.exit(1);
}

try {
	const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

	console.log("📋 Validating manifest structure...\n");

	const requiredFields = [
		"name",
		"short_name",
		"start_url",
		"display",
		"icons",
	];

	const missingFields = [];
	const issues = [];

	// Check required fields
	for (const field of requiredFields) {
		if (!manifest[field]) {
			missingFields.push(field);
		} else {
			console.log(`✅ ${field}: present`);
		}
	}

	// Validate icons
	if (manifest.icons && Array.isArray(manifest.icons)) {
		console.log(`\n📸 Icons: ${manifest.icons.length} found`);

		const requiredSizes = [192, 512];
		for (const size of requiredSizes) {
			const icon = manifest.icons.find((i) =>
				i.sizes?.includes(`${size}x${size}`),
			);
			if (icon) {
				const iconPath = path.join(process.cwd(), "public", icon.src);
				if (fs.existsSync(iconPath)) {
					console.log(`   ✅ ${size}x${size} icon exists`);
				} else {
					issues.push(`Icon file not found: ${icon.src}`);
				}
			} else {
				issues.push(`Missing ${size}x${size} icon`);
			}
		}
	} else {
		issues.push("Icons array is missing or invalid");
	}

	// Check display mode
	const validDisplayModes = ["standalone", "fullscreen", "minimal-ui"];
	if (manifest.display && !validDisplayModes.includes(manifest.display)) {
		issues.push(`Invalid display mode: ${manifest.display}`);
	} else {
		console.log(`✅ display: ${manifest.display}`);
	}

	// Check theme color
	if (manifest.theme_color) {
		console.log(`✅ theme_color: ${manifest.theme_color}`);
	} else {
		issues.push("theme_color is recommended");
	}

	if (missingFields.length > 0) {
		console.log(`\n❌ Missing required fields: ${missingFields.join(", ")}`);
	}

	if (issues.length > 0) {
		console.log(`\n⚠️  Issues found:`);
		issues.forEach((issue) => console.log(`   - ${issue}`));
		process.exit(1);
	}

	console.log("\n✅ PWA manifest is valid!");
	process.exit(0);
} catch (error) {
	console.error(`❌ Failed to validate manifest: ${error.message}`);
	process.exit(1);
}
