-- VIZEX v19: run AFTER v13 / v14 migrations; this does NOT modify customer orders or payment state.
create table if not exists public.vizex_template_animations (
  template_id text primary key,
  config jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
alter table public.vizex_template_animations enable row level security;
-- No policies: database reads and writes occur only via server-side service role.
-- Uploaded ornament PNG/JPG/WEBP files are public so they can render on published invitations.
insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
values ('vizex-template-assets','vizex-template-assets',true,2097152,array['image/png','image/jpeg','image/webp'])
on conflict (id) do update set public=true,file_size_limit=2097152,allowed_mime_types=array['image/png','image/jpeg','image/webp'];
-- No anonymous INSERT/UPDATE/DELETE storage policies; only service-role-backed admin API writes.
