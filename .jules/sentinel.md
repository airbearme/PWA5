## 2025-05-15 - Pervasive Hardcoded Secrets in Deployment Scripts
**Vulnerability:** Found multiple hardcoded IONOS SFTP passwords, Supabase Service Role keys, and Stripe live keys across ~20 files, including documentation and utility scripts.
**Learning:** Legacy deployment scripts and "fix-it" utilities often bypass standard environment variable practices, leading to secret sprawl. Developers might hardcode credentials during troubleshooting and forget to remove them.
**Prevention:** Implement a pre-commit hook (e.g., using `gitleaks` or `secretlint`) to prevent commits containing common secret patterns. Standardize all deployment logic to use a centralized environment variable configuration.
