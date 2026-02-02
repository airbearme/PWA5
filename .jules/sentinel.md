## 2026-02-02 - [Mass Assignment Prevention via Shared Schemas]
**Vulnerability:** User-provided input in auth registration and profile sync endpoints allowed setting protected fields like `role` and `ecoPoints`.
**Learning:** Hardening should happen at the schema level in a shared location (`shared/schema.ts`) to ensure consistency between production logic and security tests. Local schema re-definitions in routes are a maintainability risk and often lead to testing mismatches.
**Prevention:** Always use centralized, hardened Zod schemas (e.g., `registerUserSchema`, `updateProfileSchema`) that explicitly `.omit()` protected fields when parsing untrusted request bodies.
