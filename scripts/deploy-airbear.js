#!/usr/bin/env node

import { execSync } from "child_process";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import SftpClient from "ssh2-sftp-client";

// Load environment variables
dotenv.config();

const IONOS_CONFIG = {
	host: "access-5018328928.webspace-host.com",
	username: "a2096159",
	password: process.env.IONOS_SFTP_PASSWORD,
	port: 22,
	remoteBase: "/public", // IONOS web directory
	localDist: "dist/public", // Local build directory
};

console.log("🚀 Starting AirBear PWA deployment to IONOS...");

const joinRemotePath = (...parts) =>
	parts.filter(Boolean).join("/").replace(/\\/g, "/");

async function deploy() {
	const sftp = new SftpClient();

	try {
		// 1. Build the application
		console.log("📦 Building application...");
		execSync("npm run build:static", { stdio: "inherit" });

		// 2. Verify build output
		const distPath = path.resolve(IONOS_CONFIG.localDist);
		if (!fs.existsSync(distPath)) {
			throw new Error(
				`Build output not found at ${distPath}. Make sure the build completed successfully.`,
			);
		}
		console.log("✅ Build completed successfully");

		// 3. Connect to IONOS SFTP
		console.log("🌐 Connecting to IONOS SFTP...");
		await sftp.connect({
			host: IONOS_CONFIG.host,
			username: IONOS_CONFIG.username,
			password: IONOS_CONFIG.password,
			port: IONOS_CONFIG.port,
		});
		console.log("✅ Connected to IONOS SFTP");

		// 4. Check and create remote directories if needed
		console.log("📂 Verifying remote directory structure...");

		// First, check if we can list the root directory
		let rootContents;
		try {
			rootContents = await sftp.list("/");
			console.log(
				"📋 Root directory contents:",
				rootContents.map((f) => f.name).join(", "),
			);
		} catch (err) {
			console.error("❌ Cannot list root directory:", err.message);
			throw new Error("Insufficient permissions to list root directory");
		}

		// Check if httpdocs exists, if not try to create it
		let targetDir = IONOS_CONFIG.remoteBase;
		try {
			const stats = await sftp.stat(targetDir);
			console.log(`✅ ${targetDir} exists and is a ${stats.type}`);
		} catch (err) {
			console.log(`ℹ️ ${targetDir} does not exist, attempting to create...`);
			try {
				await sftp.mkdir(targetDir, true);
				console.log(`✅ Created ${targetDir}`);
			} catch (mkdirErr) {
				console.error(`❌ Failed to create ${targetDir}:`, mkdirErr.message);
				console.log("ℹ️ Attempting to use alternative directory...");

				// Try alternative directories
				const altDirs = ["/htdocs", "/www", "/public_html"];
				for (const dir of altDirs) {
					try {
						const stats = await sftp.stat(dir);
						if (stats && stats.type === "d") {
							targetDir = dir;
							console.log(`✅ Found alternative web directory: ${targetDir}`);
							break;
						}
					} catch (e) {}
				}

				if (targetDir === IONOS_CONFIG.remoteBase) {
					throw new Error(
						"Could not find a suitable web directory. Please check your hosting configuration.",
					);
				}
			}
		}

		// 5. Upload files
		console.log(`\n📤 Uploading files to ${targetDir}...`);

		async function uploadDir(localPath, remotePath) {
			const files = fs.readdirSync(localPath);

			for (const file of files) {
				const localFilePath = path.join(localPath, file);
				const remoteFilePath = joinRemotePath(remotePath, file);
				const stats = fs.statSync(localFilePath);

				if (stats.isDirectory()) {
					try {
						await sftp.mkdir(remoteFilePath, true);
						await sftp.chmod(remoteFilePath, 0o755); // Ensure directory is executable/readable
						console.log(`📁 Created directory: ${remoteFilePath}`);
					} catch (e) {
						// Directory might already exist
					}
					await uploadDir(localFilePath, remoteFilePath);
				} else {
					await sftp.fastPut(localFilePath, remoteFilePath);
					await sftp.chmod(remoteFilePath, 0o644); // Ensure file is readable
					console.log(
						`✅ Uploaded: ${remoteFilePath} (${(stats.size / 1024).toFixed(2)} KB)`,
					);
				}
			}
		}

		await uploadDir(distPath, targetDir);

		// 6. Verify upload
		try {
			const indexExists = await sftp.exists(
				joinRemotePath(targetDir, "index.html"),
			);
			console.log("\n🔍 Verification:");
			console.log(`- index.html exists: ${indexExists ? "✅" : "❌"}`);

			if (indexExists) {
				const stats = await sftp.stat(joinRemotePath(targetDir, "index.html"));
				console.log(`- index.html size: ${stats.size} bytes`);
				console.log(
					`- index.html permissions: ${stats.permissions.toString(8).slice(-3)}`,
				);
			}
		} catch (err) {
			console.error("❌ Verification failed:", err.message);
		}

		console.log(`\n🎉 Deployment complete!`);
		console.log(`🌐 Your PWA should be available at: https://airbear.me`);
		console.log(`📱 PWA install prompt will appear on first visit`);
	} catch (error) {
		console.error("❌ Deployment failed:", error.message);
		process.exit(1);
	} finally {
		if (sftp) {
			await sftp.end();
			console.log("🔌 Disconnected from IONOS SFTP");
		}
	}
}

// Run the deployment
deploy();
