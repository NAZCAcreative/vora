'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

const FILTERS = ['TOPIK 전문', '비즈니스', '그룹수업', '가격순', '원어민'];

const TEACHERS = [
  {
    id: '1',
    name: '고선미쌤',
    rating: '4.9',
    reviews: '128',
    price: '₩25,000',
    recommended: true,
    tags: [
      { label: 'TOPIK 전문', className: 'bg-primary/10 text-primary' },
      { label: '원어민', className: 'bg-secondary/10 text-secondary' },
      { label: '회화', className: 'bg-tertiary/10 text-tertiary' },
    ],
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDHPiPuxm_-n7eDq9R5lnTkeRgLObIpSHgV8yGQ2qcvBW-X3bu4NMpgPOAu7_k1IoHcGXT0eTT1g7kMtiIABZleHRO1Lk8-l7KduIgrc5ntXffjPVqXRn0LJ_2BJC0X2Stg1ryflmtlfUWV4oLF-5BgrUuCcYPDx-HeT7CSwff1J7wT0z1VestyVYfmU6P9vhCAtwA6H7XsFlwcqlVnNeGgAeXImaiM_rcZSwOAVHu-wQj_1DLETSDqdk7XOxX8nX3JUqefQZXwkQ',
  },
  {
    id: '2',
    name: '민준쌤',
    rating: '4.8',
    reviews: '96',
    price: '₩24,000',
    tags: [
      { label: '비즈니스', className: 'bg-primary/10 text-primary' },
      { label: '초보 OK', className: 'bg-tertiary/10 text-tertiary' },
      { label: '열정맨', className: 'bg-secondary/10 text-secondary' },
    ],
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBpD998PfDDin7Bf52GGfocc1uSgQmrhPrSNXEkCkbdzVnJKEX_rPHlvodp2tlMfSLOgK_ACOKS1lZoqddIzk_Uu855HcHjRivyllDA4HrxAoaHH5EacR5v0IcXq3IT3ldU7OaH1b9lgUdeuT_lUP6UMKqp6sOOnS4-DQhhT9W1drMTx5CcfAdHIa5RzfNFkb_Oo1loh3RJUprtkwv9XQiTeK_CQPeJtOcU9ZOB2eO_yoE3tjT8SqPgmmzM7bsQWA3o8O62tHACYQ',
  },
  {
    id: '3',
    name: '수아쌤',
    rating: '4.8',
    reviews: '76',
    price: '₩25,000',
    tags: [
      { label: 'K-POP 한국어', className: 'bg-primary/10 text-primary' },
      { label: '여행 회화', className: 'bg-tertiary/10 text-tertiary' },
      { label: '발음 전문', className: 'bg-secondary/10 text-secondary' },
    ],
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBZzhnKFmLsjbB5DxSMj2xxQ-yWW1zT85_Mn_iqLVPDpZbJfq_I2GhJQEaoaxpOaD91jlPbMKrJVxqdK67M75J4EE0nEjQuKM5srPa8HUni0makGJl_2qvTTJkA8og6o7JSj-4AO5lL5RZrNYiMYa8jSPkayF7a6VsURiM6Uig2ebZSCaKQNP3MIk9KE9FFFeXsvnxQzvSI5Nwt_lAZUlbGVU_bQjd-uoE9xAq74B2fkr7Og9iheRCMjD6cy6-MQuRiJwlrm2ywTQ',
  },
];

const NAV = [
  { icon: 'home', label: '홈', href: '/home' },
  { icon: 'search', label: '검색', href: '/search' },
  { icon: 'calendar_today', label: '예약', href: '/my-bookings', active: true },
  { icon: 'chat_bubble', label: '채팅', href: '/chat' },
  { icon: 'person', label: '마이', href: '/profile-setup' },
];

