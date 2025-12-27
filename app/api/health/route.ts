import { NextResponse } from "next/server"
import { getSupabaseServer } from "@/lib/supabase/server"
import { stripe } from "@/lib/stripe/server"

export async function GET() {
  const checks = {
    timestamp: new Date().toISOString(),
    status: "healthy",
    checks: {} as Record<string, { status: string; message?: string }>,
  }

  // Check Supabase connection
  try {
    const supabase = await getSupabaseServer()
    const { error } = await supabase.from("spots").select("count").limit(1).single()
    checks.checks.supabase = error
      ? { status: "unhealthy", message: error.message }
      : { status: "healthy" }
  } catch (error) {
    checks.checks.supabase = {
      status: "unhealthy",
      message: error instanceof Error ? error.message : "Unknown error",
    }
    checks.status = "unhealthy"
  }

  // Check Stripe connection
  try {
    await stripe.balance.retrieve()
    checks.checks.stripe = { status: "healthy" }
  } catch (error) {
    checks.checks.stripe = {
      status: "unhealthy",
      message: error instanceof Error ? error.message : "Unknown error",
    }
    checks.status = "unhealthy"
  }

  return NextResponse.json(checks, {
    status: checks.status === "healthy" ? 200 : 503,
  })
}