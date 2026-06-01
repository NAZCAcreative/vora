import Link from 'next/link';

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-surface font-body-md text-on-surface selection:bg-primary/20">
      <div className="relative mx-auto flex min-h-screen max-w-md flex-col overflow-hidden bg-surface-container-lowest">
        <div className="custom-pattern pointer-events-none absolute inset-0" />
        <div className="absolute right-[-10%] top-[-10%] h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-[20%] left-[-20%] h-80 w-80 rounded-full bg-secondary/5 blur-3xl" />

        <header className="relative z-10 flex h-16 w-full items-center justify-end px-container-margin">
          <Link
            href="/signup"
            className="rounded-full px-4 py-2 font-label-lg text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-primary"
          >
            건너뛰기
          </Link>
        </header>

        <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-container-margin pb-20">
          <div className="group relative mb-10 aspect-square w-full">
            <div className="absolute -right-4 -top-4 h-20 w-20 animate-pulse rounded-full bg-primary-container/20" />
            <div className="animate-float absolute bottom-4 -left-4 h-12 w-12 rotate-12 rounded-lg bg-secondary-container/20" />

            <div className="glass-card h-full w-full overflow-hidden rounded-3xl p-2 shadow-xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt="Onboarding Visual"
                className="h-full w-full rounded-2xl object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC5X9T0qid_LjJGLYK-YkfqyY5vXBsGpRiXbrXzSPgBcQHM2oZSOGPtPJO6BexPIPUpj0P_nLAnkCID7YftOuQoKGzMqxcYJvNcrqblQaQwUyUJp4FJz-rlmATyM1J6mlqfj1G_9xKz3xltcVBA30WVVmhF9A7zdzsaTYEH8AAOqZQjM5R6A3FPJqvLjilWWQUUjSBjspP7IcG1bO_71CijNd4bMGklNYDj_wLWBwuoyckvhmjWbvjQ8bUbx8bJy0Vkp5709wpMMw"
              />

              <div
                className="animate-float absolute bottom-8 right-8 flex items-center gap-2 rounded-xl border border-primary/10 bg-white/90 px-4 py-2 shadow-lg backdrop-blur-md"
                style={{ animationDelay: '1s' }}
              >
                <span className="material-symbols-outlined text-[20px] text-primary">language</span>
                <span className="font-label-lg text-primary">Live 1:1 수업</span>
              </div>
            </div>
          </div>

          <div className="w-full space-y-4 text-center">
            <h1 className="px-2 font-headline-lg-mobile text-on-surface">
              원어민과 함께하는
              <br />
              <span className="text-primary">생생한 한국어 여행</span>
            </h1>
            <p className="mx-auto max-w-[85%] font-body-md leading-relaxed text-on-surface-variant">
              1:1 맞춤 수업부터 라이브 클래스까지,
              <br />
              나에게 딱 맞는 학습을 시작해보세요.
            </p>
          </div>
        </main>

        <footer className="relative z-10 flex w-full flex-col items-center gap-stack-lg px-container-margin pb-12">
          <div className="flex gap-2">
            <div className="h-2 w-8 rounded-full bg-primary-gradient transition-all duration-300" />
            <div className="h-2 w-2 cursor-pointer rounded-full bg-outline-variant transition-all hover:bg-outline" />
            <div className="h-2 w-2 cursor-pointer rounded-full bg-outline-variant transition-all hover:bg-outline" />
          </div>

          <Link
            href="/signup"
            className="group flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-primary-gradient font-label-lg text-on-primary shadow-lg shadow-primary/20 transition-all active:scale-95"
          >
            <span>다음</span>
            <span className="material-symbols-outlined text-[18px] transition-transform group-hover:translate-x-1">arrow_forward</span>
          </Link>
        </footer>
      </div>
    </div>
  );
}
