-- VIZEX SeaBank manual payment: RUN ONCE after existing schema.sql.
-- Additive migration; does not remove existing invitations/orders.
alter table public.orders add column if not exists payment_method text;
alter table public.orders add column if not exists proof_path text;
alter table public.orders add column if not exists submitted_at timestamptz;
alter table public.orders add column if not exists reviewed_at timestamptz;
alter table public.orders add column if not exists reviewed_by uuid;
alter table public.orders add column if not exists admin_note text;
-- Make the existing check constraint support submitted/rejected states.
alter table public.orders drop constraint if exists orders_status_check;
alter table public.orders add constraint orders_status_check check (status in ('pending','submitted','rejected','failed','paid'));
create index if not exists vizex_orders_user_idx on public.orders(user_id, created_at desc);
create index if not exists vizex_orders_review_idx on public.orders(status, submitted_at desc);
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values ('payment-proofs','payment-proofs',false,4194304,array['image/jpeg','image/png','image/webp','application/pdf'])
on conflict(id) do nothing;
-- Only service role can execute. Locks the order; no self-approval by customers.
create or replace function public.review_manual_order(p_order_id text,p_approve boolean,p_reviewer uuid,p_note text default null)
returns void language plpgsql security definer set search_path=public as $$
declare v_inv uuid; v_status text; v_method text; v_proof text;
begin
  select invitation_id,status,payment_method,proof_path into v_inv,v_status,v_method,v_proof
  from public.orders where id=p_order_id for update;
  if not found then raise exception 'Pesanan tidak ditemukan'; end if;
  if v_method <> 'seabank_manual' or v_status <> 'submitted' or v_proof is null then
    raise exception 'Pesanan bukan bukti transfer yang menunggu tinjauan';
  end if;
  update public.orders set status=case when p_approve then 'paid' else 'rejected' end,
      reviewed_at=now(),reviewed_by=p_reviewer,admin_note=left(coalesce(p_note,''),500)
  where id=p_order_id;
  if p_approve then
    update public.invitations set status='published',updated_at=now() where id=v_inv;
  end if;
end; $$;
revoke all on function public.review_manual_order(text,boolean,uuid,text) from public,anon,authenticated;
grant execute on function public.review_manual_order(text,boolean,uuid,text) to service_role;
