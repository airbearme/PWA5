## 2025-02-15 - Privilege Escalation via Role Mass Assignment

**Vulnerability:** The Express `POST /api/auth/register` and `POST /api/auth/sync-profile` endpoints allowed users to specify their `role` (e.g., "admin") in the request body, which was then saved directly to the database.
**Learning:** The application used a single Zod schema for both data validation and database persistence, without filtering out sensitive fields that should only be manageable by administrators.
**Prevention:** Use separate "Public" vs "Internal" schemas (e.g., `publicProfileSchema`) to explicitly omit sensitive fields like `role` from user-facing inputs. Always default to the lowest privilege level for public registration.

## 2025-02-15 - Information Leakage in Health Endpoints

**Vulnerability:** Health check endpoints (`/api/health`) were exposing `NODE_ENV`, application versions, and detailed database error messages.
**Learning:** Default health check implementations often include metadata for debugging that is not suitable for production exposure.
**Prevention:** Harden health checks by returning only a status indicator and generic error messages. Avoid leaking stack traces or environmental details.
