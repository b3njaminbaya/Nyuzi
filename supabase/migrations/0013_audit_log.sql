-- Records every write an admin makes to products, categories, orders,
-- donations, and partner_applications. Customer-initiated writes (a guest
-- placing an order, submitting a donation) are NOT logged here -- this is
-- specifically an admin action audit trail, not a general activity feed.

create table public.audit_log (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid references auth.users (id) on delete set null,
  admin_email text,
  action text not null check (action in ('insert', 'update', 'delete')),
  entity_type text not null,
  entity_id uuid,
  changes jsonb,
  created_at timestamptz not null default now()
);

alter table public.audit_log enable row level security;

create policy "admins can view the audit log"
  on public.audit_log for select
  using (public.is_admin());

-- No insert/update/delete policies for any role: the only writer is the
-- trigger below, which is security definer and bypasses RLS entirely.

create function public.log_admin_action()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is not null and public.is_admin() then
    insert into public.audit_log (admin_id, admin_email, action, entity_type, entity_id, changes)
    values (
      auth.uid(),
      (select email from auth.users where id = auth.uid()),
      lower(TG_OP),
      TG_TABLE_NAME,
      coalesce(new.id, old.id),
      case
        when TG_OP = 'DELETE' then to_jsonb(old)
        when TG_OP = 'UPDATE' then jsonb_build_object('before', to_jsonb(old), 'after', to_jsonb(new))
        else to_jsonb(new)
      end
    );
  end if;
  return coalesce(new, old);
end;
$$;

create trigger audit_products
  after insert or update or delete on public.products
  for each row execute procedure public.log_admin_action();

create trigger audit_categories
  after insert or update or delete on public.categories
  for each row execute procedure public.log_admin_action();

create trigger audit_orders
  after insert or update or delete on public.orders
  for each row execute procedure public.log_admin_action();

create trigger audit_donations
  after insert or update or delete on public.donations
  for each row execute procedure public.log_admin_action();

create trigger audit_partner_applications
  after insert or update or delete on public.partner_applications
  for each row execute procedure public.log_admin_action();
