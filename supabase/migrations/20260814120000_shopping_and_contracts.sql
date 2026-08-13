create table public.shopping_items (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  created_by uuid not null default auth.uid() references public.profiles(id),
  name text not null check (char_length(name) between 1 and 160),
  quantity text not null default '1 st' check (char_length(quantity) between 1 and 60),
  category text not null default 'mat' check (category in ('mat', 'hushall', 'djur', 'ovrigt')),
  status text not null default 'open' check (status in ('open', 'done')),
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.contracts (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  created_by uuid not null default auth.uid() references public.profiles(id),
  category text not null check (category in ('forsakring', 'bredband', 'streaming_tv', 'mobil', 'el', 'vatten', 'gym')),
  subcategory text check (char_length(subcategory) <= 80),
  name text not null check (char_length(name) between 1 and 160),
  supplier text not null check (char_length(supplier) between 1 and 120),
  monthly_cost numeric(12, 2) not null default 0 check (monthly_cost >= 0),
  renewal_date date,
  notice_period_months integer check (notice_period_months between 0 and 36),
  status text not null default 'aktivt' check (status in ('aktivt', 'avslutas', 'avslutat')),
  notes text check (char_length(notes) <= 2000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index shopping_items_household_status_idx on public.shopping_items(household_id, status, created_at);
create index contracts_household_category_idx on public.contracts(household_id, category, status);
create index contracts_household_renewal_idx on public.contracts(household_id, renewal_date) where renewal_date is not null;

create trigger shopping_items_set_updated_at before update on public.shopping_items for each row execute function public.set_updated_at();
create trigger contracts_set_updated_at before update on public.contracts for each row execute function public.set_updated_at();

alter table public.shopping_items enable row level security;
alter table public.contracts enable row level security;

create policy "shopping_items_read_members" on public.shopping_items for select to authenticated using (public.is_household_member(household_id));
create policy "shopping_items_create_members" on public.shopping_items for insert to authenticated with check (public.is_household_member(household_id) and created_by = auth.uid());
create policy "shopping_items_update_members" on public.shopping_items for update to authenticated using (public.is_household_member(household_id)) with check (public.is_household_member(household_id));
create policy "shopping_items_delete_creator_or_owner" on public.shopping_items for delete to authenticated using (created_by = auth.uid() or public.is_household_owner(household_id));

create policy "contracts_read_members" on public.contracts for select to authenticated using (public.is_household_member(household_id));
create policy "contracts_create_members" on public.contracts for insert to authenticated with check (public.is_household_member(household_id) and created_by = auth.uid());
create policy "contracts_update_members" on public.contracts for update to authenticated using (public.is_household_member(household_id)) with check (public.is_household_member(household_id));
create policy "contracts_delete_creator_or_owner" on public.contracts for delete to authenticated using (created_by = auth.uid() or public.is_household_owner(household_id));

grant select, insert, update, delete on public.shopping_items, public.contracts to authenticated;
