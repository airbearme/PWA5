## 2025-05-14 - Parallel Query Waterfalls
**Learning:** Sequential `await` calls for independent Supabase queries in Next.js page components create significant network waterfalls, delaying Time to Interactive (TTI).
**Action:** Always use `Promise.all()` to fetch independent data sets in parallel within `useEffect` or Server Components.

## 2025-05-14 - High-Frequency Polling Optimization
**Learning:** Redundantly fetching static lookup data (like 'spots') within a high-frequency (5s) polling interval unnecessarily increases network load and database pressure.
**Action:** Decouple static lookup data fetching from dynamic state updates in polling dashboards. Fetch lookup data once on mount and only poll for volatile data.

## 2025-05-14 - Supabase Query Robustness
**Learning:** Using `.single()` in queries that might return no results (like fetching a driver's active ride) throws errors that can crash the component if not handled.
**Action:** Use `.maybeSingle()` for queries where zero results are a valid state (e.g., "no active ride") to safely handle null responses without throwing.
