'use client';

import { useEffect, useState } from 'react';

type ToastDetail = { message: string };

const EVENT_NAME = 'vora-toast';

export function showToast(message: string) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent<ToastDetail>(EVENT_NAME, { detail: { message } }));
}

export function ToastHost() {
  const [toasts, setToasts] = useState<{ id: number; message: string }[]>([]);

  useEffect(() => {
    let counter = 0;

    const handler = (event: Event) => {
      const detail = (event as CustomEvent<ToastDetail>).detail;
      const id = ++counter;
      setToasts((prev) => [...prev, { id, message: detail.message }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
      }, 2200);
    };

    window.addEventListener(EVENT_NAME, handler);
    return () => window.removeEventListener(EVENT_NAME, handler);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-24 z-[100] flex flex-col items-center gap-2 px-4">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role="status"
          className="pointer-events-auto rounded-full bg-on-surface/90 px-5 py-3 text-center font-label-lg text-label-lg text-white shadow-lg animate-[fadeIn_0.15s_ease-out]"
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}
