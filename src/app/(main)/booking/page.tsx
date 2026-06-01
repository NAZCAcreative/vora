'use client';

import { useState } from 'react';
import Link from 'next/link';

const WEEK_DAYS = ['월', '화', '수', '목', '금', '토', '일'];
const CALENDAR_DAYS = [25, 26, 27, 28, 29, 30, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
const TIME_SLOTS = ['오전 09:00', '오전 10:30', '오후 12:00', '오후 02:30', '오후 04:00', '오후 05:30', '오후 07:00', '오후 08:30'];

const NAV = [
  { icon: 'home', label: '홈', href: '/home', active: false },
  { icon: 'search', label: '검색', href: '/search', active: false },
  { icon: 'calendar_today', label: '예약', href: '/my-bookings', active: true },
  { icon: 'chat', label: '채팅', href: '/chat', active: false },
  { icon: 'person', label: '마이', href: '/profile-setup', active: false },
];

export default function BookingPage() {
  const [selectedDay, setSelectedDay] = useState(12);
  const [selectedTime, setSelectedTime] = useState('오후 02:30');

  return (
    <div className="flex min-h-screen flex-col bg-background font-body-md text-on-surface">
      <main className="flex-grow overflow-y-auto pb-56">
        <section className="px-container-margin py-stack-lg">
          <div className="mb-stack-md flex items-center gap-4">
            <div className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-primary-fixed shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt="고선미 선생님"
                className="h-full w-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDfA_6hIk-ArNi8M91_6nvsZsgapzPoeSCuhW0CTdU7DFb8bnhxfEZX_UDF--Qwj_lo74BHGOrx4legVjmadRZ6xsFhWbfgmUy533yh5HhoWeXXGSQp3_JC0es4sVTPXbWSRj_2BL4BcpTZOssen0YmYkAkYkvxZevvQRnTTNrHqLtBF2F8NIlZO76RunYjanxyGIh3xUaCMHZsmlXPABgBhJfL1xZf1pSYsoTUzszll7r_vyP1tHy7CGhwc7YSMw1QDMDA_5Oe2g"
              />
            </div>
            <div>
              <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">고선미 선생님과 예약하기</h1>
              <p className="text-body-md text-on-surface-variant">TOPIK II &amp; 회화 전문가</p>
            </div>
          </div>
          <div className="flex h-1 overflow-hidden rounded-full bg-surface-container">
            <div className="h-full w-2/3 bg-primary" />
          </div>
          <div className="mt-2 flex justify-between">
            <span className="font-label-sm text-label-sm text-primary">시간 선택</span>
            <span className="font-label-sm text-label-sm text-outline">3단계 중 2단계</span>
          </div>
        </section>

        <section className="mb-section-gap px-container-margin">
          <div className="rounded-xl bg-surface-container-lowest p-stack-md shadow-[0px_4px_20px_rgba(0,0,0,0.04)]">
            <div className="mb-stack-lg flex items-center justify-between">
              <button className="material-symbols-outlined rounded-full p-2 text-on-surface-variant hover:bg-surface-container-high" aria-label="이전 달">
                chevron_left
              </button>
              <h2 className="font-headline-md text-headline-md">2023년 10월</h2>
              <button className="material-symbols-outlined rounded-full p-2 text-on-surface-variant hover:bg-surface-container-high" aria-label="다음 달">
                chevron_right
              </button>
            </div>
            <div className="mb-2 grid grid-cols-7 gap-1 text-center">
              {WEEK_DAYS.map((day) => (
                <span key={day} className={`font-label-sm text-label-sm uppercase ${day === '일' ? 'text-error' : 'text-outline'}`}>
                  {day}
                </span>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-x-1 gap-y-2">
              {CALENDAR_DAYS.map((day, index) => {
                const selected = selectedDay === day;
                const muted = index < 6;
                return (
                  <button
                    key={`${day}-${index}`}
                    onClick={() => setSelectedDay(day)}
                    className={`flex h-10 w-10 items-center justify-center rounded-lg font-body-md ${
                      selected
                        ? 'scale-105 bg-primary font-bold text-white shadow-md'
                        : muted
                        ? 'text-outline-variant'
                        : 'hover:bg-surface-container-low'
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <section className="px-container-margin">
          <div className="mb-stack-md flex items-center justify-between">
            <h3 className="font-headline-md text-headline-md">예약 가능한 시간</h3>
            <span className="flex items-center gap-1 font-label-sm text-label-sm text-on-surface-variant">
              <span className="material-symbols-outlined text-[16px]">schedule</span>
              60분 수업
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {TIME_SLOTS.map((slot) => {
              const selected = selectedTime === slot;
              return (
                <button
                  key={slot}
                  onClick={() => setSelectedTime(slot)}
                  className={`rounded-xl border px-4 py-3 font-label-lg transition-all duration-200 ${
                    selected
                      ? 'border-primary bg-primary text-white shadow-sm'
                      : 'border-outline-variant bg-surface-container-lowest text-on-surface hover:border-primary hover:bg-primary-fixed'
                  }`}
                >
                  {slot}
                </button>
              );
            })}
          </div>
          <div className="mt-stack-lg flex items-start gap-3 rounded-xl bg-primary-fixed p-stack-md">
            <span className="material-symbols-outlined text-primary">info</span>
            <p className="text-body-md text-on-surface">
              수업 시간은 현재 현지 시간대 기준으로 표시됩니다: <strong>GMT+9 (서울)</strong>.
            </p>
          </div>
        </section>
      </main>

      <div className="fixed bottom-20 left-0 z-50 w-full bg-gradient-to-t from-background via-background to-transparent px-container-margin pb-3 pt-4">
        <div className="mx-auto flex max-w-xl flex-col gap-2">
          <Link
            href="/confirmation"
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#8b5cf6] to-[#d946ef] font-headline-md text-on-primary shadow-lg transition-all active:scale-[0.98]"
          >
            확인
          </Link>
          <Link
            href="/payment"
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full border-2 border-primary font-headline-md text-primary transition-all hover:bg-primary/5 active:scale-[0.98]"
          >
            결제 단계로 계속하기
            <span className="material-symbols-outlined">arrow_forward</span>
          </Link>
        </div>
      </div>

      <nav className="fixed bottom-0 left-0 z-40 flex h-20 w-full items-center justify-around rounded-t-xl bg-surface px-4 shadow-[0px_-4px_20px_rgba(0,0,0,0.04)] md:hidden">
        {NAV.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={`flex flex-col items-center justify-center rounded-lg p-2 transition-colors ${
              item.active ? 'scale-90 font-bold text-primary duration-150' : 'text-outline hover:bg-surface-container-low'
            }`}
          >
            <span className="material-symbols-outlined" style={item.active ? { fontVariationSettings: "'FILL' 1" } : undefined}>
              {item.icon}
            </span>
            <span className="font-label-sm text-label-sm">{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
