'use client';

import Link from 'next/link';
import { useState } from 'react';

const WRITTEN = [
  {
    teacher: '고선미 선생님',
    meta: 'Oct 24, 2023 • TOPIK II Prep',
    stars: 5,
    text: '고선미 선생님은 어려운 문법을 차분하고 명확하게 설명해 주세요. 맞춤 학습 자료도 제 수준에 꼭 맞아서 큰 도움이 됐습니다.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAmXq-8i5-gTH9KcRutKK2PgH_5U8-iK_knctssz-xhBDBv6GJYwb4AJTt_MRf9GppESQYH32TwyLqohhTz4zn-L73u-7SPv_rFUgrYVUdKEKxSys7GtwJnMiFKe6DslIrzbn8-xNp9uXsPrWwfbMzWjW3thx-YIQaVb0vE6kzkzoALw5M6suDYeFF5qZL1O7qeBjwOPTXtXUXN6rbEw9hPL9TCvWEAZl934GzYaj2bB8qmh7OHIN_4r3DUIWI-krGDVxCnCjJQJg',
  },
  {
    teacher: 'Min-su Teacher',
    meta: 'Oct 18, 2023 • Casual Conversation',
    stars: 4,
    text: 'Great conversation practice! He corrects my pronunciation gently without breaking the flow of our chat. Very enjoyable classes.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCx0q7sG36UNe_Wd0kVIOdJmFqFcisAEGs3QuLPfXIsafgnsmmrB-PYUFcm4Q5yGIKB6IOZ99Z7420a8Bvb4kXRwvrT16FtyAMlJ_d82fh-5eFDfAjI8-qamgJrsBwQN79Q8PCdB7kSwo3Ij1E9BfhQTbnix0aLGzDAViLULzJfc4I1OiYr_GwiPmE0RaF3FW8YvFFEM8ItYvhkF_VY-4wsMRSPhDbxN6wsM7IZDqrcDM6xs8Fh-Aq1enQQDIbzGk-gQQhrF5cx-A',
  },
];

const PENDING = [
  {
    teacher: 'Hye-jin Teacher',
    date: 'Today, 14:00',
    title: 'Business Korean Level 3',
    text: 'Focus on formal email etiquette and meeting vocabulary.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCtjj0ceyd0soHXUEAhKake2H6J47rxDwUszEkVymgCyGtXGQSFJkHH65WQusCIzLnO6o5tpVG9nUJhIWZtLUQn-5-JDpVc8zZHpmepXvXiC6KwXryN7Tf-F4QAVk2uZDaFN5VuKvla6TouSSR9RkYZs_2LYLlhQ2ijgUpumhfRup_GDHP1um8p1TpGAnUkQtQ0rs2a8STj2kJAIv0Sz7aoXktoSjfKfd8QX2Vs7l5txTG3ARjIYC_s8U3Od3QY__nns1XHK2RPuQ',
  },
  {
    teacher: 'Seo-joon Teacher',
    date: 'Oct 20, 2023',
    title: 'Grammar Fundamentals',
    text: 'Reviewing complex sentence structures.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDIIPnX83VRrPlmJgc-SPgmFWixN-z6hXaA58OJLWCxgeXw0J1JRWD4yCSBs4Dccxrfbe80E8MduqOMRgnQu1Fc7WifGvJ2qrxTVRD6u1xe6jOD5jsx-Z1wcmRzDxbrtHeKBpvdmY_Gl7uLiX7wQCLc_Lbzfm_bHVfnOagbpxLf_PD9GGbPMsSS5khekIxgI63Kul8FZYjS52-yqXA6QqevFz4V5Is04Mwh_gK7l1mIbzKRgU8L08dnPn5C7Uno9p46G13OlQNy_A',
  },
];

