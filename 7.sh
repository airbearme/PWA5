#!/usr/bin/env bash
set -Eeuo pipefail
trap 'on_int' INT
trap 'on_err' ERR

###############################################################################
# 7.sh — AIRBEAR ULTIMATE FINAL OCS (HARDENED + LAZY + IDEMPOTENT)
# Materializes a complete autonomous quality/security/deploy system + app hardening.
# Writes code + workflows + scripts + docs. Safe to rerun forever. No surprise prod deploys.
#
# Modes:
#   WRITE_ONLY=1  (default) : only writes artifacts
#   RUN_LOCAL=0   (default) : if 1, also runs non-destructive checks (lint/type/build) when available
#
# CI note: workflows include live integrations; enable by setting GitHub/Vercel/Supabase secrets.
###############################################################################

WRITE_ONLY="${WRITE_ONLY:-1}"
RUN_LOCAL="${RUN_LOCAL:-0}"

ROOT="$PWD"
RUN_ID="AIRBEAR-ULTIMATE-$(date +%Y%m%d-%H%M%S)"
OUT="reports/airbear/$RUN_ID"
LATEST="reports/airbear/latest"
ERR_LOG="$OUT/errors.log"
RUN_LOG="$OUT/run.log"
META_JSON="$OUT/meta.json"
WRITE_COUNT=0

START_TS=$(date +%s)
TOTAL=64
STEP=0

###############################################################################
# UI / LOGGING
###############################################################################
ts(){ date +"%H:%M:%S"; }
c_reset=$'\033[0m'
c_red=$'\033[31m'
c_grn=$'\033[32m'
c_ylw=$'\033[33m'
c_blu=$'\033[34m'
c_cyn=$'\033[36m'
c_dim=$'\033[2m'

log(){ echo "[$(ts)] $*"; }
ok(){ echo "${c_grn}[$(ts)] $*${c_reset}"; }
warn(){ echo "${c_ylw}[$(ts)] $*${c_reset}"; }
info(){ echo "${c_cyn}[$(ts)] $*${c_reset}"; }
die(){ echo "${c_red}[$(ts)] $*${c_reset}"; echo "[$(ts)] $*" >> "$ERR_LOG"; exit 1; }
ci_notice(){ echo "::notice::$*"; }
ci_warn(){ echo "::warning::$*"; }
ci_err(){ echo "::error::$*"; }

progress(){
  local pct=$(( STEP * 100 / TOTAL ))
  local elapsed=$(( $(date +%s) - START_TS ))
  local eta=$(( STEP>0 ? elapsed*(TOTAL-STEP)/STEP : 0 ))
  local bars=$(( pct/2 ))
  printf "%s" "${c_dim}"
  printf "\n[%02d/%02d] %3d%% | elapsed:%4ss | eta:%4ss | writes:%s\n" "$STEP" "$TOTAL" "$pct" "$elapsed" "$eta" "$WRITE_COUNT"
  printf "Progress: ["
  for i in $(seq 1 50); do
    if (( i <= bars )); then printf "#"; else printf "-"; fi
  done
  printf "]%s\n" "$c_reset"
}

step(){
  STEP=$((STEP+1))
  progress
  info "STEP $STEP → $1"
  ci_notice "STEP $STEP/$TOTAL: $1"
}

write(){
  local path="$1"
  mkdir -p "$(dirname "$path")"
  cat > "$path"
  WRITE_COUNT=$((WRITE_COUNT+1))
  log "wrote → $path"
}

safe_ln_latest(){
  mkdir -p "reports/airbear"
  ln -sfn "$OUT" "$LATEST"
}

on_int(){
  die "Interrupted"
}

on_err(){
  die "Failed at step $STEP (see $RUN_LOG)"
}

###############################################################################
# BOOTSTRAP OUTPUT + ERROR LOG ALWAYS EXISTS
###############################################################################
mkdir -p "$OUT"
safe_ln_latest
: > "$RUN_LOG"
exec > >(tee "$RUN_LOG") 2>&1

{
  echo "=================================================="
  echo "AirBear ULTIMATE OCS Error Log"
  echo "Run ID: $RUN_ID"
  echo "Started: $(date -Is)"
  echo "Root: $ROOT"
  echo "=================================================="
  echo
} > "$ERR_LOG"

cat > "$META_JSON" <<JSON
{"run_id":"$RUN_ID","started":"$(date -Is)","root":"$ROOT","write_only":$WRITE_ONLY,"run_local":$RUN_LOCAL}
JSON

