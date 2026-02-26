## 2025-12-30 - Eliminating Network Waterfalls and Redundant Queries

**Learning:** Network waterfalls in independent Supabase queries (e.g., fetching rides and spots sequentially) significantly increase TTI. Combining these using `Promise.all` improves perceived performance. Additionally, client-side redundant queries (like fetching `airbearId` but not using it) add unnecessary latency and database load.

**Action:** Always check `useEffect` hooks for sequential `await` calls that don't depend on each other and parallelize them. Audit event handlers for queries that aren't actually used in subsequent logic.

## 2025-12-30 - Supabase Query Robustness

**Learning:** Using `.single()` in Supabase queries when a record might not exist (e.g., active ride for a new driver) throws a PostgREST error that can break application initialization.

**Action:** Use `.maybeSingle()` for queries where zero results is a valid application state to ensure robust performance and error handling.
