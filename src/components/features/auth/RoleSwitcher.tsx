'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

export function RoleSwitcher() {
  const { activeRole, switchRole } = useAuth();
  const router = useRouter();

  if (!activeRole) return null;

  const toggle = () => {
    const nextRole = activeRole === 'student' ? 'teacher' : 'student';
    switchRole(nextRole);
    router.push(nextRole === 'teacher' ? '/homeT' : '/home');
  };

  return (
    <button
      onClick={toggle}
      className="flex items-center gap-2 rounded-full border border-gray-300 px-3 py-1.5 text-xs font-medium hover:border-korean-blue transition-colors"
      title="Switch role"
    >
      <span
        className={`inline-block h-2 w-2 rounded-full ${
          activeRole === 'teacher' ? 'bg-korean-blue' : 'bg-korean-red'
        }`}
      />
      {activeRole === 'teacher' ? 'Teacher' : 'Student'}
    </button>
  );
}
