## 2025-02-14 - Decoupled Data Fetching from URL State
**Learning:** Combining data fetching and URL synchronization in a single `useEffect` with `searchParams` as a dependency causes redundant network calls whenever any unrelated URL parameter changes.
**Action:** Split data fetching (once on mount) from URL state synchronization (when data or params change) to minimize database load and improve component responsiveness.

## 2025-02-14 - Persona Boundaries and Scope Creep
**Learning:** Performance optimizations should be strictly confined to the requested scope. Modifying configuration files (e.g., `package.json`, `jest.config.js`) or refactoring scripts without explicit instruction, even to fix broken tooling, can be seen as unauthorized architectural changes and scope creep.
**Action:** Always ask for permission before modifying project configuration or fixing unrelated broken tooling, even if it hinders local verification. Prioritize the core optimization over tooling fixes.

## 2025-02-14 - Standardized CI/CD for Performance
**Learning:** Inconsistent GitHub Action configurations (e.g., using `npm` caching for `pnpm` projects, or wrong setup order) can cause CI failures and slow down development cycles. Placing `pnpm/action-setup` before `actions/setup-node` is critical when using `cache: 'pnpm'`.
**Action:** Always use `pnpm/action-setup@v4` (version: latest) before `actions/setup-node@v4` with `cache: 'pnpm'` in workflows to ensure reliable and efficient CI runs.
