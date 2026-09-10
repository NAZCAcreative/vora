-- Image bytes live in Storage; profiles stores the URL and provenance.
alter table public.profiles
  add column if not exists avatar_is_generated boolean not null default false;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('teacher-portraits', 'teacher-portraits', true, 5242880,
  array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

-- Generated shared assets are written only by the administrative importer.
-- Users can manage images only under their own UUID folder.
drop policy if exists teacher_portraits_select_own on storage.objects;
create policy teacher_portraits_select_own on storage.objects for select to authenticated
  using (bucket_id = 'teacher-portraits' and (storage.foldername(name))[1] = auth.uid()::text);
drop policy if exists teacher_portraits_insert_own on storage.objects;
create policy teacher_portraits_insert_own on storage.objects for insert to authenticated
  with check (bucket_id = 'teacher-portraits' and (storage.foldername(name))[1] = auth.uid()::text);
drop policy if exists teacher_portraits_delete_own on storage.objects;
create policy teacher_portraits_delete_own on storage.objects for delete to authenticated
  using (bucket_id = 'teacher-portraits' and (storage.foldername(name))[1] = auth.uid()::text);

notify pgrst, 'reload schema';
