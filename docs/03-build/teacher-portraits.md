# Teacher portrait storage

Image bytes are in the public Supabase Storage bucket `teacher-portraits`. `public.profiles.avatar_url` stores the public URL; `avatar_is_generated` records whether to show the AI image label. All teacher cards and the detail page read these fields through the existing `teacher_profiles -> profiles` relationship. There is no frontend ID-to-image mapping.

- Project: `nwuanuqblzzikhrpwzwd`
- Migration: `supabase/migrations/0010_teacher_portraits.sql`
- Imported: 12 generated assets assigned to 104 teacher profiles.
- Shared generated assets use immutable content-hashed paths under `generated/`.
- User photos use `<auth.uid()>/<random UUID>.<extension>`.
- Public image downloads are allowed. Authenticated users can insert, read metadata, and delete only within their own UUID folder. Shared generated assets require administrative access to write.
- The profile edit screen uploads JPG, PNG, or WebP up to 5 MB, then saves the URL and clears the generated flag. If the DB update fails, the newly uploaded object is removed. Existing photos are not overwritten.

## Import

The import-only manifest is `supabase/seed/teacher-portraits.json`; original images remain in `public/img/generated/teachers/` as source assets. `scripts/sync-teacher-portraits.mjs` validates the target project and teacher IDs, backs up previous URL values in ignored `.tmp/`, applies the idempotent migration, uploads assets, verifies their public SHA-256 hashes, then fills empty avatar URLs in one database statement. Existing nonempty avatar URLs are preserved. Service credentials remain in process memory and are never written to files.

Provide `SUPABASE_ACCESS_TOKEN` through the environment or stdin. Do not commit access tokens. Run:

```sh
node scripts/sync-teacher-portraits.mjs          # read-only preview
node scripts/sync-teacher-portraits.mjs --apply  # upload and persist
```

Implementation references: [Supabase bucket creation](https://supabase.com/docs/guides/storage/buckets/creating-buckets), [Storage uploads](https://supabase.com/docs/reference/javascript/storage-from-upload), [Management SQL API](https://supabase.com/docs/reference/api/v1-run-a-query).

## Validation

`node tests/teacherPortraits.test.cjs` covers file validation, account ownership, upload failures, cleanup after a DB failure, and successful URL persistence. Remote checks verified all 104 URL values, all 12 optimized images, and rejection of unauthenticated Storage writes. TypeScript and targeted ESLint checks pass. Authenticated browser interaction was not automated.
