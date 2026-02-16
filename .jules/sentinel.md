# Sentinel Journal - Critical Security Learnings

## 2026-02-16 - IDOR in Express API routes
**Vulnerability:** The Express API routes (specifically `/api/rides/user/:userId` and `/api/auth/sync-profile`) lacked any authentication or authorization checks. This allowed any user to view any other user's ride history or overwrite any user's profile information by simply providing the target user's ID.
**Learning:** The Express server uses `SUPABASE_SERVICE_ROLE_KEY`, which bypasses Row Level Security (RLS). When RLS is bypassed, authorization must be explicitly implemented in the application logic. The previous implementation trusted the user ID provided in the request body or URL parameters without verification.
**Prevention:** Always verify the requester's identity using a secure token (e.g., Supabase JWT) and ensure that the authenticated user has the necessary permissions to access or modify the requested resource. Use a middleware for consistent authentication across routes.
