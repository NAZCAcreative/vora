const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

function compile(file, imports, globals = {}) {
  const context = { exports: {}, URL, ...globals, require: name => imports[name] ?? require(name) };
  vm.runInNewContext(ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS },
  }).outputText, context);
  return context.exports;
}
const redirects = compile('src/lib/auth-redirect.ts', {});

test('Google OAuth uses PKCE callback and blocks external destinations; failures allow retry', async () => {
  let options;
  let assigned;
  let fail = true;
  const { useAuthStore: store } = compile('src/stores/auth-store.ts', {
    '@/lib/auth-redirect': redirects,
    'zustand/middleware': { persist: config => config },
    '@/lib/supabase/client': { createClient: () => ({ auth: {
      signInWithOAuth: async input => {
        options = input;
        return fail ? { error: new Error('Unavailable'), data: {} } : { error: null, data: { url: 'https://provider.example/authorize' } };
      },
    } }) },
  }, { window: { location: { origin: 'https://vora.example', assign: url => { assigned = url; } } } });
  await assert.rejects(store.getState().loginWithGoogle('//evil.example'));
  assert.equal(store.getState().isLoading, false);
  assert.equal(new URL(options.options.redirectTo).searchParams.get('next'), '/student/home');
  fail = false;
  await store.getState().loginWithGoogle('/student/bookings?tab=upcoming');
  assert.equal(options.provider, 'google');
  const callback = new URL(options.options.redirectTo);
  assert.equal(callback.origin + callback.pathname, 'https://vora.example/auth/callback');
  assert.equal(callback.searchParams.get('next'), '/student/bookings?tab=upcoming');
  assert.equal(assigned, 'https://provider.example/authorize');
  assert.equal(store.getState().isLoading, true);
});

test('callback exchanges code and preserves destination on success or cancellation', async () => {
  let exchanged;
  const { GET } = compile('src/app/auth/callback/route.ts', {
    '@/lib/auth-redirect': redirects,
    'next/server': { NextResponse: { redirect: url => String(url) } },
    '@/lib/supabase/server': { createClient: async () => ({ auth: {
      exchangeCodeForSession: async code => { exchanged = code; return { error: code === 'bad' }; },
    } }) },
  });
  assert.equal(await GET({ url: 'https://vora.example/auth/callback?code=good&next=/student/bookings' }), 'https://vora.example/student/bookings');
  assert.equal(exchanged, 'good');
  for (const query of ['error=access_denied', 'code=bad', '']) {
    const result = new URL(await GET({ url: `https://vora.example/auth/callback?${query}&next=/student/bookings` }));
    assert.equal(result.pathname, '/login');
    assert.equal(result.searchParams.get('next'), '/student/bookings');
    assert.equal(result.searchParams.get('error'), query.startsWith('error') ? 'auth_cancelled' : 'auth_callback_failed');
  }
});
