-- =====================================================================
-- TapNext: ₱5 / month subscription  (run ONCE, after schema.sql)
-- Supabase dashboard > SQL Editor > New query > paste > Run
-- =====================================================================

-- 1. Each card remembers how long it is paid for
alter table public.cards add column if not exists paid_until timestamptz;

-- 2. Helper: does this owner have an active (paid) card?
create or replace function public.owner_is_active(p_owner uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.cards
     where owner_id = p_owner
       and paid_until is not null
       and paid_until > now()
  )
$$;
revoke all on function public.owner_is_active(uuid) from public;
grant execute on function public.owner_is_active(uuid) to anon, authenticated;

-- 3. Public can only see a published profile while the owner's plan is active
drop policy if exists "published profiles are public" on public.profiles;
create policy "published profiles are public"
  on public.profiles for select
  to anon, authenticated
  using (published and public.owner_is_active(owner_id));

-- 4. Tapping a card only opens the profile while the plan is active
create or replace function public.resolve_card(p_public_id text)
returns text
language sql
stable
security definer
set search_path = public
as $$
  select p.slug
    from public.cards c
    join public.profiles p on p.id = c.profile_id
   where c.public_id = p_public_id
     and p.published
     and c.paid_until is not null
     and c.paid_until > now()
$$;

-- =====================================================================
-- HOW YOU MARK A PAYMENT (do this after you receive the ₱5 by GCash/Maribank)
-- Replace the code with the customer's card code, then Run.
-- It adds 30 days, and stacks on top of any time they have left.
-- =====================================================================
-- update public.cards
--    set paid_until = greatest(coalesce(paid_until, now()), now()) + interval '30 days'
--  where activation_code = 'PASTE-THE-CODE-HERE';

-- To test with your own card right now (gives all 5 test cards 30 days):
-- update public.cards set paid_until = now() + interval '30 days';
