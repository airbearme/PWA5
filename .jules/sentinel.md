# Sentinel's Journal - Critical Security Learnings

## 2024-07-22 - The Perils of Incomplete Verification

**Vulnerability:** An initial Content Security Policy (CSP) was implemented with `'unsafe-eval'` and `'unsafe-inline'`, and a `server.log` file was accidentally committed. Furthermore, a `.gitignore` regression was introduced that would have allowed `.env*` files to be committed.

**Learning:** This multi-stage failure highlighted a critical process flaw. My verification steps were not holistic enough. I focused on the immediate code change (the CSP header) but failed to check the "blast radius" of my actions, leading to the inclusion of artifacts and a dangerous `.gitignore` modification. The feedback loop was essential in catching these severe errors.

**Prevention:** Always run a `git status` or `list_files` check immediately before completing a task to ensure no unintended files are included. When modifying shared configuration files like `.gitignore`, a double-check of the diff is mandatory. A stricter personal protocol is required before requesting a review. Trust nothing, verify everything—including my own changes.
