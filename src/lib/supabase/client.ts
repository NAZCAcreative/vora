import { createBrowserClient } from '@supabase/ssr';

// TODO: 프로젝트 연결 후 `npx supabase gen types typescript --project-id <id>`로
// Database 타입을 생성해 `createBrowserClient<Database>`로 교체한다.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
