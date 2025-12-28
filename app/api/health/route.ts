import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    
    // Check database connectivity
    const { error: dbError } = await supabase
      .from("spots")
      .select("id")
      .limit(1);

    const health = {
      status: dbError ? "unhealthy" : "healthy",
      timestamp: new Date().toISOString(),
      services: {
        database: dbError ? "unhealthy" : "healthy",
        api: "healthy",
      },
      version: process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0",
      ...(dbError && { error: dbError.message }),
    };

    const statusCode = dbError ? 503 : 200;

    return NextResponse.json(health, { status: statusCode });
  } catch (error: any) {
    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        error: error.message,
      },
      { status: 503 }
    );
  }
}
