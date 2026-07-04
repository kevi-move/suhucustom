-- 在 Supabase 控制台运行此文件即可启用联系表单
-- 路径：Supabase → SQL Editor → New query → 粘贴全部 → Run

create table if not exists public.inquiries (
  id uuid default gen_random_uuid() primary key,
  full_name text not null,
  email text not null,
  company text,
  phone text,
  product_category text,
  estimated_qty text,
  target_market text,
  lead_time text,
  message text not null,
  source_page text not null default '/contact-us',
  status text not null default 'new' check (status in ('new', 'processing', 'closed')),
  created_at timestamptz not null default now()
);

create index if not exists idx_inquiries_created_at on public.inquiries(created_at desc);
create index if not exists idx_inquiries_status on public.inquiries(status);

alter table public.inquiries enable row level security;

drop policy if exists "inquiries anon insert" on public.inquiries;
drop policy if exists "inquiries authenticated select" on public.inquiries;
drop policy if exists "inquiries authenticated update" on public.inquiries;
drop policy if exists "inquiries authenticated delete" on public.inquiries;

create policy "inquiries anon insert"
  on public.inquiries
  for insert
  to anon, authenticated
  with check (true);

create policy "inquiries authenticated select"
  on public.inquiries
  for select
  to authenticated
  using (true);

create policy "inquiries authenticated update"
  on public.inquiries
  for update
  to authenticated
  using (true)
  with check (true);

create policy "inquiries authenticated delete"
  on public.inquiries
  for delete
  to authenticated
  using (true);
