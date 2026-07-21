-- Hanzo Base schema for Press (the `databaseSchema` DDL).
--
-- On publish, Hanzo Cloud translates each CREATE TABLE into a Hanzo Base
-- collection via `provisionBaseFromDDL` (additive + idempotent). Base manages
-- `id`/`created`/`updated`/`owner`/`org` itself, so they are never re-declared
-- here: every row is stamped with the verified IAM `owner`+`org` and is
-- org-scoped by the access rule `@request.auth.org_id = org` — a member of your
-- org reads/writes it; other orgs cannot see it.
--
-- Keep this file in lockstep with what the app reads/writes:
--   issues   → src/views/newsstand.tsx
--   articles → src/views/issue.tsx, src/views/article.tsx

-- A numbered issue: the unit the magazine ships in.
CREATE TABLE IF NOT EXISTS issues (
  number       INTEGER NOT NULL,   -- the marquee issue number (01, 02, …)
  title        TEXT NOT NULL,      -- the issue's name
  cover_line   TEXT,               -- one line that sells the whole issue
  published_at TEXT,               -- ISO timestamp when it went live ('' while draft)
  published    BOOLEAN DEFAULT 0   -- on the shelf vs. still a draft
);

-- A piece inside an issue: the cover story, or a department section article.
CREATE TABLE IF NOT EXISTS articles (
  issue_id   TEXT NOT NULL,      -- the issues.id this piece runs in
  title      TEXT NOT NULL,      -- the headline
  dek        TEXT,               -- the standfirst under the headline
  body       TEXT,               -- the copy (blank-line-separated paragraphs)
  department TEXT,               -- Features, Dispatch, Interview, Essay, …
  is_cover   BOOLEAN DEFAULT 0,  -- runs as the issue's cover story
  "order"    INTEGER DEFAULT 0   -- position within the issue (quoted: reserved word)
);
