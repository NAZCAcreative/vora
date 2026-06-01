import Link from 'next/link';

const PAYMENTS = [
  { date: '2024.05.10', status: '결제 완료', title: '고선미쌤 1:1 레슨 10회권', method: '신용카드 결제', amount: '₩250,000', canceled: false },
  { date: '2024.04.15', status: '결제 완료', title: '프리미엄 멤버십 (1개월)', method: '카카오페이 결제', amount: '₩15,000', canceled: false },
  { date: '2024.03.02', status: '결제 취소', title: 'TOPIK II 모의고사 패키지', method: '신용카드 결제', amount: '₩35,000', canceled: true },
];

export default function PaymentHistoryPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background pb-24 text-on-background">
      <header className="fixed top-0 z-50 w-full bg-surface shadow-sm">
        <div className="mx-auto flex h-16 w-full max-w-4xl items-center justify-between px-container-margin">
          <Link href="/profile-setup" className="flex items-center justify-center rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container active:scale-95" aria-label="뒤로가기">
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <h1 className="font-headline-md text-headline-md font-bold text-primary">결제 내역</h1>
          <button className="flex items-center justify-center rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container active:scale-95" aria-label="필터">
            <span className="material-symbols-outlined">filter_list</span>
          </button>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-4xl flex-grow flex-col gap-stack-lg px-container-margin pt-stack-lg">
        <div className="flex items-center justify-between rounded-lg bg-surface-container-lowest p-4 shadow-sm">
          <span className="font-label-lg text-label-lg text-on-surface">2024년</span>
          <span className="material-symbols-outlined text-on-surface-variant">expand_more</span>
        </div>

        <div className="grid gap-stack-md lg:grid-cols-2">
          {PAYMENTS.map((payment) => (
            <article
              key={`${payment.date}-${payment.title}`}
              className={`flex flex-col gap-stack-sm rounded-lg border border-surface-container-high bg-surface-container-lowest p-4 shadow-sm transition-shadow hover:shadow-md ${
                payment.canceled ? 'opacity-75' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-label-sm text-on-surface-variant">{payment.date}</span>
                <span className={`rounded-full px-2 py-1 font-label-sm text-label-sm ${payment.canceled ? 'bg-error-container/20 text-error' : 'bg-primary-container/10 text-primary'}`}>
                  {payment.status}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div className={`flex h-12 w-12 items-center justify-center rounded-lg bg-surface-container ${payment.canceled ? 'text-on-surface-variant' : 'text-primary'}`}>
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                    receipt_long
                  </span>
                </div>
                <div className="flex-grow">
                  <h3 className={`font-label-lg text-label-lg ${payment.canceled ? 'text-on-surface-variant line-through' : 'text-on-surface'}`}>{payment.title}</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant">{payment.method}</p>
                </div>
              </div>
              <div className="flex justify-end border-t border-surface-container-highest pt-2">
                <span className={`font-headline-md text-headline-md ${payment.canceled ? 'text-on-surface-variant line-through' : 'text-primary'}`}>{payment.amount}</span>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
