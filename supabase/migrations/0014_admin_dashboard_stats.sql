-- Not security definer on purpose: this runs under the caller's own RLS,
-- so it only ever aggregates rows an admin can already see via the
-- existing "admins can view all X" policies.
create function public.get_admin_dashboard_stats()
returns table(
  total_revenue numeric,
  paid_orders_count bigint,
  total_orders_count bigint,
  donations_count bigint,
  pending_donations_count bigint,
  pending_partner_applications_count bigint,
  published_products_count bigint
)
language sql
stable
as $$
  select
    (select coalesce(sum(total_amount), 0) from public.orders where status = 'paid'),
    (select count(*) from public.orders where status = 'paid'),
    (select count(*) from public.orders),
    (select count(*) from public.donations),
    (select count(*) from public.donations where status = 'submitted'),
    (select count(*) from public.partner_applications where status = 'pending'),
    (select count(*) from public.products where status = 'published');
$$;

grant execute on function public.get_admin_dashboard_stats() to authenticated;
