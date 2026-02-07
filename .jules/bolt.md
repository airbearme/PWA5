# Bolt's Performance Journal ⚡

## 2025-05-23 - Redundant Network Requests & Lack of Memoization in Booking Flow
**Learning:** In `app/book/page.tsx`, the `useEffect` hook for fetching spots was coupled to `searchParams`. This caused redundant network requests whenever the URL changed (e.g., when syncing state to the URL), wasting bandwidth and database resources. Additionally, derived state like distance and fare were recalculated on every render without `useMemo`, and standard `<img>` tags were used for critical above-the-fold assets, hurting LCP.

**Action:** Decouple data fetching from ephemeral URL state, move pure utility functions out of the component render loop, and use `useMemo` and `next/image` to optimize rendering performance.
