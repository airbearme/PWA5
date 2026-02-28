## 2025-05-15 - Optimizing Supabase Query Waterfalls in Driver Dashboard
**Learning:** Parallelizing sequential Supabase query waterfalls using `Promise.all` in Next.js page components significantly reduces Time to Interactive (TTI). Additionally, decoupling static lookup data (like `spots`) from dynamic updates by fetching them conditionally within a unified `Promise.all` prevents redundant network requests during polling loops.
**Action:** Always identify sequential `await` calls for independent data sources and parallelize them. For high-frequency polling, implement a conditional check (e.g., `if (Object.keys(data).length === 0)`) to skip fetching static data after the initial load.

## 2025-05-15 - Standardizing GitHub Actions for pnpm
**Learning:** All GitHub Actions workflows must use `pnpm/action-setup@v4` (strictly positioned before `actions/setup-node`) and use `cache: 'pnpm'` to support the latest pnpm lockfile version (9.0). Using `npm ci` or outdated `action-setup` versions fails when no `package-lock.json` is present.
**Action:** Always verify that CI workflows are using the standardized pnpm setup pattern: `pnpm/action-setup@v4` with `version: latest`, followed by `actions/setup-node` with `cache: 'pnpm'`.
