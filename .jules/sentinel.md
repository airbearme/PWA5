## 2025-05-22 - Hardcoded Secrets in Deployment Scripts
**Vulnerability:** Found multiple instances of live Supabase Service Role keys, Anon keys, and Stripe Publishable keys in shell scripts (`add-vercel-env-vars.sh`), helper scripts (`scripts/check-new-credentials.js`), and build configuration (`vite.config.ts`).
**Learning:** Development scripts and "quick start" documentation often become a dumping ground for real keys during rapid prototyping, which then get committed to the repository.
**Prevention:** Always use environment variables for secrets, even in helper scripts. Enforce format-compliant placeholders (e.g., `eyJ...placeholder`) in the codebase and use pre-commit hooks or CI checks to scan for real-looking keys.
