## 2025-05-14 - Parallelizing Supabase Queries
**Learning:** Sequential `await` calls for independent Supabase queries in `useEffect` create network waterfalls, significantly delaying Time to Interactive (TTI) in data-heavy dashboards. Using `Promise.all` can reduce loading times by up to 50% depending on the number of queries.
**Action:** Always audit `useEffect` hooks for multiple independent `await` calls and parallelize them with `Promise.all`.

## 2025-05-14 - Respecting Boundary Constraints
**Learning:** Even when fixing a broken test environment or linting errors, modifying `package.json` or adding dependencies without explicit permission violates agent boundaries.
**Action:** Prioritize the core task (performance) and only fix environment issues that are strictly necessary and within boundaries. If a dependency is missing, request user input or report it instead of auto-installing if boundaries prohibit it.

## 2025-05-14 - GitHub Actions pnpm Standardization
**Learning:** GitHub Actions workflows in a `pnpm`-only project will fail if they use `cache: npm` or `npm ci`. Additionally, `actions/setup-node` with `cache: pnpm` fails if `pnpm` isn't already installed on the runner.
**Action:** Always ensure `pnpm/action-setup@v4` is called BEFORE `actions/setup-node@v4` and standardize on `pnpm install --frozen-lockfile`.

## 2025-05-14 - Zod Environment Validation in CI
**Learning:** Next.js build and test processes often validate environment variables via Zod. If required secrets are missing in CI, the build will fail.
**Action:** Provide Zod-compliant placeholder values (e.g., valid URLs, expected prefixes like `pk_`) in CI workflows to ensure builds pass even when actual secrets are not available.
