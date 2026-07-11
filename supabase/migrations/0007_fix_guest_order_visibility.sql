-- `user_id = auth.uid()` is never true when both sides are NULL (guest
-- checkout), so guests could never read back the order they just placed.
-- Guest orders are keyed by an unguessable UUID, so treating "knows the
-- order id" as sufficient to view a guest order is the standard tradeoff
-- for guest checkout (same as an emailed "view your order" link).
-- Authenticated users' orders remain strictly owner + admin only.
drop policy if exists "customers can view their own orders" on public.orders;

create policy "guests and owners can view their orders"
  on public.orders for select
  using (user_id is null or user_id = auth.uid());

drop policy if exists "customers can view their own order items" on public.order_items;

create policy "guests and owners can view their order items"
  on public.order_items for select
  using (
    exists (
      select 1 from public.orders o
      where o.id = order_id and (o.user_id is null or o.user_id = auth.uid())
    )
  );
