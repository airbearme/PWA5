## 2024-07-25 - Do Not Commit Temporary Artifacts

**Learning:** My first submission was rejected because it included temporary files and directories generated during local testing (`dev.log`, `playwright-report/`, `test-results/`). Committing these artifacts pollutes the repository, creates unnecessary noise in code reviews, and can lead to merge conflicts.

**Action:** Before every submission, I must verify that no temporary or generated files are staged for commit. I should consider adding these common patterns to a `.gitignore` file if they aren't already present to prevent this from happening automatically.
