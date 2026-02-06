## 2025-05-15 - [Hardcoded IONOS SFTP Credentials]
**Vulnerability:** Multiple legacy deployment scripts and instruction files (`deploy.js`, `scripts/deploy-ionos.js`, etc.) contained a hardcoded plaintext password (`Danknugs420420`) for the IONOS SFTP server.
**Learning:** Legacy diagnostic and deployment scripts often accumulate in the root or `scripts/` directory and can be overlooked during standard security sweeps, leading to major secret exposure.
**Prevention:** Strictly enforce the use of environment variables for all credentials and implement a CI/CD check to block PRs containing high-entropy strings or common secret keywords. Use a `.gitignore` to prevent deployment-specific scripts from being committed unless they are thoroughly sanitized.
