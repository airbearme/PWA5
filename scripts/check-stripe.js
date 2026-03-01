import Stripe from 'stripe';

/**
 * Stripe Connectivity Testing Script
 */

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

console.log("💳 Testing Stripe connectivity...\n");

if (!STRIPE_SECRET_KEY) {
	console.log("❌ Stripe secret key not found");
	process.exit(1);
}

async function testStripe() {
	try {
		const stripe = new Stripe(STRIPE_SECRET_KEY);
		const balance = await stripe.balance.retrieve();
		console.log("✅ Stripe connection successful");
		process.exit(0);
	} catch (error) {
		console.error("❌ Stripe test failed: " + error.message);
		process.exit(1);
	}
}

testStripe();
