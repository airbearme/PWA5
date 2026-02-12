#!/usr/bin/env bash
set -Eeuo pipefail
trap 'echo "[!] interrupted"; exit 130' INT
trap 'echo "[!] failed at line $LINENO"; exit 1' ERR

# 6.sh — Materialize stubs (21–100)
# Safe defaults: no prod deploys, no destructive ops without PR
APPLY="${APPLY:-1}"
RUN="${RUN:-1}"
ROOT="$PWD"

need(){ command -v "$1" >/dev/null 2>&1; }
run(){ echo; echo "==> $*"; "$@"; }

mkdir -p scripts .github/workflows .airbear docs contracts observability

###############################################################################
# RATE LIMITING (token bucket, edge-safe)
###############################################################################
cat > lib/rate-limit.ts <<'TS'
const buckets = new Map<string,{t:number,c:number}>();
export function rateLimit(key:string, limit=60, windowMs=60000){
  const now=Date.now();
  const b=buckets.get(key)||{t:now,c:0};
  if(now-b.t>windowMs){ b.t=now; b.c=0; }
  b.c++; buckets.set(key,b);
  return b.c<=limit;
}
TS

###############################################################################
# CAPTCHA / TURNSTILE HOOK (stubbed, off by default)
###############################################################################
cat > lib/captcha.ts <<'TS'
export async function verifyCaptcha(token?:string){
  if(!process.env.CAPTCHA_SECRET) return true; // noop default
  // integrate provider here
  return Boolean(token);
}
TS

###############################################################################
# HOTFIX + ROLLBACK WORKFLOWS
###############################################################################
cat > .github/workflows/airbear-hotfix.yml <<'YML'
name: AirBear Hotfix
on: { workflow_dispatch: {} }
jobs:
  hotfix:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: echo "Create hotfix branch, apply minimal patch, open PR"
YML

cat > .github/workflows/airbear-rollback.yml <<'YML'
name: AirBear Rollback
on: { workflow_dispatch: {} }
jobs:
  rollback:
    runs-on: ubuntu-latest
    steps:
      - run: echo "Trigger platform rollback (guarded)"
YML

###############################################################################
# STAGING + PREVIEW DEPLOYS
###############################################################################
cat > .github/workflows/airbear-preview.yml <<'YML'
name: AirBear Preview
on: [pull_request]
jobs:
  preview:
    runs-on: ubuntu-latest
    steps:
      - run: echo "Deploy preview and comment URL"
YML

###############################################################################
# LIGHTHOUSE CI + AXE
###############################################################################
cat > .github/workflows/airbear-lhci.yml <<'YML'
name: AirBear Lighthouse CI
on: [workflow_dispatch, schedule]
jobs:
  lhci:
    runs-on: ubuntu-latest
    steps:
      - run: echo "Run Lighthouse CI with budgets"
YML

cat > .github/workflows/airbear-a11y.yml <<'YML'
name: AirBear A11y (axe)
on: [workflow_dispatch, schedule]
jobs:
  axe:
    runs-on: ubuntu-latest
    steps:
      - run: echo "Run axe-playwright; fail on new issues"
YML

###############################################################################
# VISUAL REGRESSION (PLAYWRIGHT)
###############################################################################
cat > .github/workflows/airbear-visual.yml <<'YML'
name: AirBear Visual Diffs
on: [pull_request]
jobs:
  visual:
    runs-on: ubuntu-latest
    steps:
      - run: echo "Screenshot diff baseline vs PR"
YML

###############################################################################
# FLAKY TEST QUARANTINE
###############################################################################
cat > scripts/quarantine-flaky.mjs <<'JS'
console.log("Detect flaky tests across retries; label and quarantine");
JS

###############################################################################
# API CONTRACT SNAPSHOTS
###############################################################################
cat > scripts/snapshot-contracts.mjs <<'JS'
console.log("Snapshot API schemas to /contracts and diff on PR");
JS

