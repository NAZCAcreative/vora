import Link from 'next/link';

const FILES = [
  {
    icon: 'picture_as_pdf',
    name: '중급 한국어_문법_총정리.pdf',
    meta: 'PDF',
    size: '12.4 MB',
    date: '2023.10.15',
    iconClass: 'bg-error-container/20 text-error',
  },
  {
    icon: 'description',
    name: '단어_퀴즈_Week3.docx',
    meta: 'Word',
    size: '850 KB',
    date: '2023.10.20',
    iconClass: 'bg-primary-container/10 text-primary',
  },
  {
    icon: 'image',
    name: '전통_시장_풍경_고화질.jpg',
    meta: 'Image',
    size: '5.2 MB',
    date: '2023.10.22',
    iconClass: 'bg-secondary-container/10 text-secondary',
  },
  {
    icon: 'movie',
    name: '말하기_연습_샘플_A.mp4',
    meta: 'Video',
    size: '42.1 MB',
    date: '2023.10.25',
    iconClass: 'bg-tertiary-container/10 text-tertiary',
  },
];

const FOLDERS = ['전체 파일', '문법 교재', '회화 연습', 'TOPIK 기출', '미디어 파일'];

export default function TeacherMaterialsPage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-7xl bg-background px-container-margin pb-32 pt-stack-lg font-body-md text-on-background">
      <section className="mb-8 flex items-center gap-3">
        <Link href="/profileT" className="flex h-10 w-10 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container" aria-label="뒤로가기">
          <span className="material-symbols-outlined">arrow_back</span>
        </Link>
        <div>
          <h1 className="font-headline-lg text-2xl font-bold text-on-surface">수업 자료 보관함</h1>
          <p className="mt-1 text-sm text-on-surface-variant">총 24개의 파일 (사용 중: 1.2 GB / 5 GB)</p>
        </div>
      </section>

      <section className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="font-headline-md text-headline-md font-bold text-on-surface">자료 관리</h2>
          <p className="mt-1 text-sm text-on-surface-variant">수업에 사용할 교재와 미디어 파일을 정리하세요.</p>
        </div>
        <button className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary-container px-6 py-3 font-bold text-white shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'wght' 600" }}>
            upload_file
          </span>
          새 자료 업로드
        </button>
      </section>

      <section className="scrollbar-hide mb-6 flex gap-2 overflow-x-auto pb-2">
        {FOLDERS.map((folder, index) => (
          <button
            key={folder}
            className={`whitespace-nowrap rounded-full px-5 py-2.5 text-sm transition-colors ${
              index === 0 ? 'bg-primary font-semibold text-on-primary' : 'bg-surface-container-high font-medium text-on-surface-variant hover:bg-surface-container-highest'
            }`}
          >
            {folder}
          </button>
        ))}
      </section>

      <section className="space-y-4">
        <div className="hidden grid-cols-12 gap-4 border-b border-outline-variant/30 px-6 py-2 text-sm font-semibold text-on-surface-variant md:grid">
          <div className="col-span-6">파일명</div>
          <div className="col-span-2 text-center">용량</div>
          <div className="col-span-2 text-center">날짜</div>
          <div className="col-span-2 text-right">관리</div>
        </div>

        {FILES.map((file) => (
          <article
            key={file.name}
            className="grid grid-cols-12 items-center gap-4 rounded-xl bg-surface-container-lowest p-4 shadow-[0_4px_20px_rgba(0,0,0,0.04)] transition-shadow hover:shadow-md md:px-6 md:py-4"
          >
            <div className="col-span-12 flex items-center gap-4 md:col-span-6">
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${file.iconClass}`}>
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                  {file.icon}
                </span>
              </div>
              <div className="min-w-0">
                <h3 className="truncate font-semibold text-on-surface">{file.name}</h3>
                <p className="mt-0.5 text-xs text-on-surface-variant md:hidden">
                  {file.meta} • {file.size} • {file.date}
                </p>
              </div>
            </div>
            <div className="hidden text-center text-sm text-on-surface-variant md:col-span-2 md:block">{file.size}</div>
            <div className="hidden text-center text-sm text-on-surface-variant md:col-span-2 md:block">{file.date}</div>
            <div className="col-span-12 flex items-center justify-end gap-2 md:col-span-2">
              <button className="rounded-full p-2 text-primary transition-colors hover:bg-surface-container" aria-label={`${file.name} 다운로드`}>
                <span className="material-symbols-outlined">download</span>
              </button>
              <button className="rounded-full p-2 text-error transition-colors hover:bg-error-container/20" aria-label={`${file.name} 삭제`}>
                <span className="material-symbols-outlined">delete</span>
              </button>
              <button className="rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container" aria-label={`${file.name} 더보기`}>
                <span className="material-symbols-outlined">more_vert</span>
              </button>
            </div>
          </article>
        ))}
      </section>

      <section className="relative mt-12 flex flex-col items-center gap-8 overflow-hidden rounded-2xl bg-primary-fixed p-8 md:flex-row">
        <div className="relative z-10 flex-1">
          <h2 className="font-headline-md text-xl font-bold text-on-primary-fixed">더 많은 저장공간이 필요하신가요?</h2>
          <p className="mb-6 mt-2 text-on-primary-fixed-variant">프로 선생님 플랜으로 업그레이드하고 최대 50GB의 저장공간과 고화질 동영상 업로드 기능을 이용해 보세요.</p>
          <button className="rounded-full bg-primary px-6 py-2.5 font-bold text-white shadow-lg transition-transform hover:scale-105 active:scale-95">플랜 업그레이드</button>
        </div>
        <div className="relative h-48 w-48 shrink-0">
          <div className="absolute inset-0 rounded-full bg-secondary/10"></div>
          <div className="absolute inset-4 rounded-full bg-primary/20"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="material-symbols-outlined text-6xl text-primary" style={{ fontVariationSettings: "'wght' 200" }}>
              cloud_done
            </span>
          </div>
        </div>
        <div className="absolute -bottom-12 -right-12 h-48 w-48 rounded-full bg-white/20"></div>
      </section>
    </main>
  );
}
