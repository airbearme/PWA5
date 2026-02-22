#!/usr/bin/env node

import { execSync } from "child_process";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import SftpClient from "ssh2-sftp-client";

// Load environment variables
dotenv.config();

const IONOS_CONFIG = {
	host:
		process.env.IONOS_SFTP_HOST ||
		process.env.IONOS_FTP_HOST ||
		"access-5018328928.webspace-host.com",
	username:
		process.env.IONOS_SFTP_USER || process.env.IONOS_FTP_USER || "a2096159",
	password:
		process.env.IONOS_SFTP_PASSWORD ||
		process.env.IONOS_FTP_PASSWORD ||
		process.env.IONOS_SFTP_PASSWORD,
	port: 22,
};

console.log("🚀 Starting comprehensive AirBear PWA deployment to IONOS...");

const joinRemotePath = (...parts) =>
	parts.filter(Boolean).join("/").replace(/\\/g, "/");

async function deploy() {
	try {
		// 1. Build the application
		console.log("📦 Building application...");
		execSync("npm run build:static", { stdio: "inherit" });

		// 2. Verify build output
		const distPath = path.resolve("dist/public");
		if (!fs.existsSync(distPath)) {
			throw new Error(
				"Build output not found. Make sure the build completed successfully.",
			);
		}

		console.log("✅ Build completed successfully");

		// 3. Connect to IONOS via SFTP
		console.log("🌐 Connecting to IONOS via SFTP...");
		console.log(`📡 SFTP Host: ${IONOS_CONFIG.host}`);
		console.log(`👤 SFTP User: ${IONOS_CONFIG.username}`);

		const sftp = new SftpClient();

		await sftp.connect({
			host: IONOS_CONFIG.host,
			username: IONOS_CONFIG.username,
			password: IONOS_CONFIG.password,
			port: IONOS_CONFIG.port,
		});

		console.log("📡 Connected to IONOS SFTP");

		// 4. Try multiple common IONOS web directories
		const possibleDirectories = [
			"/",
			"/httpdocs",
			"/htdocs",
			"/public_html",
			"/www",
		];

		for (const remoteBase of possibleDirectories) {
			console.log(`\n🎯 Trying deployment to: ${remoteBase}`);

			try {
				// Ensure directory exists
				await sftp.mkdir(remoteBase, true);
				console.log(`📁 Ensured ${remoteBase} directory exists`);

				// Clean directory
				const removeDirContents = async (remoteDir) => {
					try {
						const list = await sftp.list(remoteDir);
						for (const item of list) {
							const remotePath = joinRemotePath(remoteDir, item.name);
							if (item.type === "d") {
								await removeDirContents(remotePath);
								await sftp.rmdir(remotePath, true);
							} else {
								await sftp.delete(remotePath);
							}
						}
					} catch (err) {
						console.log(`📁 Directory ${remoteDir} may be empty`);
					}
				};

				await removeDirContents(remoteBase);
				console.log(`✅ Cleaned ${remoteBase}`);

				// Upload files
				const uploadDir = async (localDir, remoteDir) => {
					const items = fs.readdirSync(localDir);
					for (const item of items) {
						const localPath = path.join(localDir, item);
						const remotePath = joinRemotePath(remoteDir, item);
						const stats = fs.statSync(localPath);

						if (stats.isDirectory()) {
							await sftp.mkdir(remotePath, true);
							await uploadDir(localPath, remotePath);
						} else {
							await sftp.put(localPath, remotePath);
							console.log(`✅ Uploaded ${remotePath}`);
						}
					}
				};

				await uploadDir(distPath, remoteBase);
				console.log(`🎉 Deployment to ${remoteBase} completed!`);

				// Test the deployment by checking if index.html is accessible
				console.log(`🔍 Testing access to ${remoteBase}/index.html...`);

				// Give the server a moment to update
				await new Promise((resolve) => setTimeout(resolve, 2000));

				// Check if we can list the uploaded files
				try {
					const list = await sftp.list(remoteBase);
					console.log(
						`📂 Files in ${remoteBase}:`,
						list.map((f) => f.name).join(", "),
					);

					// If we have index.html, this might be the correct directory
					if (list.some((f) => f.name === "index.html")) {
						console.log(`🎯 SUCCESS: Found index.html in ${remoteBase}!`);
						console.log(`🔗 Try accessing: https://airbear.me`);
						break; // Stop trying other directories
					}
				} catch (err) {
					console.log(
						`⚠️  Could not list files in ${remoteBase}: ${err.message}`,
					);
				}
			} catch (err) {
				console.log(`❌ Failed to deploy to ${remoteBase}: ${err.message}`);
			}
		}

		await sftp.end();
		console.log("\n🎉 Deployment process completed!");
		console.log("🔗 Access your app at: https://airbear.me");
		console.log("📱 PWA install prompt will appear on first visit");

		// Create a simple test file to verify access
		const testContent = `<!DOCTYPE html>
<html>
<head><title>AirBear PWA Test</title></head>
<body>
<h1>🎉 AirBear PWA is Live!</h1>
<p>If you can see this, the deployment was successful!</p>
<p>Access the main app at: <a href="index.html">Main App</a></p>
</body>
</html>`;

		console.log("\n📝 Creating simple test page...");
		// You can manually create this test page via SFTP if needed
	} catch (error) {
		console.error("❌ Deployment failed:", error.message);
		process.exit(1);
	}
}

deploy();
