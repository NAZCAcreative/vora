import Link from 'next/link';

const NAV = [
  { icon: 'home', label: '홈', href: '/home', active: false },
  { icon: 'search', label: '검색', href: '/search', active: false },
  { icon: 'calendar_today', label: '예약', href: '/my-bookings', active: true },
  { icon: 'chat', label: '채팅', href: '/chat', active: false },
  { icon: 'person', label: '마이', href: '/profile-setup', active: false },
];

export default function ConfirmationPage() {
  return (
    <div className="flex min-h-screen flex-col bg-surface font-body-md text-on-surface">
      <header className="flex h-16 w-full items-center justify-between bg-transparent px-container-margin">
        <Link href="/home" className="rounded-full p-2 transition-all duration-100 hover:bg-surface-container-low active:scale-95" aria-label="닫기">
          <span className="material-symbols-outlined text-on-surface">close</span>
        </Link>
        <div className="w-10" />
      </header>

      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col items-center px-container-margin pb-20">
        <div className="flex w-full flex-col items-center pt-8">
          <div className="relative mb-6 h-32 w-32">
            <div className="absolute inset-0 animate-pulse rounded-full bg-primary opacity-10" />
            <div className="absolute inset-2 rounded-full bg-primary-container opacity-20" />
            <div className="primary-gradient absolute inset-4 flex items-center justify-center rounded-full shadow-lg">
              <span className="material-symbols-outlined text-5xl text-white" style={{ fontVariationSettings: "'wght' 700" }}>
                check
              </span>
            </div>
            <span className="material-symbols-outlined absolute -right-2 -top-2 animate-bounce text-secondary-container" style={{ fontVariationSettings: "'FILL' 1" }}>
              auto_awesome
            </span>
            <span className="material-symbols-outlined absolute bottom-4 -left-4 animate-ping text-tertiary-container text-[16px]">star</span>
          </div>
          <h1 className="mb-stack-sm text-center font-headline-lg-mobile text-headline-lg-mobile">결제가 완료되었어요.</h1>
          <p className="px-8 text-center text-on-surface-variant">선생님과의 즐거운 수업이 기다리고 있어요.</p>
        </div>

        <div className="mt-10 w-full rounded-xl border border-surface-container bg-surface-container-lowest p-stack-lg shadow-[0px_4px_20px_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-stack-md border-b border-surface-variant pb-stack-md">
            <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt="고선미 선생님"
                className="h-full w-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA-zLk7vh1--tj2NUTutg_w8I5ep47oHbnuXfIuGS1XfY-7zASjdGX0bKkPVLwLwEc-CxeTLE_3IB7CLpdFPEtpOdNTVC3FiN-aRkzsl8huWOcdSUKCWo1CRj7mn3gVgxIWS20G13IUnrYm4JXsFLRyrS9r3LkmHOjBYGot0XRX9pzzcABBIqVRNrUVViA7IOqFZqM3W4bA61lD4vSW_aNTGLXF8_6kwyexTlwXE0zS1iA97Bz0tMpSnNkNkpNUmOvzQdyA5JfP5A"
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-headline-md text-headline-md">고선미쌤</h3>
                <span className="material-symbols-outlined text-sm text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>
                  favorite
                </span>
              </div>
              <p className="font-label-sm text-label-sm text-on-surface-variant">50분 | 1:1 화상 수업</p>
            </div>
          </div>

          <div className="flex flex-col gap-stack-sm py-stack-md">
            <div className="flex items-center justify-between">
              <span className="text-on-surface-variant">수업 일시</span>
              <span className="font-label-lg text-label-lg">2024. 06. 12 (수) 10:00</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-on-surface-variant">결제 금액</span>
              <span className="font-label-lg text-label-lg text-primary">₩25,000</span>
            </div>
          </div>
        </div>

        <div className="mt-stack-md flex w-full items-center gap-stack-md rounded-xl bg-surface-container-low p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-primary-container">
            <span className="material-symbols-outlined">notifications_active</span>
          </div>
          <div className="flex-1">
            <p className="font-label-lg text-label-lg">수업 10분 전 알림</p>
            <p className="font-label-sm text-label-sm text-on-surface-variant">잊지 않도록 푸시 알림을 보내드릴게요!</p>
          </div>
          <span className="material-symbols-outlined text-outline">chevron_right</span>
        </div>

        <div className="mt-auto flex w-full flex-col gap-stack-md pt-10">
          <button className="primary-gradient flex h-14 w-full items-center justify-center gap-2 rounded-xl font-headline-md text-headline-md text-white shadow-lg transition-all duration-100 active:scale-95">
            <span className="material-symbols-outlined">link</span>
            수업 링크 확인
          </button>
          <Link
            href="/my-bookings"
            className="flex h-14 w-full items-center justify-center rounded-xl border-2 border-primary bg-white font-headline-md text-headline-md text-primary transition-all duration-100 active:scale-95"
          >
            내 예약 보기
          </Link>
        </div>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t border-surface-variant bg-surface px-4">
        {NAV.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={`flex flex-col items-center gap-1 transition-colors hover:text-primary ${
              item.active ? 'text-primary' : 'text-on-surface-variant'
            }`}
          >
            <span className="material-symbols-outlined" style={item.active ? { fontVariationSettings: "'FILL' 1" } : undefined}>
              {item.icon}
            </span>
            <span className="text-[10px] font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
