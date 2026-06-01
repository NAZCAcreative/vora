import Link from 'next/link';

const FAQ_CATEGORIES = [
  { icon: 'calendar_today', label: '예약/취소', className: 'bg-primary-container/10 text-primary' },
  { icon: 'payments', label: '결제/환불', className: 'bg-secondary-container/10 text-secondary-container' },
  { icon: 'person', label: '계정/로그인', className: 'bg-tertiary-container/10 text-tertiary-container' },
  { icon: 'school', label: '수업 이용', className: 'bg-primary/10 text-primary' },
];

export default function SupportPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background pb-24 text-on-background antialiased">
      <header className="fixed top-0 z-50 flex h-16 w-full items-center justify-between bg-surface px-container-margin shadow-sm">
        <Link href="/profile-setup" className="flex items-center justify-center rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container active:scale-95" aria-label="뒤로가기">
          <span className="material-symbols-outlined">arrow_back</span>
        </Link>
        <h1 className="font-headline-md text-headline-md font-bold text-on-surface">고객센터</h1>
        <div className="w-10" />
      </header>

      <main className="mx-auto flex w-full max-w-2xl flex-grow flex-col gap-section-gap px-container-margin pt-stack-lg">
        <section className="flex flex-col gap-stack-sm">
          <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">무엇을 도와드릴까요?</h2>
          <div className="relative mt-2 w-full">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
            <input
              className="h-14 w-full rounded-xl border border-outline-variant/30 bg-surface-container-low pl-12 pr-4 font-body-lg text-body-lg text-on-surface shadow-sm transition-shadow placeholder:text-on-surface-variant/70 focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="궁금한 점을 검색해보세요"
              type="text"
            />
          </div>
        </section>

        <section className="flex flex-col gap-stack-md">
          <h3 className="ml-1 font-label-lg text-label-lg uppercase tracking-wide text-on-surface-variant">자주 묻는 질문</h3>
          <div className="grid grid-cols-2 gap-4">
            {FAQ_CATEGORIES.map((category) => (
              <button
                key={category.label}
                className="flex flex-col items-center justify-center gap-3 rounded-xl border border-outline-variant/10 bg-surface-container-lowest p-4 shadow-[0_4px_20px_rgba(0,0,0,0.04)] transition-transform hover:border-primary/20 active:scale-95"
              >
                <div className={`flex h-12 w-12 items-center justify-center rounded-full ${category.className}`}>
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                    {category.icon}
                  </span>
                </div>
                <span className="font-body-md text-body-md font-semibold text-on-surface">{category.label}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="mt-auto w-full pb-6 pt-6">
          <div className="relative flex flex-col gap-4 overflow-hidden rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-5 shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
            <div className="pointer-events-none absolute -right-4 -top-4 h-24 w-24 rounded-full bg-primary/5 blur-xl" />
            <div>
              <h4 className="font-headline-md text-headline-md text-on-surface">원하는 답변을 찾지 못하셨나요?</h4>
              <p className="mt-1 font-body-md text-body-md text-on-surface-variant">상담원이 직접 친절하게 안내해 드립니다.</p>
            </div>
            <button className="primary-gradient mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-xl font-label-lg text-label-lg text-on-primary shadow-md transition-transform active:scale-[0.98]">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                chat_bubble
              </span>
              1:1 문의하기
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
