-- donations/partner_applications policies have no `to` clause (defaults to
-- PUBLIC) and work correctly. The newsletter policy was scoped `to anon,
-- authenticated` explicitly, which somehow isn't matching at runtime.
-- Dropping the role scope to match the pattern that's proven to work.
drop policy if exists "anyone can subscribe" on public.newsletter_signups;

create policy "anyone can subscribe"
  on public.newsletter_signups
  for insert
  with check (true);
