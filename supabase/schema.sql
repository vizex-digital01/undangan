-- Run once in Supabase SQL Editor.
create extension if not exists pgcrypto;
create table if not exists public.invitations (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 slug text unique not null,
 template_id text not null,
 data jsonb not null default '{}'::jsonb,
 status text not null default 'draft' check(status in ('draft','published')),
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
create table if not exists public.orders (
 id text primary key,
 invitation_id uuid not null references public.invitations(id) on delete cascade,
 user_id uuid not null references auth.users(id) on delete cascade,
 amount integer not null check(amount in (19000,29000,39000,59000)),
 status text not null default 'pending' check(status in ('pending','failed','paid')),
 created_at timestamptz not null default now()
);
alter table public.invitations enable row level security;
alter table public.orders enable row level security;
-- No direct user write policies: all writes go through authenticated server API.
create policy "User can read own invitations" on public.invitations for select to authenticated using (auth.uid()=user_id);
create policy "User can read own orders" on public.orders for select to authenticated using (auth.uid()=user_id);
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
 values('invite-photos','invite-photos',false,4194304,array['image/jpeg','image/png','image/webp'])
 on conflict(id) do nothing;
-- Service-role RPC: uses one transaction so paid+published is atomic.
create or replace function public.confirm_invite_payment(p_order_id text)
returns void language plpgsql security definer set search_path = public as $$
declare target uuid;
begin
 select invitation_id into target from public.orders where id=p_order_id and status in ('pending','paid') for update;
 if target is null then raise exception 'Order not found'; end if;
 update public.orders set status='paid' where id=p_order_id;
 update public.invitations set status='published',updated_at=now() where id=target;
end;$$;
revoke all on function public.confirm_invite_payment(text) from public,anon,authenticated;
grant execute on function public.confirm_invite_payment(text) to service_role;
