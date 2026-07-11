-- The insert policy for newsletter_signups didn't get created in 0001_init.sql
-- (RLS was enabled with no matching policy, so all inserts were denied).
drop policy if exists "anyone can subscribe" on public.newsletter_signups;

create policy "anyone can subscribe"
  on public.newsletter_signups for insert
  with check (true);
