import Link from 'next/link';

const STUDENT_AVATAR =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAsDQWYlKS8U3OVevGDbEWQUTItOqbiSJdI7HL6nsZcrlm1Lw3tB96Cu4spiDsMCXqXKSbbXTiU3qZnbPeEUATjUIPENG9j3RkvaxnrQ2E0gdXLp6rz_-kWRshyIynN7ULj3M2kXBs_4yYWhQQXkO3rNouCZoay3yHPNwLbuyEM3-xw0JKAAHSPungWRXO1OnqRoTgiCUiz4frkTY4aQvTmJ_LP1QuJJOtuXM1AYfP5zbqqbenYJfmncfaX7Jh0u9pHYeWB0Qq1WQ';

export default function TeacherChatDetailPage() {
  return (
    <main className="flex h-[calc(100vh-144px)] flex-col overflow-hidden bg-background font-body-md text-on-background">
      <section className="z-40 flex h-16 w-full items-center justify-between bg-surface px-container-margin shadow-sm">
        <div className="flex items-center gap-4">
          <Link href="/chatT" className="-ml-2 flex items-center justify-center rounded-full p-2 text-on-surface-variant transition-opacity hover:opacity-80 active:scale-95" aria-label="채팅 목록으로 돌아가기">
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-surface-variant">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img alt="소피아 학생" className="h-full w-full object-cover" src={STUDENT_AVATAR} />
              <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-surface bg-green-500" />
            </div>
            <div>
              <h1 className="font-headline-md text-headline-md font-bold leading-tight text-on-surface">소피아 학생</h1>
              <span className="block font-label-sm text-label-sm font-medium text-outline">온라인</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center justify-center rounded-full p-2 text-on-surface-variant transition-opacity hover:opacity-80 active:scale-95" aria-label="영상 통화">
            <span className="material-symbols-outlined">videocam</span>
          </button>
          <button className="flex items-center justify-center rounded-full p-2 text-on-surface-variant transition-opacity hover:opacity-80 active:scale-95" aria-label="더보기">
            <span className="material-symbols-outlined">more_vert</span>
          </button>
        </div>
      </section>

      <section className="no-scrollbar mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 overflow-y-auto bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed px-container-margin pb-48 pt-4">
        <div className="my-4 flex justify-center">
          <span className="rounded-full bg-surface-container px-3 py-1 text-center font-label-sm text-label-sm text-on-surface-variant shadow-sm">오늘, 10월 24일</span>
        </div>

        <TeacherBubble time="오전 09:41">안녕하세요 소피아님! 복습 잘 하셨나요?</TeacherBubble>

        <StudentBubble time="오전 09:45">네 선생님! 단어 외우는게 조금 어려웠어요</StudentBubble>

        <div className="mt-2 flex items-end justify-end gap-2">
          <div className="flex max-w-[85%] flex-col items-end gap-2">
            <div className="rounded-2xl rounded-br-sm bg-primary px-4 py-3 text-on-primary shadow-md">
              <p className="font-body-md text-body-md">
                괜찮아요! 내일 수업에서 같이 복습해볼게요.
                <br />
                내일 수업 자료 미리 보내드립니다!
              </p>
            </div>
            <div className="flex w-64 cursor-pointer items-center gap-3 rounded-xl border border-surface-variant bg-surface-container-lowest p-3 shadow-sm transition-colors hover:bg-surface-container-low active:scale-95">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-error-container text-on-error-container">
                <span className="material-symbols-outlined">picture_as_pdf</span>
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="truncate font-body-md text-body-md font-medium text-on-surface">K-Lingo_수업자료_05.pdf</p>
                <p className="font-label-sm text-label-sm text-outline">2.4 MB</p>
              </div>
              <button className="rounded-full p-1 text-on-surface-variant transition-colors hover:text-primary" aria-label="다운로드">
                <span className="material-symbols-outlined">download</span>
              </button>
            </div>
            <span className="mr-1 text-right font-label-sm text-label-sm text-outline">오전 09:50</span>
          </div>
        </div>

        <div className="mb-4 flex items-end justify-start gap-2">
          <Avatar small />
          <div className="flex h-10 w-16 items-center gap-1 rounded-2xl rounded-bl-sm border border-surface-variant bg-surface-container-low px-4 py-3 shadow-sm">
            <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-outline-variant" />
            <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-outline-variant [animation-delay:0.2s]" />
            <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-outline-variant [animation-delay:0.4s]" />
          </div>
        </div>
      </section>

      <section className="fixed bottom-20 left-0 z-[80] w-full border-t border-surface-variant bg-surface-container-lowest px-container-margin py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.04)] md:left-1/2 md:max-w-4xl md:-translate-x-1/2">
        <div className="flex items-end gap-2 rounded-2xl border border-surface-variant bg-surface-container p-1 transition-all focus-within:border-primary focus-within:ring-1 focus-within:ring-primary md:p-2">
          <button className="mb-0.5 shrink-0 rounded-full p-2 text-on-surface-variant transition-colors hover:text-primary" aria-label="첨부">
            <span className="material-symbols-outlined">add_circle</span>
          </button>
          <textarea
            className="max-h-24 w-full resize-none self-center border-none bg-transparent px-2 py-2.5 font-body-md text-body-md text-on-surface placeholder:text-outline focus:ring-0"
            placeholder="메시지를 입력하세요..."
            rows={1}
          />
          <button className="mb-0.5 shrink-0 rounded-xl bg-primary p-2.5 text-on-primary shadow-sm transition-colors hover:bg-primary-container active:scale-95" aria-label="전송">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
              send
            </span>
          </button>
        </div>
      </section>
    </main>
  );
}

function Avatar({ small = false }: { small?: boolean }) {
  return (
    <div className={`${small ? 'mb-5 h-8 w-8' : 'h-10 w-10'} shrink-0 overflow-hidden rounded-full bg-surface-variant`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img alt="소피아 학생" className="h-full w-full object-cover" src={STUDENT_AVATAR} />
    </div>
  );
}

function TeacherBubble({ children, time }: { children: React.ReactNode; time: string }) {
  return (
    <div className="flex items-end justify-end gap-2">
      <div className="flex max-w-[80%] flex-col items-end gap-1">
        <div className="rounded-2xl rounded-br-sm bg-primary px-4 py-3 text-on-primary shadow-md">
          <p className="font-body-md text-body-md">{children}</p>
        </div>
        <span className="mr-1 text-right font-label-sm text-label-sm text-outline">{time}</span>
      </div>
    </div>
  );
}

function StudentBubble({ children, time }: { children: React.ReactNode; time: string }) {
  return (
    <div className="flex items-end justify-start gap-2">
      <Avatar small />
      <div className="flex max-w-[75%] flex-col items-start gap-1">
        <div className="rounded-2xl rounded-bl-sm border border-surface-variant bg-surface-container-low px-4 py-3 text-on-surface shadow-sm">
          <p className="font-body-md text-body-md">{children}</p>
        </div>
        <span className="ml-1 font-label-sm text-label-sm text-outline">{time}</span>
      </div>
    </div>
  );
}
