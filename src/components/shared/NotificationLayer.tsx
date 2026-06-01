'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

type AlertSlide = {
  id: string;
  icon: string;
  title: string;
  description: string;
  time: string;
  href: string;
  tone: string;
  badge: string;
};

const REQUIRED_ALERTS: AlertSlide[] = [
  {
    id: 'lesson-reminder',
    icon: 'notifications_active',
    title: '수업 10분 전 알림',
    description: '고선미쌤과의 수업이 곧 시작됩니다. 입장 준비를 확인하세요.',
    time: '오늘 오후 2:20',
    href: '/my-bookings',
    tone: 'from-primary to-tertiary',
    badge: '수업',
  },
  {
    id: 'booking-status',
    icon: 'event_available',
    title: '예약 승인/변경 알림',
    description: '예약 확정, 시간 변경, 취소 요청이 생기면 바로 알려드립니다.',
    time: '실시간',
    href: '/my-bookings',
    tone: 'from-secondary to-primary',
    badge: '예약',
  },
  {
    id: 'chat-message',
    icon: 'chat_bubble',
    title: '채팅 메시지 알림',
    description: '선생님이 보낸 수업 준비 메시지와 링크를 놓치지 않게 해줍니다.',
    time: '방금 전',
    href: '/chat',
    tone: 'from-tertiary to-primary',
    badge: '채팅',
  },
  {
    id: 'payment-status',
    icon: 'payments',
    title: '결제/환불 알림',
    description: '결제 성공, 실패, 환불 처리 상태를 안전하게 확인할 수 있습니다.',
    time: '어제',
    href: '/payment-history',
    tone: 'from-primary to-secondary',
    badge: '결제',
  },
  {
    id: 'teacher-settlement',
    icon: 'account_balance_wallet',
    title: '정산/출금 알림',
    description: '선생님 모드에서 정산 완료와 출금 신청 결과를 알려드립니다.',
    time: '매주 월요일',
    href: '/profileT/withdraw',
    tone: 'from-tertiary to-secondary',
    badge: '정산',
  },
];

const RECENT_ALERTS = [
  {
    icon: 'event_available',
    title: '예약이 확정됐어요',
    description: '10월 12일 오후 2:30 수업이 확정되었습니다.',
    time: '5분 전',
    href: '/my-bookings',
    unread: true,
  },
  {
    icon: 'chat_bubble',
    title: '새 메시지가 도착했어요',
    description: '고선미쌤이 수업 자료 링크를 보냈습니다.',
    time: '12분 전',
    href: '/chat/1',
    unread: true,
  },
  {
    icon: 'payments',
    title: '결제가 완료됐어요',
    description: '₩35,000 결제가 정상 처리되었습니다.',
    time: '어제',
    href: '/payment-history',
    unread: false,
  },
];

type NotificationCenterContentProps = {
  compact?: boolean;
  onNavigate?: () => void;
};

