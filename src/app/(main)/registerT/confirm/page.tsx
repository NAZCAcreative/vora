import Link from 'next/link';

export default function TeacherRegisterConfirmPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-lg flex-col bg-background px-container-margin pb-32 pt-stack-md font-body-md text-on-background">
      <div className="sticky top-[56px] z-40 -mx-container-margin bg-surface px-container-margin shadow-sm">
        <div className="flex h-16 items-center justify-between">
          <Link href="/registerT/details" className="text-on-surface-variant transition-opacity hover:opacity-80 active:scale-95" aria-label="이전 단계">
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <h1 className="font-headline-md text-headline-md font-bold text-primary">수업 등록</h1>
          <div className="w-6" />
        </div>
      </div>

      <section className="mt-stack-md flex flex-col gap-stack-sm">
        <div className="flex items-center justify-between px-1">
          <span className="font-label-lg text-label-lg text-on-surface-variant">Step 3 of 3</span>
          <span className="font-label-lg text-label-lg text-primary">최종 확인</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-surface-container-high">
          <div className="h-full w-full rounded-full bg-gradient-to-r from-primary to-secondary-container transition-all duration-500" />
        </div>
      </section>

      <section className="mt-section-gap flex flex-col gap-stack-lg">
        <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-background">
          입력하신 정보를
          <br />
          확인해 주세요
        </h2>

        <div className="grid grid-cols-1 gap-stack-md">
          <SummaryCard>
            <div className="flex items-start gap-stack-md">
              <IconBadge icon="category" className="bg-primary-fixed text-primary" />
              <div className="flex-grow">
                <span className="mb-1 block font-label-sm text-label-sm text-on-surface-variant">수업 유형 & 카테고리</span>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded bg-primary-fixed-dim/20 px-2 py-1 font-label-sm text-label-sm text-primary">1:1 화상 수업</span>
                  <span className="rounded bg-secondary-fixed-dim/20 px-2 py-1 font-label-sm text-label-sm text-secondary">비즈니스 한국어</span>
                </div>
              </div>
              <Link href="/registerT" className="text-on-surface-variant transition-colors hover:text-primary" aria-label="수업 유형 수정">
                <span className="material-symbols-outlined text-sm">edit</span>
              </Link>
            </div>

            <Divider />

            <div className="flex items-start gap-stack-md">
              <IconBadge icon="title" className="bg-tertiary-fixed text-tertiary" />
              <div className="flex-grow">
                <span className="mb-1 block font-label-sm text-label-sm text-on-surface-variant">수업 제목</span>
                <p className="font-body-lg text-body-lg text-on-background">실전 비즈니스 이메일 작성 마스터 클래스</p>
              </div>
            </div>
          </SummaryCard>

          <SummaryCard>
            <div className="flex items-start gap-stack-md">
              <IconBadge icon="payments" className="bg-secondary-fixed text-secondary" />
              <div className="flex-grow">
                <span className="mb-1 block font-label-sm text-label-sm text-on-surface-variant">수업 가격 (1회/50분 기준)</span>
                <p className="font-headline-md text-headline-md text-on-background">
                  35,000<span className="ml-1 font-body-md text-body-md text-on-surface-variant">KRW</span>
                </p>
              </div>
              <Link href="/registerT/details" className="text-on-surface-variant transition-colors hover:text-primary" aria-label="상세 정보 수정">
                <span className="material-symbols-outlined text-sm">edit</span>
              </Link>
            </div>

            <Divider />

            <div className="flex items-start gap-stack-md">
              <IconBadge icon="description" className="bg-surface-variant text-on-surface-variant" />
              <div className="flex-grow">
                <span className="mb-1 block font-label-sm text-label-sm text-on-surface-variant">상세 설명</span>
                <p className="line-clamp-3 font-body-md text-sm text-on-surface">
                  한국 회사에서 자주 사용하는 비즈니스 이메일 템플릿과 정중한 표현들을 배웁니다. 실제 업무 상황을 가정한 롤플레이를 통해 실전 감각을 익힐 수 있습니다.
                </p>
              </div>
            </div>
          </SummaryCard>
        </div>
      </section>

      <div className="flex-grow" />

      <section className="mt-stack-lg">
        <Link href="/registerT/complete" className="block w-full rounded-full bg-gradient-to-r from-primary to-secondary-container py-4 text-center font-label-lg text-label-lg text-on-primary shadow-lg transition-opacity hover:opacity-90 active:scale-95">
          등록 완료하기
        </Link>
        <p className="mt-stack-sm text-center font-label-sm text-label-sm text-on-surface-variant">등록 후 수업 일정 관리가 가능합니다.</p>
      </section>
    </main>
  );
}

function SummaryCard({ children }: { children: React.ReactNode }) {
  return (
    <article className="flex flex-col gap-stack-md rounded-xl border border-surface-container-low bg-surface-container-lowest p-stack-md shadow-[0px_4px_20px_rgba(0,0,0,0.04)]">
      {children}
    </article>
  );
}

function IconBadge({ icon, className }: { icon: string; className: string }) {
  return (
    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${className}`}>
      <span className="material-symbols-outlined">{icon}</span>
    </div>
  );
}

function Divider() {
  return <div className="h-px w-full bg-surface-container" />;
}
