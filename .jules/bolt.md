## 2025-05-22 - [Database Indexing Consistency]
**Learning:** Inconsistencies between the ORM schema (shared/schema.ts) and the SQL documentation (supabase-schema.sql) can lead to broken optimizations or missing indexes in production. Always verify the actual column names used in the app code before implementing indexes.
**Action:** Cross-reference storage queries and ORM definitions with raw SQL files to ensure indexing coverage is uniform and correct.
