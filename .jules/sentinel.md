## 2025-05-15 - [Mass Assignment Privilege Escalation]
**Vulnerability:** API endpoints allowed users to specify their own `role` via JSON payloads.
**Learning:** Shared schemas between frontend and backend can inadvertently expose administrative fields if not properly filtered at the route level.
**Prevention:** Use Zod's `.omit()` or `.pick()` to explicitly filter sensitive fields from user-provided data before processing. Hardcode default roles for public operations like registration.

## 2026-02-01 - [Hardcoded Production Credentials]
**Vulnerability:** Plain-text SSH credentials (host, username, password) for the production server were found in `deploy.js` and `deploy-with-correct-creds.js`.
**Learning:** Development and helper scripts often bypass standard security reviews and can become long-lived liabilities if not audited.
**Prevention:** Never store credentials in code. Use environment variables or secret management systems (like GitHub Secrets) and ensure helper scripts are either properly secured or removed after use.
