# OAuth Integrations — Clipper Hub

## Status
This repository currently ships a static HTML dashboard with Supabase Auth/data sync. It does **not** yet contain a server-side OAuth callback runtime. This document and `supabase/oauth-schema.sql` establish the secure integration baseline; provider authorization is not considered live until Edge Functions, provider credentials, migrations, and callback tests are deployed.

## Providers in scope
- Google / YouTube
- TikTok
- Meta (Facebook Pages / Instagram)
- LinkedIn
- X

## Required architecture
1. Browser requests `oauth-start` Edge Function with provider + platform.
2. Function validates the authenticated Supabase user, creates random one-time state (and PKCE verifier where supported), stores state server-side with expiry, then returns provider authorization URL.
3. Provider redirects to `oauth-callback`; function validates state, exchanges code server-side, fetches account identity, encrypts access/refresh tokens with AES-256-GCM, and persists ciphertext only.
4. Dashboard reads connection metadata through RLS; tokens are never returned to the browser.
5. Disconnect revokes provider token where supported, then removes ciphertext; refresh jobs renew expiring credentials.
6. Use exact redirect URI registered at each provider. Reject state mismatch, expired state, replay, and untrusted return URLs.

## Database
Review and apply `supabase/oauth-schema.sql` in the Supabase SQL Editor. It enables owner-only SELECT; client INSERT/UPDATE/DELETE is revoked by design.

## Supabase Edge Function secrets (set server-side only)
- `OAUTH_REDIRECT_BASE=https://clipper-hub-app.vercel.app`
- `OAUTH_TOKEN_ENCRYPTION_KEY`: 32 random bytes encoded as 64 hex characters
- Provider credentials: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `TIKTOK_CLIENT_KEY`, `TIKTOK_CLIENT_SECRET`, `META_APP_ID`, `META_APP_SECRET`, `LINKEDIN_CLIENT_ID`, `LINKEDIN_CLIENT_SECRET`, `X_CLIENT_ID`, `X_CLIENT_SECRET`
- Supabase Edge Function runtime has its own Supabase URL/service role secrets; do not copy service role into Vercel/browser.

## Redirect URI convention
Register these callback URLs with each provider after deploying the Edge Function:
- `https://<SUPABASE_PROJECT_REF>.supabase.co/functions/v1/oauth-callback/google`
- `https://<SUPABASE_PROJECT_REF>.supabase.co/functions/v1/oauth-callback/tiktok`
- `https://<SUPABASE_PROJECT_REF>.supabase.co/functions/v1/oauth-callback/meta`
- `https://<SUPABASE_PROJECT_REF>.supabase.co/functions/v1/oauth-callback/linkedin`
- `https://<SUPABASE_PROJECT_REF>.supabase.co/functions/v1/oauth-callback/x`

Provider dashboard setup is external and must be completed by the owner (app verification, redirect allowlists, permissions, business review where applicable).

## Acceptance checklist
- [ ] OAuth state is one-time, expiring, and user-bound
- [ ] PKCE enabled where provider supports it
- [ ] Token exchange and refresh happen server-side
- [ ] Tokens encrypted at rest; encryption key never in client
- [ ] RLS prevents cross-user connection reads
- [ ] Connect, reconnect, disconnect, expired, and error states tested
- [ ] Each provider callback tested with a real provider app
- [ ] No provider marked connected without verified callback + account identity
