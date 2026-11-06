# Clipper Hub — Security & Ownership Audit

## Findings (2026-11-06)

- Supabase Security Advisor reports 20 public tables with RLS enabled but no policies.
- Findings include workspaces, SEO tables, integrations, API keys, posts, analytics, logs, and AI jobs.
- `workspaces` currently has `id`, `name`, and `created_at`; it has no owner/member relation.
- `seo_sites` currently has no `workspace_id` or `owner_id`; its child entities reference `site_id`.
- Several operational tables use nullable `workspace_id` and do not yet establish ownership.
- `seo_google_connections` uses `owner_key` (default `primary`) and stores encrypted token JSON; it is not tied to authenticated user ownership in the schema inspected.
- Supabase Edge Functions list is empty.

## Security decision

Do NOT add broad `USING (true)` policies or enable client access to these tables. That would expose workspace and integration data. Do not deploy owner-based policies until owner mapping/backfill is defined and verified.

## Safe implementation sequence

1. Define single-owner workspace model for internal Clipper Hub (or explicit workspace membership if multi-user is intended).
2. Add owner relation and backfill existing rows deterministically; stop if any row cannot be mapped.
3. Add owner-scoped RLS policies for SELECT/INSERT/UPDATE/DELETE with matching `USING` and `WITH CHECK`.
4. Keep provider tokens, API key hashes, OAuth state, and AI job execution server-only; deny direct browser access where appropriate.
5. Test anon, authenticated owner, and non-owner access for every table before enabling frontend features.
6. Keep service-role credentials exclusively server-side.

## Follow-up

- Inspect existing policies on `accounts` and `contents` and align them with workspace ownership.
- Review Auth signup trigger separately; current signup failure is not proven to be caused by RLS.
- Add server-side API/Edge Functions and worker only after ownership and secrets handling are settled.
