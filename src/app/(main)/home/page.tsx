import Link from 'next/link';

const TEACHERS = [
  {
    name: '고선미쌤',
    badgeColor: 'bg-secondary',
    badgeIcon: 'workspace_premium',
    badgeText: 'TOP',
    rating: '4.9',
    reviews: '128',
    tags: [
      { label: 'TOPIK 전문', className: 'bg-primary/10 text-primary' },
      { label: '회화', className: 'bg-secondary/10 text-secondary' },
    ],
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAMrvHQ6dyHl2uA1Trtt1BFlzNcuuNNuA2haFyDmmMHh9Qypvm4XWwY4ikrTbOKPR1qTEqvqRHjmLiOIWHveeWvLguLNTiYZX4DZ90xRUzytT1dBEvLXtgT7T6PD2AnL1upuSN0kKYP-Knx0_pwmNlyiksPqxHs_tKv1rxNZXU0Is7rch6c6NITZg2A6Vqgmh7OZdZhoK0OYWeHsC_XbL-ZgooyCDc_l_NCPfr6Yw1nm3IcEglGW_qO0X5tKJquos39LXbdjqmynw',
  },
  {
    name: '민준쌤',
    badgeColor: 'bg-primary',
    badgeIcon: 'new_releases',
    badgeText: 'HOT',
    rating: '4.8',
    reviews: '96',
    tags: [
      { label: '비즈니스', className: 'bg-primary-container/10 text-primary-container' },
      { label: '초보 OK', className: 'bg-tertiary/10 text-tertiary' },
    ],
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCj8oGtb-Pe3X7ryI-s0t-OCW_pqOAbJue89sywDex62AGMoVzW_P2fWp1lNy89IonngszDjTdmLsGJ7OtYvaFcg1V5lLWbttlXWCPdWpko1hfU_IVwGBXNhodeTyncPB8iO2DftVHZ_4emxlFAYv_915jC3sdAbG5y0VZPs78826ZBgZ4FKq76E0l9Lq5W3r2rehhjHWn-5yA58DYwuaC-ovbTCM73wEqXybT2WOY1iCtTg9WcFSl44mzvbVz8ln6mE8TIFbfBLA',
  },
];

const QUICK_ACCESS = [
  { icon: 'calendar_month', label: '1:1 수업', color: 'text-primary', bg: 'bg-primary/10', href: '/booking' },
  { icon: 'groups', label: '그룹 클래스', color: 'text-secondary', bg: 'bg-secondary/10', href: '/search' },
  { icon: 'card_giftcard', label: '무료 체험', color: 'text-tertiary', bg: 'bg-tertiary/10', href: '/search' },
  { icon: 'live_tv', label: '라이브', color: 'text-primary-container', bg: 'bg-primary-container/10', href: '/search' },
];

const CATEGORIES = [
  { icon: 'music_note', label: 'K-POP 한국어', color: 'text-primary', bg: 'bg-primary/5', hover: 'group-hover:bg-primary/10' },
  { icon: 'movie', label: 'K-DRAMA 표현', color: 'text-secondary', bg: 'bg-secondary/5', hover: 'group-hover:bg-secondary/10' },
  { icon: 'school', label: 'TOPIK 준비반', color: 'text-tertiary', bg: 'bg-tertiary/5', hover: 'group-hover:bg-tertiary/10' },
  { icon: 'flight', label: '여행 한국어', color: 'text-primary-container', bg: 'bg-primary-container/5', hover: 'group-hover:bg-primary-container/10' },
];

