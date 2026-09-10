import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { createClient } from '@supabase/supabase-js';
import nextEnv from '@next/env';

nextEnv.loadEnvConfig(process.cwd());
const project = 'nwuanuqblzzikhrpwzwd';
const baseUrl = `https://${project}.supabase.co`;
const bucket = 'teacher-portraits';
const apply = process.argv.includes('--apply');
const token = (process.env.SUPABASE_ACCESS_TOKEN || readFileSync(0, 'utf8')).trim();
if (!token) throw new Error('Set SUPABASE_ACCESS_TOKEN or provide it on stdin.');
if (process.env.NEXT_PUBLIC_SUPABASE_URL !== baseUrl) throw new Error('Project URL mismatch.');

async function management(path, body) {
  const response = await fetch(`https://api.supabase.com/v1/projects/${project}/${path}`, {
    method: body ? 'POST' : 'GET',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  // Do not log responses from key endpoints or authentication headers.
  if (!response.ok) throw new Error(`Management ${path}: HTTP ${response.status}`);
  return response.json();
}
const sql = (query, readOnly = false) => management('database/query', { query, read_only: readOnly });
const quote = (value) => `'${value.replaceAll("'", "''")}'`;
const hash = (bytes) => createHash('sha256').update(bytes).digest('hex');

async function main() {
  const manifest = JSON.parse(readFileSync('supabase/seed/teacher-portraits.json', 'utf8'));
  const assets = new Map();
  for (const [id, path] of Object.entries(manifest)) {
    if (!/^[a-f0-9-]{36}$/.test(id) || !/^\/img\/generated\/teachers\/[a-z-]+\.png$/.test(path)) {
      throw new Error('Invalid portrait manifest entry.');
    }
    if (!assets.has(path)) {
      const bytes = readFileSync(`public${path}`);
      const digest = hash(bytes);
      assets.set(path, { bytes, object: `generated/${digest.slice(0, 16)}-${path.split('/').at(-1)}`, digest });
    }
  }
  const ids = Object.keys(manifest).map(quote).join(',');
  const before = await sql(`select p.id, p.avatar_url from public.profiles p
    join public.teacher_profiles t on t.profile_id = p.id where p.id in (${ids})`, true);
  if (before.length !== Object.keys(manifest).length) throw new Error('Teacher manifest does not match project profiles.');
  console.log(JSON.stringify({ mode: apply ? 'apply' : 'dry-run', project, teachers: before.length,
    assets: assets.size, emptyAvatars: before.filter((p) => !p.avatar_url).length }));
  if (!apply) return;

  mkdirSync('.tmp', { recursive: true });
  writeFileSync(`.tmp/teacher-portraits-before-${Date.now()}.json`, JSON.stringify(before, null, 2));
  const migration = readFileSync('supabase/migrations/0010_teacher_portraits.sql', 'utf8');
  await sql(`begin;\n${migration}\ncommit;`);
  const keys = await management('api-keys');
  const serviceKey = keys.find((key) => key.name === 'service_role')?.api_key;
  if (!serviceKey) throw new Error('Service role key unavailable.');
  const admin = createClient(baseUrl, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });

  for (const [path, asset] of assets) {
    const { error } = await admin.storage.from(bucket).upload(asset.object, asset.bytes,
      { contentType: 'image/png', cacheControl: '31536000', upsert: false });
    if (error && !['409', 'Duplicate'].includes(String(error.statusCode)) && !/already exists/i.test(error.message)) {
      throw new Error(`Upload failed for ${path}: ${error.message}`);
    }
    const { data } = admin.storage.from(bucket).getPublicUrl(asset.object);
    const response = await fetch(data.publicUrl);
    if (!response.ok || hash(Buffer.from(await response.arrayBuffer())) !== asset.digest) {
      throw new Error(`Public image verification failed: ${path}`);
    }
    asset.url = data.publicUrl;
    console.log(`Verified ${path.split('/').at(-1)}`);
  }

  // Only fill empty avatars; preserve any photos uploaded since the preview was created.
  const values = Object.entries(manifest).map(([id, path]) => `(${quote(id)}::uuid, ${quote(assets.get(path).url)})`).join(',\n');
  const updated = await sql(`with portraits(id, url) as (values ${values}), changed as (
    update public.profiles p set avatar_url = portraits.url, avatar_is_generated = true
    from portraits where p.id = portraits.id and (p.avatar_url is null or p.avatar_url = '')
    returning p.id
  ) select count(*)::int as updated from changed;`);
  const verified = await sql(`select count(*)::int as teachers,
    count(*) filter (where p.avatar_url is not null and p.avatar_url <> '')::int as with_avatar,
    count(*) filter (where p.avatar_is_generated)::int as generated
    from public.profiles p join public.teacher_profiles t on t.profile_id = p.id where p.id in (${ids})`, true);
  if (verified[0].with_avatar !== before.length) throw new Error('Some teachers still have no avatar.');
  console.log(JSON.stringify({ updated: updated[0].updated, verified: verified[0] }));
}

main().catch((error) => { console.error(error.message); process.exitCode = 1; });
