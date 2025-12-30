#!/usr/bin/env node

/**
 * Database Schema Testing Script
 * Validates database schema matches expected structure
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY =
	process.env.SUPABASE_SERVICE_ROLE_KEY ||
	process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log("💾 Testing database schema...\n");

if (!SUPABASE_URL || !SUPABASE_KEY) {
	console.log("❌ Supabase credentials not found");
	process.exit(1);
}

const requiredTables = {
	spots: ["id", "name", "latitude", "longitude", "is_active"],
	airbears: [
		"id",
		"latitude",
		"longitude",
		"battery_level",
		"is_available",
		"is_charging",
	],
	rides: [
		"id",
		"user_id",
		"pickup_spot_id",
		"dropoff_spot_id",
		"status",
		"fare",
	],
	users: ["id", "email", "role"],
	error_logs: ["id", "error_type", "error_message", "timestamp"],
	error_consent: ["id", "user_id", "consent_given"],
};

async function testSchema() {
	try {
		const { createClient } = require("@supabase/supabase-js");
		const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

		console.log("📋 Checking required tables and columns...\n");

		let allValid = true;

		for (const [table, columns] of Object.entries(requiredTables)) {
			const { data, error } = await supabase
				.from(table)
				.select(columns.join(","))
				.limit(1);

			if (error) {
				if (error.code === "42P01") {
					console.log(`❌ Table '${table}': does not exist`);
					allValid = false;
				} else if (error.code === "42703") {
					console.log(`⚠️  Table '${table}': some columns missing`);
					allValid = false;
				} else {
					console.log(`⚠️  Table '${table}': ${error.message}`);
				}
			} else {
				console.log(
					`✅ Table '${table}': valid (${columns.length} columns checked)`,
				);
			}
		}

		if (allValid) {
			console.log("\n✅ Database schema is valid!");
			process.exit(0);
		} else {
			console.log("\n⚠️  Some schema issues found. Run migrations if needed.");
			process.exit(1);
		}
	} catch (error) {
		console.error(`❌ Schema test failed: ${error.message}`);
		process.exit(1);
	}
}

testSchema();

