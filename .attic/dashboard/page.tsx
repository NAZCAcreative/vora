import Link from 'next/link';

const LEGACY_STATS = [
  { label: '전체 수업', value: '31건', icon: 'event_available' },
  { label: '이번 달 수익', value: '₩1,250,000', icon: 'payments' },
  { label: '평균 평점', value: '4.9', icon: 'star' },
];

export default function DashboardPage() {
  return (
    <main className="mx-auto min-h-screen max-w-[1200px] bg-background px-container-margin pb-28 pt-stack-lg font-body-md text-on-surface">
      <section className="rounded-xl bg-surface-container-lowest p-stack-lg shadow-sm">
        <p className="font-label-sm text-label-sm text-on-surface-variant">이전 대시보드</p>
        <h1 className="mt-1 font-headline-lg text-headline-lg text-on-surface">교사 관리 요약</h1>
        <p className="mt-2 text-body-md text-on-surface-variant">기존 대시보드 경로는 요약 화면으로 유지됩니다.</p>
      </section>

      <section className="mt-stack-lg grid gap-stack-md sm:grid-cols-3">
        {LEGACY_STATS.map((stat) => (
          <article key={stat.label} className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-stack-md shadow-sm">
            <span className="material-symbols-outlined text-primary">{stat.icon}</span>
            <p className="mt-3 text-label-sm text-on-surface-variant">{stat.label}</p>
            <p className="mt-1 font-headline-md text-headline-md text-on-surface">{stat.value}</p>
          </article>
        ))}
      </section>

      <Link
        href="/teacher/home"
        className="primary-gradient mt-stack-lg flex items-center justify-between rounded-xl p-5 font-label-lg text-on-primary shadow-md transition-transform active:scale-[0.98]"
      >
        새 선생님 홈으로 이동
        <span className="material-symbols-outlined">arrow_forward</span>
      </Link>
    </main>
  );
}