const NAV = [
  { icon: 'home', label: '홈', href: '/home', active: true },
  { icon: 'search', label: '검색', href: '/search', active: false },
  { icon: 'calendar_today', label: '예약', href: '/my-bookings', active: false },
  { icon: 'chat', label: '채팅', href: '/chat', active: false },
  { icon: 'person', label: '마이', href: '/profile-setup', active: false },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background pb-24 font-body-md text-on-background">
      <main className="mx-auto max-w-[1200px]">
        <section className="hero-gradient relative overflow-hidden rounded-b-[2rem] px-container-margin pb-12 pt-stack-lg">
          <div className="relative z-10">
            <div className="flex flex-col gap-2">
              <h2 className="font-headline-lg-mobile text-headline-lg-mobile leading-tight text-on-background">
                안녕하세요, <span className="font-bold text-primary">민수</span>님!
                <br />
                오늘도 즐겁게 한국어 공부해요!
              </h2>
              <p className="font-body-md text-on-surface-variant opacity-80">즐겁고 특별한 1:1 한국어 수업</p>
            </div>

            <div className="group relative mt-stack-lg">
              <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center">
                <span className="material-symbols-outlined text-outline">search</span>
              </div>
              <input
                className="w-full rounded-full border-none bg-white py-4 pl-12 pr-12 font-body-lg text-body-lg shadow-sm focus:ring-2 focus:ring-primary/20"
                placeholder="선생님, 수업 검색하기"
                type="text"
              />
              <Link
                href="/search"
                aria-label="검색"
                className="primary-gradient absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-white shadow-lg transition-transform active:scale-90"
              >
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </Link>
            </div>
          </div>

          <div className="absolute -right-8 top-4 h-40 w-40 rounded-full bg-primary-container/20 blur-3xl" />
          <div className="absolute -bottom-12 -left-12 h-48 w-48 rounded-full bg-secondary-container/20 blur-3xl" />
        </section>

        <section className="relative z-20 -mt-6 px-container-margin">
          <div className="grid grid-cols-4 gap-gutter-md rounded-xl border border-white/50 bg-white p-stack-md shadow-lg">
            {QUICK_ACCESS.map((item) => (
              <Link key={item.label} href={item.href} className="group flex flex-col items-center gap-2">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${item.bg} transition-transform group-active:scale-90`}>
                  <span className={`material-symbols-outlined ${item.color}`}>{item.icon}</span>
                </div>
                <span className="text-center font-label-sm text-label-sm text-on-surface">{item.label}</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-section-gap">
          <div className="mb-stack-md flex items-center justify-between px-container-margin">
            <h3 className="flex items-center gap-2 font-headline-md text-headline-md">
              <span className="material-symbols-outlined text-[24px] text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>
                star
              </span>
              오늘의 추천 선생님
            </h3>
            <Link href="/search" className="flex items-center font-label-lg text-label-lg text-primary hover:underline">
              더보기 <span className="material-symbols-outlined ml-1 text-sm">chevron_right</span>
            </Link>
          </div>

          <div className="flex snap-x gap-stack-md overflow-x-auto px-container-margin pb-4">
            {TEACHERS.map((teacher) => (
              <Link
                key={teacher.name}
                href="/teachers/1"
                className="flex min-w-[240px] snap-start flex-col overflow-hidden rounded-xl border border-surface-container-high bg-white shadow-md transition-transform hover:scale-[1.02]"
              >
                <div className="relative h-48">
                  <img alt={`${teacher.name} portrait`} className="h-full w-full object-cover" src={teacher.image} />
                  <div className={`absolute left-2 top-2 flex items-center gap-1 rounded-lg ${teacher.badgeColor} px-2 py-0.5 text-[10px] font-bold text-white shadow-md`}>
                    <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      {teacher.badgeIcon}
                    </span>
                    {teacher.badgeText}
                  </div>
                  <button className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md" aria-label="찜하기">
                    <span className="material-symbols-outlined">favorite</span>
                  </button>
                </div>
                <div className="flex flex-col gap-2 p-stack-md">
                  <div className="flex items-center gap-1">
                    <span className="font-headline-md text-headline-md text-on-surface">{teacher.name}</span>
                    <span className="material-symbols-outlined text-[18px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                      verified
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-label-sm text-on-surface-variant">
                    <span className="material-symbols-outlined text-[14px] text-[#FFC107]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      star
                    </span>
                    <span className="font-bold">{teacher.rating}</span> ({teacher.reviews})
                  </div>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {teacher.tags.map((tag) => (
                      <span key={tag.label} className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${tag.className}`}>
                        {tag.label}
                      </span>
                    ))}
                  </div>
                  <div className="mt-2 font-bold text-body-md text-on-surface">
                    ₩25,000~ <span className="text-[12px] font-normal text-on-surface-variant">/ 50분</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-stack-lg px-container-margin">
          <div className="primary-gradient group relative flex h-40 items-center overflow-hidden rounded-2xl p-6 shadow-xl">
            <div className="z-10 flex max-w-[60%] flex-col gap-1 text-white">
              <span className="inline-block w-fit rounded bg-white/20 px-2 py-0.5 text-[10px] font-bold opacity-70">LIVE</span>
              <h4 className="font-headline-lg-mobile text-[18px] leading-snug">
                K-POP으로 배우는 한국어
                <br />
                무료 라이브 클래스
              </h4>
              <Link href="/search" className="mt-2 flex items-center gap-1 font-label-lg text-label-lg opacity-90 transition-opacity group-hover:opacity-100">
                지금 확인하기 <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>
            <div className="absolute bottom-0 right-[-10px] h-full w-[45%]">
              <img
                alt="K-POP Korean class banner"
                className="h-full w-full object-contain object-bottom drop-shadow-2xl"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD_jN2Og2RvLDp6VnQswpMgcNncZKNe-FF8mRCTN3ykOP3GwbA6lsA1QeosgsINFdiwg7qdBiayY2jCd_F7euPHg8NffaIGUzrYlqanU-IDEO-q4dfn_UN7z4V7SpmqjSeu3hWmYnLS4YQFfmpic_4C8MrWpVIxPew3ncw5HypypbB6_X_QaUQe4otyfd6Lp1e4O7XwfaVLjORGpdNJ-GPNKo5KL0MSOs_HvrmsD-cW8yGRZltVOsRdw6iXC_EHjAs2M8rMjQUqIw"
              />
            </div>
          </div>
        </section>

        <section className="mt-section-gap px-container-margin pb-stack-lg">
          <div className="mb-stack-md flex items-center justify-between">
            <h3 className="flex items-center gap-2 font-headline-md text-headline-md">
              <span className="material-symbols-outlined text-[24px] text-primary">auto_awesome</span>
              수업 카테고리
            </h3>
            <Link href="/search" className="flex items-center font-label-lg text-label-lg text-primary hover:underline">
              전체보기 <span className="material-symbols-outlined ml-1 text-sm">chevron_right</span>
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-gutter-md sm:grid-cols-4">
            {CATEGORIES.map((category) => (
              <Link
                key={category.label}
                href="/search"
                className="group flex flex-col items-center gap-3 rounded-2xl border border-surface-container bg-white p-4 shadow-sm transition-all hover:shadow-md active:scale-95"
              >
                <div className={`flex h-16 w-16 items-center justify-center rounded-full ${category.bg} ${category.hover} transition-colors`}>
                  <span className={`material-symbols-outlined text-3xl ${category.color}`}>{category.icon}</span>
                </div>
                <span className="text-center font-label-lg text-on-surface">{category.label}</span>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <nav className="fixed bottom-0 left-0 z-50 flex w-full items-center justify-around rounded-t-xl border-t border-outline-variant bg-surface px-2 py-3 shadow-lg">
        {NAV.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={`flex flex-col items-center justify-center transition-colors duration-200 hover:bg-surface-container-low active:scale-90 ${
              item.active ? 'font-bold text-primary' : 'text-on-surface-variant'
            }`}
          >
            <span className="material-symbols-outlined" style={item.active ? { fontVariationSettings: "'FILL' 1" } : undefined}>
              {item.icon}
            </span>
            <span className="font-label-sm text-label-sm">{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
