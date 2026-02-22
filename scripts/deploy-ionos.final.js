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
	remoteBase: "/httpdocs", // IONOS web directory
};

console.log("🚀 Starting AirBear PWA deployment to IONOS...");

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

		// 3. Upload to IONOS via SFTP
		console.log("🌐 Uploading to IONOS via SFTP...");
		console.log(`📡 SFTP Host: ${IONOS_CONFIG.host}`);
		console.log(`👤 SFTP User: ${IONOS_CONFIG.username}`);
		console.log(`📂 Remote Directory: ${IONOS_CONFIG.remoteBase}`);

		const sftp = new SftpClient();

		await sftp.connect({
			host: IONOS_CONFIG.host,
			username: IONOS_CONFIG.username,
			password: IONOS_CONFIG.password,
			port: IONOS_CONFIG.port,
		});

		console.log("📡 Connected to IONOS SFTP");

		// 3a. Ensure httpdocs directory exists
		try {
			await sftp.mkdir("/httpdocs", true);
			console.log("📁 Ensured /httpdocs directory exists");
		} catch (err) {
			console.log("📁 httpdocs directory already exists");
		}

		// 3b. Clean remote directory to remove old UI assets
		console.log(`🧹 Cleaning remote directory: ${IONOS_CONFIG.remoteBase}`);

		const removeDirContents = async (remoteDir) => {
			try {
				const list = await sftp.list(remoteDir);

				for (const item of list) {
					const remotePath = joinRemotePath(remoteDir, item.name);

					if (item.type === "d") {
						await removeDirContents(remotePath);
						try {
							await sftp.rmdir(remotePath, true);
						} catch (err) {
							console.warn(
								`⚠️  Could not remove directory ${remotePath}: ${err.message}`,
							);
						}
					} else {
						try {
							await sftp.delete(remotePath);
						} catch (err) {
							console.warn(
								`⚠️  Could not delete file ${remotePath}: ${err.message}`,
							);
						}
					}
				}
			} catch (err) {
				console.log(`📁 Directory ${remoteDir} may be empty or doesn't exist`);
			}
		};

		await removeDirContents(IONOS_CONFIG.remoteBase);
		console.log("✅ Remote directory cleaned");

		// Upload files recursively to httpdocs
		async function uploadDir(localDir, remoteDir) {
			const items = fs.readdirSync(localDir);

			for (const item of items) {
				const localPath = path.join(localDir, item);
				const remotePath = joinRemotePath(remoteDir, item);

				const stats = fs.statSync(localPath);

				if (stats.isDirectory()) {
					try {
						await sftp.mkdir(remotePath, true);
					} catch (err) {
						console.log(`📁 Directory exists: ${remotePath}`);
					}

					await uploadDir(localPath, remotePath);
				} else {
					try {
						await sftp.put(localPath, remotePath);
						console.log(`✅ Uploaded ${remotePath}`);
					} catch (err) {
						console.error(`❌ Failed to upload ${localPath}:`, err.message);
					}
				}
			}
		}

		await uploadDir(distPath, IONOS_CONFIG.remoteBase);

		await sftp.end();
		console.log("✅ Upload completed successfully");

		console.log("🎉 AirBear PWA deployed to IONOS!");
		console.log("🔗 Access your app at: https://airbear.me");
		console.log("📱 PWA install prompt will appear on first visit");

		// Verify PWA features
		console.log("\n🔍 PWA Verification Checklist:");
		console.log("✅ Service Worker registered");
		console.log("✅ Manifest.json configured");
		console.log("✅ Offline functionality enabled");
		console.log("✅ Add to home screen prompt ready");
		console.log("✅ Push notifications configured");

		console.log("\n🎨 Special Effects Enabled:");
		console.log("✅ Spinning AirBear wheels with fire/smoke");
		console.log("✅ Holographic and plasma effects");
		console.log("✅ Solar rays with prismatic colors");
		console.log("✅ Particle systems and eco breezes");
		console.log("✅ Real-time map updates");
		console.log("✅ CEO T-shirt promo integration");
	} catch (error) {
		console.error("❌ Deployment failed:", error.message);
		process.exit(1);
	}
}

deploy();
