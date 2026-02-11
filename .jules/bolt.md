## 2025-05-15 - Decoupling URL state from data fetching
**Learning:** Using `searchParams` as a dependency in a `useEffect` that performs data fetching (like loading spots) causes redundant network requests whenever *any* query parameter changes, even if unrelated to the fetch.
**Action:** Fetch static data (like locations) once on mount, and use a separate `useEffect` to synchronize URL-based selection state.

## 2025-05-15 - Memoizing heavy React components and calculations
**Learning:** In a high-interaction app like a booking flow, re-calculating distances and fares on every render (even if triggered by unrelated UI state changes) can cause micro-stutter.
**Action:** Extract utility functions outside the component and use `useMemo` for derived values like distance and fare.
