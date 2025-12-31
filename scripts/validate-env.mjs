
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

dotenv.config({ path: '.env.local' });

async function validateSupabase() {
  console.log('Validating Supabase connection...');
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_PWA4_URL;
    const supabaseServiceKey = process.env.SUPABASE_PWA4_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Supabase URL or service key is missing.');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { data, error } = await supabase.from('users').select('*').limit(1);

    if (error && error.code !== '42P01') { // 42P01 means table does not exist, which is fine for a connection test
      throw error;
    }

    console.log('Supabase connection successful.');
    return true;
  } catch (error) {
    console..error('Supabase connection failed:', error.message);
    return false;
  }
}

async function validateStripe() {
  console.log('Validating Stripe connection...');
  try {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

    if (!stripeSecretKey) {
      throw new Error('Stripe secret key is missing.');
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16',
    });

    await stripe.customers.list({ limit: 1 });
    console.log('Stripe connection successful.');
    return true;
  } catch (error) {
    console.error('Stripe connection failed:', error.message);
    return false;
  }
}

async function main() {
  console.log('Starting environment validation...');

  const isSupabaseValid = await validateSupabase();
  const isStripeValid = await validateStripe();

  if (isSupabaseValid && isStripeValid) {
    console.log('All environment variables are configured correctly.');
    process.exit(0);
  } else {
    console.error('Environment validation failed.');
    process.exit(1);
  }
}

main();
