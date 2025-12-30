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

    // Check if ride exists and is pending
    const { data: ride, error: rideError } = await supabase
      .from("rides")
      .select("*")
      .eq("id", rideId)
      .single();

    if (rideError || !ride) {
      return NextResponse.json(
        { error: "Ride not found" },
        { status: 404 }
      );
    }

    if (ride.status !== "pending") {
      return NextResponse.json(
        { error: "Ride is no longer available" },
        { status: 400 }
      );
    }

    // Update ride with driver
    const { data: updatedRide, error: updateError } = await supabase
      .from("rides")
      .update({
        driver_id: user.id,
        status: "accepted",
        accepted_at: new Date().toISOString(),
      })
      .eq("id", rideId)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json(
        { error: updateError.message || "Failed to accept ride" },
        { status: 400 }
      );
    }

    return NextResponse.json({ ride: updatedRide });
  } catch (error: any) {
    console.error("Error accepting ride:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}



