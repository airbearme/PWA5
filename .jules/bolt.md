# Bolt's Performance Journal

## 2026-02-11 - [React Rendering Optimization in Booking Flow]
**Learning:** In Next.js App Router, using `searchParams` as a dependency in `useEffect` can cause redundant network requests if the effect also performs data fetching. Decoupling the initial fetch from the URL synchronization logic ensures that selection changes (which might update the URL) don't trigger expensive re-fetches of static or semi-static data.
**Action:** Always separate data fetching from URL parameter reactivity in components that use both.

## 2026-02-11 - [Expensive Computations in Render Loop]
**Learning:** Derived values like distance calculations from coordinates should be memoized with `useMemo`, and the utility functions themselves should be moved outside the component scope to avoid re-allocation on every render.
**Action:** Move helper functions outside components when they don't depend on component state, and memoize results of O(n) or complex math operations.
