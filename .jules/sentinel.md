## 2025-05-14 - Mass Assignment & Information Disclosure Hardening
**Vulnerability:** Mass assignment in Auth routes and information leakage in health endpoints.
**Learning:** The application had a dual-API architecture where security logic needed to be synchronized. User registration and profile sync routes were vulnerable to role escalation because the incoming request body was parsed without omitting the `role` field. Health endpoints were exposing environment details and raw database errors.
**Prevention:** Always use Zod `.omit()` or `.pick()` on incoming payloads for sensitive models. Hardcode default roles in registration logic rather than relying on client-provided data. Sanitize health check responses to only include high-level status indicators.
