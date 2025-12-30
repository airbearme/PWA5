import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await getSupabaseServer();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rideId = params.id;

    // Check if ride exists and belongs to driver
    const { data: ride, error: rideError } = await supabase
      .from("rides")
      .select("*")
      .eq("id", rideId)
      .eq("driver_id", user.id)
      .single();

    if (rideError || !ride) {
      return NextResponse.json(
        { error: "Ride not found or unauthorized" },
        { status: 404 }
      );
    }

    if (!["accepted", "in_progress"].includes(ride.status)) {
      return NextResponse.json(
        { error: "Ride cannot be completed in current state" },
        { status: 400 }
      );
    }

    // Update ride status
    const { data: updatedRide, error: updateError } = await supabase
      .from("rides")
      .update({
        status: "completed",
        completed_at: new Date().toISOString(),
      })
      .eq("id", rideId)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json(
        { error: updateError.message || "Failed to complete ride" },
        { status: 400 }
      );
    }

    // Update AirBear availability
    if (ride.airbear_id) {
      await supabase
        .from("airbears")
        .update({ is_available: true })
        .eq("id", ride.airbear_id);
    }

    return NextResponse.json({ ride: updatedRide });
  } catch (error: any) {
    console.error("Error completing ride:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}



