import Link from 'next/link';

const REVIEWS = [
  {
    initials: 'JD',
    name: 'John Doe',
    date: '2023.11.15',
    rating: 4,
    status: '답변 대기',
    pending: true,
    text: "선생님 덕분에 한국어 발음이 정말 많이 좋아졌어요! 특히 'ㄹ' 발음 교정해주신 게 큰 도움이 되었습니다. 다음 수업도 기대돼요.",
  },
  {
    name: 'Alex Kim',
    date: '2023.11.12',
    rating: 5,
    status: '답변 완료',
    pending: false,
    text: 'TOPIK II 준비하면서 막막했는데, 선생님의 체계적인 설명 덕분에 자신감이 생겼습니다. 감사합니다!',
    answer: '알렉스님! 자신감을 얻으셨다니 제가 더 기쁘네요. 남은 준비 기간도 함께 힘내봐요! 궁금한 점은 언제든 질문해 주세요. :)',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDPfzVwImcNIjGMxm8zCUfNpdxkvFhVaOV_FQN4DrKnZUlFKh89Jvf9FrSYqyNxofN2Ny2nXf3BuA9q6_DAD0mlzfs9FN-FIwoywcjPA_VdNfzklGmye8-My0qpdl3eYmkAB3nKbVnDT31kjHAe9YJXLnjxAmd5icdVK_5O-2b-oSj-dftnzWguZwOoLxwkXffBIIzBx6wS51E9_DZbLuPr3cVVeGXf9bpswuex4vwL2Fyme_2i7oU-YqSdcjazW4e1USnT-HozcQ',
  },
  {
    initials: 'SC',
    name: 'Sarah Chen',
    date: '2023.11.10',
    rating: 5,
    status: '답변 대기',
    pending: true,
    text: '수업 시간이 너무 빨리 지나가요! 어려운 문법도 이해하기 쉽게 비유해주셔서 정말 좋았습니다.',
  },
];

const FILTERS = ['미답변순', '최신순', '높은 평점순'];

export default function TeacherReviewRepliesPage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl bg-background px-container-margin pb-32 pt-stack-lg font-body-md text-on-background">
      <section className="mb-8">
        <div className="mb-2 flex items-center gap-3">
          <Link href="/profileT" className="flex h-10 w-10 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container" aria-label="뒤로가기">
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <h1 className="font-headline-lg text-2xl font-bold text-on-surface">리뷰 답변 관리</h1>
        </div>
        <p className="text-body-md text-on-surface-variant">학생들이 남긴 소중한 피드백에 답변을 달고 소통하세요.</p>
      </section>

      <section className="mb-8 grid gap-4 sm:grid-cols-2">
        <Stat label="총 리뷰" value="124" className="text-primary" />
        <Stat label="미답변 리뷰" value="8" className="text-secondary" highlight />
      </section>

      <section className="custom-scrollbar mb-6 flex items-center gap-3 overflow-x-auto pb-2">
        {FILTERS.map((filter, index) => (
          <button
            key={filter}
            className={`whitespace-nowrap rounded-full px-5 py-2 text-label-lg transition-all active:scale-95 ${
              index === 0 ? 'bg-primary text-on-primary shadow-md shadow-primary/20 hover:brightness-110' : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'
            }`}
          >
            {filter}
          </button>
        ))}
      </section>

      <section className="space-y-6">
        {REVIEWS.map((review) => (
          <article key={`${review.name}-${review.date}`} className="overflow-hidden rounded-xl border border-outline-variant/30 bg-surface-container-lowest shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
            <div className="p-6">
              <div className="mb-4 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {review.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img alt={review.name} className="h-10 w-10 rounded-full object-cover" src={review.image} />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-container-highest font-bold text-primary">{review.initials}</div>
                  )}
                  <div>
                    <h2 className="font-bold text-on-surface">{review.name}</h2>
                    <div className="flex items-center gap-1">
                      <Stars count={review.rating} />
                      <span className="ml-1 text-label-sm text-on-surface-variant">{review.date}</span>
                    </div>
                  </div>
                </div>
                <span className={`rounded-full px-3 py-1 text-[11px] font-bold tracking-tight ${review.pending ? 'bg-secondary-container/10 text-secondary' : 'bg-primary-container/10 text-primary'}`}>
                  {review.status}
                </span>
              </div>
              <p className={`mb-6 text-body-md leading-relaxed text-on-surface-variant ${review.answer ? 'italic' : ''}`}>{review.answer ? `"${review.text}"` : review.text}</p>
              {review.answer ? (
                <div className="relative rounded-lg bg-surface-container p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-primary">subdirectory_arrow_right</span>
                    <span className="font-label-sm text-label-sm font-bold text-primary">선생님의 답변</span>
                  </div>
                  <p className="text-body-md text-on-surface">{review.answer}</p>
                  <button className="absolute right-4 top-4 text-on-surface-variant transition-colors hover:text-primary" aria-label="답변 수정">
                    <span className="material-symbols-outlined text-[18px]">edit</span>
                  </button>
                </div>
              ) : (
                <ReplyBox />
              )}
            </div>
          </article>
        ))}
      </section>

      <button className="mt-8 w-full rounded-xl border-2 border-dashed border-outline-variant py-4 font-medium text-on-surface-variant transition-colors hover:bg-surface-container-low active:scale-95">
        리뷰 더보기
      </button>
    </main>
  );
}

function Stat({ label, value, className, highlight = false }: { label: string; value: string; className: string; highlight?: boolean }) {
  return (
    <article className={`rounded-xl border p-5 shadow-[0_4px_20px_rgba(0,0,0,0.04)] ${highlight ? 'border-primary-container/20 bg-primary-container/10' : 'border-outline-variant/30 bg-surface-container-lowest'}`}>
      <span className="mb-1 block text-label-sm text-on-surface-variant">{label}</span>
      <span className={`text-2xl font-bold ${className}`}>{value}</span>
    </article>
  );
}

function Stars({ count }: { count: number }) {
  return (
    <div className="flex text-amber-400">
      {Array.from({ length: 5 }).map((_, index) => (
        <span key={index} className="material-symbols-outlined text-[18px]" style={index < count ? { fontVariationSettings: "'FILL' 1" } : undefined}>
          star
        </span>
      ))}
    </div>
  );
}

function ReplyBox() {
  return (
    <div className="space-y-3">
      <textarea className="h-28 w-full resize-none rounded-lg border-none bg-surface-container-low p-4 text-body-md focus:ring-2 focus:ring-primary" placeholder="학생에게 따뜻한 답변을 남겨주세요..." />
      <div className="flex justify-end gap-2">
        <button className="px-4 py-2 text-label-lg text-on-surface-variant">취소</button>
        <button className="rounded-lg bg-primary px-6 py-2 text-label-lg font-bold text-on-primary shadow-md shadow-primary/20">등록하기</button>
      </div>
    </div>
  );
}
