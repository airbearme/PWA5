## 2026-02-10 - [Decoupling URL Sync from Data Fetching]
**Learning:** In Next.js App Router, using `searchParams` directly as a dependency in a `useEffect` that performs data fetching leads to redundant network requests every time the selection changes.
**Action:** Use a mount-only `useEffect` for initial data fetching and a separate `useEffect` for URL synchronization, employing `useRef` to ensure selection logic only runs once or when explicitly intended, rather than re-triggering the fetch logic.
