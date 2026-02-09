## 2025-02-09 - Mass Assignment and Role Escalation Prevention
**Vulnerability:** The application had multiple endpoints (`PATCH /api/rides/:id`, `POST /api/auth/sync-profile`) that accepted arbitrary request bodies and applied them to database records via `Partial<T>` updates. This allowed users to modify sensitive fields like `fare`, `userId`, or `role`.
**Learning:** Using `z.object({...}).strict()` or explicit field picking in Zod schemas is essential for any endpoint that performs updates to prevent malicious field injection.
**Prevention:** Always define and use hardened update schemas (e.g., `rideUpdateSchema`, `updateProfileSchema`) that only include safe-to-edit fields. Use `.strict()` to ensure no extra fields are passed.
