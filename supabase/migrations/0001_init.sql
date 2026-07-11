-- Nyuzi initial schema: accounts are optional, so every submission table
-- accepts anonymous writes and only exposes rows back to their own owner.

-- 1. Profiles ---------------------------------------------------------------

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  role text not null default 'donor' check (role in ('donor', 'buyer', 'partner', 'admin')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles are readable by their owner"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles are editable by their owner"
  on public.profiles for update
  using (auth.uid() = id);

-- Auto-create a profile row whenever someone signs up.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 2. Donations ----------------------------------------------------------------

create table public.donations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete set null default auth.uid(),
  title text not null,
  category text not null check (category in ('clothing', 'shoes', 'accessories', 'other')),
  condition int not null check (condition between 0 and 100),
  notes text,
  photo_count int not null default 0,
  pickup_requested boolean not null default false,
  status text not null default 'submitted' check (status in ('submitted', 'scheduled', 'collected', 'processed')),
  created_at timestamptz not null default now()
);

alter table public.donations enable row level security;

create policy "anyone can submit a donation"
  on public.donations for insert
  with check (user_id is null or user_id = auth.uid());

create policy "donors can view their own donations"
  on public.donations for select
  using (user_id = auth.uid());

-- 3. Partner applications -----------------------------------------------------

create table public.partner_applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete set null default auth.uid(),
  full_name text not null,
  email text not null,
  organization text not null,
  partnership_type text not null check (
    partnership_type in ('Upcycling Studio', 'Recycler', 'Logistics Provider', 'NGO')
  ),
  message text not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now()
);

alter table public.partner_applications enable row level security;

create policy "anyone can submit a partner application"
  on public.partner_applications for insert
  with check (user_id is null or user_id = auth.uid());

create policy "applicants can view their own application"
  on public.partner_applications for select
  using (user_id = auth.uid());

-- 4. Newsletter signups --------------------------------------------------------

create table public.newsletter_signups (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz not null default now()
);

alter table public.newsletter_signups enable row level security;

create policy "anyone can subscribe"
  on public.newsletter_signups for insert
  with check (true);
