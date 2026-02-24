## 2025-03-05 - Privilege Escalation in Sync-Profile
**Vulnerability:** The `/api/auth/sync-profile` endpoint allowed the client to specify the user's `role` and `id` in the request body, which were then trusted by the server to create or update local user records using the Supabase Service Role.
**Learning:** In a hybrid architecture where the frontend uses Supabase SDK directly and a separate backend uses Supabase Admin, endpoints that sync state must verify the user's identity via JWT even if they don't perform traditional "auth" (login/register), to prevent IDOR and privilege escalation.
**Prevention:** Always verify Supabase JWTs on the backend using `supabase.auth.getUser(token)` and use the verified `user.id` and `metadata.role` as the source of truth for database operations.
