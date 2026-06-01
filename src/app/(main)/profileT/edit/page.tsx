import Link from 'next/link';

const PROFILE_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBcdqdAsonbI8MUMfxxjbG4c6bZEu7xilpIi7RG4IZ3YPzk76jP1ZiqQqB0FShyRZEoxycgxR5u3Qtq2iOdBZ1i0rUH0GSmBTW5wX7iCtR3NpIvBEyiVz-JMVLJKNHWH2HEe-o2uIkcM2LWC5_zcFCAJrSDv81YTWOJK69F0FEOiOh0yCvEgQFWz49eWRVZdXdO-7r8Hao-RLHwLmUfGUQxz-Twe6pkyq0GQyKrzxNM59iCdyaSCdJCOBs834LN4G0mbXmEyvGnTg';

const EXPERTISE = [
  { label: 'TOPIK', active: true },
  { label: '회화', active: false },
  { label: '비즈니스 한국어', active: false },
  { label: '+ 추가', active: false },
];

const LANGUAGES = [
  { label: '영어 (English)', active: true },
  { label: '중국어 (中文)', active: false },
  { label: '일본어 (日本語)', active: true },
];

export default function TeacherProfileEditPage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl bg-background px-container-margin pb-32 pt-stack-lg font-body-md text-on-background">
      <div className="mb-stack-lg flex h-16 items-center justify-between">
        <Link href="/profileT" className="flex items-center text-on-surface transition-opacity hover:opacity-80 active:scale-95" aria-label="뒤로가기">
          <span className="material-symbols-outlined">arrow_back_ios</span>
        </Link>
        <h1 className="font-headline-lg text-headline-lg font-bold text-primary">내 정보 관리</h1>
        <div className="w-10" />
      </div>

      <section className="flex flex-col items-center rounded-xl border border-surface-container-high bg-surface-container-lowest p-6 shadow-[0px_4px_20px_rgba(0,0,0,0.04)]">
        <div className="group relative">
          <div className="h-32 w-32 overflow-hidden rounded-full border-4 border-white bg-surface-container shadow-lg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt="Teacher Profile" className="h-full w-full object-cover" src={PROFILE_IMAGE} />
          </div>
          <button className="absolute bottom-0 right-0 rounded-full bg-primary p-2 text-on-primary shadow-md transition-transform hover:scale-110 active:scale-95" aria-label="프로필 사진 변경">
            <span className="material-symbols-outlined text-sm">photo_camera</span>
          </button>
        </div>
        <p className="mt-4 font-label-sm text-label-sm font-medium text-on-surface-variant">프로필 사진 변경</p>
      </section>

      <form className="mt-8 grid gap-6 lg:grid-cols-2">
        <Field label="이름">
          <input
            className="h-12 w-full rounded-xl border border-outline-variant bg-surface-container-lowest px-4 text-body-lg transition-all focus:border-primary focus:ring-1 focus:ring-primary"
            placeholder="이름을 입력하세요"
            type="text"
            defaultValue="김민준"
          />
        </Field>

        <Field label="전문 분야">
          <div className="flex flex-wrap gap-2">
            {EXPERTISE.map((chip) => (
              <button
                key={chip.label}
                className={`rounded-full px-4 py-2 font-label-sm text-label-sm font-semibold transition-all ${
                  chip.active
                    ? 'border border-primary/20 bg-primary-container text-on-primary-container'
                    : 'border border-transparent bg-surface-container-high text-on-surface-variant hover:border-primary/30'
                }`}
                type="button"
              >
                {chip.label}
              </button>
            ))}
          </div>
        </Field>

        <Field label="자기소개 (최대 500자)">
          <textarea
            className="w-full rounded-xl border border-outline-variant bg-surface-container-lowest p-4 text-body-md leading-relaxed transition-all focus:border-primary focus:ring-1 focus:ring-primary"
            placeholder="학생들에게 본인을 소개해주세요."
            rows={6}
            defaultValue="안녕하세요! 5년 차 한국어 강사 김민준입니다. TOPIK 준비부터 일상 회화까지, 쉽고 재미있게 한국어를 배울 수 있도록 도와드릴게요."
          />
          <div className="px-1 text-right">
            <span className="text-[10px] font-medium text-on-surface-variant">84 / 500</span>
          </div>
        </Field>

        <Field label="가능 언어 설정">
          <div className="grid grid-cols-2 gap-3">
            {LANGUAGES.map((language) => (
              <button key={language.label} type="button" className="flex items-center justify-between rounded-xl border border-outline-variant bg-surface-container-lowest p-3">
                <span className="text-body-md font-medium">{language.label}</span>
                <span className={`material-symbols-outlined text-xl ${language.active ? 'text-primary' : 'text-outline-variant'}`} style={language.active ? { fontVariationSettings: "'FILL' 1" } : undefined}>
                  {language.active ? 'check_circle' : 'radio_button_unchecked'}
                </span>
              </button>
            ))}
            <button type="button" className="flex items-center justify-center rounded-xl border border-dashed border-primary/40 bg-primary/5 p-3 text-body-md font-bold text-primary">
              <span className="material-symbols-outlined mr-1 text-sm">add</span>
              언어 추가
            </button>
          </div>
        </Field>

        <div className="pt-4 lg:col-span-2">
          <Link
            href="/profileT"
            className="block h-14 w-full rounded-xl bg-gradient-to-r from-primary to-secondary py-3.5 text-center font-headline-md text-headline-md font-bold text-on-primary shadow-lg shadow-primary/20 transition-all hover:opacity-90 active:scale-[0.98]"
          >
            저장하기
          </Link>
        </div>
      </form>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="space-y-2">
      <label className="block px-1 font-headline-md text-label-lg font-semibold text-on-surface-variant">{label}</label>
      {children}
    </section>
  );
}
