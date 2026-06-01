'use client';

import Link from 'next/link';

const TEACHER_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCwcAwRNtZgVMJj96_FUFPcln-Ik7QenXZ_juRTbrFhOh5G6iOQ6bosrWx7tANRy0YALJuf6tYLSUqqH5AciEbtlf2NnmlyXRiVUrP3Z9XlXwkzHWYtSziP_39BhOvScIyC648UIhMCJ-vAGMLZUSwHmjGoJzm8iEAZVcIn8wSvJJh5vXNQg1bGtKTViP6x7w_LpsVBnwMkHNNHVkcUj1oQ9hTH6Rl_4JOluc8Q5DaOWcSeriyQCFdWOYuUbxEzB8erry9dLoCz1A';

const SCHEDULE = [
  {
    time: '10:00',
    duration: '50분',
    title: '기초 회화',
    type: '1:1 수업',
    topic: '초급 회화',
    capacity: '1명',
    status: '수업 전',
    badge: '오늘',
    active: true,
  },
  {
    time: '14:00',
    duration: '50분',
    title: 'TOPIK II',
    type: '그룹 수업',
    topic: 'TOPIK II 대비',
    capacity: '4/6명',
    status: '수업 전',
    badge: '오늘',
    active: true,
  },
  {
    time: '18:00',
    duration: '50분',
    title: '레벨 테스트',
    type: '무료 체험',
    topic: '프리토킹',
    capacity: '1명',
    status: '예정',
    badge: 'D-1',
    active: false,
  },
];

const TABS = ['전체', '1:1 수업', '그룹 수업', '무료 체험'];

