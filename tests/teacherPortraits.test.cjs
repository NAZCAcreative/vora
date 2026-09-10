const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

const compiled = ts.transpileModule(fs.readFileSync('src/lib/queries/teacherPortraits.ts', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;
const profileId = '4e827ccb-c588-49c0-a78c-be9cde1a772e';
const photo = { type: 'image/png', size: 1024 };

function setup(options = {}) {
  const calls = [];
  const storage = {
    upload: async (path) => { calls.push(['upload', path]); return { error: options.uploadError }; },
    getPublicUrl: (path) => ({ data: { publicUrl: `https://example.test/${path}` } }),
    remove: async (paths) => { calls.push(['remove', Array.from(paths)]); return { error: null }; },
  };
  const client = {
    auth: { getUser: async () => ({ data: { user: options.user === undefined ? { id: profileId } : options.user }, error: null }) },
    storage: { from: (bucket) => { assert.equal(bucket, 'teacher-portraits'); return storage; } },
    from: (table) => {
      assert.equal(table, 'profiles');
      return { update: (values) => {
        calls.push(['update', JSON.parse(JSON.stringify(values))]);
        return { eq: (field, id) => {
          assert.equal(field, 'id'); assert.equal(id, profileId);
          return { select: () => ({ single: async () => ({ error: options.updateError }) }) };
        } };
      } };
    },
  };
  const context = { exports: {}, crypto: { randomUUID: () => 'unique-photo-id' }, require: () => ({ createClient: () => client }) };
  vm.runInNewContext(compiled, context);
  return { upload: context.exports.uploadTeacherPortrait, calls };
}

test('invalid formats and oversized files never reach storage', async () => {
  const { upload, calls } = setup();
  await assert.rejects(upload(profileId, { type: 'image/svg+xml', size: 100 }));
  await assert.rejects(upload(profileId, { type: 'image/png', size: 5242881 }));
  await assert.rejects(upload(profileId, { type: 'image/png', size: 0 }));
  assert.equal(calls.length, 0);
});

test('signed-out users and a different profile cannot upload', async () => {
  for (const user of [null, { id: 'different-user' }]) {
    const { upload, calls } = setup({ user });
    await assert.rejects(upload(profileId, photo));
    assert.equal(calls.length, 0);
  }
});

test('failed storage upload never changes the profile', async () => {
  const { upload, calls } = setup({ uploadError: { message: 'Denied' } });
  await assert.rejects(upload(profileId, photo));
  assert.deepEqual(calls.map(([action]) => action), ['upload']);
});

test('failed database update cleans up only the new object', async () => {
  const { upload, calls } = setup({ updateError: { message: 'Database unavailable' } });
  await assert.rejects(upload(profileId, photo));
  assert.deepEqual(calls.at(-1), ['remove', [`${profileId}/unique-photo-id.png`]]);
});

test('successful upload stores a persistent URL and removes the AI label', async () => {
  const { upload, calls } = setup();
  const url = await upload(profileId, photo);
  assert.equal(url, `https://example.test/${profileId}/unique-photo-id.png`);
  assert.deepEqual(calls.find(([action]) => action === 'update')[1], { avatar_url: url, avatar_is_generated: false });
  assert.ok(!calls.some(([action]) => action === 'remove'));
});