ok "AirBear ULTIMATE OCS starting"
info "Output → $OUT"
info "Latest → $LATEST"
info "WRITE_ONLY=$WRITE_ONLY RUN_LOCAL=$RUN_LOCAL"

###############################################################################
# SANITY
###############################################################################
step "Sanity checks"
[[ -f package.json ]] || die "Run from repo root (package.json missing)"
command -v node >/dev/null || die "node missing"
command -v pnpm >/dev/null || warn "pnpm missing (CI workflows will install pnpm); local run steps may be skipped"

###############################################################################
# 1) APP HARDENING CORE (CSP, headers, flags, rate limits, PII scrub, logger)
###############################################################################
step "App hardening core libs"
write lib/security-headers.ts <<'TS'
export const CSP = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data: https:",
  "style-src 'self' 'unsafe-inline' https:",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https:", // tighten after removing inline/eval usage
  "connect-src 'self' https: wss:",
  "upgrade-insecure-requests",
].join("; ");

export const SECURITY_HEADERS: Record<string, string> = {
  "Content-Security-Policy": CSP,
  "Referrer-Policy": "no-referrer",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "0",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=()",
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
  "Cross-Origin-Opener-Policy": "same-origin",
  "Cross-Origin-Resource-Policy": "same-site",
  "Cross-Origin-Embedder-Policy": "credentialless",
};
TS

write lib/flags.ts <<'TS'
export const flags = {
  killSwitch: process.env.NEXT_PUBLIC_KILL_SWITCH === "1",
  canary: process.env.NEXT_PUBLIC_CANARY === "1",
};
TS

write lib/rate-limit.ts <<'TS'
type Bucket = { resetAt: number; count: number };
const buckets = new Map<string, Bucket>();

export function rateLimit(key: string, limit = 60, windowMs = 60_000) {
  const now = Date.now();
  const b = buckets.get(key) ?? { resetAt: now + windowMs, count: 0 };
  if (now > b.resetAt) { b.resetAt = now + windowMs; b.count = 0; }
  b.count++;
  buckets.set(key, b);
  return b.count <= limit;
}
TS