function TeacherCard({
  teacher,
  favorite,
  onToggleFavorite,
}: {
  teacher: (typeof TEACHERS)[number];
  favorite: boolean;
  onToggleFavorite: () => void;
}) {
  return (
    <article className="group relative overflow-hidden rounded-xl border border-surface-container-high bg-surface-container-lowest p-4 shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
      <div className="flex gap-4">
        <div className="relative flex-shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img alt={teacher.name} className="h-24 w-24 rounded-lg object-cover" src={teacher.image} />
          {teacher.recommended && (
            <div className="absolute -left-2 -top-2 flex items-center gap-0.5 rounded-full bg-secondary px-2 py-0.5 text-[10px] font-bold text-on-secondary shadow-sm">
              <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                workspace_premium
              </span>
              추천
            </div>
          )}
        </div>

        <div className="min-w-0 flex-grow">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="flex items-center gap-1 font-headline-md text-headline-md text-on-surface">
                {teacher.name}
                <span className="material-symbols-outlined text-[18px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                  verified
                </span>
              </h3>
              <div className="mb-2 flex items-center gap-1 text-on-surface-variant">
                <span className="material-symbols-outlined text-[16px] text-[#FFD700]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  star
                </span>
                <span className="font-label-lg text-label-lg">{teacher.rating}</span>
                <span className="font-body-md text-body-md opacity-70">({teacher.reviews} reviews)</span>
              </div>
            </div>
            <button className="text-on-surface-variant transition-colors hover:text-secondary active:scale-95" aria-label={`${teacher.name} 찜하기`} onClick={onToggleFavorite}>
              <span className="material-symbols-outlined" style={favorite ? { fontVariationSettings: "'FILL' 1" } : undefined}>
                favorite
              </span>
            </button>
          </div>

          <div className="mb-3 flex flex-wrap gap-1.5">
            {teacher.tags.map((tag) => (
              <span key={tag.label} className={`rounded px-2 py-0.5 text-[11px] font-semibold ${tag.className}`}>
                {tag.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-3 border-t border-surface-container pt-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-headline-md text-headline-md font-bold text-primary">
          {teacher.price}
          <span className="text-sm font-normal text-on-surface-variant"> / 50분</span>
        </p>
        <div className="flex gap-2">
          <Link
            href={`/teachers/${teacher.id}`}
            className="flex-1 rounded-full border border-primary px-5 py-2 text-center font-label-lg text-primary transition-colors hover:bg-primary/5 active:scale-95 sm:flex-none"
          >
            프로필 보기
          </Link>
          <Link
            href={`/booking?teacher=${teacher.id}`}
            className="flex-1 rounded-full bg-gradient-to-r from-primary to-secondary px-5 py-2 text-center font-label-lg text-white shadow-md transition-transform active:scale-95 sm:flex-none"
          >
            예약하기
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [favorites, setFavorites] = useState(() => new Set<string>());

  const selectedDate = searchParams.get('date') ?? '12';
  const selectedTime = searchParams.get('time') ?? '14:30';

  const toggleFavorite = (id: string) => {
    setFavorites((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="teacher-recommend-page min-h-screen bg-background pb-24 font-body-md text-on-background">
      <header className="fixed left-0 top-0 z-50 flex w-full items-center justify-between bg-surface px-container-margin py-4 shadow-sm">
        <div className="flex items-center gap-3">
          <button className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-surface-container" aria-label="뒤로가기" onClick={() => router.back()}>
            <span className="material-symbols-outlined text-on-surface">arrow_back</span>
          </button>
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile font-bold text-primary">맞춤 선생님 추천</h1>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 text-on-surface-variant transition-colors hover:text-primary" aria-label="알림">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <Link href="/profile-setup" className="h-8 w-8 overflow-hidden rounded-full border border-primary-fixed" aria-label="마이페이지">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt="User"
              className="h-full w-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDrY6BFuv52mT5V2dBF_ev-xIoHtOQwGAtBGPgwhCvO-XOKhHsDjkxz8eENXewsvpquRArU6JWVCpTN07aMxhuYUeMS9LxG7wGY1cSJpjTaqzC7wk5PvSMJ7Q6XRPdL_-KZUcyr_qK9ORdE-WUBbJqmBNNnNFuiG_clEI_mFVTABxLuT81Z3F82zT3Wj9X3C1wlK6vGm3yUJn1zLlbVBO9ZOAbYhB_bWt7Pyi0xaNsKPcDE1EtebHwODI7y8Jlx96OfsTP_VsZ1ew"
            />
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-container-margin pb-32">
        <section className="mb-section-gap pt-4">
          <div className="mb-4 rounded-xl border border-primary-fixed-dim/50 bg-primary-fixed/30 p-4">
            <div className="mb-1 flex items-center gap-2 text-primary">
              <span className="material-symbols-outlined text-[18px]">calendar_month</span>
              <span className="font-label-lg text-label-lg">선택한 수업 시간</span>
            </div>
            <p className="font-headline-md text-headline-md font-bold text-on-background">
              10월 {selectedDate}일 <span className="text-primary">{selectedTime}</span>
            </p>
            <p className="mt-1 font-body-md text-body-md text-on-surface-variant">이 시간에 바로 수업 가능한 베스트 선생님을 찾았습니다.</p>
          </div>

          <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-2">
            <button className="flex items-center gap-1 whitespace-nowrap rounded-full bg-primary px-4 py-2 font-label-lg text-on-primary shadow-md">
              <span className="material-symbols-outlined text-[18px]">tune</span>
              필터
            </button>
            {FILTERS.map((filter) => {
              const active = activeFilter === filter;
              return (
                <button
                  key={filter}
                  className={`whitespace-nowrap rounded-full border px-4 py-2 font-label-lg transition-colors ${
                    active ? 'border-primary bg-primary text-on-primary' : 'border-outline-variant/30 bg-surface-container-highest text-on-surface-variant'
                  }`}
                  onClick={() => setActiveFilter(active ? null : filter)}
                >
                  {filter}
                </button>
              );
            })}
          </div>
        </section>

        <section className="space-y-gutter-md">
          {TEACHERS.map((teacher) => (
            <TeacherCard key={teacher.id} teacher={teacher} favorite={favorites.has(teacher.id)} onToggleFavorite={() => toggleFavorite(teacher.id)} />
          ))}

          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-secondary p-6 text-white shadow-lg">
            <div className="relative z-10">
              <p className="mb-1 font-label-lg uppercase tracking-wider text-white/80">SPECIAL OFFER</p>
              <h4 className="mb-2 font-headline-lg text-headline-lg font-bold">첫 수업 50% 할인!</h4>
              <p className="max-w-[70%] font-body-md text-body-md opacity-90">지금 바로 마음에 드는 선생님과 첫 레슨을 예약하고 할인을 받으세요.</p>
            </div>
            <div className="absolute right-0 top-0 h-full w-32 translate-x-4 opacity-20">
              <span className="material-symbols-outlined text-[120px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                celebration
              </span>
            </div>
          </div>
        </section>
      </main>

      <nav className="fixed bottom-0 left-0 z-50 flex w-full items-center justify-around rounded-t-xl bg-surface px-2 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.04)]">
        {NAV.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={`flex flex-col items-center justify-center px-4 py-1 transition-all ${
              item.active ? 'scale-90 rounded-xl bg-primary-container text-on-primary-container' : 'text-on-surface-variant hover:bg-surface-container-low'
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
