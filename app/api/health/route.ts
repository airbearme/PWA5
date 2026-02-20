import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Basic health check endpoint hardened to prevent information leakage
    return NextResponse.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    );
  }
}
