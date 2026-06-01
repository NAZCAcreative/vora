import Link from 'next/link';

const STATS = [
  { icon: 'calendar_today', label: '내 예약', value: '3', color: 'text-primary', href: '/my-bookings' },
  { icon: 'favorite', label: '찜한 선생님', value: '12', color: 'text-secondary', filled: true, href: '/wishlist' },
  { icon: 'rate_review', label: '리뷰 관리', value: '5', color: 'text-tertiary', href: '/reviews' },
];

type MenuItem = {
  icon: string;
  label: string;
  href: string;
  badge?: string;
  danger?: boolean;
};

type MenuGroup = {
  title: string;
  items: MenuItem[];
};

const MENU_GROUPS: MenuGroup[] = [
  {
    title: '활동 관리',
    items: [
      { icon: 'receipt_long', label: '결제 내역', href: '/payment-history' },
      { icon: 'confirmation_number', label: '쿠폰함', href: '/coupons', badge: '2장' },
      { icon: 'analytics', label: '학습 리포트', href: '#' },
    ],
  },
  {
    title: '서비스 안내',
    items: [
      { icon: 'campaign', label: '공지사항', href: '#' },
      { icon: 'celebration', label: '이벤트', href: '#' },
      { icon: 'help', label: '고객센터', href: '/support' },
    ],
  },
  {
    title: '설정',
    items: [
      { icon: 'settings', label: '알림 설정', href: '/notification-settings' },
      { icon: 'manage_accounts', label: '계정 관리', href: '#' },
      { icon: 'logout', label: '로그아웃', href: '#', danger: true },
    ],
  },
];

const NAV = [
  { icon: 'home', label: '홈', href: '/home', active: false },
  { icon: 'search', label: '검색', href: '/search', active: false },
  { icon: 'calendar_today', label: '예약', href: '/my-bookings', active: false },
  { icon: 'chat_bubble', label: '채팅', href: '/chat', active: false },
  { icon: 'person', label: '마이', href: '/profile-setup', active: true },
];

export default function ProfileSetupPage() {
  return (
    <div className="min-h-screen bg-background text-on-surface antialiased">
      <header className="sticky top-0 z-50 bg-surface/80 shadow-sm backdrop-blur-md">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-5">
          <h1 className="bg-gradient-to-r from-primary to-secondary bg-clip-text font-headline text-2xl font-bold text-transparent">
            K-Lingo Bridge
          </h1>
          <div className="flex items-center gap-4">
            <button className="text-on-surface-variant transition-opacity duration-100 hover:opacity-80 active:scale-95" aria-label="알림">
              <span className="material-symbols-outlined">notifications</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl space-y-8 px-container-margin pb-32 pt-6">
        <section className="flex flex-col items-center space-y-4 text-center">
          <div className="relative">
            <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-white shadow-lg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt="김지은"
                className="h-full w-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDVqrHTfKv4yGyh7EfSy6eCnYV2Y3gAnx61i4A2vfanrwKZeCfUeRzvJgJh2Oz-784Pi47-vR3dnBtXqL4zIE-k2sg9vB3azVlJEhp0kdS3SExF2Il9adJ5YnvebzvfYBJiEhv4LGfKUL7GrXJj3hsYU0VBLMHAyJQHs8TMSn_FDOKE2oTtTKVQGH47XGg30WBKf64BQ4iuLlnWBXexEfkipO4_dTxL8S0yA7HrbOaxryrji5K8rQ_9oCGg--cytLD3ARmGTGz9Ew"
              />
            </div>
            <button className="absolute bottom-0 right-0 rounded-full border-2 border-white bg-primary p-1.5 text-white shadow-md transition-transform hover:scale-110" aria-label="프로필 편집">
              <span className="material-symbols-outlined text-[18px]">edit</span>
            </button>
          </div>
          <div>
            <h2 className="font-headline text-2xl font-bold text-on-surface">김지은</h2>
            <p className="font-medium text-on-surface-variant">레벨 3 학습자</p>
          </div>
        </section>

        <Link
          href="/homeT"
          className="relative block cursor-pointer overflow-hidden rounded-xl bg-gradient-to-br from-primary to-secondary-container p-6 text-white shadow-lg transition-transform active:scale-[0.98]"
        >
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <h3 className="mb-1 font-headline text-xl font-bold">선생님 모드로 전환</h3>
              <p className="text-sm opacity-90">한국어 교육을 시작해보세요!</p>
            </div>
            <span className="material-symbols-outlined text-4xl opacity-80">swap_horiz</span>
          </div>
          <div className="absolute -bottom-4 -right-4 opacity-10">
            <span className="material-symbols-outlined text-[120px]">school</span>
          </div>
        </Link>

        <section className="grid grid-cols-3 gap-3">
          {STATS.map((stat) => (
            <Link
              key={stat.label}
              href={stat.href}
              className="group flex flex-col items-center rounded-xl bg-surface-container-lowest p-4 text-center shadow-[0_4px_20px_rgba(0,0,0,0.04)] transition-all active:scale-95"
            >
              <span
                className={`material-symbols-outlined mb-2 transition-transform group-hover:scale-110 ${stat.color}`}
                style={stat.filled ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                {stat.icon}
              </span>
              <span className="mb-1 text-label-sm text-on-surface-variant">{stat.label}</span>
              <span className="text-lg font-bold text-on-surface">{stat.value}</span>
            </Link>
          ))}
        </section>

        <div className="space-y-6">
          {MENU_GROUPS.map((group) => (
            <section key={group.title}>
              <h4 className="mb-3 px-1 text-label-sm font-bold text-primary">{group.title}</h4>
              <div className="overflow-hidden rounded-xl bg-surface-container-lowest shadow-sm">
                {group.items.map((item, index) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`flex items-center justify-between p-4 transition-colors hover:bg-surface-container-low active:scale-[0.98] ${
                      index > 0 ? 'border-t border-surface-container' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`material-symbols-outlined ${item.danger ? 'text-error' : 'text-on-surface-variant'}`}>{item.icon}</span>
                      <span className={`text-body-md font-medium ${item.danger ? 'text-error' : ''}`}>{item.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.badge && (
                        <span className="rounded-full bg-secondary-fixed px-2 py-0.5 text-[10px] font-bold text-on-secondary-fixed-variant">
                          {item.badge}
                        </span>
                      )}
                      <span className="material-symbols-outlined text-outline-variant">chevron_right</span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>

      <nav className="fixed bottom-0 left-0 z-50 flex w-full items-center justify-around rounded-t-xl border-t border-outline-variant/30 bg-surface-container-lowest px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.04)]">
        {NAV.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={
              item.active
                ? 'flex flex-col items-center justify-center rounded-full bg-primary-fixed/50 px-4 py-1 text-primary transition-transform duration-200 active:scale-110'
                : 'flex flex-col items-center justify-center text-on-surface-variant transition-colors hover:text-primary'
            }
          >
            <span className="material-symbols-outlined" style={item.active ? { fontVariationSettings: "'FILL' 1" } : undefined}>
              {item.icon}
            </span>
            <span className="font-label text-label-sm font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