write lib/pii.ts <<'TS'
const EMAIL = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;
const PHONE = /\b(?:\+?1[\s.-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}\b/g;
export function scrubPII(input: unknown) {
  let s: string;
  try { s = typeof input === "string" ? input : JSON.stringify(input); }
  catch { s = String(input); }
  return s.replace(EMAIL, "[email]").replace(PHONE, "[phone]");
}
TS

step "Observability logger"
write observability/logger.ts <<'TS'
export function log(event: Record<string, unknown>) {
  // eslint-disable-next-line no-console
  console.log(JSON.stringify({ ts: new Date().toISOString(), ...event }));
}
TS

###############################################################################
# 2) STRICT ENV + ADMIN SUPABASE CLIENT
###############################################################################
step "Strict env contract + supabase admin client"
write lib/env.ts <<'TS'
import { z } from "zod";

const pub = z.object({
  NODE_ENV: z.enum(["development","test","production"]).default("development"),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(20),
  NEXT_PUBLIC_KILL_SWITCH: z.string().optional(),
  NEXT_PUBLIC_CANARY: z.string().optional(),
});

const srv = z.object({
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(20),
  ERROR_INGEST_TOKEN: z.string().min(16),
  STRIPE_WEBHOOK_SECRET: z.string().min(10),
  STRIPE_SECRET_KEY: z.string().min(10),
});

export const env = { ...pub.parse(process.env), ...srv.parse(process.env) };
TS

write lib/supabase-admin.ts <<'TS'
import { createClient } from "@supabase/supabase-js";
import { env } from "./env";

export const supabaseAdmin = () =>
  createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
TS

###############################################################################
# 3) MIDDLEWARE HARDENING TEMPLATE
###############################################################################
step "Middleware hardened template (kill switch + matcher)"
write middleware.hardened.ts <<'TS'
import { NextResponse, type NextRequest } from "next/server";
import { flags } from "./lib/flags";

export function middleware(req: NextRequest) {
  const p = req.nextUrl.pathname;

  if (flags.killSwitch && !p.startsWith("/api/")) {
    const url = req.nextUrl.clone();
    url.pathname = "/maintenance";
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
TS

###############################################################################
# 4) NEXT CONFIG HARDENED TEMPLATE
###############################################################################
step "Next config hardened template (headers)"
write next.config.hardened.mjs <<'MJS'
import { SECURITY_HEADERS } from "./lib/security-headers.js";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  eslint: { ignoreDuringBuilds: false },
  typescript: { ignoreBuildErrors: false },
  async headers() {
    return [
      { source: "/(.*)", headers: Object.entries(SECURITY_HEADERS).map(([k,v]) => ({ key: k, value: v })) }
    ];
  },
};

export default nextConfig;
MJS

###############################################################################
# 5) TELEMETRY API (ERRORS + SUGGESTIONS) HARDENED
###############################################################################
step "Telemetry APIs (errors + suggestions) hardened"
mkdir -p app/api/client-error app/api/suggestion

write app/api/client-error/route.ts <<'TS'
import { NextResponse } from "next/server";
import crypto from "crypto";
import { env } from "'lib/env"' (see below for file content);
import { supabaseAdmin } from "'lib/supabase-admin"' (see below for file content);
import { rateLimit } from "'lib/rate-limit"' (see below for file content);
import { scrubPII } from "'lib/pii"' (see below for file content);
import { log } from "'observability/logger"' (see below for file content);

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
TS

write app/api/suggestion/route.ts <<'TS'
import { NextResponse } from "next/server";
import crypto from "crypto";
import { env } from "'lib/env"' (see below for file content);
import { supabaseAdmin } from "'lib/supabase-admin"' (see below for file content);
import { rateLimit } from "'lib/rate-limit"' (see below for file content);
import { scrubPII } from "'lib/pii"' (see below for file content);
import { log } from "'observability/logger"' (see below for file content);

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
TS

###############################################################################
# 6) STRIPE WEBHOOK HARDENING (RAW BODY, SIGNATURE VERIFY, IDEMPOTENT HOOK)
###############################################################################
step "Stripe webhook hardened (verify + idempotency hook)"
mkdir -p app/api/stripe/webhook
write app/api/stripe/webhook/route.ts <<'TS'
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { env } from "'lib/env"' (see below for file content);
import { log } from "'observability/logger"' (see below for file content);

export const runtime = "nodejs";

const stripe = new Stripe(env.STRIPE_SECRET_KEY, { apiVersion: "2024-06-20" as any });

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");
  if (!sig) return NextResponse.json({ ok: false }, { status: 400 });

  const raw = await req.text(); // raw body required
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(raw, sig, env.STRIPE_WEBHOOK_SECRET);
  } catch (e: any) {
    log({ kind: "stripe_webhook_verify_failed", error: String(e?.message || e) });
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  // TODO: enforce idempotency using event.id persistence (recommended: table stripe_events with unique(event_id))
  log({ kind: "stripe_event_received", type: event.type, id: event.id });

  return NextResponse.json({ ok: true });
}
TS

###############################################################################
# 7) SUPABASE MIGRATIONS (telemetry tables + strict RLS)
###############################################################################
step "Supabase migration (telemetry tables + strict RLS)"
mkdir -p supabase/migrations
write "supabase/migrations/$(date +%Y%m%d%H%M%S)_telemetry_hardened.sql" <<'SQL'
create table if not exists public.client_error_reports (
  id bigserial primary key,
  created_at timestamptz not null default now(),
  hash text not null,
  url text not null default '',
  message text not null default '',
  stack text not null default '',
  user_agent text not null default '',
  severity text not null default 'error',
  app_version text not null default '',
  git_sha text not null default '',
  meta jsonb
);
create unique index if not exists client_error_reports_hash_uq on public.client_error_reports(hash);
create index if not exists client_error_reports_created_at_idx on public.client_error_reports(created_at desc);

create table if not exists public.user_suggestions (
  id bigserial primary key,
  created_at timestamptz not null default now(),
  hash text not null,
  page text not null default '',
  text text not null
);
create unique index if not exists user_suggestions_hash_uq on public.user_suggestions(hash);
create index if not exists user_suggestions_created_at_idx on public.user_suggestions(created_at desc);

alter table public.client_error_reports enable row level security;
alter table public.user_suggestions enable row level security;

-- No client policies: service_role writes only (server-side).
SQL

###############################################################################
# 8) BUDGETS (baseline + compare)
###############################################################################
step "Build budgets (baseline + compare)"
mkdir -p scripts .airbear
write scripts/budget-baseline.mjs <<'JS'
import fs from "fs";
import path from "path";
const dir = path.join(process.cwd(), ".next", "static", "chunks");
if (!fs.existsSync(dir)) { console.error("missing .next; run build before baselining"); process.exit(1); }
const walk = (d) => fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>{
  const p=path.join(d,e.name); return e.isDirectory()?walk(p):[p];
});
const files = walk(dir).filter(f=>f.endsWith(".js"));
let total=0;
for (const f of files) total += fs.statSync(f).size;
fs.mkdirSync(".airbear",{recursive:true});
fs.writeFileSync(".airbear/budget-baseline.json", JSON.stringify({created_at:new Date().toISOString(), total_bytes: total}, null, 2));
console.log("wrote .airbear/budget-baseline.json", total);
JS

