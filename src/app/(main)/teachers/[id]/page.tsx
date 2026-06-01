import Link from 'next/link';

const STATS = [
  { icon: 'workspace_premium', value: '6년 이상', label: '강의 경력', color: 'text-primary' },
  { icon: 'groups', value: '1.2k명', label: '수강생 수', color: 'text-secondary' },
  { icon: 'star', value: '4.9', label: '리뷰 480개', color: 'text-yellow-500', filled: true },
  { icon: 'translate', value: '원어민', label: '한국어 화자', color: 'text-tertiary' },
];

const TAGS = [
  { label: 'TOPIK 대비', className: 'bg-primary/10 text-primary' },
  { label: 'K-드라마 한국어', className: 'bg-secondary/10 text-secondary' },
  { label: '비즈니스 한국어', className: 'bg-tertiary/10 text-tertiary' },
];

const DAYS = [
  { day: '월', date: '24', active: true },
  { day: '화', date: '25', active: false },
  { day: '수', date: '26', active: false },
  { day: '목', date: '27', active: false },
  { day: '금', date: '28', active: false },
];

export default function TeacherDetailPage() {
  return (
    <div className="min-h-screen bg-background pb-48 font-body-md text-on-background">
      <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between bg-surface px-container-margin">
        <div className="flex items-center gap-stack-sm">
          <Link
            href="/search"
            aria-label="뒤로"
            className="flex h-10 w-10 items-center justify-center rounded-full transition-all duration-100 hover:bg-surface-container-low active:scale-95"
          >
            <span className="material-symbols-outlined text-primary">arrow_back</span>
          </Link>
        </div>
        <h1 className="font-headline-md text-headline-md font-extrabold text-primary">선생님 프로필</h1>
        <div className="flex items-center gap-stack-sm">
          <button
            aria-label="찜하기"
            className="flex h-10 w-10 items-center justify-center rounded-full transition-all duration-100 hover:bg-surface-container-low active:scale-95"
          >
            <span className="material-symbols-outlined text-primary">favorite</span>
          </button>
          <button
            aria-label="공유하기"
            className="flex h-10 w-10 items-center justify-center rounded-full transition-all duration-100 hover:bg-surface-container-low active:scale-95"
          >
            <span className="material-symbols-outlined text-primary">share</span>
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-md">
        <section className="relative aspect-[9/12] w-full overflow-hidden bg-surface-container-highest">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt="고선미 선생님 프로필"
            className="h-full w-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBkr1tWdsv8D-9NPvoILwBvYv3IVXFQ4V2ZzkcwMXzsx5aZlgnrNMtVzokQOdT4dyTTsncdGwYqYdJjt8wVB-jcGa6WSiZd5QxikcqGhvbtdCVLxtorvdi_VUWV8_1fLSD6j36zT0hhJJ1Ja2yt_g7pmABH4j0lw7TlkhomtzWBTP9q_LncD5op1t1tLM3tCoUNrmCaBOg44r58Iv7L_zPNlDjFxbbZACORITvI0CIuZxXankKNQ0AFOzrYzWexQK47r9FgZKw3iw"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <button className="flex h-20 w-20 items-center justify-center rounded-full border border-white/40 bg-white/30 backdrop-blur-md transition-transform active:scale-90" aria-label="소개 영상 재생">
              <span className="material-symbols-outlined text-5xl text-white" style={{ fontVariationSettings: "'FILL' 1" }}>
                play_arrow
              </span>
            </button>
          </div>
          <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
            <div className="glass-effect rounded-xl border border-white/20 p-4 shadow-lg">
              <div className="mb-1 flex items-center gap-2">
                <span className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">고선미</span>
                <span className="material-symbols-outlined text-2xl text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>
                  local_florist
                </span>
              </div>
              <p className="font-label-lg text-label-lg text-primary">TOPIK II &amp; 회화 전문가</p>
            </div>
          </div>
        </section>

        <section className="relative z-10 -mt-8 px-container-margin">
          <div className="grid grid-cols-2 gap-stack-md">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center rounded-xl border border-surface-container-highest bg-surface p-stack-lg text-center shadow-[0px_4px_24px_rgba(0,0,0,0.06)]"
              >
                <span
                  className={`material-symbols-outlined mb-2 ${stat.color}`}
                  style={stat.filled ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                  {stat.icon}
                </span>
                <span className="font-headline-md text-headline-md text-on-surface">{stat.value}</span>
                <span className="font-label-sm text-label-sm text-outline">{stat.label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-section-gap px-container-margin">
          <h2 className="mb-stack-md font-headline-md text-headline-md">자기소개</h2>
          <div className="rounded-xl bg-surface p-stack-lg shadow-[0px_4px_24px_rgba(0,0,0,0.06)]">
            <p className="font-body-lg text-body-lg leading-relaxed text-on-surface-variant">
              안녕하세요! 여러분의 든든한 한국어 학습 파트너 고선미입니다. 저는 수강생분들이 TOPIK II 시험을 정복하고 유창한 회화 실력을 갖출 수 있도록 돕는 데 특화되어 있습니다.
              몰입도 높은 문화 중심의 강의로 여러분의 목표에 맞춘 맞춤형 수업을 제공합니다. 함께 즐거운 한국어 여행을 시작해봐요!
            </p>
            <div className="mt-stack-lg flex flex-wrap gap-2">
              {TAGS.map((tag) => (
                <span key={tag.label} className={`rounded-full px-3 py-1 font-label-sm text-label-sm ${tag.className}`}>
                  {tag.label}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-section-gap px-container-margin">
          <div className="mb-stack-md flex items-end justify-between">
            <h2 className="font-headline-md text-headline-md">수업 가능 시간</h2>
            <button className="font-label-lg text-label-lg text-primary">달력 보기</button>
          </div>
          <div className="hide-scrollbar flex gap-stack-md overflow-x-auto pb-2">
            {DAYS.map((day) => (
              <button
                key={day.day}
                className={`flex min-w-[80px] flex-col items-center rounded-xl p-4 ${
                  day.active ? 'bg-primary text-on-primary' : 'border border-surface-container-highest bg-surface'
                }`}
              >
                <span className={`font-label-sm text-label-sm ${day.active ? 'opacity-80' : 'text-outline'}`}>{day.day}</span>
                <span className={`font-headline-md text-headline-md ${day.active ? '' : 'text-on-surface'}`}>{day.date}</span>
              </button>
            ))}
          </div>
        </section>
      </main>

      <div className="glass-effect fixed bottom-20 left-0 z-50 w-full px-container-margin pb-3 pt-3">
        <div className="mx-auto flex max-w-md">
          <Link
            href="/booking"
            className="primary-gradient flex w-full items-center justify-center gap-2 rounded-full px-8 py-3 font-headline-md text-on-primary shadow-lg shadow-primary/30 transition-all duration-150 active:scale-95"
          >
            예약하기
            <span className="material-symbols-outlined">calendar_today</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
