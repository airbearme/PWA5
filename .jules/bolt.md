## 2026-02-12 - Surgical Booking Flow Optimization
**Learning:** The booking flow in `app/book/page.tsx` contained a redundant client-side database query for available vehicles that was never utilized. This added unnecessary latency to a critical user action. Additionally, the data loading effect was over-sensitive to URL parameter changes, causing redundant full-table re-fetches.
**Action:** Always verify if client-side database lookups are actually required or if they can be handled by the backend. Use granular effects to separate static data loading from dynamic URL synchronization.
