#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const manifestPath = path.join(process.cwd(), "public", "manifest.json");
if (!fs.existsSync(manifestPath)) {
	console.log("❌ manifest.json not found");
	process.exit(1);
}
console.log("✅ PWA manifest exists");
process.exit(0);
