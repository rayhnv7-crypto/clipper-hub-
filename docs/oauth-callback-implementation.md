# OAuth Callback — Implementation Contract

## Current status
The `social-oauth` Edge Function initiates OAuth and has a JWT-authenticated callback action. The browser callback route is not implemented; Accounts still uses localStorage. Do not label social accounts as connected until callback exchange and persistence are verified.

## Required public callback behavior
The provider redirect endpoint must be public (providers cannot send a Supabase user JWT), but must rely on one-time, high-entropy state—not an unauthenticated user identifier.

1. Start endpoint authenticates the Supabase user and stores SHA-256(state), owner_id, provider, expiry (10 minutes), and provider-specific PKCE verifier where applicable.
2. Callback accepts only provider, code, state (or provider error). It hashes state and looks up the unexpired record using server/service credentials.
3. Consume state exactly once before token exchange; reject missing, expired, mismatched provider, or replayed state. Do not accept owner_id from query/body.
4. Exchange authorization code only server-side with fixed provider token endpoints and exact registered redirect URI.
5. Encrypt access and refresh tokens using AES-GCM with a unique 12-byte IV per token; encryption key is a server secret (32 bytes). Never return tokens to browser or log them.
6. Resolve provider's actual account identity from its profile endpoint. Never synthesize provider_account_id from the Supabase user ID.
7. Persist with owner_id from the consumed state and actual provider account ID. Return a minimal success/error page; no token or provider payload in HTML.
8. Add refresh/revoke lifecycle and token expiry handling before production usage.

## Redirect URI
Use one canonical callback URI consistently in provider console and both server functions. Current initiator uses `https://clipper-hub-app.vercel.app/oauth/callback`; this Vercel route must exist and forward provider callback parameters safely, or update both functions to a Supabase Edge Function URL.

## UI integration requirements
- Accounts page must initialize Supabase Auth session; Connect actions call `social-oauth` with the session JWT and action=start, then redirect to returned authorization_url.
- Display only connection status/account name from a user-authorized query. No client-side token storage.
- Provider secrets and encryption key remain server-only.
- Test with one provider in development before enabling the rest.
