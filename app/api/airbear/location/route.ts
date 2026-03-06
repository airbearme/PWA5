import { getSupabaseServer } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { rateLimit } from "@/lib/rate-limit"
import { validateLocation } from "@/lib/utils/validators"

export async function POST(request: Request) {
  try {
    // Apply rate limiting by IP (handle comma-separated list of proxies)
    const xForwardedFor = request.headers.get("x-forwarded-for")
    const ip = xForwardedFor ? xForwardedFor.split(",")[0].trim() : "unknown"
    if (!rateLimit(`location-update-${ip}`, 30, 60000)) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 })
    }

    const supabase = await getSupabaseServer()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is a driver
    const { data: userProfile } = await supabase
      .from("users")
      .select("role, assigned_airbear_id")
      .eq("id", user.id)
      .single()

    if (!userProfile || userProfile.role !== "driver" || !userProfile.assigned_airbear_id) {
      return NextResponse.json({ error: "Not authorized as driver" }, { status: 403 })
    }

    const body = await request.json().catch(() => null)
    if (!body || !validateLocation(body)) {
      return NextResponse.json({ error: "Invalid location data" }, { status: 400 })
    }

    const { latitude, longitude, heading, battery_level } = body

    // Update airbear location
    const { data, error } = await supabase
      .from("airbears")
      .update({
        latitude,
        longitude,
        heading,
        battery_level,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userProfile.assigned_airbear_id)
      .select()
      .single()

    if (error) {
      console.error("[Sentinel] Error updating location:", error)
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    console.error("[Sentinel] API error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
