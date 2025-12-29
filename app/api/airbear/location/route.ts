import { getSupabaseServer } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const supabase = await getSupabaseServer();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is a driver
    const { data: userProfile } = await supabase
      .from("users")
      .select("role, assigned_airbear_id")
      .eq("id", user.id)
      .single();

    if (
      !userProfile ||
      userProfile.role !== "driver" ||
      !userProfile.assigned_airbear_id
    ) {
      return NextResponse.json(
        { error: "Not authorized as driver" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { latitude, longitude, heading, battery_level } = body;

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
      .single();

    if (error) {
      console.error("[v0] Error updating location:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("[v0] API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
