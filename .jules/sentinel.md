## 2025-02-18 - API Route Hardening with Centralized Validators
**Vulnerability:** The driver location update API (`/api/airbear/location`) lacked input validation, rate limiting, and leaked internal error messages to the client.
**Learning:** While Supabase RLS protects row access, it doesn't prevent malformed data (e.g., battery > 100) or DoS attacks on specific endpoints. Centralized validators in `lib/utils/validators.ts` should be expanded to cover all sensor/sensor-like data to maintain consistency across the app.
**Prevention:** Always use `rateLimit` by extracting the correct client IP from the `x-forwarded-for` header list and consolidate validation logic into shared utilities to avoid fragmentation.

## 2025-02-18 - CI Setup Standardization for Security Verification
**Vulnerability:** Broken CI pipeline (incorrect pnpm setup sequence) prevented security scans and automated verification from running, leaving the codebase vulnerable to silent regressions.
**Learning:** GitHub Actions must follow a strict `actions/checkout@v4` -> `pnpm/action-setup@v4` -> `actions/setup-node@v4` (with pnpm cache) sequence. Deviating from this causes "Dependencies lock file is not found" errors because `setup-node` tries to find the lockfile before `pnpm` is configured.
**Prevention:** Standardize all workflows to the approved pnpm setup sequence and use `pnpm` instead of `npm` to ensure lockfile integrity.
