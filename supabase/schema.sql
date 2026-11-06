-- Clipper Hub database schema (Supabase PostgreSQL)
-- Run in Supabase SQL Editor after reviewing project ownership/RLS requirements.
create extension if not exists pgcrypto;

create table if not exists public.accounts (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  platform text not null,
  handle text not null,
  display_name text,
  status text not null default 'Active' check (status in ('Active','Paused','Restricted')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(owner_id, platform, handle)
);

create table if not exists public.contents (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  account_id uuid references public.accounts(id) on delete set null,
  title text not null,
  status text not null default 'Idea' check (status in ('Idea','Scripting','Editing','Review','Scheduled','Published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.accounts enable row level security;
alter table public.contents enable row level security;

create policy "accounts_select_own" on public.accounts for select to authenticated using ((select auth.uid()) = owner_id);
create policy "accounts_insert_own" on public.accounts for insert to authenticated with check ((select auth.uid()) = owner_id);
create policy "accounts_update_own" on public.accounts for update to authenticated using ((select auth.uid()) = owner_id) with check ((select auth.uid()) = owner_id);
create policy "accounts_delete_own" on public.accounts for delete to authenticated using ((select auth.uid()) = owner_id);

create policy "contents_select_own" on public.contents for select to authenticated using ((select auth.uid()) = owner_id);
create policy "contents_insert_own" on public.contents for insert to authenticated with check ((select auth.uid()) = owner_id);
create policy "contents_update_own" on public.contents for update to authenticated using ((select auth.uid()) = owner_id) with check ((select auth.uid()) = owner_id);
create policy "contents_delete_own" on public.contents for delete to authenticated using ((select auth.uid()) = owner_id);

create index if not exists accounts_owner_idx on public.accounts(owner_id);
create index if not exists contents_owner_idx on public.contents(owner_id);
create index if not exists contents_account_idx on public.contents(account_id);
