-- Cached translations for multilingual pages (DeepL + hreflang SEO)
create table if not exists public.content_translations (
  id uuid default gen_random_uuid() primary key,
  source_type text not null,
  source_id text not null,
  locale text not null,
  content jsonb not null default '{}'::jsonb,
  source_version integer not null default 1,
  updated_at timestamptz not null default now(),
  unique (source_type, source_id, locale)
);

create index if not exists idx_content_translations_lookup
  on public.content_translations (source_type, source_id, locale);

alter table public.content_translations enable row level security;

drop policy if exists "content_translations public read" on public.content_translations;
create policy "content_translations public read"
  on public.content_translations
  for select
  using (true);

drop policy if exists "content_translations service write" on public.content_translations;
create policy "content_translations service write"
  on public.content_translations
  for all
  to service_role
  using (true)
  with check (true);
