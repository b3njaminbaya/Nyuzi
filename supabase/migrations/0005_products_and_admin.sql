-- Product catalog + admin capabilities: a products table admins can manage,
-- admin visibility/update rights on donations and partner applications, and
-- a public storage bucket for product photos that only admins can write to.

-- Helper: is the calling user an admin? Only ever checks the caller's own
-- profile row, which their own "profiles are readable by their owner" policy
-- already permits — security definer here is just for reuse, not privilege
-- escalation.
create function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  );
$$;

create function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- 1. Products -----------------------------------------------------------------

create table public.products (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text,
  price numeric(10, 2) not null check (price >= 0),
  category text not null,
  image_url text,
  impact_label text,
  status text not null default 'draft' check (status in ('draft', 'published')),
  stock int not null default 1 check (stock >= 0),
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.products enable row level security;

create trigger set_products_updated_at
  before update on public.products
  for each row execute procedure public.touch_updated_at();

create policy "published products are publicly readable"
  on public.products for select
  using (status = 'published' or public.is_admin());

create policy "admins can insert products"
  on public.products for insert
  with check (public.is_admin());

create policy "admins can update products"
  on public.products for update
  using (public.is_admin());

create policy "admins can delete products"
  on public.products for delete
  using (public.is_admin());

-- 2. Admin visibility into donations & partner applications --------------------

create policy "admins can view all donations"
  on public.donations for select
  using (public.is_admin());

create policy "admins can update donations"
  on public.donations for update
  using (public.is_admin());

create policy "admins can view all partner applications"
  on public.partner_applications for select
  using (public.is_admin());

create policy "admins can update partner applications"
  on public.partner_applications for update
  using (public.is_admin());

-- 3. Product image storage ------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

create policy "product images are publicly readable"
  on storage.objects for select
  using (bucket_id = 'product-images');

create policy "admins can upload product images"
  on storage.objects for insert
  with check (bucket_id = 'product-images' and public.is_admin());

create policy "admins can update product images"
  on storage.objects for update
  using (bucket_id = 'product-images' and public.is_admin());

create policy "admins can delete product images"
  on storage.objects for delete
  using (bucket_id = 'product-images' and public.is_admin());