###############################################################################
# STRIPE WEBHOOK HARDENING
###############################################################################
cat > lib/stripe-verify.ts <<'TS'
import crypto from "crypto";
export function verifyStripe(sig:string, body:string, secret:string){
  const h=crypto.createHmac("sha256",secret).update(body).digest("hex");
  return sig.includes(h);
}
TS

###############################################################################
# SECRETS SCAN + ROTATION STUBS
###############################################################################
cat > .github/workflows/airbear-gitleaks.yml <<'YML'
name: AirBear Gitleaks
on: [push, pull_request]
jobs:
  scan:
    runs-on: ubuntu-latest
    steps:
      - run: echo "Run gitleaks"
YML

###############################################################################
# CODE OWNERS + LABELER
###############################################################################
cat > .github/CODEOWNERS <<'TXT'
* @airbear/core
TXT

cat > .github/workflows/airbear-labeler.yml <<'YML'
name: AirBear Labeler
on: [pull_request]
jobs:
  label:
    runs-on: ubuntu-latest
    steps:
      - run: echo "Auto-label by paths"
YML

###############################################################################
# DOCS + CHANGELOG AUTO-GEN
###############################################################################
cat > scripts/gen-docs.mjs <<'JS'
console.log("Generate docs from code + CI outputs");
JS

cat > scripts/gen-changelog.mjs <<'JS'
console.log("Generate changelog from merged PR labels");
JS

###############################################################################
# PII SCRUBBING
###############################################################################
cat > lib/pii.ts <<'TS'
export function scrub(obj:any){
  const s=JSON.stringify(obj);
  return s.replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi,"[email]");
}
TS

###############################################################################
# CSP + MIDDLEWARE INVARIANTS
###############################################################################
cat > lib/csp.ts <<'TS'
export const CSP = "default-src 'self'";
TS

###############################################################################
# BUILD DETERMINISM + LOCKFILE
###############################################################################
cat > scripts/check-determinism.mjs <<'JS'
console.log("Verify identical builds from clean state");
JS

###############################################################################
# CANARY + FEATURE FLAGS + KILL SWITCH
###############################################################################
cat > lib/flags.ts <<'TS'
export const flags = { canary:false, kill:false };
TS

###############################################################################
# DR DRILLS + BACKUP VERIFY
###############################################################################
cat > scripts/drill.mjs <<'JS'
console.log("Simulate DR drill; verify backups");
JS

###############################################################################
# EDGE / COLD START
###############################################################################
cat > scripts/edge-check.mjs <<'JS'
console.log("Check edge compatibility + cold start budget");
JS

###############################################################################
# SBOM + LICENSE
###############################################################################
cat > scripts/sbom.mjs <<'JS'
console.log("Generate SBOM + license allowlist");
JS

###############################################################################
# OBSERVABILITY IDS + STRUCTURED LOGS
###############################################################################
cat > observability/logger.ts <<'TS'
export function log(o:any){ console.log(JSON.stringify({ts:Date.now(),...o})) }
TS

###############################################################################
# POLICY / RLS ENFORCEMENT
###############################################################################
cat > scripts/check-rls.mjs <<'JS'
console.log("Fail if new tables lack RLS");
JS

###############################################################################
# TEMPLATE + OSS READINESS
###############################################################################
cat > scripts/template.mjs <<'JS'
console.log("Extract repo into template");
JS

###############################################################################
# AUTONOMOUS LOOP WIRING
###############################################################################
cat > .github/workflows/airbear-autonomous.yml <<'YML'
name: AirBear Autonomous Loop
on: { schedule: [{ cron: "*/15 * * * *" }], workflow_dispatch: {} }
jobs:
  loop:
    runs-on: ubuntu-latest
    steps:
      - run: echo "Dispatch quality, triage, autofix, monitors"
YML

###############################################################################
# RUN
###############################################################################
if [[ "$RUN" == "1" ]]; then
  echo "[i] Materialization complete; no local execution required"
fi

echo "[✓] Materialized stubs 21–100"
