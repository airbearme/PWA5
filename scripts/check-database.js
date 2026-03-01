import { createClient } from "@supabase/supabase-js";

/**
 * Database Connectivity Testing Script
 * Tests Supabase database connection and basic operations
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_PWA4_URL || process.env.SUPABASE_URL;
const SUPABASE_KEY =
	process.env.NEXT_PUBLIC_SUPABASE_PWA4_ANON_KEY ||
	process.env.SUPABASE_PWA4_SERVICE_ROLE_KEY ||
	process.env.SUPABASE_KEY;

console.log("💾 Testing database connectivity...\n");

if (!SUPABASE_URL || !SUPABASE_KEY) {
	console.log("❌ Supabase credentials not found in environment variables");
	process.exit(1);
}

async function testDatabase() {
	try {
		const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

		console.log("📡 Connecting to Supabase...");

		const { data: spots, error: spotsError } = await supabase
			.from("spots")
			.select("id")
			.limit(1);

		if (spotsError) {
			console.log("❌ Database connection failed: " + spotsError.message);
			process.exit(1);
		}

		console.log("✅ Database connection successful");
		process.exit(0);
	} catch (error) {
		console.error("❌ Database test failed: " + error.message);
		process.exit(1);
	}
}

testDatabase();
