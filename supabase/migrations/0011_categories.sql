-- Real categories instead of free-text product.category, so every product
-- is linked to a controlled, admin-managed vocabulary.

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  created_at timestamptz not null default now()
);

alter table public.categories enable row level security;

create policy "categories are publicly readable"
  on public.categories for select
  using (true);

create policy "admins can insert categories"
  on public.categories for insert
  with check (public.is_admin());

create policy "admins can update categories"
  on public.categories for update
  using (public.is_admin());

create policy "admins can delete categories"
  on public.categories for delete
  using (public.is_admin());

-- Seed categories from whatever free-text values already exist on products,
-- so existing rows keep working.
insert into public.categories (name, slug)
select distinct category, lower(regexp_replace(trim(category), '[^a-zA-Z0-9]+', '-', 'g'))
from public.products
where category is not null
on conflict (name) do nothing;

alter table public.products add column category_id uuid references public.categories (id);

update public.products p
set category_id = c.id
from public.categories c
where p.category = c.name;

alter table public.products alter column category_id set not null;
alter table public.products drop column category;