write scripts/budget-compare.mjs <<'JS'
import fs from "fs";
import path from "path";
const basePath = path.join(process.cwd(), ".airbear", "budget-baseline.json");
if (!fs.existsSync(basePath)) { console.error("missing baseline"); process.exit(2); }
const base = JSON.parse(fs.readFileSync(basePath,"utf8"));
const dir = path.join(process.cwd(), ".next", "static", "chunks");
if (!fs.existsSync(dir)) { console.error("missing .next; run build"); process.exit(1); }
const walk = (d) => fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>{
  const p=path.join(d,e.name); return e.isDirectory()?walk(p):[p];
});
const files = walk(dir).filter(f=>f.endsWith(".js"));
let total=0;
for (const f of files) total += fs.statSync(f).size;
const maxPct = Number(process.env.BUDGET_MAX_GROWTH_PCT || "5");
const max = Math.floor(base.total_bytes * (1 + maxPct/100));
console.log(`baseline=${base.total_bytes} current=${total} max=${max} (+${maxPct}%)`);
if (total > max) process.exit(3);
JS

###############################################################################
# 9) CONTRACT SNAPSHOTS + VISUAL + FLAKY QUARANTINE (materialized scripts)
###############################################################################
step "Contract snapshot + visual + flaky quarantine scripts"
write scripts/snapshot-contracts.mjs <<'JS'
import fs from "fs";
import path from "path";
fs.mkdirSync("contracts",{recursive:true});
const out = { generated_at: new Date().toISOString(), note: "Populate with OpenAPI/JSON schema snapshots." };
fs.writeFileSync(path.join("contracts","README.json"), JSON.stringify(out,null,2));
console.log("contracts snapshot stub written");
JS

write scripts/quarantine-flaky.mjs <<'JS'
console.log("Flaky quarantine stub: integrate Playwright retries + label tests. No-op by default.");
JS

###############################################################################
# 10) GOVERNANCE (CODEOWNERS, templates, dependabot)
###############################################################################
step "Repo governance (CODEOWNERS/templates/dependabot)"
mkdir -p .github/ISSUE_TEMPLATE .github/workflows

write .github/CODEOWNERS <<'TXT'
* @airbearme/core
.github/workflows/ @airbearme/devops
supabase/ @airbearme/db
app/api/ @airbearme/backend
components/ @airbearme/frontend
TXT

write .github/pull_request_template.md <<'MD'
## Summary
-

## Checklist
- [ ] Typecheck
- [ ] Build
- [ ] E2E (if applicable)
- [ ] No secrets
- [ ] DB/RLS verified (if applicable)
MD

write .github/ISSUE_TEMPLATE/bug.yml <<'YML'
name: Bug
description: Something broke
title: "[bug] "
labels: ["bug","triage"]
body:
  - type: textarea
    id: steps
    attributes: { label: Steps to reproduce }
    validations: { required: true }
  - type: textarea
    id: expected
    attributes: { label: Expected vs actual }
    validations: { required: true }
  - type: textarea
    id: logs
    attributes: { label: Logs }
YML

write .github/ISSUE_TEMPLATE/feature.yml <<'YML'
name: Feature
description: Request / idea
title: "[feature] "
labels: ["feature","triage"]
body:
  - type: textarea
    id: proposal
    attributes: { label: Proposal }
    validations: { required: true }
YML

write .github/dependabot.yml <<'YML'
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule: { interval: "daily" }
    open-pull-requests-limit: 10
  - package-ecosystem: "github-actions"
    directory: "/"
    schedule: { interval: "weekly" }
YML

###############################################################################
# 11) CI: STRICT QUALITY GATE + SECURITY + SBOM + LHCI + A11Y + E2E + PREVIEW
###############################################################################
step "CI workflows (quality/security/sbom/lhci/a11y/e2e/preview)"
write .github/workflows/airbear-quality.yml <<'YML'
name: AirBear Quality Gate (Strict)
on: [push, pull_request, workflow_dispatch]
permissions: { contents: read }
jobs:
  gate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
        with: { version: 9 }
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: "pnpm" }
      - run: pnpm install
      - run: npx -y @biomejs/biome check .
      - run: pnpm run lint
      - run: pnpm run type-check
      - run: pnpm run build
      - run: node scripts/budget-compare.mjs
        env: { BUDGET_MAX_GROWTH_PCT: "5" }
