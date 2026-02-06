# Bolt's Performance Journal ⚡

## 2025-05-15 - Optimized BookRidePage Rendering and LCP
**Learning:** Decoupling spot-fetching from URL search parameter synchronization prevents redundant network requests when users interact with the page. Standard `img` tags were causing LCP warnings and layout shifts. Moving pure functions outside the component scope and using `useMemo` for derived calculations improves rendering performance.
**Action:** Always separate data fetching from secondary state synchronization in `useEffect` hooks. Prefer Next.js `Image` with `priority` for above-the-fold assets to optimize LCP.

## 2025-05-15 - State-Sync Loop Anti-Pattern
**Learning:** Implementing a `useEffect` that synchronizes state with URL parameters can easily create an infinite loop or revert manual user changes if the state itself is in the dependency array without proper guards.
**Action:** Use conditional guards (e.g., `if (!state)`) when synchronizing from URL to avoid overwriting manual user interactions.
