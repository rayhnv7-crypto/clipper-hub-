# Clipper Hub — Next Implementation Scope

## Accounts and Content enhancements

- Account edit: update handle, display name, platform, status.
- Content edit: update title, linked account, workflow status.
- Search Accounts by platform, handle, display name.
- Search Content by title and filter by status/account.
- JSON export: download all local records as a backup.
- JSON import: validate schema before replacing existing records; ask for confirmation.
- KPI values must be derived from stored records, not hard-coded sample values.

## Existing dashboard design

The original visual prototype remains the design reference. Do not replace it with a different dashboard concept. Integrate operational features into the existing layout and preserve its typography, colors, spacing, and information hierarchy.

## Data safety

- Warn before destructive operations.
- Do not delete an account while content references it.
- Keep import/export schema versioned in future iterations.
- Clearly label local-only data until cloud persistence is implemented.

## Cloud migration

Next architecture step: Supabase Auth + Postgres, with account/content ownership and Row Level Security. Migration must preserve local JSON export/import as a recovery mechanism.
