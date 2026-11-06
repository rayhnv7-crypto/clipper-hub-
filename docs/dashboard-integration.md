# Dashboard Integration — Current Implementation

## Module routes
- Accounts: `src/accounts/index.html`
- Content: `src/content/index.html`

## Shared browser data keys
- Accounts: `clipper-hub:accounts:v1`
- Content: `clipper-hub:content:v1`

Content records reference accounts using `accountId` (stable account `id`).

## KPI definitions (local data)
- Total Accounts: count of account records.
- Active Accounts: accounts with status `active`.
- Total Content: count of content records.
- In Production: content status in `scripting`, `editing`, or `review`.
- Published: content status `published`.

## Integration note
The module pages are committed and share localStorage on the same browser origin. The original dashboard HTML still needs to be added to the repository and its existing navigation wired to these routes. Until that is done, this is module-level integration, not a finished dashboard integration.

## Local testing
For stable shared browser storage, serve the repository over localhost (same origin) rather than opening individual HTML files under separate `file://` origins.
