## 2025-05-15 - [Mass Assignment Privilege Escalation]
**Vulnerability:** API endpoints allowed users to specify their own `role` via JSON payloads.
**Learning:** Shared schemas between frontend and backend can inadvertently expose administrative fields if not properly filtered at the route level.
**Prevention:** Use Zod's `.omit()` or `.pick()` to explicitly filter sensitive fields from user-provided data before processing. Hardcode default roles for public operations like registration.
