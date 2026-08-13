create extension if not exists "pgcrypto";

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.households (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 80),
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.household_members (
  household_id uuid not null references public.households(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null default 'member' check (role in ('owner', 'member')),
  joined_at timestamptz not null default now(),
  primary key (household_id, user_id)
);

create table public.bills (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  created_by uuid not null default auth.uid() references public.profiles(id),
  supplier text not null check (char_length(supplier) between 1 and 120),
  category text not null check (category in ('el', 'forsakring', 'mobil', 'mat', 'hantverk')),
  amount numeric(12, 2) not null check (amount >= 0),
  due_date date not null,
  status text not null default 'upcoming' check (status in ('upcoming', 'paid', 'overdue')),
  source text not null default 'manuell' check (source in ('ocr', 'manuell', 'open_banking')),
  notes text check (char_length(notes) <= 2000),
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.chores (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  created_by uuid not null default auth.uid() references public.profiles(id),
  title text not null check (char_length(title) between 1 and 160),
  assignee_id uuid references public.profiles(id) on delete set null,
  assignee_name text check (char_length(assignee_name) <= 80),
  due_date date not null,
  status text not null default 'open' check (status in ('open', 'done')),
  category text not null default 'hem' check (category in ('stadning', 'hem', 'inkop', 'ovrigt')),
  recurrence text check (recurrence in ('varje_vecka', 'varannan_vecka', 'varje_manad')),
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index bills_household_due_date_idx on public.bills(household_id, due_date);
create index chores_household_due_date_idx on public.chores(household_id, due_date);
create index household_members_user_idx on public.household_members(user_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at before update on public.profiles for each row execute function public.set_updated_at();
create trigger households_set_updated_at before update on public.households for each row execute function public.set_updated_at();
create trigger bills_set_updated_at before update on public.bills for each row execute function public.set_updated_at();
create trigger chores_set_updated_at before update on public.chores for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1)));
  return new;
end;
$$;

create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

create or replace function public.add_household_owner()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.household_members (household_id, user_id, role)
  values (new.id, new.created_by, 'owner');
  return new;
end;
$$;

create trigger on_household_created after insert on public.households for each row execute function public.add_household_owner();

create or replace function public.is_household_member(target_household uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.household_members
    where household_id = target_household and user_id = auth.uid()
  );
$$;

create or replace function public.is_household_owner(target_household uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.household_members
    where household_id = target_household and user_id = auth.uid() and role = 'owner'
  );
$$;

alter table public.profiles enable row level security;
alter table public.households enable row level security;
alter table public.household_members enable row level security;
alter table public.bills enable row level security;
alter table public.chores enable row level security;

create policy "profiles_read_shared_household" on public.profiles for select to authenticated
using (
  id = auth.uid() or exists (
    select 1
    from public.household_members mine
    join public.household_members theirs on mine.household_id = theirs.household_id
    where mine.user_id = auth.uid() and theirs.user_id = profiles.id
  )
);
create policy "profiles_update_self" on public.profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

create policy "households_create" on public.households for insert to authenticated with check (created_by = auth.uid());
create policy "households_read_members" on public.households for select to authenticated using (public.is_household_member(id));
create policy "households_update_owners" on public.households for update to authenticated using (public.is_household_owner(id)) with check (public.is_household_owner(id));
create policy "households_delete_owners" on public.households for delete to authenticated using (public.is_household_owner(id));

create policy "members_read_household" on public.household_members for select to authenticated using (public.is_household_member(household_id));
create policy "members_add_by_owner" on public.household_members for insert to authenticated with check (public.is_household_owner(household_id));
create policy "members_update_by_owner" on public.household_members for update to authenticated using (public.is_household_owner(household_id)) with check (public.is_household_owner(household_id));
create policy "members_remove_by_owner_or_self" on public.household_members for delete to authenticated using (public.is_household_owner(household_id) or user_id = auth.uid());

create policy "bills_read_members" on public.bills for select to authenticated using (public.is_household_member(household_id));
create policy "bills_create_members" on public.bills for insert to authenticated with check (public.is_household_member(household_id) and created_by = auth.uid());
create policy "bills_update_members" on public.bills for update to authenticated using (public.is_household_member(household_id)) with check (public.is_household_member(household_id));
create policy "bills_delete_creator_or_owner" on public.bills for delete to authenticated using (created_by = auth.uid() or public.is_household_owner(household_id));

create policy "chores_read_members" on public.chores for select to authenticated using (public.is_household_member(household_id));
create policy "chores_create_members" on public.chores for insert to authenticated with check (public.is_household_member(household_id) and created_by = auth.uid());
create policy "chores_update_members" on public.chores for update to authenticated using (public.is_household_member(household_id)) with check (public.is_household_member(household_id));
create policy "chores_delete_creator_or_owner" on public.chores for delete to authenticated using (created_by = auth.uid() or public.is_household_owner(household_id));

grant usage on schema public to authenticated;
grant select, insert, update, delete on public.profiles, public.households, public.household_members, public.bills, public.chores to authenticated;
grant execute on function public.is_household_member(uuid), public.is_household_owner(uuid) to authenticated;
