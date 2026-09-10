import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createClient } from '@/lib/supabase/client';
import type { Profile, UserRole, LanguageLevel } from '@/types';

interface RegisterData {
  email: string;
  password: string;
  name: string;
  nativeLanguage: string;
  koreanLevel: LanguageLevel;
}

let authRevision = 0;

interface AuthState {
  syncUser: (id: string | null) => Promise<void>;
  user: Profile | null;
  activeRole: UserRole | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  // AuthHydrator가 localStorage 캐시를 실제 Supabase 세션과 대조해 확정하기 전까지 false.
  // 이 값이 true가 되기 전에는 화면들이 "로그인 안 됨(user===null)"과 "아직 확인 중"을 구분할 수 없어
  // 하드 새로고침 시 실제로는 로그인된 사용자인데도 빈 화면(찜 목록/채팅 목록 등)을 잘못 보여주게 된다.
  isHydrated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<'signed_in' | 'verify_email'>;
  logout: () => Promise<void>;
  fetchMe: () => Promise<void>;
  switchRole: (role: UserRole) => void;
  setHydrated: () => void;
}

async function loadProfile(userId: string): Promise<Profile> {
  const supabase = createClient();
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
  if (error || !data) throw new Error(error?.message ?? 'Profile not found');

  return {
    id: data.id,
    role: data.role,
    activeRole: data.active_role ?? undefined,
    name: data.name,
    avatarUrl: data.avatar_url ?? undefined,
    nativeLanguage: data.native_language ?? undefined,
    koreanLevel: data.korean_level,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      activeRole: null,
      isLoading: false,
      isAuthenticated: false,
      isHydrated: false,

      syncUser: async (id) => {
        const revision = ++authRevision;
        if (!id || get().user?.id !== id) set({ user: null, isAuthenticated: false, activeRole: null });
        if (!id) { set({ isHydrated: true }); return; }
        try {
          const profile = await loadProfile(id);
          if (revision === authRevision) set((state) => ({ user: profile, isAuthenticated: true, activeRole: state.activeRole ?? profile.activeRole ?? profile.role, isHydrated: true }));
        } catch (error) {
          if (revision === authRevision) set({ user: null, isAuthenticated: false, activeRole: null, isHydrated: true });
          throw error;
        }
      },
      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const supabase = createClient();
          const { data, error } = await supabase.auth.signInWithPassword({ email, password });
          if (error || !data.user) throw new Error(error?.message ?? 'Login failed');

          await get().syncUser(data.user.id);
        } finally {
          set({ isLoading: false });
        }
      },

      register: async (data) => {
        set({ isLoading: true });
        try {
          const supabase = createClient();
          const { data: signUpData, error } = await supabase.auth.signUp({
            email: data.email,
            password: data.password,
            options: {
              data: {
                name: data.name,
                native_language: data.nativeLanguage,
                korean_level: data.koreanLevel,
                role: 'student',
              },
            },
          });
          if (error || !signUpData.user) throw new Error(error?.message ?? 'Registration failed');

          if (!signUpData.session) {
            await get().syncUser(null);
            return 'verify_email';
          }
          await get().syncUser(signUpData.user.id);
          return 'signed_in';
        } finally {
          set({ isLoading: false });
        }
      },

      logout: async () => {
        const supabase = createClient();
        const { error } = await supabase.auth.signOut();
        if (error) throw new Error('로그아웃하지 못했습니다. 다시 시도해주세요.');
        await get().syncUser(null);
      },

      fetchMe: async () => {
        const supabase = createClient();
        const { data, error } = await supabase.auth.getUser();
        if (error || !data.user) {
          await get().syncUser(null);
          throw new Error(error?.message ?? 'Not authenticated');
        }

        await get().syncUser(data.user.id);
      },

      switchRole: (role) => {
        set({ activeRole: role });
      },

      setHydrated: () => set({ isHydrated: true }),
    }),
    {
      name: 'vora-auth',
      // 서버 렌더는 항상 user: null로 시작하는데, 클라이언트가 마운트 즉시 localStorage의
      // 캐시된 user를 자동 적용하면 서버/클라이언트 렌더 결과가 달라져 하이드레이션 에러가 난다.
      // AuthHydrator가 실제 Supabase 세션과 대조해 확정한 뒤 명시적으로 rehydrate()를 호출한다.
      skipHydration: true,
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        activeRole: state.activeRole,
      }),
    }
  )
);
