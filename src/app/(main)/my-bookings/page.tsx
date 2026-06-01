'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const DATES = [
  { weekday: '월', day: '12' },
  { weekday: '화', day: '13' },
  { weekday: '수', day: '14' },
  { weekday: '목', day: '15' },
  { weekday: '금', day: '16' },
  { weekday: '토', day: '17', weekend: true },
  { weekday: '일', day: '18', weekend: true },
];

const TIME_GROUPS = [
  {
    label: '오전',
    icon: 'light_mode',
    slots: [
      { time: '09:00' },
      { time: '10:00' },
      { time: '11:00', disabled: true },
    ],
  },
  {
    label: '오후',
    icon: 'wb_sunny',
    slots: [
      { time: '13:00' },
      { time: '14:00' },
      { time: '15:00' },
      { time: '16:00' },
      { time: '17:00', disabled: true },
    ],
  },
  {
    label: '저녁',
    icon: 'dark_mode',
    slots: [{ time: '19:00' }, { time: '20:00' }],
  },
];

const DURATIONS = [
  { label: '1회 체험', description: '단기 집중' },
  { label: '4회 패키지', description: '주 1회 추천' },
];

const NAV = [
  { icon: 'home', label: '홈', href: '/home' },
  { icon: 'search', label: '검색', href: '/search' },
  { icon: 'calendar_today', label: '예약', href: '/my-bookings', active: true },
  { icon: 'chat', label: '채팅', href: '/chat' },
  { icon: 'person', label: '마이', href: '/profile-setup' },
];

export default function MyBookingsPage() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState('13');
  const [selectedTime, setSelectedTime] = useState('14:00');
  const [selectedDuration, setSelectedDuration] = useState('1회 체험');

  return (
    <div className="booking-time-page min-h-screen bg-background pb-24 font-body-md text-on-background">
      <header className="sticky top-0 z-40 flex w-full items-center justify-between bg-surface px-container-margin py-4 shadow-sm">
        <button
          className="rounded-full p-2 text-on-surface-variant transition-colors duration-200 hover:bg-surface-container-high active:scale-95"
          aria-label="뒤로가기"
          onClick={() => router.back()}
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="font-headline-md text-headline-md font-bold text-primary">수업 시간 선택</h1>
        <div className="w-10" aria-hidden="true" />
      </header>

      <main className="mx-auto w-full max-w-7xl space-y-section-gap px-container-margin py-6 pb-32">
        <section className="space-y-stack-md">
          <h2 className="font-headline-md text-headline-md text-on-surface">날짜 선택</h2>
          <div className="hide-scrollbar flex gap-gutter-md overflow-x-auto pb-2">
            {DATES.map((date) => {
              const selected = selectedDate === date.day;
              return (
                <button
                  key={date.day}
                  className={`flex h-20 w-16 flex-shrink-0 flex-col items-center justify-center rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.04)] transition-colors ${
                    selected
                      ? 'border-2 border-primary bg-primary-container text-on-primary-container shadow-[0px_4px_20px_rgba(0,0,0,0.08)]'
                      : date.weekend
                      ? 'border border-outline-variant bg-surface-container-lowest text-error hover:bg-surface-container-low'
                      : 'border border-outline-variant bg-surface-container-lowest text-on-surface hover:bg-surface-container-low'
                  }`}
                  onClick={() => setSelectedDate(date.day)}
                >
                  <span className={`font-label-sm text-label-sm ${selected ? 'text-on-primary-container' : date.weekend ? '' : 'text-on-surface-variant'}`}>
                    {date.weekday}
                  </span>
                  <span className="font-headline-md text-headline-md">{date.day}</span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="space-y-stack-md rounded-xl bg-surface-container-lowest p-5 shadow-[0px_4px_20px_rgba(0,0,0,0.04)]">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-headline-md text-headline-md text-on-surface">시간 선택</h2>
            <span className="rounded-full bg-secondary-fixed px-2 py-1 font-label-sm text-label-sm text-secondary">50분 수업</span>
          </div>

          {TIME_GROUPS.map((group) => (
            <div key={group.label} className={group.label === '저녁' ? '' : 'mb-6'}>
              <h3 className="mb-3 flex items-center font-label-lg text-label-lg text-on-surface-variant">
                <span className="material-symbols-outlined mr-2">{group.icon}</span>
                {group.label}
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {group.slots.map((slot) => {
                  const selected = selectedTime === slot.time;
                  return (
                    <button
                      key={slot.time}
                      disabled={slot.disabled}
                      className={`rounded-lg py-2 font-body-md text-body-md transition-colors ${
                        slot.disabled
                          ? 'cursor-not-allowed border border-outline-variant text-on-surface opacity-50'
                          : selected
                          ? 'border-2 border-primary bg-primary-container font-semibold text-on-primary-container shadow-[0px_4px_10px_rgba(94,57,224,0.2)]'
                          : 'border border-outline-variant text-on-surface hover:bg-surface-container-low'
                      }`}
                      onClick={() => setSelectedTime(slot.time)}
                    >
                      {slot.time}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </section>

        <section className="space-y-stack-md rounded-xl bg-surface-container-lowest p-5 shadow-[0px_4px_20px_rgba(0,0,0,0.04)]">
          <h2 className="font-headline-md text-headline-md text-on-surface">수업 횟수</h2>
          <div className="flex gap-4">
            {DURATIONS.map((duration) => {
              const selected = selectedDuration === duration.label;
              return (
                <label key={duration.label} className="flex-1 cursor-pointer">
                  <input
                    checked={selected}
                    className="sr-only"
                    name="duration"
                    type="radio"
                    onChange={() => setSelectedDuration(duration.label)}
                  />
                  <div
                    className={`rounded-xl border px-4 py-3 text-center transition-all ${
                      selected ? 'border-secondary bg-secondary-fixed text-on-secondary-container' : 'border-outline-variant'
                    }`}
                  >
                    <span className="mb-1 block font-label-lg text-label-lg">{duration.label}</span>
                    <span className="block text-xs text-on-surface-variant">{duration.description}</span>
                  </div>
                </label>
              );
            })}
          </div>
        </section>

        <div className="pb-8 pt-4">
          <Link
            href={`/search?date=${selectedDate}&time=${encodeURIComponent(selectedTime)}`}
            className="flex w-full items-center justify-center rounded-full bg-gradient-to-r from-primary to-secondary py-4 font-headline-md text-headline-md text-on-primary shadow-[0px_8px_24px_rgba(94,57,224,0.3)] transition-all hover:opacity-90 active:scale-[0.98]"
          >
            선생님 찾기
            <span className="material-symbols-outlined ml-2">search</span>
          </Link>
        </div>
      </main>

      <nav className="fixed bottom-0 left-0 z-50 flex w-full items-center justify-around rounded-t-xl bg-surface-container-lowest px-4 py-3 shadow-[0px_-4px_20px_rgba(0,0,0,0.04)]">
        {NAV.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={`flex flex-col items-center justify-center rounded-xl px-3 py-1.5 transition-colors active:scale-90 ${
              item.active ? 'bg-primary-container text-on-primary-container' : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            <span className="material-symbols-outlined" style={item.active ? { fontVariationSettings: "'FILL' 1" } : undefined}>
              {item.icon}
            </span>
            <span className="mt-1 font-label-sm text-label-sm">{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
