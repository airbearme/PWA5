## 2025-05-22 - Privilege Escalation via Mass Assignment
**Vulnerability:** Users were able to set their own roles (e.g., 'admin') by passing a `role` field in registration or profile sync requests.
**Learning:** Using a single Zod schema for both reading and writing (or for both public and private updates) without stripping sensitive fields leads to mass assignment vulnerabilities.
**Prevention:** Always use separate schemas for public-facing updates or explicitly strip/overwrite sensitive fields like `role`, `permissions`, or `balance` before processing.
