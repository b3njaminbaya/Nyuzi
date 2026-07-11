-- The 0007 fix for guest order visibility used `user_id is null or user_id =
-- auth.uid()` as a SELECT policy. RLS filters rows, not query shape, so that
-- policy actually let ANYONE bulk-list every guest order (name, phone,
-- address) via `select * from orders` with no filter at all -- not just
-- look up one they already knew the id of. Tightening the table policy back
-- to owner/admin only, and moving guest "know the id" lookups to a
-- security-definer function that only ever returns the one row requested.

drop policy if exists "guests and owners can view their orders" on public.orders;
create policy "owners and admins can view their orders"
  on public.orders for select
  using (user_id = auth.uid());

drop policy if exists "guests and owners can view their order items" on public.order_items;
create policy "owners and admins can view their order items"
  on public.order_items for select
  using (
    exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid())
  );

create function public.get_order_by_id(order_id uuid)
returns setof public.orders
language sql
security definer
set search_path = public
stable
as $$
  select o.* from public.orders o
  where o.id = order_id
    and (o.user_id is null or o.user_id = auth.uid() or public.is_admin());
$$;

grant execute on function public.get_order_by_id(uuid) to anon, authenticated;
