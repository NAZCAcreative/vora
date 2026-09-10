'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/stores/auth-store';

export function AdminEntry() {
  const userId = useAuthStore((state) => state.user?.id);
  const [authorizedId, setAuthorizedId] = useState<string | null>(null);
  useEffect(() => {
    let cancelled = false;
    if (!userId) return;
    createClient().rpc('admin_is_authorized').then(({ data, error }) => {
      if (!cancelled) setAuthorizedId(!error && data === true ? userId : null);
    });
    return () => { cancelled = true; };
  }, [userId]);
  if (!userId || authorizedId !== userId) return null;
  return (
    <Link href="/admin" className="flex items-center justify-between gap-4 rounded-xl border border-primary/20 bg-primary/5 p-5 transition-colors hover:bg-primary/10">
      <span className="flex items-center gap-3">
        <span aria-hidden="true" className="material-symbols-outlined text-primary">admin_panel_settings</span>
        <span><span className="block font-bold text-primary">관리자 페이지</span><span className="mt-1 block text-sm text-on-surface-variant">학생·선생님·수업 및 운영 현황 관리</span></span>
      </span>
      <span aria-hidden="true" className="material-symbols-outlined text-primary">chevron_right</span>
    </Link>
  );
}
