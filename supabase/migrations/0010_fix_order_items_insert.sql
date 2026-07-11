-- The order_items INSERT policy checks its parent order via a subquery on
-- public.orders. That subquery is itself subject to the orders table's own
-- RLS, which 0009 tightened to owner-only -- so for a guest order (user_id
-- is null, auth.uid() is null), the subquery can never see the row it just
-- inserted, and order_items insert fails for every guest checkout. Moving
-- the ownership check into a security-definer function (same pattern as
-- is_admin() and get_order_by_id()) so it isn't subject to that RLS.

create function public.order_is_insertable(p_order_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.orders o
    where o.id = p_order_id and (o.user_id is null or o.user_id = auth.uid())
  );
$$;

grant execute on function public.order_is_insertable(uuid) to anon, authenticated;

drop policy if exists "order items can be created alongside their order" on public.order_items;

create policy "order items can be created alongside their order"
  on public.order_items for insert
  with check (public.order_is_insertable(order_id));
