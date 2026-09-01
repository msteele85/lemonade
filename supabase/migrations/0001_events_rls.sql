-- Lock down the analytics events table.
--
-- Resolves two Supabase security alerts on the `events` table:
--   rls_disabled_in_public   — anyone with the project URL could read/edit/delete
--   sensitive_columns_exposed — session_id and free-form metadata were readable
--
-- The app writes events from the browser using the public anon key, so anon
-- must keep INSERT. It must not keep anything else: before this migration the
-- anon key could SELECT all rows, INSERT forged rows, and DELETE the table's
-- contents.
--
-- IMPORTANT: create the policy BEFORE enabling RLS. Enabling RLS with no
-- insert policy in place denies writes, and lib/analytics.ts swallows errors
-- by design — so analytics would stop silently and look completely normal.

begin;

drop policy if exists "anon can insert events" on public.events;

create policy "anon can insert events"
  on public.events
  for insert
  to anon
  with check (true);

-- With RLS on, anything not granted by a policy is denied. Only the INSERT
-- policy above exists, so anon SELECT / UPDATE / DELETE are all refused.
-- Reads still work from the SQL editor and any server-side service-role
-- client, both of which bypass RLS.
alter table public.events enable row level security;

commit;
