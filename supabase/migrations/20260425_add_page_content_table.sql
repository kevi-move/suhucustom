-- Structured editable content for frontend pages (home/services now, extensible later)
create table if not exists public.page_content (
  id uuid default gen_random_uuid() primary key,
  page_slug text not null unique,
  content jsonb not null default '{}'::jsonb,
  version integer not null default 1,
  updated_by text,
  updated_at timestamptz not null default now()
);

create index if not exists idx_page_content_slug on public.page_content(page_slug);

alter table public.page_content enable row level security;

drop policy if exists "page_content public read" on public.page_content;
drop policy if exists "page_content authenticated write" on public.page_content;

create policy "page_content public read"
  on public.page_content
  for select
  using (true);

create policy "page_content authenticated write"
  on public.page_content
  for all
  to authenticated
  using (true)
  with check (true);

create or replace function public.bump_page_content_version()
returns trigger as $$
begin
  if tg_op = 'UPDATE' then
    new.version := old.version + 1;
    new.updated_at := now();
  end if;
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_bump_page_content_version on public.page_content;
create trigger trg_bump_page_content_version
before update on public.page_content
for each row
execute function public.bump_page_content_version();
