## 2025-05-14 - [Parallelize Independent Data Fetches]
**Learning:** Sequential await calls for independent data resources (e.g., Supabase queries) create unnecessary bottlenecks and increase Time to Interactive (TTI). Parallelizing them with `Promise.all` is a low-risk, high-impact optimization.
**Action:** Always check `useEffect` or Server Components for multiple sequential `await` calls to external services and parallelize them when they don't depend on each other.

## 2025-05-14 - [GitHub Actions pnpm Caching]
**Learning:** When using `actions/setup-node@v4` with `cache: 'pnpm'`, the `pnpm` executable must be installed (via `pnpm/action-setup@v4`) BEFORE the `setup-node` step. Otherwise, the cache key calculation will fail because it can't find the `pnpm` binary.
**Action:** Ensure `pnpm/action-setup` always precedes `actions/setup-node` in GitHub Actions workflows when caching is enabled.
