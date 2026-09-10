import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { safeAuthNext } from '@/lib/auth-redirect';

// 매직링크/OAuth 로그인 후 Supabase가 리다이렉트하는 콜백 엔드포인트.
// ?code=...를 세션 쿠키로 교환한 뒤 원래 목적지(또는 홈)로 보낸다.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = safeAuthNext(searchParams.get('next'));

  if (code && !searchParams.has('error')) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  const loginUrl = new URL('/login', origin);
  loginUrl.searchParams.set('error', searchParams.get('error') === 'access_denied' ? 'auth_cancelled' : 'auth_callback_failed');
  loginUrl.searchParams.set('next', next);
  return NextResponse.redirect(loginUrl);
}
