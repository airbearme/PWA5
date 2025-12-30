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
