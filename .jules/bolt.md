## 2025-05-15 - Optimizing Supabase Query Waterfalls in Driver Dashboard
**Learning:** Parallelizing sequential Supabase query waterfalls using `Promise.all` in Next.js page components significantly reduces Time to Interactive (TTI). Additionally, decoupling static lookup data (like `spots`) from dynamic updates by fetching them conditionally within a unified `Promise.all` prevents redundant network requests during polling loops.
**Action:** Always identify sequential `await` calls for independent data sources and parallelize them. For high-frequency polling, implement a conditional check (e.g., `if (Object.keys(data).length === 0)`) to skip fetching static data after the initial load.

## 2025-05-15 - Standardizing GitHub Actions for pnpm
**Learning:** All GitHub Actions workflows must use `pnpm/action-setup@v4` (strictly positioned before `actions/setup-node`) and use `cache: 'pnpm'` to support the latest pnpm lockfile version (9.0). Using `npm ci` or outdated `action-setup` versions fails when no `package-lock.json` is present.
**Action:** Always verify that CI workflows are using the standardized pnpm setup pattern: `pnpm/action-setup@v4` with `version: latest`, followed by `actions/setup-node` with `cache: 'pnpm'`.

## 2025-05-15 - Resolving CI Build and Runtime Environment Issues
**Learning:** Next.js build-time and runtime Zod validation (`lib/env.ts`) requires valid environment variables even in CI. Jobs using `pnpm run build` or `pnpm run start` must provide Zod-compliant placeholders for all required keys (e.g., URLs must have valid protocols, keys must meet minimum lengths). Additionally, ensure both `PWA4` and legacy naming conventions are covered if the app uses both. All `actions/upload-artifact` and `actions/download-artifact` must be version `v4` to avoid deprecation failures.
**Action:** Always include a comprehensive `env` block with valid placeholders (e.g., `eyJ...` for Supabase keys) in build and test jobs to satisfy schema validation.