export function NotificationCenterContent({ compact = false, onNavigate }: NotificationCenterContentProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [readAll, setReadAll] = useState(false);

  const moveTo = (index: number) => {
    const boundedIndex = Math.max(0, Math.min(index, REQUIRED_ALERTS.length - 1));
    const scroller = scrollerRef.current;
    const slide = scroller?.children.item(boundedIndex) as HTMLElement | null;

    slide?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    setActiveIndex(boundedIndex);
  };

  return (
    <div className={`flex flex-col ${compact ? 'gap-stack-lg' : 'gap-section-gap'}`}>
      <section className="flex flex-col gap-stack-sm">
        <p className="font-label-lg text-label-lg text-primary">필수 알림</p>
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className={`${compact ? 'font-headline-md text-headline-md' : 'font-headline-lg text-headline-lg'} text-on-surface`}>
              놓치면 안 되는 알림
            </h1>
            <p className="mt-1 font-body-md text-body-md text-on-surface-variant">
              수업, 예약, 채팅, 결제 상태를 슬라이드로 빠르게 확인하세요.
            </p>
          </div>
          <Link
            href="/notification-settings"
            onClick={onNavigate}
            className="hidden rounded-full border border-outline-variant px-4 py-2 font-label-lg text-label-lg text-on-surface-variant transition-colors hover:bg-surface-container-low sm:inline-flex"
          >
            설정
          </Link>
        </div>
      </section>

      <section className="relative">
        <div
          ref={scrollerRef}
          onScroll={(event) => {
            const target = event.currentTarget;
            const nextIndex = Math.round(target.scrollLeft / Math.max(target.clientWidth, 1));
            setActiveIndex(Math.max(0, Math.min(nextIndex, REQUIRED_ALERTS.length - 1)));
          }}
          className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth rounded-xl scrollbar-hide"
        >
          {REQUIRED_ALERTS.map((alert) => (
            <article key={alert.id} className="w-full shrink-0 snap-center">
              <Link
                href={alert.href}
                onClick={onNavigate}
                className={`flex ${compact ? 'min-h-[220px]' : 'min-h-[260px]'} flex-col justify-between rounded-xl bg-gradient-to-br ${
                  alert.tone
                } p-6 text-white shadow-[0_14px_34px_rgba(94,57,224,0.22)] transition-transform active:scale-[0.99]`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/18">
                    <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      {alert.icon}
                    </span>
                  </div>
                  <span className="rounded-full bg-white/18 px-3 py-1 font-label-sm text-label-sm">{alert.badge}</span>
                </div>
                <div>
                  <p className="mb-2 font-label-lg text-label-lg text-white/80">{alert.time}</p>
                  <h2 className={`${compact ? 'font-headline-md text-headline-md' : 'font-headline-lg text-headline-lg'}`}>
                    {alert.title}
                  </h2>
                  <p className="mt-2 max-w-2xl font-body-md text-body-md text-white/88">{alert.description}</p>
                </div>
                <div className="flex items-center justify-between pt-6">
                  <span className="font-label-lg text-label-lg">자세히 보기</span>
                  <span className="material-symbols-outlined">arrow_forward</span>
                </div>
              </Link>
            </article>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <button
            type="button"
            onClick={() => moveTo(activeIndex - 1)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-outline-variant bg-surface-container-lowest text-on-surface-variant shadow-sm transition-colors hover:bg-surface-container-low active:scale-95"
            aria-label="이전 알림"
          >
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <div className="flex items-center gap-2">
            {REQUIRED_ALERTS.map((alert, index) => (
              <button
                key={alert.id}
                type="button"
                onClick={() => moveTo(index)}
                className={`h-2.5 rounded-full transition-all ${activeIndex === index ? 'w-7 bg-primary' : 'w-2.5 bg-outline-variant'}`}
                aria-label={`${index + 1}번째 알림으로 이동`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => moveTo(activeIndex + 1)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-outline-variant bg-surface-container-lowest text-on-surface-variant shadow-sm transition-colors hover:bg-surface-container-low active:scale-95"
            aria-label="다음 알림"
          >
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      </section>

      <section className="rounded-xl bg-surface-container-lowest p-5 shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-headline-md text-headline-md text-on-surface">최근 알림</h2>
          <button
            type="button"
            onClick={() => setReadAll(true)}
            className="font-label-lg text-label-lg text-primary transition-opacity hover:opacity-80 active:scale-95 disabled:text-outline"
            disabled={readAll}
          >
            {readAll ? '읽음 완료' : '모두 읽음'}
          </button>
        </div>
        <div className="divide-y divide-surface-container">
          {RECENT_ALERTS.map((alert) => (
            <Link
              key={alert.title}
              href={alert.href}
              onClick={onNavigate}
              className={`flex gap-3 rounded-lg px-2 py-4 transition-colors first:pt-0 last:pb-0 hover:bg-surface-container-low/60 ${
                alert.unread && !readAll ? 'bg-primary-fixed/25' : 'bg-transparent'
              }`}
            >
              <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-fixed text-primary">
                <span className="material-symbols-outlined text-[22px]">{alert.icon}</span>
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-start justify-between gap-3">
                  <span className="flex items-center gap-2 font-label-lg text-label-lg text-on-surface">
                    {alert.unread && !readAll ? <span className="h-2 w-2 rounded-full bg-error" aria-hidden="true" /> : null}
                    {alert.title}
                  </span>
                  <span className="shrink-0 font-label-sm text-label-sm text-outline">{alert.time}</span>
                </span>
                <span className="mt-1 block font-body-md text-body-md text-on-surface-variant">{alert.description}</span>
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

export function NotificationLayer({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [onClose, open]);

  return (
    <div className={`fixed inset-0 z-[90] ${open ? 'pointer-events-auto' : 'pointer-events-none'}`} aria-hidden={!open}>
      <button
        type="button"
        aria-label="알림 닫기"
        onClick={onClose}
        className={`absolute inset-0 bg-black/35 transition-opacity duration-200 ${open ? 'opacity-100' : 'opacity-0'}`}
      />
      <aside
        className={`absolute right-0 top-0 flex h-dvh w-full max-w-[440px] flex-col bg-background shadow-[-14px_0_36px_rgba(25,28,31,0.18)] transition-transform duration-300 ease-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="알림"
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-outline-variant/50 bg-white/90 px-container-margin backdrop-blur-md">
          <h2 className="font-headline-md text-headline-md text-on-surface">알림</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container-low active:scale-95"
            aria-label="닫기"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-container-margin py-stack-lg pb-28">
          <NotificationCenterContent compact onNavigate={onClose} />
        </div>
      </aside>
    </div>
  );
}
