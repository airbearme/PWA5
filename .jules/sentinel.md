## 2025-05-15 - Mass Assignment and Information Leakage in Dual-API Architecture
**Vulnerability:** Mass assignment risk in user registration and information leakage in health check endpoints.
**Learning:** In a dual-API architecture (Express + Next.js), security fixes must be applied consistently across both environments. Using a shared schema that includes sensitive fields like 'role' without a corresponding 'public' version leads to mass assignment vulnerabilities.
**Prevention:** Always use a 'public' version of input schemas (omitting sensitive fields) for user-facing endpoints. Explicitly set sensitive fields to safe defaults during creation and use 'undefined' during updates to prevent accidental overwrites. Harden health checks to return only essential status info.

## 2025-05-15 - Mass Assignment and Info Disclosure
**Vulnerability:** User registration and profile synchronization allowed clients to set their own "role" field, leading to potential privilege escalation. Health check endpoints exposed application version and detailed error messages.
**Learning:** Dual-API architectures (Express + Next.js) require synchronized schema validation. Relying on client-provided data for identity fields without strict filtering is a common mass assignment vector.
**Prevention:** Use Zod schemas that explicitly omit sensitive fields for public-facing endpoints. Hardcode sensitive defaults (like role: "user") on the server side during creation. Sanitize all health check responses to return only minimal status indicators.