export default function HomeTPage() {
  return (
    <main className="mx-auto min-h-screen max-w-[1200px] bg-background px-container-margin pb-28 pt-stack-lg font-body-md text-on-surface">
      <section className="mt-2">
        <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">안녕하세요, 선미쌤</h2>
        <p className="font-body-md text-body-md text-on-surface-variant">오늘도 멋진 수업 만들어봐요!</p>
      </section>

      <section className="primary-gradient mt-stack-lg flex items-center justify-between rounded-xl p-4 text-on-primary shadow-md">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-2xl">swap_horiz</span>
          <span className="font-label-lg">학생 모드로 전환</span>
        </div>
        <Link href="/home" className="rounded-full border border-white/30 bg-white/20 px-4 py-1.5 text-[13px] font-medium transition-colors hover:bg-white/30 active:scale-95">
          전환하기
        </Link>
      </section>

      <section className="primary-gradient relative mt-stack-lg overflow-hidden rounded-xl p-stack-lg text-on-primary shadow-lg">
        <div className="relative z-10 flex items-start justify-between">
          <div>
            <p className="font-label-sm text-label-sm opacity-90">이번 달 수익</p>
            <h3 className="mt-1 font-display-lg text-display-lg">₩1,250,000</h3>
            <div className="mt-2 flex w-fit items-center gap-1 rounded-full bg-white/20 px-2 py-1 text-label-sm">
              <span className="material-symbols-outlined text-[16px]">trending_up</span>
              <span>지난 달 대비 24%</span>
            </div>
          </div>
          <span className="material-symbols-outlined text-4xl opacity-30">payments</span>
        </div>
        <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-white/20 blur-3xl" />
      </section>

      <section className="mt-stack-lg grid grid-cols-3 gap-stack-md">
        <StatCard label="예정 수업" value="8건" helper="오늘 3건" valueClassName="text-primary" />
        <StatCard label="완료 수업" value="23건" helper="이번 달" valueClassName="text-secondary" />
        <div className="flex flex-col items-center rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-stack-md text-center shadow-sm">
          <p className="font-label-sm text-label-sm text-on-surface-variant">평균 평점</p>
          <div className="mt-1 flex items-center gap-1">
            <span className="material-symbols-outlined text-[18px] text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>
              star
            </span>
            <p className="font-headline-md text-headline-md text-on-surface">4.9</p>
          </div>
          <p className="mt-1 text-[10px] text-on-surface-variant">(128)</p>
        </div>
      </section>

      <section className="mt-section-gap space-y-stack-md">
        <div className="flex items-end justify-between px-1">
          <div>
            <h4 className="font-headline-md text-headline-md">오늘의 일정</h4>
            <p className="mt-0.5 text-[12px] text-on-surface-variant">10월 12일 (목)</p>
          </div>
          <Link href="/lessonsT" className="flex items-center gap-1 font-label-lg text-primary transition-opacity hover:opacity-80">
            더보기 <span className="material-symbols-outlined text-sm">chevron_right</span>
          </Link>
        </div>

        <div className="-mx-container-margin flex gap-2 overflow-x-auto px-container-margin py-1 no-scrollbar">
          {TABS.map((tab, index) => (
            <button
              key={tab}
              type="button"
              className={`whitespace-nowrap rounded-full px-5 py-2 text-[13px] font-semibold transition-colors ${
                index === 0 ? 'bg-primary text-on-primary shadow-sm shadow-primary/20' : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-variant'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="space-y-stack-md">
          {SCHEDULE.map((lesson) => (
            <ScheduleCard key={`${lesson.time}-${lesson.title}`} lesson={lesson} />
          ))}
        </div>
      </section>

      <section className="glass-card mt-section-gap flex items-center gap-4 rounded-2xl border border-primary/10 p-stack-lg">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-tertiary-container text-on-tertiary-container">
          <span className="material-symbols-outlined text-[32px]">auto_awesome</span>
        </div>
        <div>
          <h5 className="font-label-lg text-label-lg text-primary">교사 팁: 활발한 피드백</h5>
          <p className="mt-1 text-[12px] leading-snug text-on-surface-variant">수업 직후 피드백을 작성하면 학생의 재수강률이 40% 이상 상승합니다.</p>
        </div>
      </section>

      <div className="pointer-events-none fixed inset-0 z-[-1] overflow-hidden">
        <div className="absolute left-[12%] top-[18%] h-16 w-16 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute right-[12%] top-[56%] h-20 w-20 rounded-full bg-secondary/5 blur-3xl" />
      </div>
    </main>
  );
}

function StatCard({ label, value, helper, valueClassName }: { label: string; value: string; helper: string; valueClassName: string }) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-stack-md text-center shadow-sm">
      <p className="font-label-sm text-label-sm text-on-surface-variant">{label}</p>
      <p className={`mt-1 font-headline-md text-headline-md ${valueClassName}`}>{value}</p>
      <p className="mt-1 text-[10px] text-on-surface-variant">{helper}</p>
    </div>
  );
}

function ScheduleCard({ lesson }: { lesson: (typeof SCHEDULE)[number] }) {
  const icon = lesson.type === '그룹 수업' ? 'groups' : lesson.type === '무료 체험' ? 'volunteer_activism' : 'person';

  return (
    <article
      className={`rounded-xl border bg-surface-container-lowest p-4 shadow-sm transition-all hover:shadow-md ${
        lesson.active ? 'border-outline-variant/30' : 'border-outline-variant/20 opacity-80'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 gap-3">
          <div className="w-14 shrink-0 pt-0.5">
            <p className="font-label-lg text-label-lg font-bold text-on-surface">{lesson.time}</p>
            <p className="mt-0.5 text-[11px] text-on-surface-variant">{lesson.duration}</p>
          </div>
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface-container text-primary">
            <span className="material-symbols-outlined text-[22px]">{icon}</span>
          </div>
          <div className="min-w-0">
            <div className="flex min-w-0 items-center gap-2">
              <p className="truncate font-label-lg text-label-lg font-bold text-on-surface">{lesson.title}</p>
              <span className="shrink-0 rounded bg-surface-container px-1.5 py-0.5 text-[10px] font-semibold text-on-surface-variant">{lesson.badge}</span>
            </div>
            <p className="mt-1 truncate text-[12px] text-on-surface-variant">
              {lesson.type} · {lesson.topic} · {lesson.capacity}
            </p>
          </div>
        </div>
        <span
          className={`shrink-0 rounded-full px-2.5 py-1 font-label-sm text-label-sm ${
            lesson.active ? 'bg-primary/10 text-primary' : 'bg-surface-container text-on-surface-variant'
          }`}
        >
          {lesson.status}
        </span>
      </div>
    </article>
  );
}
