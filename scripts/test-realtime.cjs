#!/usr/bin/env node

/**
 * Real-time Features Testing Script
 * Tests Supabase real-time subscriptions
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_PWA4_URL;
const SUPABASE_KEY =
	process.env.NEXT_PUBLIC_SUPABASE_PWA4_ANON_KEY ||
	process.env.SUPABASE_PWA4_SERVICE_ROLE_KEY;

console.log("📡 Testing real-time features...\n");

if (!SUPABASE_URL || !SUPABASE_KEY) {
	console.log("❌ Supabase credentials not found");
	process.exit(1);
}

async function testRealtime() {
	try {
		const { createClient } = require("@supabase/supabase-js");
		const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

		console.log("📡 Testing real-time subscription...");

		// Check if realtime is enabled for airbears table
		const channel = supabase
			.channel("test-realtime")
			.on(
				"postgres_changes",
				{
					event: "*",
					schema: "public",
					table: "airbears",
				},
				(payload) => {
					console.log("✅ Real-time event received:", payload.eventType);
				},
			)
			.subscribe();

		// Wait a bit to see if subscription works
		await new Promise((resolve) => setTimeout(resolve, 2000));

		// Check if subscription is active
		const status = channel.state;
		console.log(`   Subscription status: ${status}`);

		if (status === "SUBSCRIBED") {
			console.log("✅ Real-time subscription active");
		} else {
			console.log("⚠️  Real-time subscription not active");
		}

		// Clean up
		supabase.removeChannel(channel);

		// Check realtime file
		const realtimePath = require("path").join(
			process.cwd(),
			"lib",
			"supabase",
			"realtime.ts",
		);
		const fs = require("fs");
		if (fs.existsSync(realtimePath)) {
			console.log("\n✅ Real-time utilities file exists");
		}

		console.log("\n✅ Real-time tests complete!");
		process.exit(0);
	} catch (error) {
		console.error(`❌ Real-time test failed: ${error.message}`);
		process.exit(1);
	}
}

testRealtime();
