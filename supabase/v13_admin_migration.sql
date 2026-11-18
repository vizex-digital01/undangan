-- VIZEX v13: apply AFTER v9 and v10 migrations. Existing records are preserved.
create extension if not exists pgcrypto;
alter table public.invitations add column if not exists customer_name text;
alter table public.invitations add column if not exists customer_whatsapp text;
create index if not exists vizex_inv_created_idx on public.invitations(created_at desc);
create index if not exists vizex_inv_customer_phone_idx on public.invitations(customer_whatsapp);

create table if not exists public.vizex_template_settings (
 template_id text primary key,
 is_active boolean not null default true,
 display_name text,
 description text,
 updated_at timestamptz not null default now()
);
create table if not exists public.vizex_site_settings (
 key text primary key,
 value text not null default '',
 updated_at timestamptz not null default now()
);
insert into public.vizex_site_settings(key,value) values
 ('support_whatsapp',''), ('support_email',''), ('announcement','')
on conflict(key) do nothing;
create table if not exists public.vizex_admin_events (
 id uuid primary key default gen_random_uuid(),
 kind text not null,
 title text not null,
 detail text,
 entity_id text,
 seen_at timestamptz,
 created_at timestamptz not null default now()
);
create index if not exists vizex_events_recent_idx on public.vizex_admin_events(created_at desc);
create table if not exists public.vizex_admin_audit (
 id uuid primary key default gen_random_uuid(),
 admin_id uuid not null,
 action text not null,
 entity_type text not null,
 entity_id text not null,
 details jsonb not null default '{}'::jsonb,
 created_at timestamptz not null default now()
);
create index if not exists vizex_admin_audit_time_idx on public.vizex_admin_audit(created_at desc);

alter table public.vizex_template_settings enable row level security;
alter table public.vizex_site_settings enable row level security;
alter table public.vizex_admin_events enable row level security;
alter table public.vizex_admin_audit enable row level security;
-- No client RLS policies. Admin server API uses the service role after JWT+UID checks.
-- Bank account data remains in Vercel environment variables, not these tables.
