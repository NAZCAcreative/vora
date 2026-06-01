'use client';

import Link from 'next/link';
import { useState } from 'react';

type Lesson = {
  time: string;
  duration: string;
  typeLabel: string;
  target: string;
  capacity: string;
  badge: string;
  title: string;
  todayClass: string;
  accent: string;
  badgeClassName: string;
  ready: boolean;
};

const LESSONS: Lesson[] = [
  {
    time: '10:00',
    duration: '50분',
    typeLabel: '1:1 화상 수업',
    target: '초급 회화',
    capacity: '1명 예약',
    badge: '1:1',
    title: '기초 회화 집중반',
    todayClass: 'bg-primary/10 text-primary',
    accent: 'bg-primary',
    badgeClassName: 'bg-primary-fixed text-on-primary-fixed-variant',
    ready: true,
  },
  {
    time: '14:00',
    duration: '50분',
    typeLabel: '그룹 수업',
    target: 'TOPIK 중급',
    capacity: '4/6명 예약',
    badge: '그룹',
    title: 'TOPIK II 읽기 대비',
    todayClass: 'bg-surface-container-high text-on-surface-variant',
    accent: 'bg-secondary-container',
    badgeClassName: 'bg-primary-fixed text-on-primary-fixed-variant',
    ready: false,
  },
  {
    time: '18:00',
    duration: '25분',
    typeLabel: '무료 체험',
    target: '레벨 테스트',
    capacity: '1명 예약',
    badge: '무료',
    title: '레벨 테스트 및 상담',
    todayClass: 'bg-surface-container-high text-on-surface-variant',
    accent: 'bg-outline-variant',
    badgeClassName: 'bg-error-container text-on-error-container',
    ready: false,
  },
];

const TABS = ['1:1 레슨', '그룹 클래스', '무료 체험'];