YML

write .github/workflows/airbear-dep-review.yml <<'YML'
name: AirBear Dependency Review
on: [pull_request]
permissions: { contents: read }
jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/dependency-review-action@v4
YML

write .github/workflows/airbear-codeql.yml <<'YML'
name: AirBear CodeQL
on:
  push: { branches: ["main"] }
  pull_request:
  schedule: [{ cron: "27 6 * * 1" }]
permissions:
  security-events: write
  contents: read
jobs:
  analyze:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: github/codeql-action/init@v3
        with: { languages: "javascript-typescript" }
      - uses: github/codeql-action/analyze@v3
YML

write .github/workflows/airbear-gitleaks.yml <<'YML'
name: AirBear Gitleaks
on: [push, pull_request]
permissions: { contents: read }
jobs:
  gitleaks:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: gitleaks/gitleaks-action@v2
        env: { GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }} }
YML

write .github/workflows/airbear-trivy.yml <<'YML'
name: AirBear Trivy FS
on: [pull_request, workflow_dispatch, schedule]
permissions: { contents: read }
jobs:
  trivy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: aquasecurity/trivy-action@0.28.0
        with:
          scan-type: "fs"
          format: "table"
          exit-code: "1"
          severity: "CRITICAL,HIGH"
YML

write .github/workflows/airbear-semgrep.yml <<'YML'
name: AirBear Semgrep
on: [pull_request, workflow_dispatch]
permissions: { contents: read }
jobs:
  semgrep:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: returntocorp/semgrep-action@v1
        with: { config: "auto" }
YML

write .github/workflows/airbear-osv.yml <<'YML'
name: AirBear OSV
on: [pull_request, workflow_dispatch, schedule]
permissions: { contents: read }
jobs:
  osv:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: |
          npm i -g @google/osv-scanner
          osv-scanner scan --lockfile .
YML

write .github/workflows/airbear-e2e.yml <<'YML'
name: AirBear E2E
on: [pull_request, workflow_dispatch, schedule]
permissions: { contents: read }
jobs:
  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
        with: { version: 9 }
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: "pnpm" }
      - run: pnpm install
      - run: pnpm run build
      - run: pnpm run test:e2e
      - run: node scripts/quarantine-flaky.mjs || true
YML

write lighthouserc.json <<'JSON'
{
  "ci": {
    "collect": { "numberOfRuns": 1, "startServerCommand": "pnpm start", "url": ["http://localhost:3000/"] },
    "assert": {
      "assertions": {
        "categories:performance": ["warn", { "minScore": 0.85 }],
        "categories:accessibility": ["warn", { "minScore": 0.9 }]
      }
    },
    "upload": { "target": "temporary-public-storage" }
  }
}
JSON

write .github/workflows/airbear-lhci.yml <<'YML'
name: AirBear Lighthouse CI
on: [workflow_dispatch, schedule]
permissions: { contents: read }
jobs:
  lhci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
        with: { version: 9 }
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: "pnpm" }
      - run: pnpm install
      - run: pnpm run build
      - run: pnpm add -D @lhci/cli
      - run: |
          pnpm start &
          npx lhci autorun
YML

write .github/workflows/airbear-preview.yml <<'YML'
name: AirBear Preview Deploy (Vercel)
on: [pull_request]
permissions:
  contents: read
  pull-requests: write
jobs:
  preview:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
        with: { version: 9 }
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: "pnpm" }
      - run: pnpm install
      - run: pnpm run build
      - name: Deploy Preview
        id: deploy
        run: |
          npm i -g vercel
          url=$(vercel --token "${{ secrets.VERCEL_TOKEN }}" --confirm --scope "${{ secrets.VERCEL_SCOPE }}" | tail -n 1)
          echo "url=$url" >> $GITHUB_OUTPUT
      - name: Comment Preview URL
        uses: actions/github-script@v7
        with:
          script: |
            const url = "${{ steps.deploy.outputs.url }}";
            if (!url) return;
            await github.rest.issues.createComment({
              owner: context.repo.owner,
              repo: context.repo.repo,
              issue_number: context.issue.number,
              body: `Preview deployed: ${url}`
            });
YML

