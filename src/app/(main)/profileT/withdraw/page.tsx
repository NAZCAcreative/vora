import Link from 'next/link';

const MONTHS = [
  { label: '10월', height: 'h-[30%]', active: false },
  { label: '11월', height: 'h-[45%]', active: false },
  { label: '12월', height: 'h-[60%]', active: false },
  { label: '1월', height: 'h-[55%]', active: false },
  { label: '2월', height: 'h-[80%]', active: true },
  { label: '3월', height: 'h-[95%]', active: true, gradient: true },
];

export default function TeacherWithdrawPage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl bg-surface px-container-margin pb-28 pt-stack-lg font-body-md text-on-surface">
      <section className="mb-stack-lg flex items-center gap-3">
        <Link href="/profileT" className="flex h-10 w-10 items-center justify-center rounded-full text-primary transition-colors hover:bg-surface-container-high" aria-label="뒤로가기">
          <span className="material-symbols-outlined">arrow_back</span>
        </Link>
        <div>
          <h1 className="font-headline-md text-headline-md font-bold text-primary">수익 관리</h1>
          <p className="text-sm text-on-surface-variant">정산 예정 금액과 출금 현황을 확인하세요.</p>
        </div>
      </section>

      <div className="grid gap-section-gap lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)] lg:items-start">
        <div className="space-y-section-gap">
          <section className="primary-gradient relative overflow-hidden rounded-xl p-6 text-on-primary shadow-xl">
            <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
            <div className="relative z-10">
              <p className="font-label-lg text-white/80">이번 달 수익</p>
              <h2 className="mt-1 text-[32px] font-bold leading-tight sm:text-[40px]">₩1,250,000</h2>
              <div className="mt-4 flex w-fit items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-label-sm">
                <span className="material-symbols-outlined text-[16px]">trending_up</span>
                <span>지난 달 대비 24% 상승</span>
              </div>
            </div>
            <div className="mt-8 flex h-20 items-end gap-1 sm:h-28">
              {['h-[40%]', 'h-[60%]', 'h-[50%]', 'h-[80%]', 'h-full'].map((height, index) => (
                <div key={height} className={`flex-1 rounded-t-sm ${index === 4 ? 'border-t-2 border-white bg-white/40' : 'bg-white/20'} ${height}`} />
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-stack-md font-headline-md text-headline-md text-on-surface">최근 6개월 추이</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 rounded-xl bg-surface-container-lowest p-stack-md shadow-sm">
                <div className="flex h-36 items-end justify-between gap-2 px-2">
                  {MONTHS.map((month) => (
                    <div key={month.label} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                      <div className={`w-full rounded-t-lg ${month.gradient ? 'primary-gradient' : month.active ? 'bg-primary-container/40' : 'bg-surface-container-high'} ${month.height}`} />
                      <span className={`text-[10px] ${month.gradient ? 'font-bold text-primary' : month.active ? 'font-bold text-outline' : 'text-outline'}`}>{month.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <SmallMetric icon="payments" label="누적 수익" value="₩15.4M" className="bg-primary-fixed text-primary" />
              <SmallMetric icon="verified" label="수업 횟수" value="482회" className="bg-secondary-fixed text-secondary" />
            </div>
          </section>
        </div>

        <aside className="space-y-stack-lg lg:sticky lg:top-24">
          <section>
            <div className="mb-stack-md flex items-center justify-between gap-3">
              <h2 className="font-headline-md text-headline-md text-on-surface">수익 현황</h2>
              <button className="shrink-0 text-label-lg text-primary hover:underline">자세히 보기</button>
            </div>
            <div className="space-y-4 rounded-xl bg-surface-container-lowest p-stack-md shadow-sm">
              <SummaryRow label="총 수익" value="₩1,600,000" />
              <SummaryRow label="플랫폼 수수료 (-20%)" value="-₩320,000" valueClassName="text-secondary" />
              <hr className="border-outline-variant" />
              <SummaryRow label="정산 예정 금액" value="₩1,280,000" valueClassName="text-xl font-extrabold text-primary" />
              <SummaryRow label="이번 달 정산 완료" value="₩980,000" />
            </div>
          </section>

          <button className="primary-gradient w-full rounded-xl py-4 text-lg font-bold text-on-primary shadow-lg transition-all hover:opacity-90 active:scale-95">
            출금 신청하기
          </button>
        </aside>
      </div>
    </main>
  );
}

function SummaryRow({ label, value, valueClassName = 'text-lg font-bold text-on-surface' }: { label: string; value: string; valueClassName?: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="font-medium text-on-surface-variant">{label}</span>
      <span className={valueClassName}>{value}</span>
    </div>
  );
}

function SmallMetric({ icon, label, value, className }: { icon: string; label: string; value: string; className: string }) {
  return (
    <article className={`flex min-h-32 flex-col justify-between rounded-xl p-stack-md shadow-sm ${className}`}>
      <span className="material-symbols-outlined text-[32px]">{icon}</span>
      <div>
        <p className="font-label-sm text-on-surface-variant">{label}</p>
        <p className="text-lg font-bold">{value}</p>
      </div>
    </article>
  );
}
