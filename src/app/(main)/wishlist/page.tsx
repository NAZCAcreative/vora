import Link from 'next/link';

const TEACHERS = [
  {
    name: '김지수 (Ji-soo Kim)',
    status: 'Available now',
    rating: '4.9',
    reviews: '128 reviews',
    tags: ['TOPIK II', 'Speaking', 'Business'],
    online: true,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuArLthLs1_dwBmR-gVxPO3GAxsqBbSNJoiMiiv8yIFu6gbuc8WIPDqnoX1PCsNi7-GMrAJYTrO3m8YLnlgdRg-sl3W2RBX218L8NfSaIhlFtBYilPHL3SBnTUmYnlLQIU-mOE0eUpL2xMjy-DHF1-tuER2pGJ25p-fp5Rc20iQtTMWlO7qFBQV-BU2ycpObHio-bHq5sTjrktivyi3Ob9C3DEJdLuajKZsLwBftiDLHuP951SzaqsM4fc15iRtUlHSmvEn2tKc2hw',
  },
  {
    name: '박민호 (Min-ho Park)',
    status: 'Last seen 2h ago',
    rating: '4.7',
    reviews: '85 reviews',
    tags: ['Beginner', 'Pronunciation'],
    online: false,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAj9SeihSV9I5oKTJ5RQlBcdPXnJY6IUiO6ez0zzt3ODWaHAWWc5VpiCIWpcDK1e48AAyseylxuMvDPpPFywoSGlhrYu2kVsVQ_p1tYwRJlCjHxmNBbu_HDlUqaNiojO6Ulk8kkqHF3mfupq8xuK3JyzDSuNgHmx_39AllbJUWBHuZRyycEuutzZa76iomNL6se4XOtSE6Zn7KFetUTipU42MKNdFbl63-n28ecFCHBF3N136dwKQjB8GfqvMByYFOkNFbJYXusnQ',
  },
];

export default function WishlistPage() {
  return (
    <div className="min-h-screen bg-surface pb-24 text-on-surface antialiased">
      <header className="sticky top-0 z-40 flex w-full items-center justify-between bg-surface px-container-margin py-4 shadow-sm">
        <Link href="/profile-setup" className="flex items-center justify-center rounded-full p-2 text-primary transition-colors hover:bg-surface-container-high active:scale-95" aria-label="뒤로가기">
          <span className="material-symbols-outlined">arrow_back</span>
        </Link>
        <h1 className="font-headline-md text-headline-md text-on-surface">찜한 선생님</h1>
        <div className="w-10" />
      </header>

      <main className="mx-auto flex max-w-[1200px] flex-col gap-stack-md px-container-margin py-stack-lg">
        {TEACHERS.map((teacher) => (
          <article key={teacher.name} className="wishlist-card relative flex flex-col gap-4 overflow-hidden rounded-xl p-4 transition-transform duration-200 hover:-translate-y-1 md:flex-row">
            <div className="relative mx-auto h-24 w-24 flex-shrink-0 md:mx-0 md:h-32 md:w-32">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img alt={teacher.name} className="h-full w-full rounded-xl object-cover shadow-sm" src={teacher.image} />
              <div
                className={`absolute bottom-0 right-0 z-10 h-4 w-4 translate-x-1/4 translate-y-1/4 rounded-full border-2 border-white shadow-sm ${
                  teacher.online ? 'bg-green-500' : 'bg-outline'
                }`}
              />
            </div>
            <div className="flex flex-1 flex-col justify-between text-center md:text-left">
              <div>
                <div className="mb-1 flex items-start justify-between">
                  <h2 className="font-headline-md text-headline-md text-on-surface">{teacher.name}</h2>
                  <button className="absolute right-4 top-4 text-secondary-container transition-transform hover:scale-110 active:scale-90 md:static" aria-label="찜 해제">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                      favorite
                    </span>
                  </button>
                </div>
                <p className="mb-2 font-label-sm text-label-sm text-on-surface-variant">{teacher.status}</p>
                <div className="mb-3 flex items-center justify-center gap-1 md:justify-start">
                  <span className="material-symbols-outlined text-[16px] text-yellow-400" style={{ fontVariationSettings: "'FILL' 1" }}>
                    star
                  </span>
                  <span className="font-label-lg text-label-lg font-bold">{teacher.rating}</span>
                  <span className="font-body-md text-body-md text-outline">({teacher.reviews})</span>
                </div>
              </div>
              <div className="flex flex-wrap justify-center gap-2 md:justify-start">
                {teacher.tags.map((tag, index) => (
                  <span
                    key={tag}
                    className={`rounded-full px-3 py-1 font-label-sm text-label-sm ${
                      index === 0 ? 'bg-primary-fixed/20 text-on-primary-fixed' : index === 1 ? 'bg-secondary-fixed/20 text-on-secondary-fixed' : 'bg-surface-container-high text-on-surface'
                    }`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </main>
    </div>
  );
}
