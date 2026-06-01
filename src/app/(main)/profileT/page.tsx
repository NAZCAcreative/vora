import Link from 'next/link';

const PROFILE_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAkPxspvwFZyYzX70D-cIqj7ewO_mfKMSon2vIgOvNo10bQns3OOQd4dSysRB7-xBh6tEj9gzWJlR1Vk3dXRazeZCNaS26Yx-x7DacJlDJ10qWkgk22R2zSTuxkA6DIWk_2XhjJRgtIRS-VSlBhG5AO5gtD79WipnqJ_baCN0TYK4jONwaopOQUgZ5hxz6giqn9y2xODpDDaM2h8QLUIpC1mb937Z0FbFVUTz63ACuFQsja3PlhX_pgk51nv9vhVoZC2ShNEKuG-w';

const STATS = [
  { label: '총 수익', value: '₩2.4M', className: 'text-primary' },
  { label: '수업 중', value: '12', className: 'text-secondary' },
  { label: '평점', value: '4.9', className: 'text-on-surface', star: true },
];

const MENU = [
  { icon: 'person', label: '내 정보 관리', href: '/profileT/edit' },
  { icon: 'account_balance', label: '정산 계좌 설정', href: '/profileT/account' },
  { icon: 'rate_review', label: '리뷰 답변 관리', href: '/profileT/reviews' },
  { icon: 'folder_open', label: '수업 자료 보관함', href: '/profileT/materials' },
  { icon: 'support_agent', label: '고객센터', href: '/support' },
];

export default function TeacherProfilePage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-7xl space-y-section-gap bg-background px-container-margin pb-28 pt-stack-lg font-body-md text-on-background">
      <section className="flex items-center gap-4">
        <div className="relative shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img alt="고선미 선생님" className="h-20 w-20 rounded-full border-4 border-surface object-cover shadow-md" src={PROFILE_IMAGE} />
          <div className="absolute bottom-0 right-0 rounded-full bg-primary p-1 text-on-primary shadow-sm">
            <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              verified
            </span>
          </div>
        </div>
        <div>
          <h1 className="font-headline-lg text-headline-lg font-bold text-on-surface">고선미 쌤</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">TOPIK 전문 강사</p>
        </div>
      </section>

      <section>
        <Link href="/home" className="flex w-full items-center justify-between rounded-xl bg-gradient-to-r from-primary to-secondary-container p-4 text-on-primary shadow-lg transition-all hover:opacity-90 active:scale-[0.98]">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-white/20 p-2 backdrop-blur-sm">
              <span className="material-symbols-outlined text-on-primary">school</span>
            </div>
            <span className="font-label-lg text-label-lg font-semibold">학생 모드로 전환</span>
          </div>
          <span className="material-symbols-outlined text-on-primary">chevron_right</span>
        </Link>
      </section>

      <section className="grid grid-cols-3 gap-gutter-md">
        {STATS.map((stat) => (
          <article key={stat.label} className="flex flex-col items-start space-y-1 rounded-xl bg-surface-container-lowest p-4 text-left shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
            <span className="font-body-md text-[12px] text-on-surface-variant">{stat.label}</span>
            <div className="flex items-center gap-1">
              <span className={`font-headline-md text-headline-md font-bold ${stat.className}`}>{stat.value}</span>
              {stat.star && (
                <span className="material-symbols-outlined text-[16px] text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>
                  star
                </span>
              )}
            </div>
          </article>
        ))}
      </section>

      <section>
        <Link href="/profileT/withdraw" className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-secondary px-5 py-4 font-label-lg text-label-lg font-bold text-on-primary shadow-lg shadow-primary/20 transition-all hover:opacity-90 active:scale-[0.98]">
          <span className="material-symbols-outlined">account_balance_wallet</span>
          출금신청
        </Link>
      </section>

      <section className="overflow-hidden rounded-xl bg-surface-container-lowest shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
        <ul className="flex flex-col divide-y divide-surface-container">
          {MENU.map((item) => (
            <li key={item.label}>
              <Link href={item.href} className="flex w-full items-center justify-between p-4 transition-colors hover:bg-surface-container-low active:bg-surface-container">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-on-surface-variant">{item.icon}</span>
                  <span className="font-body-lg text-body-lg text-on-surface">{item.label}</span>
                </div>
                <span className="material-symbols-outlined text-on-surface-variant">chevron_right</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="flex justify-start pb-stack-lg pt-stack-sm">
        <button className="flex items-center gap-2 px-1 font-body-md text-body-md text-error transition-opacity hover:opacity-80">
          <span className="material-symbols-outlined">logout</span>
          로그아웃
        </button>
      </section>
    </main>
  );
}
