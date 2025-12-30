import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const supabase = await getSupabaseServer();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { pickup_spot_id, dropoff_spot_id, fare, distance } = body;

    if (!pickup_spot_id || !dropoff_spot_id || !fare) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Find available AirBear
    const { data: availableAirbears } = await supabase
      .from("airbears")
      .select("id")
      .eq("is_available", true)
      .eq("is_charging", false)
      .limit(1);

    const airbearId = availableAirbears?.[0]?.id || null;

    // Create ride booking
    const { data: ride, error: rideError } = await supabase
      .from("rides")
      .insert({
        user_id: user.id,
        pickup_spot_id,
        dropoff_spot_id,
        airbear_id: airbearId,
        fare: parseFloat(fare),
        distance: distance ? parseFloat(distance) : null,
        status: "pending",
      })
      .select()
      .single();

    if (rideError) {
      console.error("Ride creation error:", rideError);
      return NextResponse.json(
        { error: rideError.message || "Failed to create ride" },
        { status: 400 }
      );
    }

    return NextResponse.json({ ride }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating ride:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}



