'use client';

import Link from 'next/link';
import { LearningImage } from '@/components/shared/LearningImage';
import { useState } from 'react';

type Slide = {
  icon: string;
  iconClassName: string;
  badge: string;
  title: React.ReactNode;
  description: React.ReactNode;
};

const SLIDES: Slide[] = [
  {
    icon: 'record_voice_over',
    iconClassName: 'from-primary to-secondary',
    badge: 'Live 1:1 수업',
    title: (
      <>
        원어민과 함께하는
        <br />
        <span className="text-primary">생생한 한국어 여행</span>
      </>
    ),
    description: (
      <>
        1:1 맞춤 수업부터 라이브 클래스까지,
        <br />
        나에게 딱 맞는 학습을 시작해보세요.
      </>
    ),
  },
  {
    icon: 'groups',
    iconClassName: 'from-secondary to-tertiary',
    badge: '그룹 클래스',
    title: (
      <>
        함께 배우면
        <br />
        <span className="text-primary">더 즐거운 한국어</span>
      </>
    ),
    description: (
      <>
        같은 목표를 가진 학습자들과 함께하는
        <br />
        소규모 그룹 클래스로 부담 없이 시작하세요.
      </>
    ),
  },
  {
    icon: 'volunteer_activism',
    iconClassName: 'from-tertiary to-primary',
    badge: '무료 체험',
    title: (
      <>
        지금 바로
        <br />
        <span className="text-primary">무료 체험 레슨</span>으로 시작해요
      </>
    ),
    description: (
      <>
        마음에 드는 선생님을 찾아 부담 없이
        <br />
        첫 수업을 무료로 경험해보세요.
      </>
    ),
  },
];

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const isLast = step === SLIDES.length - 1;
  const slide = SLIDES[step];

  return (
    <div className="min-h-screen bg-surface font-body-md text-on-surface selection:bg-primary/20">
      <div className="relative mx-auto flex min-h-[calc(100dvh-64px)] max-w-md flex-col overflow-hidden bg-surface-container-lowest">
        <div className="custom-pattern pointer-events-none absolute inset-0" />
        <div className="absolute right-[-10%] top-[-10%] h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-[20%] left-[-20%] h-80 w-80 rounded-full bg-secondary/5 blur-3xl" />

        <div className="relative z-10 flex h-16 w-full items-center justify-end px-container-margin">
          <Link
            href="/signup"
            className="inline-flex min-h-11 items-center rounded-lg px-4 py-2 font-label-lg text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-primary"
          >
            건너뛰기
          </Link>
        </div>

        <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-container-margin pb-6">
          <div className="group relative mb-6 aspect-square w-full max-w-[240px] sm:max-w-[300px]">
            <div className="absolute -right-4 -top-4 h-20 w-20 animate-pulse rounded-full bg-primary-container/20" />
            <div className="animate-float absolute bottom-4 -left-4 h-12 w-12 rotate-12 rounded-lg bg-secondary-container/20" />

            <div className="glass-card flex h-full w-full items-center justify-center overflow-hidden rounded-xl p-2 shadow-xl">
              <div className="h-full w-full overflow-hidden rounded-xl">
                <LearningImage key={step} scene={step === 0 ? 'desk' : step === 1 ? 'cafe' : 'seoul'} className="h-full w-full fade-in" priority />
              </div>

              <div
                className="animate-float absolute bottom-8 right-8 flex items-center gap-2 rounded-xl border border-primary/10 bg-white/90 px-4 py-2 shadow-lg backdrop-blur-md"
                style={{ animationDelay: '1s' }}
              >
                <span className="material-symbols-outlined text-[20px] text-primary">language</span>
                <span className="font-label-lg text-primary">{slide.badge}</span>
              </div>
            </div>
          </div>

          <div className="w-full space-y-4 text-center">
            <h1 className="px-2 font-headline-lg-mobile text-headline-lg-mobile text-on-surface">{slide.title}</h1>
            <p className="mx-auto max-w-sm font-body-md leading-relaxed text-on-surface-variant">{slide.description}</p>
          </div>
        </main>

        <footer className="relative z-10 flex w-full flex-col items-center gap-stack-lg px-container-margin pb-28">
          <div className="flex gap-2">
            {SLIDES.map((s, index) => (
              <button
                key={s.badge}
                type="button"
                onClick={() => setStep(index)}
                aria-label={`${index + 1}번째 화면으로 이동`}
                aria-current={step === index}
                className="flex h-11 w-11 items-center justify-center rounded-lg"
              >
                <span aria-hidden="true" className={`h-2 rounded-full transition-all ${step === index ? 'w-8 bg-primary-gradient' : 'w-2 bg-outline-variant'}`} />
              </button>
            ))}
          </div>

          {isLast ? (
            <Link
              href="/signup"
              className="group flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-primary-gradient font-label-lg text-on-primary shadow-sm shadow-primary/20 transition-all active:scale-[0.98]"
            >
              <span>시작하기</span>
              <span className="material-symbols-outlined text-[18px] transition-transform group-hover:translate-x-1">arrow_forward</span>
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => setStep((prev) => Math.min(prev + 1, SLIDES.length - 1))}
              className="group flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-primary-gradient font-label-lg text-on-primary shadow-sm shadow-primary/20 transition-all active:scale-[0.98]"
            >
              <span>다음</span>
              <span className="material-symbols-outlined text-[18px] transition-transform group-hover:translate-x-1">arrow_forward</span>
            </button>
          )}
        </footer>
      </div>
    </div>
  );
}
