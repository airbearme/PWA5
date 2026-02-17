## 2025-05-15 - Mass Assignment and Information Leakage in Dual-API Architecture
**Vulnerability:** Mass assignment risk in user registration and information leakage in health check endpoints.
**Learning:** In a dual-API architecture (Express + Next.js), security fixes must be applied consistently across both environments. Using a shared schema that includes sensitive fields like 'role' without a corresponding 'public' version leads to mass assignment vulnerabilities.
**Prevention:** Always use a 'public' version of input schemas (omitting sensitive fields) for user-facing endpoints. Explicitly set sensitive fields to safe defaults during creation and use 'undefined' during updates to prevent accidental overwrites. Harden health checks to return only essential status info.
