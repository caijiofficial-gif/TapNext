-- =====================================================================
-- TapNext database (Supabase / Postgres)
-- Run this whole file once in: Supabase dashboard > SQL Editor > New query
-- =====================================================================

-- ---------- 1. PROFILES ----------
-- One row per profile. A person can have one profile per mode
-- (personal, gamer, athletic). "data" holds everything the editor saves:
-- name, headline, location, phone, email, links, slides, sections, photo URL.
create table public.profiles (
  id          uuid primary key default gen_random_uuid(),
  owner_id    uuid not null references auth.users(id) on delete cascade,
  type        text not null check (type in ('personal', 'gamer', 'athletic')),
  slug        text unique check (slug ~ '^[a-z0-9][a-z0-9-]{2,29}$'),   -- the public link: tapnext.../u/<slug>
  theme       text not null default 'light'
              check (theme in ('light', 'dark', 'navy', 'pink', 'green')),
  published   boolean not null default false,
  data        jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (owner_id, type),
  check (not published or slug is not null),          -- must have a link to publish
  check (pg_column_size(data) < 1000000)              -- usage limit: under ~1 MB per profile
);

-- ---------- 2. CARDS ----------
-- One row per physical card you sell.
--   public_id        -> written on the NFC chip inside the link (safe to be seen)
--   activation_code  -> the Lifetime Code printed in the parcel (secret)
create table public.cards (
  id               uuid primary key default gen_random_uuid(),
  public_id        text not null unique,
  activation_code  text not null unique,
  color            text not null check (color in ('black', 'white', 'navy', 'pink', 'green')),
  owner_id         uuid references auth.users(id) on delete set null,
  profile_id       uuid references public.profiles(id) on delete set null,
  activated_at     timestamptz,
  created_at       timestamptz not null default now()
);

-- ---------- 3. KEEP updated_at FRESH ----------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- ---------- 4. ROW LEVEL SECURITY (who can see / change what) ----------
alter table public.profiles enable row level security;
alter table public.cards    enable row level security;

-- Profiles: anyone can read PUBLISHED profiles (that's the page people see after a tap)
create policy "published profiles are public"
  on public.profiles for select
  to anon, authenticated
  using (published);

-- Profiles: owners can read, create, edit and delete their own (including drafts)
create policy "owners read own profiles"
  on public.profiles for select
  to authenticated
  using (owner_id = auth.uid());

create policy "owners create own profiles"
  on public.profiles for insert
  to authenticated
  with check (owner_id = auth.uid());

create policy "owners update own profiles"
  on public.profiles for update
  to authenticated
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

create policy "owners delete own profiles"
  on public.profiles for delete
  to authenticated
  using (owner_id = auth.uid());

-- Cards: owners can see their own cards. Nobody can list cards or read codes.
create policy "owners read own cards"
  on public.cards for select
  to authenticated
  using (owner_id = auth.uid());

-- Owners may only change which profile their card opens, and only to a profile they own
revoke insert, update, delete on public.cards from anon, authenticated;
grant update (profile_id) on public.cards to authenticated;

create policy "owners assign own profile to card"
  on public.cards for update
  to authenticated
  using (owner_id = auth.uid())
  with check (
    owner_id = auth.uid()
    and (profile_id is null
         or exists (select 1 from public.profiles p
                    where p.id = profile_id and p.owner_id = auth.uid()))
  );

-- ---------- 5. FUNCTIONS THE WEBSITE CALLS ----------

-- Activate a card with the Lifetime Code from the parcel (user must be signed in)
create or replace function public.activate_card(p_code text)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_public_id text;
begin
  if auth.uid() is null then
    raise exception 'Please sign in first';
  end if;

  update public.cards
     set owner_id = auth.uid(), activated_at = now()
   where activation_code = upper(trim(p_code))
     and owner_id is null
  returning public_id into v_public_id;

  if v_public_id is null then
    raise exception 'Invalid or already used code';
  end if;

  return v_public_id;
end;
$$;

-- When a card is tapped, find the published profile link it points to
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
$$;

revoke all on function public.activate_card(text) from public;
revoke all on function public.resolve_card(text)  from public;
grant execute on function public.activate_card(text) to authenticated;
grant execute on function public.resolve_card(text)  to anon, authenticated;

-- ---------- 6. TEST DATA: make 5 sample cards (one per color) ----------
-- Run this to get codes to test with. Look at the result in the Table Editor > cards.
insert into public.cards (public_id, activation_code, color)
select substr(replace(gen_random_uuid()::text, '-', ''), 1, 8),
       upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 16)),
       c
from unnest(array['black', 'white', 'navy', 'pink', 'green']) as c;