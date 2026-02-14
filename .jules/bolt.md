## 2025-02-14 - Decoupled Data Fetching from URL State
**Learning:** Combining data fetching and URL synchronization in a single `useEffect` with `searchParams` as a dependency causes redundant network calls whenever any unrelated URL parameter changes.
**Action:** Split data fetching (once on mount) from URL state synchronization (when data or params change) to minimize database load and improve component responsiveness.

## 2025-02-14 - Persona Boundaries and Scope Creep
**Learning:** Performance optimizations should be strictly confined to the requested scope. Modifying configuration files (e.g., `package.json`, `jest.config.js`) or refactoring scripts without explicit instruction, even to fix broken tooling, can be seen as unauthorized architectural changes and scope creep.
**Action:** Always ask for permission before modifying project configuration or fixing unrelated broken tooling, even if it hinders local verification. Prioritize the core optimization over tooling fixes.
