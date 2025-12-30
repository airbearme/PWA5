#!/usr/bin/env bash
set -Eeuo pipefail

pnpm install
pnpm run lint
pnpm run type-check
pnpm run build
pnpm run test:e2e
node scripts/budget-compare.mjs

echo "✓ VALIDATION PASSED"
