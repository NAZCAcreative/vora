import Link from 'next/link';

export default function SignupPage() {
  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col font-body-md overflow-x-hidden">

      {/* Background blobs */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute top-[60%] -right-[10%] w-[60%] h-[60%] rounded-full bg-secondary/5 blur-[120px]" />
      </div>

      {/* Main */}
      <main className="relative z-10 flex-grow flex flex-col items-center justify-center px-container-margin pt-section-gap pb-20">
        <div className="w-full max-w-md flex flex-col gap-stack-lg">

          {/* Brand header */}
          <div className="flex flex-col items-center text-center gap-stack-sm mb-4">
            <div className="bg-gradient-primary w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg rotate-6 mb-4">
              <span className="material-symbols-outlined text-white text-[36px]">language</span>
            </div>
            <h1 className="text-headline-lg-mobile font-headline-lg-mobile md:text-headline-lg md:font-headline-lg text-on-surface">
              K-Lingo Bridge
            </h1>
            <p className="text-body-md font-body-md text-on-surface-variant px-8">
              세계와 한국을 잇는 가장 스마트한 언어 파트너
            </p>
          </div>

          {/* Card */}
          <div className="bg-surface-container-lowest rounded-xl p-8 shadow-[0px_4px_20px_rgba(0,0,0,0.04)] border border-surface-variant/30 w-full fade-in">
            <div className="flex flex-col gap-stack-md">

              {/* Google */}
              <button
                type="button"
                className="flex items-center justify-center gap-stack-md w-full py-4 px-6 bg-white border border-outline-variant rounded-full text-label-lg font-label-lg text-on-surface hover:bg-surface-container-low transition-all active:scale-[0.98]"
              >
                <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Google로 계속하기
              </button>

              {/* Apple */}
              <button
                type="button"
                className="flex items-center justify-center gap-stack-md w-full py-4 px-6 bg-black rounded-full text-label-lg font-label-lg text-white hover:bg-[#1a1a1a] transition-all active:scale-[0.98]"
              >
                <svg className="w-5 h-5 fill-current flex-shrink-0" viewBox="0 0 384 512">
                  <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 33-17.9 64.4-17.9 31.4 0 39.2 17.9 65.4 17.4 48.3-.7 90.4-82.4 102.2-116.3-1.6-.8-36-13.3-36.3-54.4zM249.6 112c21.8-26.4 36-62.8 30.3-99.2-31.9 1.3-70.5 21.3-93.3 48-19.1 21.6-35.8 58.7-30.2 94 35.4 2.8 71.4-16.4 93.2-42.8z" />
                </svg>
                Apple로 계속하기
              </button>

              {/* Divider */}
              <div className="flex items-center gap-stack-md my-2">
                <div className="h-px flex-grow bg-outline-variant" />
                <span className="text-label-sm font-label-sm text-outline whitespace-nowrap">또는 이메일로 가입</span>
                <div className="h-px flex-grow bg-outline-variant" />
              </div>

              {/* Email */}
              <div className="flex flex-col gap-stack-sm">
                <label className="text-label-lg font-label-lg text-on-surface-variant ml-1">
                  이메일 주소
                </label>
                <input
                  type="email"
                  placeholder="example@klingo.com"
                  className="w-full bg-surface-container-low border-transparent focus:border-primary focus:ring-0 rounded-xl py-3.5 px-4 text-body-md transition-all"
                />
              </div>

              {/* CTA */}
              <Link
                href="/home"
                className="bg-gradient-primary w-full py-4 rounded-full text-label-lg font-label-lg text-white text-center shadow-lg shadow-primary/20 hover:opacity-90 active:scale-[0.98] transition-all mt-2 block"
              >
                시작하기
              </Link>

              {/* Login link */}
              <div className="text-center mt-4">
                <p className="text-body-md font-body-md text-on-surface-variant">
                  이미 계정이 있으신가요?{' '}
                  <Link href="/homeT" className="text-primary font-bold hover:underline ml-1">
                    교사 대시보드로 이동
                  </Link>
                </p>
              </div>

            </div>
          </div>

          {/* Policy */}
          <div className="text-center px-8">
            <p className="text-label-sm font-label-sm text-outline leading-5">
              가입 시 K-Lingo Bridge의{' '}
              <Link href="#" className="underline">이용약관</Link>
              {' '}및{' '}
              <Link href="#" className="underline">개인정보처리방침</Link>에
              동의하는 것으로 간주됩니다.
            </p>
          </div>

        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-surface-variant/30 px-6 py-2 flex justify-between items-center z-50">
        <Link href="#" className="flex flex-col items-center gap-1 text-primary">
          <span className="material-symbols-outlined">home</span>
          <span className="text-[10px] font-medium">홈</span>
        </Link>
        <Link href="#" className="flex flex-col items-center gap-1 text-outline">
          <span className="material-symbols-outlined">search</span>
          <span className="text-[10px] font-medium">검색</span>
        </Link>
        <Link href="#" className="flex flex-col items-center gap-1 text-outline">
          <span className="material-symbols-outlined">calendar_today</span>
          <span className="text-[10px] font-medium">예약</span>
        </Link>
        <Link href="#" className="flex flex-col items-center gap-1 text-outline">
          <span className="material-symbols-outlined">chat</span>
          <span className="text-[10px] font-medium">채팅</span>
        </Link>
        <Link href="#" className="flex flex-col items-center gap-1 text-outline">
          <span className="material-symbols-outlined">person</span>
          <span className="text-[10px] font-medium">마이</span>
        </Link>
      </nav>

    </div>
  );
}
