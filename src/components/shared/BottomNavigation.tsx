'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

type NavItem = {
  icon: string;
  label: string;
  href: string;
  match: string[];
};

const STUDENT_NAV_ITEMS: NavItem[] = [
  { icon: 'home', label: '홈', href: '/home', match: ['/home', '/'] },
  { icon: 'search', label: '검색', href: '/search', match: ['/search', '/teachers'] },
  { icon: 'calendar_today', label: '예약', href: '/my-bookings', match: ['/my-bookings', '/booking', '/payment', '/confirmation'] },
  { icon: 'chat_bubble', label: '채팅', href: '/chat', match: ['/chat'] },
  {
    icon: 'person',
    label: '마이',
    href: '/profile-setup',
    match: ['/profile-setup', '/coupons', '/wishlist', '/reviews', '/payment-history', '/notification-settings', '/notifications', '/support'],
  },
];

const TEACHER_NAV_ITEMS: NavItem[] = [
  { icon: 'home', label: '홈', href: '/homeT', match: ['/homeT'] },
  { icon: 'menu_book', label: '수업관리', href: '/lessonsT', match: ['/lessonsT'] },
  { icon: 'add_circle', label: '등록', href: '/registerT', match: ['/registerT'] },
  { icon: 'chat_bubble', label: '채팅', href: '/chatT', match: ['/chatT'] },
  { icon: 'person', label: '마이', href: '/profileT', match: ['/profileT'] },
];

export function BottomNavigation() {
  const pathname = usePathname();
  const teacherMode =
    pathname.startsWith('/homeT') ||
    pathname.startsWith('/lessonsT') ||
    pathname.startsWith('/registerT') ||
    pathname.startsWith('/chatT') ||
    pathname.startsWith('/profileT');
  const items = teacherMode ? TEACHER_NAV_ITEMS : STUDENT_NAV_ITEMS;

  return (
    <nav className="global-bottom-nav fixed bottom-0 left-0 z-[70] flex h-20 w-full items-center justify-around rounded-t-xl border-t border-outline-variant/40 bg-surface-container-lowest px-2 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
      {items.map((item) => {
        const active = item.match.some((path) => (path === '/' ? pathname === '/' : pathname.startsWith(path)));

        return (
          <Link
            key={item.label}
            href={item.href}
            className={`flex h-14 flex-1 max-w-20 flex-col items-center justify-center rounded-xl px-2 py-1.5 transition-all active:scale-95 ${
              active ? 'bg-primary-container font-bold text-on-primary-container' : 'text-on-surface-variant hover:bg-surface-container-low hover:text-primary'
            }`}
          >
            <span
              className="material-symbols-outlined text-[26px] leading-none"
              style={active ? { fontVariationSettings: "'FILL' 1" } : undefined}
            >
              {item.icon}
            </span>
            <span className="mt-1 whitespace-nowrap text-[12px] font-semibold leading-none">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
