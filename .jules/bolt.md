# Bolt's Journal - Performance Learnings

## 2026-02-13 - Decoupling data fetching from URL synchronization
**Learning:** In Next.js App Router, using `useSearchParams` as a dependency in a `useEffect` that fetches data causes redundant network requests whenever any unrelated query parameter changes.
**Action:** Split the effect: one for fetching data (on mount or stable dependencies), and another for synchronizing component state with specific URL parameters.

## 2026-02-13 - Memoizing derived values from state
**Learning:** Derived values like distance calculations or fare estimations should be memoized with `useMemo` when they depend on state that might stay stable while other unrelated state (like `booking` status or auth state) changes.
**Action:** Apply `useMemo` to expensive calculations and move utility functions outside the component scope to avoid re-creation.