export default function TeacherLessonsPage() {
  const [meetModalOpen, setMeetModalOpen] = useState(false);

  return (
    <>
      <main className="mx-auto min-h-screen max-w-[1200px] bg-background pb-28 font-body-md text-on-background">
        <section className="sticky top-[56px] z-40 border-b border-surface-container bg-surface px-container-margin pb-stack-md pt-4 shadow-sm">
          <div className="mb-stack-md flex items-center justify-between">
            <h1 className="font-headline-md text-headline-md text-on-surface">수업관리</h1>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1.5 rounded-full border border-primary px-3 py-1.5 font-label-sm text-primary transition-colors hover:bg-primary/5">
                <span className="material-symbols-outlined text-[18px]">calendar_month</span>
                달력으로 보기
              </button>
              <button className="flex items-center justify-center rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container-high" aria-label="새로고침">
                <span className="material-symbols-outlined">refresh</span>
              </button>
            </div>
          </div>

          <div className="hide-scrollbar flex gap-gutter-md overflow-x-auto pb-2">
            {TABS.map((tab, index) => (
              <button
                key={tab}
                className={`shrink-0 rounded-full px-4 py-2 font-label-lg transition-colors active:scale-95 ${
                  index === 0 ? 'bg-primary text-on-primary shadow-md' : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-stack-md px-container-margin py-stack-md">
          <div className="mt-2 flex items-center justify-between">
            <div className="flex w-full flex-col gap-1">
              <p className="mb-1 text-[13px] font-bold uppercase tracking-wider text-primary/80">Upcoming Schedule</p>
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-primary/10 p-2.5 text-primary">
                  <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    event
                  </span>
                </div>
                <h2 className="break-keep font-headline-md text-headline-md font-bold text-on-surface">2024년 10월 12일 (토)</h2>
              </div>
            </div>
          </div>

          {LESSONS.map((lesson) => (
            <LessonCard key={`${lesson.time}-${lesson.title}`} lesson={lesson} onOpenMeet={() => setMeetModalOpen(true)} />
          ))}
        </section>
      </main>

      {meetModalOpen && <GoogleMeetModal onClose={() => setMeetModalOpen(false)} />}
    </>
  );
}

function LessonCard({ lesson, onOpenMeet }: { lesson: Lesson; onOpenMeet: () => void }) {
  return (
    <article className="group relative flex flex-col gap-4 overflow-hidden rounded-xl border border-surface-container-high bg-surface-container-lowest p-4 shadow-[0px_4px_20px_rgba(0,0,0,0.04)] transition-shadow hover:shadow-md md:flex-row md:items-center">
      <div className={`absolute left-0 top-0 h-full w-1.5 rounded-l-xl ${lesson.accent}`} />
      <div className={`flex flex-1 items-start gap-4 ${lesson.ready ? '' : 'opacity-80'}`}>
        <div className="flex min-w-[60px] flex-col items-center">
          <span className="font-label-lg text-label-lg font-bold text-on-surface">{lesson.time}</span>
          <span className="font-label-sm text-label-sm text-on-surface-variant">{lesson.duration}</span>
        </div>
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${lesson.badgeClassName}`}>
          <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            {lesson.badge === '그룹' ? 'groups' : lesson.badge === '무료' ? 'volunteer_activism' : 'person'}
          </span>
        </div>
        <div className="flex min-w-0 flex-1 flex-col justify-center">
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <h3 className="font-label-lg text-label-lg font-bold text-on-surface">{lesson.title}</h3>
            <span className={`rounded px-2 py-0.5 text-[10px] font-bold ${lesson.badgeClassName}`}>{lesson.badge}</span>
            <span className={`rounded px-2 py-0.5 text-[10px] font-bold ${lesson.todayClass}`}>오늘</span>
          </div>
          <div className="flex flex-wrap gap-2 font-body-md text-body-md text-on-surface-variant">
            <span>{lesson.typeLabel}</span>
            <span aria-hidden="true">·</span>
            <span>{lesson.target}</span>
            <span aria-hidden="true">·</span>
            <span>{lesson.capacity}</span>
          </div>
        </div>
      </div>

      <div className="mt-2 flex w-full flex-row gap-2 md:mt-0 md:w-auto">
        <Link href="/lessonsT/edit" className="flex-1 rounded-lg border border-primary px-6 py-2.5 text-center text-[15px] font-bold text-primary transition-all hover:bg-primary/5 md:flex-none">
          수정
        </Link>
        <Link href="/lessonsT/attendance" className="flex-1 rounded-lg border border-outline px-6 py-2.5 text-center text-[15px] font-bold text-on-surface transition-all hover:bg-surface-container md:flex-none">
          출석 관리
        </Link>
        {lesson.ready ? (
          <button
            className="flex-[2] rounded-lg bg-gradient-to-r from-primary to-secondary px-8 py-2.5 text-[15px] font-bold text-on-primary shadow-md transition-all hover:opacity-90 active:scale-95 md:flex-none"
            onClick={onOpenMeet}
          >
            수업 링크
          </button>
        ) : (
          <button className="flex-[2] cursor-not-allowed rounded-lg border border-outline-variant/30 bg-surface-container px-6 py-2.5 font-label-lg text-outline md:flex-none" disabled>
            수업 링크
          </button>
        )}
      </div>
    </article>
  );
}

function GoogleMeetModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-container-margin">
      <button className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} aria-label="모달 닫기" />
      <section className="relative w-full max-w-sm overflow-hidden rounded-xl bg-surface-container-lowest shadow-2xl">
        <button className="absolute right-4 top-4 rounded-full p-1 text-on-surface-variant transition-colors hover:bg-surface-container-high" onClick={onClose} aria-label="닫기">
          <span className="material-symbols-outlined">close</span>
        </button>
        <div className="p-8 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <span className="material-symbols-outlined text-4xl text-primary">video_camera_front</span>
          </div>
          <h3 className="mb-2 font-headline-md text-headline-md text-on-surface">Google Meet 수업 입장</h3>
          <p className="mb-8 font-body-md text-body-md text-on-surface-variant">수업 시작 5분 전부터 입장이 가능합니다.</p>
          <button className="mb-3 w-full rounded-xl bg-gradient-to-r from-primary to-secondary py-4 font-bold text-on-primary shadow-lg transition-all hover:opacity-90 active:scale-95">수업 링크</button>
          <button className="w-full rounded-lg py-3 font-label-lg text-on-surface-variant transition-colors hover:bg-surface-container" onClick={onClose}>
            닫기
          </button>
        </div>
      </section>
    </div>
  );
}
