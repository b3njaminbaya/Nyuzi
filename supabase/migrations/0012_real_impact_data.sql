-- Replace the hardcoded numbers on the Impact page with real, computed
-- data. Impact per donation is computed server-side at insert time (same
-- coefficients as the client-side estimator on the Donate page, so the
-- number a donor sees matches what's later aggregated) so it can't be
-- spoofed by a client sending arbitrary values. Only donations that have
-- actually been collected or processed count toward public totals --
-- "submitted" isn't a diverted-from-landfill claim yet.

alter table public.donations add column impact_water_l numeric;
alter table public.donations add column impact_co2_kg numeric;
alter table public.donations add column impact_landfill_m3 numeric;

create function public.compute_donation_impact()
returns trigger
language plpgsql
as $$
declare
  base_water numeric;
  base_co2 numeric;
  base_landfill numeric;
  factor numeric := new.condition / 100.0;
begin
  if new.category = 'clothing' then
    base_water := 3000; base_co2 := 3; base_landfill := 0.05;
  elsif new.category = 'shoes' then
    base_water := 1500; base_co2 := 2; base_landfill := 0.03;
  elsif new.category = 'accessories' then
    base_water := 800; base_co2 := 1; base_landfill := 0.02;
  else
    base_water := 500; base_co2 := 0.5; base_landfill := 0.01;
  end if;

  new.impact_water_l := round(base_water * factor);
  new.impact_co2_kg := round((base_co2 * factor)::numeric, 2);
  new.impact_landfill_m3 := round((base_landfill * factor)::numeric, 3);
  return new;
end;
$$;

create trigger set_donation_impact
  before insert on public.donations
  for each row execute procedure public.compute_donation_impact();

-- Public aggregate-only stats (no PII, no individual rows exposed).

create function public.get_impact_totals()
returns table(water_l numeric, co2_kg numeric, landfill_m3 numeric, items_count bigint)
language sql
security definer
set search_path = public
stable
as $$
  select coalesce(sum(impact_water_l), 0), coalesce(sum(impact_co2_kg), 0),
         coalesce(sum(impact_landfill_m3), 0), count(*)
  from public.donations
  where status in ('collected', 'processed');
$$;

grant execute on function public.get_impact_totals() to anon, authenticated;

create function public.get_impact_trend()
returns table(month text, co2_kg numeric, water_l numeric, landfill_m3 numeric)
language sql
security definer
set search_path = public
stable
as $$
  select to_char(date_trunc('month', created_at), 'Mon'),
         coalesce(sum(impact_co2_kg), 0), coalesce(sum(impact_water_l), 0), coalesce(sum(impact_landfill_m3), 0)
  from public.donations
  where status in ('collected', 'processed')
    and created_at >= date_trunc('month', now()) - interval '5 months'
  group by date_trunc('month', created_at)
  order by date_trunc('month', created_at);
$$;

grant execute on function public.get_impact_trend() to anon, authenticated;

create function public.get_recent_donation_activity(result_limit int default 5)
returns table(category text, status text, created_at timestamptz)
language sql
security definer
set search_path = public
stable
as $$
  select category, status, created_at
  from public.donations
  order by created_at desc
  limit result_limit;
$$;

grant execute on function public.get_recent_donation_activity(int) to anon, authenticated;
