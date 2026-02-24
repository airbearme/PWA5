## 2025-05-23 - Parallelizing Supabase Queries
**Learning:** Sequential Supabase queries in `useEffect` hooks create network waterfalls that significantly increase Time to Interactive (TTI), especially on mobile networks or when multiple independent resources (spots, airbears, rides) are needed.
**Action:** Use `Promise.all()` to parallelize independent network requests. This ensures the page waits only for the longest single request rather than the sum of all requests.

## 2025-05-23 - Boundary Awareness in CI/CD Fixes
**Learning:** Fixing broken CI environments by modifying `package.json`, `tsconfig.json`, or adding environment variable placeholders in `lib/env.ts` is considered an architectural overreach and a safety risk by reviewers, even if it enables automated verification.
**Action:** Focus strictly on the performance win. Use manual verification (Playwright screenshots, local builds) to confirm correctness when CI is broken, rather than attempting to repair the entire infrastructure without explicit instruction.
