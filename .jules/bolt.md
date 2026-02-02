## 2026-02-02 - [Database Index for Ride History]
**Learning:** Performance optimizations in this codebase must target measurable gains like database indexes or image LCP improvements. Memoizing cheap mathematical operations (e.g., Haversine formula) is considered a micro-optimization and is discouraged if it doesn't solve a real bottleneck.
**Action:** Always prioritize architectural or data-access optimizations over component-level micro-memoization.
