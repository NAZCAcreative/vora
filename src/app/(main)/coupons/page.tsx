import Link from 'next/link';

const COUPONS = [
  {
    icon: 'local_offer',
    title: '₩5,000 OFF',
    label: '웰컴 할인 쿠폰',
    expires: '유효기간: 2024.12.31 까지',
    note: '* 3만원 이상 결제 시 사용 가능',
    headerClass: 'from-primary-fixed to-surface-container-lowest',
    iconClass: 'bg-primary text-on-primary',
    textClass: 'text-primary',
  },
  {
    icon: 'celebration',
    title: '10% 할인',
    label: '생일 축하 쿠폰',
    expires: '유효기간: 2024.11.30 까지',
    note: '* 최대 1만원 할인',
    headerClass: 'from-secondary-fixed to-surface-container-lowest',
    iconClass: 'bg-secondary-container text-on-secondary-container',
    textClass: 'text-secondary-container',
  },
];

export default function CouponsPage() {
  return (
    <div className="min-h-screen bg-surface pb-24 text-on-surface antialiased">
      <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between bg-surface px-container-margin shadow-sm">
        <div className="flex items-center gap-4">
          <Link href="/profile-setup" className="rounded-full p-2 text-primary transition-transform hover:opacity-80 active:scale-90" aria-label="뒤로가기">
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile font-bold text-primary">쿠폰함</h1>
        </div>
        <button className="rounded-full p-2 text-primary transition-transform hover:opacity-80 active:scale-90" aria-label="알림">
          <span className="material-symbols-outlined">notifications</span>
        </button>
      </header>

      <main className="flex flex-col gap-section-gap px-container-margin pt-stack-lg">
        <section className="flex flex-col gap-stack-sm">
          <label className="font-label-lg text-label-lg text-on-surface" htmlFor="coupon-code">
            쿠폰 등록
          </label>
          <div className="flex gap-2">
            <input
              id="coupon-code"
              className="flex-1 rounded-lg border border-outline-variant bg-surface-container-low px-4 py-3 font-body-md text-body-md transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="쿠폰 코드를 입력하세요"
              type="text"
            />
            <button className="rounded-lg bg-gradient-to-r from-primary to-secondary-container px-6 py-3 font-label-lg text-label-lg text-on-primary shadow-md transition-opacity hover:opacity-90">
              등록
            </button>
          </div>
        </section>

        <section className="flex flex-col gap-stack-md">
          <h2 className="font-headline-md text-headline-md text-on-surface">사용 가능한 쿠폰</h2>
          {COUPONS.map((coupon) => (
            <article key={coupon.label} className="coupon-notch relative overflow-hidden rounded-xl bg-surface-container-lowest shadow-md">
              <div className={`flex items-center gap-4 bg-gradient-to-r p-4 ${coupon.headerClass}`}>
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full shadow-sm ${coupon.iconClass}`}>
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                    {coupon.icon}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className={`font-headline-md text-headline-md font-bold ${coupon.textClass}`}>{coupon.title}</h3>
                  <p className="mt-1 font-label-lg text-label-lg text-on-surface">{coupon.label}</p>
                </div>
              </div>
              <div className="coupon-divider" />
              <div className="flex items-end justify-between bg-surface-container-lowest p-4">
                <div>
                  <p className="font-body-md text-body-md text-on-surface-variant">{coupon.expires}</p>
                  <p className="mt-1 font-label-sm text-label-sm text-outline">{coupon.note}</p>
                </div>
                <button className={`font-label-lg text-label-lg hover:underline ${coupon.textClass}`}>적용하기</button>
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
