# Sentinel Security Journal

## 2025-12-31 - Mass Assignment in Auth and Ride Routes
**Vulnerability:** User-provided payloads in `/api/auth/register`, `/api/auth/sync-profile`, and `PATCH /api/rides/:id` were parsed using schemas that included sensitive fields like `role`, `ecoPoints`, and `fare`.
**Learning:** This is a classic Mass Assignment (or Overposting) vulnerability. In this codebase, the Express routes in `server/routes.ts` lacked strict input validation for update operations, relying on shared schemas that included internal metadata.
**Prevention:** Always use specialized Zod schemas for user-provided data (e.g., `updateProfileSchema`) that explicitly omit or only include safe-to-edit fields. Use `omit` on base schemas to ensure that new sensitive fields added to the database don't automatically become editable by users.
