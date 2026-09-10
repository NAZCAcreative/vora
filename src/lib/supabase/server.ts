import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// TODO: 프로젝트 연결 후 `npx supabase gen types typescript --project-id <id>`로
// Database 타입을 생성해 `createServerClient<Database>`로 교체한다.
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
          } catch {
            // Server Component에서 호출된 경우 — 미들웨어가 세션 갱신을 대신 처리하므로 무시해도 안전하다.
          }
        },
      },
    },
  );
}
