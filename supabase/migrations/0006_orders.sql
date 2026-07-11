-- Orders + line items for real checkout. Accounts stay optional (matching
-- donations/partner_applications), so guest checkout is supported.

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete set null default auth.uid(),
  status text not null default 'pending_payment' check (
    status in ('pending_payment', 'awaiting_manual_payment', 'paid', 'payment_failed', 'fulfilled', 'cancelled')
  ),
  payment_method text not null default 'mpesa' check (payment_method in ('mpesa', 'manual')),
  total_amount numeric(10, 2) not null check (total_amount >= 0),
  customer_name text not null,
  customer_phone text not null,
  customer_email text,
  shipping_address text not null,
  mpesa_checkout_request_id text,
  mpesa_receipt_number text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.orders enable row level security;

create trigger set_orders_updated_at
  before update on public.orders
  for each row execute procedure public.touch_updated_at();

create policy "anyone can create an order"
  on public.orders for insert
  with check (user_id is null or user_id = auth.uid());

create policy "customers can view their own orders"
  on public.orders for select
  using (user_id = auth.uid());

create policy "admins can view all orders"
  on public.orders for select
  using (public.is_admin());

create policy "admins can update orders"
  on public.orders for update
  using (public.is_admin());

-- 2. Order items -----------------------------------------------------------

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  product_id uuid references public.products (id) on delete set null,
  title text not null,
  price numeric(10, 2) not null check (price >= 0),
  quantity int not null check (quantity > 0),
  created_at timestamptz not null default now()
);

alter table public.order_items enable row level security;

create policy "order items can be created alongside their order"
  on public.order_items for insert
  with check (
    exists (
      select 1 from public.orders o
      where o.id = order_id and (o.user_id is null or o.user_id = auth.uid())
    )
  );

create policy "customers can view their own order items"
  on public.order_items for select
  using (
    exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid())
  );

create policy "admins can view all order items"
  on public.order_items for select
  using (public.is_admin());
