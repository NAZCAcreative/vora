'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { NotificationLayer } from './NotificationLayer';

const TEACHER_MODE_PREFIXES = ['/homeT', '/lessonsT', '/registerT', '/chatT', '/profileT'];

export function TopNavigation() {
  const pathname = usePathname();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const teacherMode = TEACHER_MODE_PREFIXES.some((path) => pathname.startsWith(path));
  const homeHref = teacherMode ? '/homeT' : '/home';
  const profileHref = teacherMode ? '/profileT' : '/profile-setup';
  const profileLabel = teacherMode ? '선생님 내 정보' : '학생 내 정보';

  return (
    <>
      <header className="global-top-nav relative sticky top-0 z-[70] flex w-full items-center justify-end bg-white/80 px-container-margin py-stack-md backdrop-blur-md">
        <Link
          href={homeHref}
          className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center"
          aria-label="홈으로 이동"
        >
          <Image src="/img/logo_pink.png" alt="VARA" width={102} height={24} className="h-6 w-auto object-contain" priority />
        </Link>
        <div className="flex items-center gap-3">
          <Link className="transition-opacity duration-150 hover:opacity-80 active:scale-95" href="/notification-settings" aria-label="설정">
            <span className="material-symbols-outlined text-on-surface-variant">settings</span>
          </Link>
          <button
            type="button"
            className="relative transition-opacity duration-150 hover:opacity-80 active:scale-95"
            aria-label="알림"
            aria-expanded={notificationsOpen}
            onClick={() => setNotificationsOpen(true)}
          >
            <span className="material-symbols-outlined text-on-surface-variant">notifications</span>
            <span className="absolute right-0 top-0 h-2 w-2 rounded-full bg-error ring-2 ring-white" aria-hidden="true" />
          </button>
          <Link className="transition-transform duration-150 active:scale-95" href={profileHref} aria-label={profileLabel}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt={profileLabel}
              className="h-9 w-9 rounded-full border-2 border-primary-fixed object-cover shadow-sm"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDVqrHTfKv4yGyh7EfSy6eCnYV2Y3gAnx61i4A2vfanrwKZeCfUeRzvJgJh2Oz-784Pi47-vR3dnBtXqL4zIE-k2sg9vB3azVlJEhp0kdS3SExF2Il9adJ5YnvebzvfYBJiEhv4LGfKUL7GrXJj3hsYU0VBLMHAyJQHs8TMSn_FDOKE2oTtTKVQGH47XGg30WBKf64BQ4iuLlnWBXexEfkipO4_dTxL8S0yA7HrbOaxryrji5K8rQ_9oCGg--cytLD3ARmGTGz9Ew"
            />
          </Link>
        </div>
      </header>
      <NotificationLayer open={notificationsOpen} onClose={() => setNotificationsOpen(false)} />
    </>
  );
}
