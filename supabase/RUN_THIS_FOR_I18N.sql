-- 在 Supabase → SQL Editor 粘贴并 Run（启用多语言翻译缓存 + SEO 元数据表）
-- 安全可重复执行（IF NOT EXISTS / DROP POLICY IF EXISTS）

-- 1) 翻译缓存表（DeepL bootstrap 写入，前台读取）
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

-- 2) 静态页 SEO 元数据表（可选，消除 page_meta 缺失报错）
create table if not exists public.page_meta (
  id uuid default gen_random_uuid() primary key,
  page_slug text unique not null,
  meta_title text not null default '',
  meta_description text not null default '',
  updated_at timestamptz not null default now()
);

create index if not exists idx_page_meta_slug on public.page_meta(page_slug);

alter table public.page_meta enable row level security;

drop policy if exists "Anyone can read page_meta" on public.page_meta;
create policy "Anyone can read page_meta"
  on public.page_meta
  for select
  using (true);

drop policy if exists "Authenticated users can insert page_meta" on public.page_meta;
create policy "Authenticated users can insert page_meta"
  on public.page_meta
  for insert
  with check (auth.role() = 'authenticated');

drop policy if exists "Authenticated users can update page_meta" on public.page_meta;
create policy "Authenticated users can update page_meta"
  on public.page_meta
  for update
  using (auth.role() = 'authenticated');

drop policy if exists "Authenticated users can delete page_meta" on public.page_meta;
create policy "Authenticated users can delete page_meta"
  on public.page_meta
  for delete
  using (auth.role() = 'authenticated');
