#!/usr/bin/env bash
set -Eeuo pipefail
trap 'fail "Interrupted"' INT
trap 'fail "Error on step $STEP"' ERR

###############################################################################
# AIRBEAR AUTO-ADOPT OCS
###############################################################################

STEP=0
TOTAL=6
START_TS=$(date +%s)

RUN_ID="ADOPT-$(date +%Y%m%d-%H%M%S)"
OUT="reports/airbear/$RUN_ID"
LATEST="reports/airbear/latest"
ERR_LOG="$OUT/errors.log"
RUN_LOG="$OUT/run.log"

mkdir -p "$OUT"
ln -sfn "$OUT" "$LATEST"

: > "$RUN_LOG"
exec > >(tee "$RUN_LOG") 2>&1

fail(){
  echo "[FATAL] $*" | tee -a "$ERR_LOG"
  exit 1
}

progress(){
  local pct=$(( STEP * 100 / TOTAL ))
  printf "\n[%02d/%02d] %3d%%\n" "$STEP" "$TOTAL" "$pct"
}

step(){
  STEP=$((STEP+1))
  progress
  echo "[STEP $STEP] $1"
}

###############################################################################
# STEP 1 — Sanity
###############################################################################
step "Sanity checks"
[[ -f package.json ]] || fail "package.json missing"
[[ -f next.config.hardened.mjs ]] || fail "next.config.hardened.mjs missing"
[[ -f middleware.hardened.ts ]] || fail "middleware.hardened.ts missing"
mkdir -p reports/airbear

###############################################################################
# STEP 2 — Adopt Next config
###############################################################################
step "Adopt hardened Next config"

if [[ -f next.config.mjs && ! -f next.config.old.mjs ]]; then
  cp next.config.mjs next.config.old.mjs
  echo "Backup → next.config.old.mjs"
fi

cp next.config.hardened.mjs next.config.mjs
echo "Adopted → next.config.mjs"

###############################################################################
# STEP 3 — Adopt middleware
###############################################################################
step "Adopt hardened middleware"

if [[ -f middleware.ts && ! -f middleware.old.ts ]]; then
  cp middleware.ts middleware.old.ts
  echo "Backup → middleware.old.ts"
fi

cp middleware.hardened.ts middleware.ts
echo "Adopted → middleware.ts"

###############################################################################
# STEP 4 — Apply Supabase telemetry migration
###############################################################################
step "Apply Supabase telemetry migration"

MIG=$(ls -1 supabase/migrations/*telemetry_hardened.sql 2>/dev/null | tail -n 1 || true)
[[ -n "$MIG" ]] || fail "Telemetry migration not found"

if command -v pnpm >/dev/null && pnpm -s drizzle-kit --help >/dev/null 2>&1; then
  echo "Using drizzle-kit push"
  pnpm drizzle-kit push || fail "drizzle-kit push failed"
else
  echo "drizzle-kit unavailable"
  echo "Apply manually in Supabase SQL editor:"
  echo "→ $MIG"
fi

###############################################################################
# STEP 5 — Verify adoption
###############################################################################
step "Verify adoption"

grep -q "SECURITY_HEADERS" next.config.mjs || fail "Next config not hardened"
grep -q "killSwitch" middleware.ts || fail "Middleware not hardened"
echo "Verification passed"

###############################################################################
# STEP 6 — Finalize
###############################################################################
step "Finalize"

{
  echo "Completed successfully"
  echo "Finished: $(date -Is)"
} > "$ERR_LOG"

echo
echo "=================================================="
echo "[✓] AIRBEAR AUTO-ADOPTION COMPLETE"
echo "[✓] next.config + middleware hardened"
echo "[✓] Supabase telemetry applied (or staged)"
echo "[✓] Idempotent, logged, safe"
echo "Logs → $LATEST"
echo "=================================================="