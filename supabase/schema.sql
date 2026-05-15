create table if not exists public.binnibus_routes (
  id text primary key,
  code text not null,
  name text not null,
  kind text not null,
  origin text not null,
  destination text not null,
  color text not null,
  path jsonb not null
);

alter table public.binnibus_routes enable row level security;

create policy "Public read binnibus routes"
on public.binnibus_routes
for select
to anon
using (true);
