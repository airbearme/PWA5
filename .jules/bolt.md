## 2024-05-22 - [Optimizing CI Pipeline with pnpm and Caching]
**Learning:** The existing CI workflows were using `npm` and lacked proper `pnpm` setup, causing failures and slow install times in a project designed for `pnpm`. Standardizing on `pnpm/action-setup` before `setup-node` with `cache: 'pnpm'` is the project's requirement for deterministic and fast builds.
**Action:** Migrated all active workflows to use `pnpm`, pinned setup versions, and optimized the caching order to ensure the CI pipeline is stable and efficient.
