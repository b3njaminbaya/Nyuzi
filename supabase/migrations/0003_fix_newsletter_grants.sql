-- Belt-and-suspenders fix: RLS policies only restrict access on top of a
-- base SQL privilege grant — they don't grant it. If anon/authenticated
-- never got table-level INSERT, the policy alone wasn't enough.
grant insert on public.newsletter_signups to anon, authenticated;

drop policy if exists "anyone can subscribe" on public.newsletter_signups;

create policy "anyone can subscribe"
  on public.newsletter_signups
  for insert
  to anon, authenticated
  with check (true);