###############################################################################
# 12) DEPLOY: STAGING + PROD GUARDED + ROLLBACK
###############################################################################
step "Deploy workflows (staging + prod guarded + rollback)"
write .github/workflows/airbear-deploy-staging.yml <<'YML'
name: AirBear Deploy Staging (Guarded)
on: { workflow_dispatch: {} }
permissions: { contents: read }
jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: staging
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
        with: { version: 9 }
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: "pnpm" }
      - run: pnpm install
      - run: pnpm run type-check
      - run: pnpm run build
      - run: |
          npm i -g vercel
          vercel --token "${{ secrets.VERCEL_TOKEN }}" --confirm --scope "${{ secrets.VERCEL_SCOPE }}"
YML

write .github/workflows/airbear-deploy-prod.yml <<'YML'
name: AirBear Deploy Production (Guarded)
on: { workflow_dispatch: {} }
permissions: { contents: read }
jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: production
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
        with: { version: 9 }
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: "pnpm" }
      - run: pnpm install
      - run: pnpm run type-check
      - run: pnpm run build
      - run: |
          npm i -g vercel
          vercel --prod --token "${{ secrets.VERCEL_TOKEN }}" --confirm --scope "${{ secrets.VERCEL_SCOPE }}"
YML

write .github/workflows/airbear-rollback.yml <<'YML'
name: AirBear Rollback (Manual Promote)
on:
  workflow_dispatch:
    inputs:
      deployment_url:
        description: "Previous Vercel deployment URL to promote"
        required: true
permissions: { contents: read }
jobs:
  rollback:
    runs-on: ubuntu-latest
    environment: production
    steps:
      - run: |
          npm i -g vercel
          vercel alias set "${{ inputs.deployment_url }}" "${{ secrets.VERCEL_PROD_ALIAS }}" \
            --token "${{ secrets.VERCEL_TOKEN }}" --scope "${{ secrets.VERCEL_SCOPE }}"
YML

###############################################################################
# 13) AUTOFIX PR + AUTONOMOUS ORCHESTRATOR
###############################################################################
step "Autofix PR + autonomous dispatcher"
write .github/workflows/airbear-autofix-pr.yml <<'YML'
name: AirBear Scheduled Autofix PR
on:
  schedule: [{ cron: "17 8 * * *" }]
  workflow_dispatch:
permissions:
  contents: write
  pull-requests: write
jobs:
  autofix:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with: { fetch-depth: 0 }
      - uses: pnpm/action-setup@v3
        with: { version: 9 }
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: "pnpm" }
      - run: pnpm install
      - run: npx -y @biomejs/biome check --write .
      - run: npx -y eslint . --fix || true
      - run: pnpm run type-check || true
      - run: pnpm run build || true
      - name: Open PR if changes
        uses: actions/github-script@v7
        with:
          script: |
            const { execSync } = require("child_process");
            const status = execSync("git status --porcelain=v1").toString().trim();
            if (!status) { core.info("No changes."); return; }
            const branch = `bot/autofix-${new Date().toISOString().slice(0,10)}`;
            execSync(`git checkout -b ${branch}`);
            execSync("git add -A");
            execSync(`git commit -m "chore: scheduled autofix"`);
            execSync(`git push origin ${branch}`);
            await github.rest.pulls.create({
              owner: context.repo.owner,
              repo: context.repo.repo,
              title: "chore: scheduled autofix",
              head: branch,
              base: "main",
              body: "Automated formatting/lint/type fixes (PR-based)."
            });
YML

write scripts/triage-from-supabase.mjs <<'JS'
import https from "https";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO = process.env.GITHUB_REPOSITORY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !GITHUB_TOKEN || !REPO) {
  console.error("missing env SUPABASE_URL SUPABASE_SERVICE_ROLE_KEY GITHUB_TOKEN GITHUB_REPOSITORY");
  process.exit(1);
}

function req(url, opts={}, body){
  return new Promise((resolve,reject)=>{
    const u=new URL(url);
    const r=https.request({
      method: opts.method||"GET",
      hostname: u.hostname,
      path: u.pathname+u.search,
      headers: opts.headers||{},
    }, res=>{
      let d=""; res.on("data",c=>d+=c);
      res.on("end",()=>resolve({status:res.status, text:d}));
    });
    r.on("error",reject);
    if(body) r.write(JSON.stringify(body));
    r.end();
  });
}

async function supa(table){
  const url = `${SUPABASE_URL}/rest/v1/${table}?select=*&order=created_at.desc&limit=25`;
  const r = await req(url, { headers: {
    apikey: SUPABASE_SERVICE_ROLE_KEY,
    authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
    "content-type":"application/json",
  }});
  if(r.status!==200) throw new Error(`supabase ${table} status=${r.status}`);
  return JSON.parse(r.text||"[]");
}

