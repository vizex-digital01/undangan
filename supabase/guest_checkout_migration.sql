-- VIZEX v10: run once AFTER schema.sql and seabank_migration.sql.
-- Customers use a private browser session; studio admin still uses Supabase login.
create table if not exists public.guest_sessions (
  id uuid primary key default gen_random_uuid(),
  token_hash text not null unique,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null
);
create index if not exists vizex_guest_expires_idx on public.guest_sessions(expires_at);
alter table public.guest_sessions enable row level security;
-- No client policies: guest access only through server-side token verification.
alter table public.invitations add column if not exists guest_id uuid references public.guest_sessions(id) on delete set null;
alter table public.invitations alter column user_id drop not null;
alter table public.orders add column if not exists guest_id uuid references public.guest_sessions(id) on delete set null;
alter table public.orders alter column user_id drop not null;
create index if not exists vizex_invitations_guest_idx on public.invitations(guest_id, created_at desc);
create index if not exists vizex_orders_guest_idx on public.orders(guest_id,created_at desc);
-- Orders must remain traceable to either a legacy account or a guest session.
-- Existing legacy user rows remain intact.
