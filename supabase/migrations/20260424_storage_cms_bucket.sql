-- Public bucket for blog / editor images (uploaded by authenticated users only)
insert into storage.buckets (id, name, public)
values ('cms', 'cms', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "cms objects public read" on storage.objects;
drop policy if exists "cms objects authenticated insert" on storage.objects;
drop policy if exists "cms objects authenticated update" on storage.objects;
drop policy if exists "cms objects authenticated delete" on storage.objects;

create policy "cms objects public read"
  on storage.objects for select
  using (bucket_id = 'cms');

create policy "cms objects authenticated insert"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'cms');

create policy "cms objects authenticated update"
  on storage.objects for update to authenticated
  using (bucket_id = 'cms')
  with check (bucket_id = 'cms');

create policy "cms objects authenticated delete"
  on storage.objects for delete to authenticated
  using (bucket_id = 'cms');

drop policy if exists "cms objects service role write" on storage.objects;
create policy "cms objects service role write"
  on storage.objects for all to service_role
  using (bucket_id = 'cms')
  with check (bucket_id = 'cms');
