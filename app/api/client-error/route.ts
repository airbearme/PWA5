import { NextResponse } from "next/server";
import crypto from "crypto";
import { env } from "@/lib/env";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { rateLimit } from "@/lib/rate-limit";
import { scrubPII } from "@/lib/pii";
import { log } from "@/observability/logger";

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!rateLimit(`err:${ip}`, 30, 60_000)) return NextResponse.json({ ok: false }, { status: 429 });

  const token = req.headers.get("x-airbear-ingest-token") || "";
  if (token !== env.ERROR_INGEST_TOKEN) return NextResponse.json({ ok: false }, { status: 401 });

  const body = await req.json().catch(() => null) as any;
  if (!body || typeof body !== "object") return NextResponse.json({ ok: false }, { status: 400 });

  const payload = {
    url: scrubPII(String(body.url || "")),
    message: scrubPII(String(body.message || "")),
    stack: scrubPII(String(body.stack || "")),
    user_agent: scrubPII(String(body.user_agent || "")),
    severity: String(body.severity || "error"),
    meta: body.meta ?? null,
    app_version: scrubPII(String(body.app_version || "")),
    git_sha: scrubPII(String(body.git_sha || "")),
  };

  const hash = crypto.createHash("sha256").update(JSON.stringify(payload)).digest("hex");
  const { error } = await supabaseAdmin().from("client_error_reports").insert({ ...payload, hash });
  if (error) {
    log({ kind: "telemetry_insert_failed", table: "client_error_reports", error: error.message });
    return NextResponse.json({ ok: false }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}