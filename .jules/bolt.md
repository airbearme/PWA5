# Bolt's Journal - Performance Learnings

## 2025-05-15 - [Decoupling Fetch Logic in App Router]
**Learning:** In Next.js App Router, using `useSearchParams` inside a `useEffect` that also handles data fetching causes redundant network requests whenever ANY query parameter changes (even unrelated ones). This is because `searchParams` is a new object on every relevant navigation/update.
**Action:** Always decouple data fetching (mount-only or data-dependent) from URL synchronization (searchParams-dependent) into separate `useEffect` hooks.

## 2025-05-15 - [Utility Memoization in Render Body]
**Learning:** Re-defining utility functions like distance calculators inside a component body leads to unnecessary memory allocation and potential re-renders of children if passed down. Similarly, derived values should always be memoized if they depend on state that might change independently.
**Action:** Move non-state-dependent utilities to module level and use `useMemo` for expensive or frequently recalculated derived values.
