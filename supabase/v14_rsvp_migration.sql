-- VIZEX v14, run AFTER v13. Does not delete or overwrite prior orders.
create extension if not exists pgcrypto;
create table if not exists public.vizex_rsvp (
 id uuid primary key default gen_random_uuid(),
 invitation_id uuid not null references public.invitations(id) on delete cascade,
 respondent_hash text not null,
 guest_name text not null check(char_length(guest_name) between 1 and 100),
 attendance text not null check(attendance in ('hadir','tidak','ragu')),
 party_size smallint not null default 0 check(party_size between 0 and 4),
 wish text not null default '' check(char_length(wish)<=500),
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 unique(invitation_id,respondent_hash),
 constraint vizex_rsvp_party_consistency check ((attendance='hadir' and party_size between 1 and 4) or (attendance<>'hadir' and party_size=0))
);
create index if not exists vizex_rsvp_by_invitation on public.vizex_rsvp(invitation_id,updated_at desc);
alter table public.vizex_rsvp enable row level security;
-- No anon SELECT/INSERT policies: public RSVP uses narrowly scoped server API,
-- owner reports use authenticated guest-session cookies; admin reports require JWT + admin UID.