export default function ReviewsPage() {
  const [tab, setTab] = useState<'written' | 'pending'>('written');

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-surface pb-24 text-on-surface selection:bg-primary-container selection:text-on-primary-container">
      <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between bg-surface px-container-margin">
        <Link href="/profile-setup" className="-ml-2 rounded-full p-2 text-primary transition-colors hover:bg-surface-container-low" aria-label="뒤로가기">
          <span className="material-symbols-outlined">arrow_back</span>
        </Link>
        <h1 className="font-headline-md text-headline-md font-extrabold text-primary">리뷰 관리</h1>
        <button className="-mr-2 rounded-full p-2 text-primary transition-colors hover:bg-surface-container-low" aria-label="알림">
          <span className="material-symbols-outlined">notifications</span>
        </button>
      </header>

      <main className="relative z-10 flex-1">
        <div className="sticky top-16 z-30 bg-surface/90 px-container-margin pb-6 pt-2 shadow-[0_4px_20px_rgba(248,249,254,0.9)] backdrop-blur-md">
          <div className="relative flex gap-1 rounded-xl bg-surface-container-low p-1">
            <button
              className={`flex-1 rounded-lg py-2.5 text-center font-label-lg transition-all duration-200 ${
                tab === 'written' ? 'bg-surface-container-lowest text-primary shadow-[0px_2px_8px_rgba(0,0,0,0.04)]' : 'text-on-surface-variant hover:bg-surface-container-highest'
              }`}
              onClick={() => setTab('written')}
            >
              작성한 리뷰
            </button>
            <button
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2.5 text-center font-label-lg transition-all duration-200 ${
                tab === 'pending' ? 'bg-surface-container-lowest text-primary shadow-[0px_2px_8px_rgba(0,0,0,0.04)]' : 'text-on-surface-variant hover:bg-surface-container-highest'
              }`}
              onClick={() => setTab('pending')}
            >
              작성 대기
              <span className="rounded-full bg-secondary-container px-1.5 py-0.5 text-[10px] font-bold leading-none text-on-tertiary">2</span>
            </button>
          </div>
        </div>

        {tab === 'written' ? (
          <section className="review-tab-content flex flex-col gap-stack-md px-container-margin">
            {WRITTEN.map((review) => (
              <article key={review.teacher} className="rounded-xl border border-surface-variant/40 bg-surface-container-lowest p-5 shadow-[0px_4px_20px_rgba(0,0,0,0.04)] transition-shadow hover:shadow-[0px_8px_30px_rgba(0,0,0,0.06)]">
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img alt={review.teacher} className="h-12 w-12 rounded-full border-2 border-surface-container-lowest object-cover shadow-sm" src={review.image} />
                    <div className="flex flex-col">
                      <h3 className="font-label-lg text-on-surface">{review.teacher}</h3>
                      <p className="mt-0.5 font-label-sm text-outline">{review.meta}</p>
                    </div>
                  </div>
                  <button className="p-1 text-outline-variant transition-colors hover:text-primary">
                    <span className="material-symbols-outlined">more_vert</span>
                  </button>
                </div>
                <div className="mb-3 flex gap-0.5 text-secondary-container">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <span key={index} className={`material-symbols-outlined text-[20px] ${index >= review.stars ? 'text-outline-variant' : ''}`} style={{ fontVariationSettings: "'FILL' 1" }}>
                      star
                    </span>
                  ))}
                </div>
                <p className="rounded-lg bg-surface-container-low/50 p-3 font-body-md leading-relaxed text-on-surface-variant">{review.text}</p>
                <div className="mt-4 flex justify-end border-t border-surface-variant/30 pt-4">
                  <button className="rounded-full border border-primary bg-surface-container-lowest px-5 py-2 font-label-lg text-primary transition-all hover:border-transparent hover:bg-primary-fixed">Edit Review</button>
                </div>
              </article>
            ))}
          </section>
        ) : (
          <section className="review-tab-content flex flex-col gap-stack-md px-container-margin">
            {PENDING.map((item) => (
              <article key={item.teacher} className="group relative overflow-hidden rounded-[1.25rem] border border-transparent bg-surface-container-lowest p-5 shadow-[0px_4px_20px_rgba(0,0,0,0.04)] transition-all duration-300 hover:border-primary-fixed-dim">
                <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br from-primary-fixed-dim/40 to-secondary-fixed-dim/20 opacity-50 blur-2xl transition-opacity group-hover:opacity-100" />
                <div className="relative z-10 mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img alt={item.teacher} className="h-14 w-14 rounded-full border-[3px] border-surface-container-lowest object-cover shadow-md" src={item.image} />
                    <div className="flex flex-col">
                      <h3 className="font-headline-md text-lg leading-tight text-on-surface">{item.teacher}</h3>
                      <p className="mt-0.5 flex items-center gap-1 font-label-sm text-outline">
                        <span className="material-symbols-outlined text-[14px]">event_available</span>
                        {item.date}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="relative z-10 mb-5 flex items-start gap-3 rounded-xl border border-surface-variant/30 bg-surface-container-low p-3.5">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-fixed">
                    <span className="material-symbols-outlined text-[18px] text-primary">record_voice_over</span>
                  </div>
                  <div>
                    <h4 className="mb-0.5 font-label-lg text-on-surface">{item.title}</h4>
                    <p className="font-body-md text-sm text-on-surface-variant">{item.text}</p>
                  </div>
                </div>
                <button className="relative z-10 w-full rounded-[1rem] bg-gradient-to-r from-primary to-tertiary-container py-3.5 font-label-lg text-on-primary shadow-[0px_4px_12px_rgba(94,57,224,0.25)] transition-all active:scale-[0.98]">
                  <span className="flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-[20px]">edit_document</span>
                    Write Review
                  </span>
                </button>
              </article>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}
