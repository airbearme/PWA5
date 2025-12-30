import { NextResponse } from "next/server";
import crypto from "crypto";
import { env } from "@/lib/env";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { rateLimit } from "@/lib/rate-limit";
import { scrubPII } from "@/lib/pii";
import { log } from "@/observability/logger";

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!rateLimit(`sug:${ip}`, 10, 60_000)) return NextResponse.json({ ok: false }, { status: 429 });

  const token = req.headers.get("x-airbear-ingest-token") || "";
  if (token !== env.ERROR_INGEST_TOKEN) return NextResponse.json({ ok: false }, { status: 401 });

  const body = await req.json().catch(() => null) as any;
  const text = scrubPII(String(body?.text || "")).trim();
  const page = scrubPII(String(body?.page || ""));
  if (!text) return NextResponse.json({ ok: false }, { status: 400 });

  const hash = crypto.createHash("sha256").update(text + "|" + page).digest("hex");
  const { error } = await supabaseAdmin().from("user_suggestions").insert({ text, page, hash });
  if (error) {
    log({ kind: "telemetry_insert_failed", table: "user_suggestions", error: error.message });
    return NextResponse.json({ ok: false }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}