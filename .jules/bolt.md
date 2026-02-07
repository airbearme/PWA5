## 2025-05-15 - Surgical Schema Optimizations
**Learning:** In a project with multiple schema definitions (e.g., Drizzle/TypeScript and raw SQL), inconsistencies in column naming (like `requested_at` vs `created_at`) can lead to breaking changes if not handled carefully during optimization.

**Action:** Always verify existing column names in both ORM and SQL schemas before adding indexes. Implement surgical, non-breaking performance fixes by respecting the column names used in each respective file, even if they are inconsistent, to avoid breaking existing queries or deployment scripts.

## 2025-05-15 - GitHub Actions PNPM Caching Order
**Learning:** Using `actions/setup-node@v4` with `cache: 'pnpm'` fails if `pnpm` is not already installed on the runner. Additionally, using `cache: 'npm'` in a project with only `pnpm-lock.yaml` will fail with "Dependencies lock file is not found".

**Action:** Always place `pnpm/action-setup` BEFORE `actions/setup-node` when utilizing `cache: 'pnpm'`. Standardize all workflows to use `pnpm` consistently to avoid lockfile mismatch errors.
