-- OAuth connection metadata for Clipper Hub.
-- Access/refresh tokens MUST be encrypted by a trusted server/Edge Function before storage.
-- Never expose service-role keys or token encryption keys to browser clients.
create table if not exists public.social_connections (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  platform text not null check (platform in ('google','youtube','tiktok','meta','instagram','linkedin','x')),
  provider_account_id text,
  account_name text,
  scopes text[] not null default '{}',
  token_ciphertext text,
  refresh_ciphertext text,
  token_expires_at timestamptz,
  status text not null default 'connected' check (status in ('connected','expired','revoked','error')),
  last_error text,
  connected_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(owner_id, platform, provider_account_id)
);
alter table public.social_connections enable row level security;
drop policy if exists social_connections_select_own on public.social_connections;
create policy social_connections_select_own on public.social_connections for select to authenticated using ((select auth.uid()) = owner_id);
-- Browser clients are intentionally denied INSERT/UPDATE/DELETE; trusted server uses service role.
revoke insert, update, delete on public.social_connections from anon, authenticated;
grant select on public.social_connections to authenticated;
create index if not exists social_connections_owner_idx on public.social_connections(owner_id);