async function issueSearch(hash){
  const url = `https://api.github.com/search/issues?q=repo:${REPO}+label:hash:${hash}`;
  const r = await req(url, { headers:{
    authorization:`Bearer ${GITHUB_TOKEN}`,
    accept:"application/vnd.github+json",
    "user-agent":"airbear-triage-bot"
  }});
  if(r.status!==200) return null;
  const j=JSON.parse(r.text||"{}");
  return (j.items||[])[0]||null;
}

async function createIssue(title, body, hash, labels){
  const url = `https://api.github.com/repos/${REPO}/issues`;
  const r = await req(url, { method:"POST", headers:{
    authorization:`Bearer ${GITHUB_TOKEN}`,
    accept:"application/vnd.github+json",
    "content-type":"application/json",
    "user-agent":"airbear-triage-bot"
  }}, { title, body, labels:[...labels,`hash:${hash}`] });
  if(r.status!==201) throw new Error(`issue create status=${r.status}`);
  return JSON.parse(r.text);
}

(async()=>{
  const errs = await supa("client_error_reports");
  for(const e of errs){
    if(!e.hash) continue;
    const existing = await issueSearch(e.hash);
    if(existing) continue;
    const title = `[client-error] ${String(e.message||"error").slice(0,80)}`;
    const body = [`**url**: ${e.url||""}`,`**severity**: ${e.severity||""}`,`**hash**: ${e.hash}`,``,mdjson(e)].join("\n");
    await createIssue(title, body, e.hash, ["triage","auto","bug"]);
  }

  const sugg = await supa("user_suggestions");
  for(const s of sugg){
    if(!s.hash) continue;
    const existing = await issueSearch(s.hash);
    if(existing) continue;
    const title = `[suggestion] ${String(s.text||"suggestion").slice(0,80)}`;
    const body = [`**page**: ${s.page||""}`,`**hash**: ${s.hash}`,``,mdjson(s)].join("\n");
    await createIssue(title, body, s.hash, ["triage","auto","feature"]);
  }
})();
JS

write .github/workflows/airbear-triage.yml <<'YML'
name: AirBear Error/Suggestion Triage
on:
  schedule: [{ cron: "11 * * * *" }]
  workflow_dispatch:
permissions:
  issues: write
  contents: read
jobs:
  triage:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22 }
      - run: node scripts/triage-from-supabase.mjs
        env:
          SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          SUPABASE_SERVICE_ROLE_KEY: ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
YML

write .github/workflows/airbear-autonomous.yml <<'YML'
name: AirBear Autonomous Loop
on:
  schedule: [{ cron: "*/15 * * * *" }]
  workflow_dispatch:
permissions: { contents: read }
jobs:
  dispatch:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/github-script@v7
        with:
          script: |
            const w = async (id) => github.rest.actions.createWorkflowDispatch({
              owner: context.repo.owner, repo: context.repo.repo, workflow_id: id, ref: "main"
            });
            await w("airbear-autofix-pr.yml");
            await w("airbear-triage.yml");
YML

###############################################################################
# 14) SBOM + LICENSE ALLOWLIST
###############################################################################
step "SBOM + license allowlist"
mkdir -p .airbear
write .airbear/license-allowlist.txt <<'TXT'
MIT
Apache-2.0
BSD-2-Clause
BSD-3-Clause
ISC
CC0-1.0
Unlicense
TXT

write .github/workflows/airbear-sbom.yml <<'YML'
name: AirBear SBOM
on: [pull_request, workflow_dispatch, schedule]
permissions: { contents: read }
jobs:
  sbom:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
        with: { version: 9 }
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: "pnpm" }
      - run: pnpm install
      - run: pnpm add -D @cyclonedx/cyclonedx-npm
      - run: npx cyclonedx-npm --output-file sbom.json
      - uses: actions/upload-artifact@v4
        with: { name: sbom, path: sbom.json }
YML

###############################################################################
# 15) SECRETS DOC (authoritative)
###############################################################################
step "Secrets + env documentation"
write .airbear/SECRETS_REQUIRED.md <<'MD'
## GitHub Secrets (required for full automation)
- SUPABASE_URL
- SUPABASE_SERVICE_ROLE_KEY
- VERCEL_TOKEN
- VERCEL_SCOPE
- VERCEL_PROD_ALIAS

## Runtime Environment (Vercel/hosting)
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY
- ERROR_INGEST_TOKEN
- STRIPE_SECRET_KEY
- STRIPE_WEBHOOK_SECRET

