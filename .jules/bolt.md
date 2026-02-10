# Bolt's Journal - Performance Learnings

## 2025-05-15 - [Decoupling Fetch Logic in App Router]
**Learning:** In Next.js App Router, using `useSearchParams` inside a `useEffect` that also handles data fetching causes redundant network requests whenever ANY query parameter changes (even unrelated ones). This is because `searchParams` is a new object on every relevant navigation/update.
**Action:** Always decouple data fetching (mount-only or data-dependent) from URL synchronization (searchParams-dependent) into separate `useEffect` hooks.

## 2025-05-15 - [Utility Memoization in Render Body]
**Learning:** Re-defining utility functions like distance calculators inside a component body leads to unnecessary memory allocation and potential re-renders of children if passed down. Similarly, derived values should always be memoized if they depend on state that might change independently.
**Action:** Move non-state-dependent utilities to module level and use `useMemo` for expensive or frequently recalculated derived values.

## 2025-05-15 - [Environment Validation during Build Phase]
**Learning:** Next.js build process (static analysis and pre-rendering) often imports files that execute top-level Zod validation for environment variables. If these secrets are missing in CI/Build environment, the entire build fails even if they aren't needed for the build itself.
**Action:** Use `envSchema.partial()` or provide safe fallback values during build phase (detected via `process.env.NEXT_PHASE === 'phase-production-build'`) to prevent build-time failures due to missing runtime secrets.
