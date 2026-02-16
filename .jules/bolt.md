## 2026-02-16 - [Redundant Data Fetching in Booking Flow]
**Learning:** Decoupling data fetching from URL synchronization in React components prevents redundant database calls. In app/book/page.tsx, combining both in a single useEffect with searchParams dependency caused re-fetching of all spots on every URL change.
**Action:** Always split useEffect hooks to separate one-time data fetching from dynamic state/URL synchronization.
