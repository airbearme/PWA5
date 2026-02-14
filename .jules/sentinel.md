## 2026-02-14 - Privilege Escalation via Mass Assignment in Auth Routes
**Vulnerability:** The `/api/auth/register` and `/api/auth/sync-profile` endpoints accepted a `role` field directly from the request body, allowing any user to register as or escalate their privileges to "admin".
**Learning:** Even when using Zod for validation, including sensitive fields like `role` in a shared schema used for public-facing endpoints creates a mass assignment risk.
**Prevention:** Always use restricted schemas (e.g., `publicProfileSchema`) that omit sensitive fields for endpoints accessible to non-admin users.

## 2026-02-14 - Information Leakage in Health Endpoints
**Vulnerability:** The `/api/health` endpoints (both Express and Next.js) exposed `env` (NODE_ENV), `version`, and detailed database error messages.
**Learning:** Health checks are often overlooked but can provide valuable reconnaissance data to attackers.
**Prevention:** Minimize health check responses to the bare minimum status indicators.
