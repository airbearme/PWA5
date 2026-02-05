#!/usr/bin/env node

/**
 * Bundle Size Check Script
 * Validates bundle sizes are within acceptable limits
 */

const fs = require("fs");
const path = require("path");

console.log("📦 Checking bundle sizes...\n");

const nextDir = path.join(process.cwd(), ".next");

if (!fs.existsSync(nextDir)) {
	console.log('⚠️  .next directory not found. Run "pnpm run build" first.');
	process.exit(0);
}

function getFileSize(filePath) {
	try {
		const stats = fs.statSync(filePath);
		return stats.size;
	} catch {
		return 0;
	}
}

function formatSize(bytes) {
	if (bytes < 1024) return `${bytes} B`;
	if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
	return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function findLargeFiles(dir, maxSize = 500 * 1024) {
	const largeFiles = [];

	function walk(currentPath) {
		const items = fs.readdirSync(currentPath);

		for (const item of items) {
			const fullPath = path.join(currentPath, item);
			const stat = fs.statSync(fullPath);

			if (stat.isDirectory()) {
				walk(fullPath);
			} else if (stat.isFile() && stat.size > maxSize) {
				largeFiles.push({
					path: fullPath.replace(process.cwd(), ""),
					size: stat.size,
				});
			}
		}
	}

	walk(dir);
	return largeFiles;
}

// Check static files
const staticDir = path.join(nextDir, "static");
if (fs.existsSync(staticDir)) {
	console.log("📊 Analyzing static files...\n");

	const largeFiles = findLargeFiles(staticDir, 200 * 1024); // 200KB threshold

	if (largeFiles.length > 0) {
		console.log("⚠️  Large files found (>200KB):");
		largeFiles.forEach(({ path: filePath, size }) => {
			console.log(`   ${filePath}: ${formatSize(size)}`);
		});
	} else {
		console.log("✅ No unusually large static files found");
	}
}

// Check for main bundle
const chunksDir = path.join(nextDir, "static", "chunks");
if (fs.existsSync(chunksDir)) {
	const chunks = fs.readdirSync(chunksDir).filter((f) => f.endsWith(".js"));
	console.log(`\n📦 JavaScript chunks: ${chunks.length} found`);

	let totalSize = 0;
	chunks.forEach((chunk) => {
		const size = getFileSize(path.join(chunksDir, chunk));
		totalSize += size;
	});

	console.log(`   Total size: ${formatSize(totalSize)}`);

	if (totalSize > 2 * 1024 * 1024) {
		// 2MB
		console.log("⚠️  Total bundle size exceeds 2MB (consider code splitting)");
	} else {
		console.log("✅ Bundle size is acceptable");
	}
}

console.log("\n✅ Bundle size check complete!");
process.exit(0);


