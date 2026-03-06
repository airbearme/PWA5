## 2025-02-18 - API Route Hardening with Centralized Validators
**Vulnerability:** The driver location update API (`/api/airbear/location`) lacked input validation, rate limiting, and leaked internal error messages to the client.
**Learning:** While Supabase RLS protects row access, it doesn't prevent malformed data (e.g., battery > 100) or DoS attacks on specific endpoints. Centralized validators in `lib/utils/validators.ts` should be expanded to cover all sensor/sensor-like data to maintain consistency across the app.
**Prevention:** Always use `rateLimit` by extracting the correct client IP from the `x-forwarded-for` header list and consolidate validation logic into shared utilities to avoid fragmentation.
