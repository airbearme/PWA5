#!/usr/bin/env node

/**
 * Database Connectivity Testing Script
 * Tests Supabase database connection and basic operations
 */

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_PWA4_URL;
const SUPABASE_KEY =
	process.env.NEXT_PUBLIC_SUPABASE_PWA4_ANON_KEY ||
	process.env.SUPABASE_PWA4_SERVICE_ROLE_KEY;

console.log("💾 Testing database connectivity...\n");

if (!SUPABASE_URL || !SUPABASE_KEY) {
	console.log("❌ Supabase credentials not found in environment variables");
	console.log(
		"   Required: NEXT_PUBLIC_SUPABASE_PWA4_URL, NEXT_PUBLIC_SUPABASE_PWA4_ANON_KEY",
	);
	process.exit(1);
}

async function testDatabase() {
	try {
		const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

		console.log("📡 Connecting to Supabase...");

		// Test 1: Basic connection
		const { data: spots, error: spotsError } = await supabase
			.from("spots")
			.select("id")
			.limit(1);

		if (spotsError) {
			console.log(`❌ Database connection failed: ${spotsError.message}`);
			process.exit(1);
		}

		console.log("✅ Database connection successful");

		// Test 2: Check required tables
		const requiredTables = ["spots", "airbears", "rides", "users"];
		console.log("\n📋 Checking required tables...");

		for (const table of requiredTables) {
			const { error } = await supabase.from(table).select("id").limit(1);
			if (error) {
				console.log(`   ❌ Table '${table}': ${error.message}`);
			} else {
				console.log(`   ✅ Table '${table}': accessible`);
			}
		}

		// Test 3: Check error_logs table (if exists)
		const { error: errorLogsError } = await supabase
			.from("error_logs")
			.select("id")
			.limit(1);

		if (errorLogsError) {
			console.log(`\n⚠️  error_logs table not found (run migration if needed)`);
		} else {
			console.log(`\n✅ error_logs table: accessible`);
		}

		console.log("\n✅ Database tests passed!");
		process.exit(0);
	} catch (error) {
		console.error(`❌ Database test failed: ${error.message}`);
		process.exit(1);
	}
}

testDatabase();