## Optional Runtime
- NEXT_PUBLIC_KILL_SWITCH=1  (maintenance)
- NEXT_PUBLIC_CANARY=1
MD

###############################################################################
# 16) ANTICIPATED PROMPTS (1–100) MATERIALIZED AS ACTIONABLE ITEMS
###############################################################################
step "Anticipated prompts 1–100 (materialized plan + toggles)"
write .airbear/ANTICIPATE_100.md <<'MD'
# Anticipate 100 — Materialized Backlog (Actions, not chat)

Each item is an artifact, gate, or script already present in this repo after running 7.sh, or is a clearly scoped follow-up.

1. Strict Quality Gate → `.github/workflows/airbear-quality.yml`
2. Scheduled Autofix PR → `.github/workflows/airbear-autofix-pr.yml`
3. Telemetry ingest endpoints → `app/api/client-error`, `app/api/suggestion`
4. Supabase telemetry schema + RLS → `supabase/migrations/*telemetry_hardened.sql`
5. Triage telemetry → GitHub Issues → `.github/workflows/airbear-triage.yml` + `scripts/triage-from-supabase.mjs`
6. Preview deploy on PR → `.github/workflows/airbear-preview.yml`
7. Staging deploy guarded → `.github/workflows/airbear-deploy-staging.yml`
8. Prod deploy guarded → `.github/workflows/airbear-deploy-prod.yml`
9. Rollback promote guarded → `.github/workflows/airbear-rollback.yml`
10. Security headers + CSP → `lib/security-headers.ts` + `next.config.hardened.mjs`
11. Middleware kill-switch template → `middleware.hardened.ts`
12. Rate limiting → `lib/rate-limit.ts`
13. PII scrub → `lib/pii.ts`
14. Structured logs → `observability/logger.ts`
15. Stripe webhook verify → `app/api/stripe/webhook`
16. Dependency review → `.github/workflows/airbear-dep-review.yml`
17. CodeQL SAST → `.github/workflows/airbear-codeql.yml`
18. Gitleaks → `.github/workflows/airbear-gitleaks.yml`
19. Trivy FS scan → `.github/workflows/airbear-trivy.yml`
20. Semgrep → `.github/workflows/airbear-semgrep.yml`
21. OSV scanner → `.github/workflows/airbear-osv.yml`
22. E2E pipeline → `.github/workflows/airbear-e2e.yml`
23. LHCI budgets → `.github/workflows/airbear-lhci.yml` + `lighthouserc.json`
24. Budgets baseline/compare → `scripts/budget-baseline.mjs`, `scripts/budget-compare.mjs`
25. Flaky quarantine hook → `scripts/quarantine-flaky.mjs`
26. Contract snapshots stub → `scripts/snapshot-contracts.mjs`
27. SBOM generation → `.github/workflows/airbear-sbom.yml`
28. License allowlist → `.airbear/license-allowlist.txt`
29. CODEOWNERS → `.github/CODEOWNERS`
30. PR template → `.github/pull_request_template.md`
31–100. Additional hardening expansions: canary % rollout, RLS audit automation, perf regression diffing, visual diffs, release tagging, changelog, docs gen, database drift detection, schema linting, API contract enforcement, incident runbooks, DR drills. (All scoped; add on-demand when you request “harden + <area>”.)
MD

###############################################################################
# 17) OPTIONAL LOCAL RUN (non-destructive)
###############################################################################
step "Optional local run (non-destructive checks)"
if [[ "$RUN_LOCAL" == "1" && "$WRITE_ONLY" == "0" ]]; then
  if command -v pnpm >/dev/null; then
    ( pnpm install && pnpm run lint && pnpm run type-check && pnpm run build ) & spinner
    ok "Local checks complete"
  else
    warn "pnpm missing; skipped local checks"
  fi
else
  info "Skipped local execution (WRITE_ONLY=$WRITE_ONLY RUN_LOCAL=$RUN_LOCAL)"
fi

###############################################################################
# 18) FINALIZE (success footer + pointers)
###############################################################################
step "Finalize"
{
  echo
  echo "--------------------------------------------------"
  echo "Completed without errors"
  echo "Finished: $(date -Is)"
} >> "$ERR_LOG"

ok "ULTIMATE OCS complete"
info "Files written: $WRITE_COUNT"
info "Run log:  $RUN_LOG"
info "Err log:  $ERR_LOG"
info "Latest:   $LATEST"
warn "Adopt templates as needed: next.config.hardened.mjs, middleware.hardened.ts"

# End