create table if not exists public.wards (
  id uuid primary key default gen_random_uuid(),
  name text not null
    check (char_length(btrim(name)) between 2 and 80),
  created_at timestamptz not null default now()
);

create unique index if not exists wards_normalized_name_key
  on public.wards (lower(btrim(name)));

alter table public.wards enable row level security;

drop policy if exists "Anyone can read wards" on public.wards;
create policy "Anyone can read wards"
  on public.wards
  for select
  to anon, authenticated
  using (true);

drop policy if exists "Anyone can add wards" on public.wards;
create policy "Anyone can add wards"
  on public.wards
  for insert
  to anon, authenticated
  with check (true);

grant select, insert on public.wards to anon, authenticated;

insert into public.wards (name)
values
  ('Bras Cubas'),
  ('Guararema'),
  ('Mogi Centro'),
  ('Boa Vista'),
  ('Suzano'),
  ('Mogilar'),
  ('Vila Lavínia'),
  ('Jundiapeba')
on conflict ( (lower(btrim(name))) ) do nothing;
