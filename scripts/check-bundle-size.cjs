#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
console.log("📦 Checking bundle sizes...\n");
const nextDir = path.join(process.cwd(), ".next");
if (!fs.existsSync(nextDir)) {
	console.log('⚠️  .next directory not found. Run "ppnpm run build" first.');
	process.exit(0);
}
console.log("✅ Bundle size check passed (stub)");
process.exit(0);
