'use client';

import { useState } from 'react';
import Link from 'next/link';

const TEACHER_AVATAR =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAqOQtI4DglgMfKefmuvCGg5vKyijsSQjKmTKTUfRMWLxyqV9tVCO2PuoAZ_nU4pV0_vwJZUNEDMq0HlkmK0_WqbKGjKJQnBI4j4FmBhz-kKdaCH0X_xpJnNcre1oFs07hlbO4077G_hIStq7h72LDueVBvjYNR3PCfqLr3ijndsCEoAGlBv_4RSGgFFGZMsCCqqjgx48WbkSq4C1IV-sK9pB7if3rhNdljyAk0HT-Eyf7h5Agkt5APa61EyU90Pz2VnZArWqprPg';

const MESSAGE_AVATAR =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBSE1anvMRMwV6NN6uqwKyz9_qELRcjI-jruV8krusywlIZDwVpG-sy1Ib-vBHnrVag0EF6Qqzro_rMnKvSyz39idogoRmRAkYEM0u3Lh9YXBcYuDsm-xfeK8nW_EpqwMjKmjehF__6Ab06fCTF3wDypGFxgdBUhkF3i76G2Zvzny_RSepFvRIFYxY-Q9UwcKOYntnkcr3DQPVUT6dbZdDBoK5f0kojL2YmGQvoRlNnKcsAFUBziW1j1UQzT7dmlFvAvYLVhHKkwg';

export default function ChatDetailPage() {
  const [message, setMessage] = useState('');
  const [typing, setTyping] = useState(false);

  const sendMessage = () => {
    if (!message.trim()) return;
    setMessage('');
    setTyping(true);
    window.setTimeout(() => setTyping(false), 1200);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-on-surface">
      <header className="glass-card sticky top-0 z-50 flex w-full items-center justify-between px-container-margin py-4 shadow-sm">
        <div className="flex items-center gap-stack-sm">
          <Link href="/chat" className="rounded-full p-2 transition-colors duration-150 hover:bg-surface-container active:scale-95" aria-label="뒤로">
            <span className="material-symbols-outlined text-primary">arrow_back</span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="h-10 w-10 rounded-full border-2 border-primary-container object-cover" src={TEACHER_AVATAR} alt="고선미 선생님" />
              <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500" />
            </div>
            <div>
              <h1 className="font-headline-lg-mobile text-headline-lg-mobile font-bold text-primary">고선미 선생님</h1>
              <p className="font-label-sm text-label-sm text-on-surface-variant">온라인</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button className="rounded-full p-2 text-on-surface-variant transition-transform hover:bg-surface-container active:scale-95" aria-label="영상 통화">
            <span className="material-symbols-outlined">videocam</span>
          </button>
          <button className="rounded-full p-2 text-error transition-transform hover:bg-surface-container active:scale-95" aria-label="통화 종료">
            <span className="material-symbols-outlined">call_end</span>
          </button>
        </div>
      </header>

      <main className="flex flex-1 flex-col gap-stack-md overflow-y-auto px-container-margin py-stack-lg">
        <div className="my-4 flex justify-center">
          <span className="rounded-full bg-surface-container-high px-4 py-1 font-label-sm text-label-sm text-on-surface-variant">오늘, 2024년 5월 24일</span>
        </div>

        <div className="flex max-w-[85%] items-end gap-stack-sm">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="h-8 w-8 rounded-full object-cover" src={MESSAGE_AVATAR} alt="선생님" />
          <div className="rounded-t-xl rounded-br-xl bg-white p-4 shadow-[0px_4px_20px_rgba(0,0,0,0.04)]">
            <p className="font-body-md text-body-md text-on-surface">안녕하세요! 내일 수업 준비되셨나요?</p>
            <div className="mt-1 text-right">
              <span className="font-label-sm text-[10px] text-on-surface-variant">오후 2:30</span>
            </div>
          </div>
        </div>

        <div className="ml-auto flex max-w-[85%] flex-col items-end gap-1">
          <div className="rounded-t-xl rounded-bl-xl bg-gradient-to-br from-[#7757fa] to-[#fe4a91] p-4 text-white shadow-lg">
            <p className="font-body-md text-body-md">네 선생님! 숙제 다 했어요 :)</p>
            <div className="mt-1 text-left">
              <span className="font-label-sm text-[10px] text-white opacity-80">오후 2:32 · 읽음</span>
            </div>
          </div>
        </div>

        <div className="flex max-w-[85%] items-end gap-stack-sm">
          <div className="w-8" />
          <div className="w-full rounded-xl border border-outline-variant bg-surface-container-low p-3">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-container text-white">
                <span className="material-symbols-outlined">description</span>
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="truncate font-label-lg text-label-lg">내일의_학습지_V1.pdf</p>
                <p className="font-label-sm text-label-sm text-on-surface-variant">2.4 MB · PDF</p>
              </div>
            </div>
            <button className="mt-3 w-full rounded-lg border border-primary bg-white py-2 font-label-lg text-label-lg text-primary transition-colors hover:bg-primary-fixed active:scale-95">
              다운로드
            </button>
          </div>
        </div>

        <div className={`flex max-w-[85%] items-center gap-2 transition-opacity duration-300 ${typing ? 'opacity-100' : 'opacity-0'}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="h-8 w-8 rounded-full object-cover" src={MESSAGE_AVATAR} alt="선생님 입력 중" />
          <div className="flex gap-1 rounded-full bg-surface-container-high px-4 py-2">
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-outline" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-outline [animation-delay:0.2s]" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-outline [animation-delay:0.4s]" />
          </div>
        </div>
      </main>

      <footer className="flex flex-col gap-3 bg-white px-container-margin py-stack-md shadow-[0_-4px_20px_rgba(0,0,0,0.04)]">
        <div className="flex items-center gap-stack-sm">
          <button className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-container-highest text-on-surface-variant transition-colors hover:bg-surface-container active:scale-90" aria-label="첨부">
            <span className="material-symbols-outlined">add</span>
          </button>
          <div className="flex flex-1 items-center rounded-full bg-surface-container-low px-4 py-2 transition-all focus-within:ring-2 focus-within:ring-primary-container">
            <input
              className="flex-1 border-none bg-transparent font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant focus:ring-0"
              placeholder="메시지를 입력하세요..."
              type="text"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              onFocus={() => setTyping(true)}
              onBlur={() => setTyping(false)}
            />
            <button className="text-on-surface-variant transition-colors hover:text-primary" aria-label="이모지">
              <span className="material-symbols-outlined">sentiment_satisfied</span>
            </button>
          </div>
          <button
            className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#7757fa] to-[#fe4a91] text-white shadow-lg transition-all active:scale-90"
            onClick={sendMessage}
            aria-label="전송"
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
              send
            </span>
          </button>
        </div>
        <div className="h-2" />
      </footer>
    </div>
  );
}
