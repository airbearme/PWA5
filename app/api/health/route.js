import { NextResponse } from "next/server"

export async function GET() {
  const checks = {
    timestamp: new Date().toISOString(),
    status: "healthy",
    checks: {},
  }

  // Check environment variables (required for validation)
  const requiredEnvs = [
    "NEXT_PUBLIC_SUPABASE_PWA4_URL",
    "NEXT_PUBLIC_SUPABASE_PWA4_ANON_KEY",
    "SUPABASE_PWA4_SERVICE_ROLE_KEY",
    "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
    "STRIPE_SECRET_KEY",
    "NEXT_PUBLIC_SITE_URL",
    "NODE_ENV",
  ]

  let allEnvsPresent = true
  for (const env of requiredEnvs) {
    if (process.env[env]) {
      checks.checks[`env_${env}`] = { status: "healthy", message: "Present" }
    } else {
      checks.checks[`env_${env}`] = { status: "unhealthy", message: "Missing" }
      allEnvsPresent = false
    }
  }

  // Check Supabase configuration
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_PWA4_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PWA4_ANON_KEY
  if (supabaseUrl && supabaseKey && supabaseUrl.includes('supabase.co')) {
    checks.checks.supabase = { status: "healthy", message: "Configuration valid" }
  } else {
    checks.checks.supabase = { status: "unhealthy", message: "Invalid configuration" }
    allEnvsPresent = false
  }

  // Check Stripe configuration
  const stripeKey = process.env.STRIPE_SECRET_KEY
  if (stripeKey && stripeKey.startsWith('sk_')) {
    checks.checks.stripe = { status: "healthy", message: "Configuration valid" }
  } else {
    checks.checks.stripe = { status: "unhealthy", message: "Invalid configuration" }
    allEnvsPresent = false
  }

  // Overall environment check
  checks.checks.environment = allEnvsPresent
    ? { status: "healthy", message: "All required variables configured" }
    : { status: "unhealthy", message: "Some variables missing or invalid" }

  if (!allEnvsPresent) {
    checks.status = "unhealthy"
  }

  return NextResponse.json(checks, {
    status: checks.status === "healthy" ? 200 : 503,
  })
}