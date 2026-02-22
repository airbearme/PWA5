import { createClient } from "@supabase/supabase-js";

const credentials = [
	{
		name: "archon-chatty",
		url: "https://etzsxcurkrjfmanhrgou.supabase.co",
		key: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder",
	},
	{
		name: "supabase-purple-zebra",
		url: "https://gtomvmymfcjswvxuclii.supabase.co",
		key: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder",
	},
	{
		name: "airbearme-project",
		url: "https://xckggdmqfqajatytmiko.supabase.co",
		key: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder",
	},
];

async function check(creds) {
	console.log("Testing:", creds.name, creds.url);
	const supabase = createClient(creds.url, creds.key);
	try {
		const { data, error } = await supabase.from("users").select("id").limit(1);
		if (error) {
			console.log("❌ Error:", error.message);
			// Try auth check
			const { data: auth, error: authErr } =
				await supabase.auth.admin.listUsers();
			if (authErr) {
				console.log("❌ Auth Error:", authErr.message);
			} else {
				console.log("✅ Auth Connected! Users:", auth.users.length);
			}
		} else {
			console.log("✅ Connected! Data access OK");
		}
	} catch (e) {
		console.log("timeout/fetch failed", e.message);
	}
}

async function run() {
	for (const c of credentials) {
		await check(c);
		console.log("---");
	}
}

run();
