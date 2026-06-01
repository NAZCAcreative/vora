import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '@/lib/api';
import type { User, UserRole, LanguageLevel } from '@/types';

interface RegisterData {
  email: string;
  password: string;
  name: string;
  nativeLanguage: string;
  koreanLevel: LanguageLevel;
}

interface AuthState {
  user: User | null;
  activeRole: UserRole | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  fetchMe: () => Promise<void>;
  switchRole: (role: UserRole) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      activeRole: null,
      isLoading: false,
      isAuthenticated: false,

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const res = await api.auth.signin({ email, password }) as { user: User; accessToken: string };
          localStorage.setItem('bkend_access_token', res.accessToken);
          set({ user: res.user, isAuthenticated: true, activeRole: res.user.role });
        } finally {
          set({ isLoading: false });
        }
      },

      register: async (data) => {
        set({ isLoading: true });
        try {
          const res = await api.auth.signup(data) as { user: User; accessToken: string };
          localStorage.setItem('bkend_access_token', res.accessToken);
          set({ user: res.user, isAuthenticated: true, activeRole: res.user.role });
        } finally {
          set({ isLoading: false });
        }
      },

      logout: async () => {
        await api.auth.signout().catch(() => {});
        localStorage.removeItem('bkend_access_token');
        set({ user: null, isAuthenticated: false, activeRole: null });
      },

      fetchMe: async () => {
        const user = await api.auth.me() as User;
        set((s) => ({ user, isAuthenticated: true, activeRole: s.activeRole ?? user.role }));
      },

      switchRole: (role) => {
        set({ activeRole: role });
      },
    }),
    {
      name: 'klb-auth',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        activeRole: state.activeRole,
      }),
    }
  )
);
