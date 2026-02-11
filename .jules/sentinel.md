# Sentinel Security Journal

## 2025-05-15 - [Privilege Escalation via Mass Assignment in Auth Routes]
**Vulnerability:** The `POST /api/auth/register` and `POST /api/auth/sync-profile` endpoints allowed users to set their own `role` field (e.g., to 'admin' or 'driver') directly via the request body.
**Learning:** The application used a shared Zod schema (`profileSchema`) for multiple routes without omitting sensitive fields like `role` during user-initiated actions.
**Prevention:** Always use `.omit({ role: true })` or separate schemas for user-facing profile updates. Hardcode default roles during registration and verify privileges before allowing role changes.

## 2025-05-15 - [Mass Assignment in Ride Updates]
**Vulnerability:** The `PATCH /api/rides/:id` endpoint accepted an unvalidated `req.body`, allowing users to modify sensitive fields like `fare`, `userId`, or `pickupSpotId`.
**Learning:** Lack of strict input validation on update endpoints can lead to data integrity and financial risks.
**Prevention:** Use strict Zod schemas with `.strict()` for all update endpoints to ensure only allowed fields are modified.

## 2025-05-15 - [Information Leakage in Health Check]
**Vulnerability:** The `GET /api/health` endpoint returned internal environment details (`NODE_ENV`) and application versions.
**Learning:** Exposing version and environment info can assist attackers in targeting specific known vulnerabilities.
**Prevention:** Strip sensitive metadata from public health/status endpoints.
