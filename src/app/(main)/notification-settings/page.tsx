'use client';

import Link from 'next/link';
import { useState } from 'react';

const GROUPS = [
  {
    icon: 'notifications_active',
    iconClass: 'text-primary',
    title: '서비스 알림',
    items: [
      { id: 'lesson-start', title: '수업 시작 알림', description: '수업 10분 전에 알림을 보내드려요.', defaultChecked: true },
      { id: 'chat-message', title: '채팅 메시지 알림', description: '튜터나 매칭된 파트너의 새 메시지 알림입니다.', defaultChecked: true },
    ],
  },
  {
    icon: 'redeem',
    iconClass: 'text-secondary',
    title: '마케팅 알림',
    items: [{ id: 'marketing', title: '이벤트 및 혜택 알림', description: '할인 쿠폰, 특별 이벤트 등 유용한 정보를 받아보세요.', defaultChecked: false }],
  },
];

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (checked: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full p-0.5 transition-colors active:scale-95 ${
        checked ? 'bg-primary' : 'bg-surface-container-highest'
      }`}
    >
      <span
        className={`h-6 w-6 rounded-full bg-white shadow-sm transition-transform ${checked ? 'translate-x-5' : 'translate-x-0'}`}
      />
    </button>
  );
}

export default function NotificationSettingsPage() {
  const [settings, setSettings] = useState(() =>
    Object.fromEntries(GROUPS.flatMap((group) => group.items.map((item) => [item.id, item.defaultChecked]))),
  );

  const setSetting = (id: string, checked: boolean) => {
    setSettings((current) => ({ ...current, [id]: checked }));
  };

  return (
    <div className="min-h-screen bg-background text-on-background selection:bg-primary-container selection:text-on-primary-container">
      <header className="fixed top-0 z-50 w-full bg-surface shadow-sm">
        <div className="flex h-16 w-full items-center justify-between px-container-margin">
          <Link href="/profile-setup" className="flex items-center justify-center rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container active:scale-95" aria-label="뒤로가기">
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <h1 className="font-headline-md text-headline-md text-on-surface">알림 설정</h1>
          <div className="w-10" />
        </div>
      </header>

      <main className="mx-auto max-w-lg px-container-margin pb-32 pt-stack-lg">
        <div className="flex flex-col gap-section-gap">
          {GROUPS.map((group) => (
            <section key={group.title} className="rounded-xl bg-surface-container-lowest p-5 shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
              <div className="mb-stack-lg flex items-center gap-2 border-b border-surface-container pb-3">
                <span className={`material-symbols-outlined ${group.iconClass}`}>{group.icon}</span>
                <h2 className="font-label-lg text-label-lg text-on-surface">{group.title}</h2>
              </div>
              <div className="flex flex-col gap-stack-lg">
                {group.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between gap-4">
                    <div className="flex min-w-0 flex-col gap-1">
                      <span className="font-body-lg text-body-lg text-on-surface">{item.title}</span>
                      <span className="font-label-sm text-label-sm text-on-surface-variant">{item.description}</span>
                    </div>
                    <Toggle checked={settings[item.id]} onChange={(checked) => setSetting(item.id, checked)} label={item.title} />
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}
