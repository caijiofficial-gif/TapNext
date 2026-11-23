-- =====================================================================
-- TapNext: card tap status (run ONCE after subscription.sql)
-- Supabase dashboard > SQL Editor > New query > paste > Run
-- Lets the tap page explain WHY a card can't open a profile yet,
-- instead of sending everybody back to the start.
-- =====================================================================
create or replace function public.card_status(p_public_id text)
returns text
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  c   public.cards%rowtype;
  s   text;
  pub boolean;
begin
  select * into c from public.cards where public_id = p_public_id;
  if not found then return 'unknown'; end if;              -- no such card
  if c.owner_id is null then return 'unclaimed'; end if;   -- not activated yet

  select p.slug, p.published into s, pub
    from public.profiles p where p.id = c.profile_id;
  if s is null or not coalesce(pub, false) then return 'empty'; end if;   -- no published profile

  if c.paid_until is null or c.paid_until <= now() then return 'inactive'; end if;  -- plan not paid
  return 'ok:' || s;
end;
$$;

revoke all on function public.card_status(text) from public;
grant execute on function public.card_status(text) to anon, authenticated;
