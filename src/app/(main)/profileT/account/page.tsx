import Link from 'next/link';

const BANKS = ['은행을 선택해주세요', '국민은행 (KB)', '신한은행', '우리은행', '하나은행', '카카오뱅크', '토스뱅크'];

export default function TeacherAccountPage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl bg-surface px-container-margin pb-28 pt-stack-lg font-body-md text-on-surface">
      <section className="mb-section-gap flex items-center gap-3">
        <Link href="/profileT" className="flex h-10 w-10 items-center justify-center rounded-full text-primary transition-colors hover:bg-surface-container-high" aria-label="뒤로가기">
          <span className="material-symbols-outlined">arrow_back</span>
        </Link>
        <div>
          <h1 className="font-headline-lg text-headline-lg font-bold text-primary">정산 계좌 설정</h1>
          <p className="text-sm text-on-surface-variant">수익 정산을 받을 계좌 정보를 관리하세요.</p>
        </div>
      </section>

      <div className="grid gap-section-gap lg:grid-cols-[minmax(0,0.9fr)_minmax(360px,1.1fr)] lg:items-start">
        <div className="space-y-section-gap">
          <section className="space-y-4">
            <h2 className="flex items-center gap-2 font-headline-md text-headline-md font-semibold text-on-surface-variant">
              <span className="material-symbols-outlined text-primary">account_balance_wallet</span>
              현재 등록된 계좌
            </h2>
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary-container to-primary p-6 text-on-primary-container shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
              <div className="absolute -bottom-8 -right-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
              <div className="relative z-10 flex items-start justify-between gap-4">
                <div className="min-w-0 space-y-1">
                  <p className="text-sm font-medium opacity-80">국민은행 (KB Bank)</p>
                  <p className="break-all font-headline-md text-xl font-bold tracking-widest">****-****-2938-12</p>
                </div>
                <span className="material-symbols-outlined shrink-0 text-3xl opacity-80">verified_user</span>
              </div>
              <div className="relative z-10 mt-6 flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs opacity-70">예금주</p>
                  <p className="text-lg font-semibold">KIM MIN JUN</p>
                </div>
                <span className="shrink-0 rounded-full bg-white/20 px-3 py-1 text-xs font-medium backdrop-blur-sm">기본 계좌</span>
              </div>
            </div>
          </section>

          <section className="space-y-3 rounded-xl bg-surface-container-high/50 p-5">
            <h3 className="flex items-center gap-2 font-headline-md text-sm font-bold text-on-surface-variant">
              <span className="material-symbols-outlined text-base">info</span>
              정산 안내 및 유의사항
            </h3>
            <ul className="list-disc space-y-2 pl-4 text-sm leading-relaxed text-on-surface-variant opacity-80">
              <li>정산은 매주 수요일에 진행되며, 전주 일요일까지의 확정 수익이 지급됩니다.</li>
              <li>본인 명의의 계좌만 등록 가능하며, 타인 명의 사용 시 정산이 거절될 수 있습니다.</li>
              <li>계좌 정보 변경 시 다음 정산 주기부터 적용됩니다.</li>
              <li>오입력된 계좌 정보로 인한 송금 오류는 K-Lingo Bridge에서 책임지지 않습니다.</li>
            </ul>
          </section>
        </div>

        <section className="rounded-xl bg-surface-container-lowest p-5 shadow-sm lg:sticky lg:top-24">
          <h2 className="mb-stack-lg flex items-center gap-2 font-headline-md text-headline-md font-semibold text-on-surface-variant">
            <span className="material-symbols-outlined text-secondary">edit_note</span>
            계좌 정보 변경 및 등록
          </h2>
          <div className="space-y-4">
            <Field label="은행 선택">
              <div className="group relative">
                <select className="h-14 w-full appearance-none rounded-xl border-none bg-surface-container-low px-4 pr-12 font-body-md text-on-surface transition-all focus:ring-2 focus:ring-primary/20">
                  {BANKS.map((bank) => (
                    <option key={bank}>{bank}</option>
                  ))}
                </select>
                <span className="material-symbols-outlined pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant transition-colors group-hover:text-primary">expand_more</span>
              </div>
            </Field>
            <Field label="예금주">
              <input className="h-14 w-full rounded-xl border-none bg-surface-container-low px-4 font-body-md transition-all focus:ring-2 focus:ring-primary/20" placeholder="실명을 입력하세요" type="text" />
            </Field>
            <Field label="계좌번호">
              <input className="h-14 w-full rounded-xl border-none bg-surface-container-low px-4 font-body-md transition-all focus:ring-2 focus:ring-primary/20" placeholder="'-' 제외 숫자만 입력" type="text" inputMode="numeric" />
            </Field>
          </div>

          <button className="mt-stack-lg flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-secondary py-4 font-headline-md text-lg font-bold text-on-primary shadow-lg transition-all active:scale-95">
            계좌 정보 업데이트
            <span className="material-symbols-outlined">sync</span>
          </button>
        </section>
      </div>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-2">
      <span className="px-1 font-label-lg text-label-lg font-semibold text-on-surface-variant">{label}</span>
      {children}
    </label>
  );
}
