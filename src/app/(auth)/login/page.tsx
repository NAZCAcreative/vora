'use client';

import Link from 'next/link';
import { safeAuthNext } from '@/lib/auth-redirect';
import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const login = useAuthStore((s) => s.login);
  const isLoading = useAuthStore((s) => s.isLoading);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async () => {
    setErrorMessage(null);
    if (!email.trim() || !password) {
      setErrorMessage('이메일과 비밀번호를 입력해주세요.');
      return;
    }
    try {
      await login(email, password);
      const next = searchParams.get('next');
      router.push(safeAuthNext(next));
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : '로그인에 실패했습니다.');
    }
  };

  return (
    <div className="bg-background text-on-background flex min-h-[calc(100dvh-64px)] flex-col items-center justify-center py-8 pb-28 px-container-margin font-body-md">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center gap-stack-sm text-center">
          <div className="bg-gradient-primary flex h-16 w-16 rotate-6 items-center justify-center rounded-xl shadow-lg">
            <span className="material-symbols-outlined text-[36px] text-white">language</span>
          </div>
          <h1 className="text-headline-lg-mobile font-headline-lg-mobile text-on-surface">VORA</h1>
          <p className="text-body-md text-on-surface-variant">다시 만나서 반가워요!</p>
        </div>

        <form
          className="flex flex-col gap-stack-md rounded-xl border border-surface-variant/30 bg-surface-container-lowest p-5 sm:p-8 shadow-[0px_4px_20px_rgba(0,0,0,0.04)]"
          onSubmit={(event) => {
            event.preventDefault();
            void handleSubmit();
          }}
        >
          <div className="flex flex-col gap-stack-sm">
            <label htmlFor="login-email" className="font-label-lg text-label-lg text-on-surface-variant">
              이메일 주소
            </label>
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-xl border-transparent bg-surface-container-low px-4 py-3.5 text-body-md focus:border-primary focus:ring-0"
            />
          </div>

          <div className="flex flex-col gap-stack-sm">
            <label htmlFor="login-password" className="font-label-lg text-label-lg text-on-surface-variant">
              비밀번호
            </label>
            <input
              id="login-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-xl border-transparent bg-surface-container-low px-4 py-3.5 text-body-md focus:border-primary focus:ring-0"
            />
          </div>

          {errorMessage && <p className="rounded-lg bg-error-container/20 px-4 py-3 text-body-md text-error">{errorMessage}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="bg-gradient-primary mt-2 w-full rounded-lg py-4 text-center font-label-lg text-label-lg text-white shadow-sm shadow-primary/20 transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-60"
          >
            {isLoading ? '로그인 중...' : '로그인'}
          </button>

          <p className="mt-2 text-center text-body-md text-on-surface-variant">
            계정이 없으신가요?{' '}
            <Link href="/signup" className="inline-flex min-h-11 items-center font-bold text-primary hover:underline">
              회원가입
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}
