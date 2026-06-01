'use client';

import { useState } from 'react';
import Link from 'next/link';

const PAYMENT_METHODS = [
  { id: 'card', icon: 'credit_card', label: '신용/체크 카드' },
  { id: 'paypal', icon: 'payments', label: 'PayPal' },
  { id: 'kakao', icon: 'account_balance_wallet', label: '카카오페이' },
];

export default function PaymentPage() {
  const [method, setMethod] = useState('card');

  return (
    <div className="min-h-screen bg-background font-body-md text-on-surface">
      <header className="fixed left-0 top-0 z-40 flex h-16 w-full items-center justify-between bg-surface px-container-margin">
        <Link href="/booking" className="flex h-10 w-10 items-center justify-center transition-all duration-100 active:scale-95" aria-label="뒤로">
          <span className="material-symbols-outlined text-primary">arrow_back_ios</span>
        </Link>
        <button className="flex h-10 w-10 items-center justify-center transition-all duration-100 active:scale-95" aria-label="찜하기">
          <span className="material-symbols-outlined text-primary">favorite</span>
        </button>
      </header>

      <main className="mx-auto max-w-lg px-container-margin pb-48 pt-stack-lg">
        <section className="soft-card-shadow mb-stack-lg flex items-center gap-4 rounded-xl bg-surface-container-lowest p-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt="고선미 선생님"
            className="h-20 w-20 rounded-lg object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCw-7p0g5P9Gl4YiRc5sabWh6vtuJqbXk7rDv_d25es2YPsAZIDT2f9Hxs5ljqK5xlcKd36TczlKmbF2KuorlP7PbyjA9v8zbg2UwaqiEQESE5EnqjwrNC9M_M7u8xg1ADl1qctFHQspy4bxgj-PafF7pMjWaw1jqm95LqI-i-iGSosiUsuW-VpCeYUIqcMHM0MF4c-ZgJv83IJehitGESsWDk1ql-OweYIrpQQNnu9BPlw_OX3UJBSM-a-xwrxuwDEMy090H4tkA"
          />
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <h2 className="font-headline-md text-headline-md">고선미쌤</h2>
              <div className="flex items-center gap-1 text-secondary">
                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                  star
                </span>
                <span className="font-label-lg text-label-lg">4.9</span>
              </div>
            </div>
            <p className="mt-1 font-body-md text-on-surface-variant">₩25,000 / 50분</p>
            <div className="mt-2 flex items-center gap-2 font-label-sm text-label-sm text-primary">
              <span className="material-symbols-outlined text-sm">calendar_today</span>
              <span>2024. 06. 12 (수) 10:00</span>
            </div>
          </div>
        </section>

        <section className="mb-stack-lg">
          <h3 className="mb-stack-md font-headline-md text-headline-md">결제 수단</h3>
          <div className="space-y-3">
            {PAYMENT_METHODS.map((item) => {
              const active = method === item.id;
              return (
                <label
                  key={item.id}
                  className={`flex cursor-pointer items-center justify-between rounded-xl border-2 bg-surface-container-lowest p-4 transition-transform active:scale-[0.98] ${
                    active ? 'border-primary' : 'border-transparent hover:border-outline-variant'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`material-symbols-outlined ${active ? 'text-primary' : 'text-outline'}`}>{item.icon}</span>
                    <span className="font-label-lg text-label-lg">{item.label}</span>
                  </div>
                  <div className={`flex h-6 w-6 items-center justify-center rounded-full border-2 p-1 ${active ? 'border-primary' : 'border-outline-variant'}`}>
                    {active && <div className="h-full w-full rounded-full bg-primary" />}
                  </div>
                  <input checked={active} className="hidden" name="payment_method" type="radio" onChange={() => setMethod(item.id)} />
                </label>
              );
            })}
          </div>
        </section>

        <section className="mb-stack-lg">
          <h3 className="mb-stack-md font-headline-md text-headline-md">쿠폰 사용</h3>
          <button className="flex w-full items-center justify-between rounded-xl border border-outline-variant bg-surface-container-lowest p-4 text-outline transition-colors active:bg-surface-container-low">
            <span className="font-body-md text-body-md">쿠폰 선택</span>
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </section>

        <section className="mb-stack-lg rounded-xl bg-surface-container-low p-5">
          <h3 className="mb-4 font-headline-md text-headline-md">결제 금액</h3>
          <div className="space-y-3">
            <div className="flex justify-between font-body-md text-body-md text-on-surface-variant">
              <span>수업 금액</span>
              <span>₩25,000</span>
            </div>
            <div className="flex justify-between font-body-md text-body-md text-on-surface-variant">
              <span>할인 금액</span>
              <span className="text-secondary">- ₩0</span>
            </div>
            <div className="my-2 h-px bg-outline-variant" />
            <div className="mt-2 flex items-center justify-between">
              <span className="font-headline-md text-headline-md">총 결제 금액</span>
              <span className="font-display-lg text-display-lg text-primary">₩25,000</span>
            </div>
          </div>
        </section>
      </main>

      <footer className="fixed bottom-20 left-0 z-50 w-full border-t border-outline-variant bg-surface px-container-margin py-3">
        <div className="mx-auto max-w-lg">
          <Link
            href="/confirmation"
            className="block w-full rounded-full bg-gradient-to-r from-primary to-secondary-container py-3 text-center font-label-lg text-label-lg text-on-primary shadow-lg transition-opacity hover:opacity-90 active:scale-95"
          >
            결제하기
          </Link>
        </div>
      </footer>
    </div>
  );
}
