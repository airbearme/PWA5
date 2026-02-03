## 2025-02-04 - Privilege Escalation via Profile Sync

**Vulnerability:** The `/api/auth/sync-profile` endpoint allowed users to update their own `role` field by passing it in the request body, potentially escalating their privileges to `admin`.
**Learning:** This occurred because a single Zod schema (`profileSchema`) was being used for both trusted (registration) and untrusted (profile sync) inputs, and the `storage.updateUser` method blindly accepted all fields from the parsed payload.
**Prevention:** Use specific, restrictive schemas for user-controlled update endpoints. Always omit sensitive fields like `role`, `balance`, or `permissions` from schemas used for public-facing update routes.

## 2025-02-04 - Hardcoded Credentials in Legacy Scripts

**Vulnerability:** Multiple SFTP deployment and diagnostic scripts contained plain-text production credentials (`Danknugs420420`).
**Learning:** Legacy scripts often linger in the codebase after a migration to more secure CI/CD pipelines (like Vercel), becoming a "ticking time bomb" if secrets are not properly rotated or if the scripts are not deleted.
**Prevention:** Always use environment variables for secrets. Implement a secret scanning tool (like Gitleaks) in the CI/CD pipeline to catch hardcoded secrets before they are committed.
