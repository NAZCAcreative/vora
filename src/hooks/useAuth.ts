'use client';

import { useAuthStore } from '@/stores/auth-store';

export function useAuth() {
  const user = useAuthStore((s) => s.user);
  const activeRole = useAuthStore((s) => s.activeRole);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);
  const login = useAuthStore((s) => s.login);
  const register = useAuthStore((s) => s.register);
  const logout = useAuthStore((s) => s.logout);
  const fetchMe = useAuthStore((s) => s.fetchMe);
  const switchRole = useAuthStore((s) => s.switchRole);

  return {
    user,
    activeRole,
    isAuthenticated,
    isLoading,
    isTeacher: activeRole === 'teacher',
    login,
    register,
    logout,
    fetchMe,
    switchRole,
  };
}
