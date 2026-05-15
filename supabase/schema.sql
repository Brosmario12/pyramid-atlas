create table if not exists public.pyramids (
  id text primary key,
  name text not null,
  country text not null,
  region text not null,
  civilization text not null,
  period text not null,
  latitude double precision not null,
  longitude double precision not null,
  "elevationMeters" double precision,
  "heightMeters" double precision,
  "sourceUrl" text not null,
  "imageUrl" text not null,
  "updatedAt" timestamptz not null default now()
);

alter table public.pyramids enable row level security;

create policy "Public read pyramids"
on public.pyramids
for select
to anon
using (true);
