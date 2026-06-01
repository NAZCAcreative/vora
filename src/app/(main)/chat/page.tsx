import Link from 'next/link';

const FILTERS = ['전체', '읽지 않음', '선생님', '스터디 그룹'];

const CHATS = [
  {
    name: '고선미 선생님',
    message: '내일 수업에서 봬요!',
    time: '오후 2:30',
    unread: 2,
    online: true,
    href: '/chat/1',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCV03WSjp5MYfw8ws68NAqnhhUW8O5Ii9bRUvfvTagiUmYMSsN1IILMoI_3LNVTk5zUbLEQPySwab1Kl3B3pRY6J0_Ra3rpdtpGH4KDuUCctF3NdatvsE4TiBYtxTBe_ST2m6iqoMrBcoGkD-vokm6hMTdhmqTNdIPZySVILSkMQGi56Ksc89QtjvojS5LbsaOH1iECTbeU4DCZy9KP75p4Akvs8KmH6TRNu08km26Jvb4z1ZEq37tXUsjGPHwDZKRbPFfdped01A',
  },
  {
    name: '민준 선생님',
    message: '숙제 확인 부탁드려요.',
    time: '오전 11:15',
    unread: 1,
    href: '/chat/1',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAmodXwTMuwPwGb1mfPgtyOxiOBimMWf_fgIHuW9G6e_Ubf2mNlhAmb15_wmxNtzcqmzmo42CPdnmnKQZaz1hO0fBMoSgE7rSJ1XS3ucEZHzO_ATwxoFKVmJnmN1J5N-d-sk_C1rjf5cg7JsailJmGXHoBYcr9eGQ3M0EDVCkjgkdaO_Mgryo5omg9UIpmzQAktd1ANW5LTuVIol-HedzDPHggzXmjA7QmIiBhklsQTZ2_g9NQh8Ji7Nsfcp1-x0eTSdbpcRCDtQQ',
  },
  {
    name: '수진 선생님',
    message: '지난 번 문법 정리는 도움 되셨나요?',
    time: '어제',
    href: '/chat/1',
    dimmed: true,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA0jwmmtvFfCwNOpWQ4cfNgTylHo_72valj9K4RCuujT7bKrA2mA9kgPQ7RxaN969Ytd5p3H186hKMBmeNIVDTTYYuGdsT6ad902vr97kTgRVWcCeGJOLqkaQKvvb7k_BiFMSyNrn9lxXJTt3v8wWaSQrgGnByJLMu_jAHrF44LqZiPpZNKLldgwGi2-MocRguWxVyPP0SMhjOpF9Fk8vq8oJ8zbbCf3dQsG1-xMhfvTn-Y7MarKXEO5402FKmSW6-R_L5Goorx6g',
  },
  {
    name: 'TOPIK II 준비반',
    message: '현우: 단어장 공유해주셔서 감사합니다!',
    time: '어제',
    href: '/chat/1',
    dimmed: true,
    group: true,
  },
  {
    name: '하윤 선생님',
    message: '오늘 고생 많으셨어요. 주말 잘 보내세요!',
    time: '화요일',
    href: '/chat/1',
    dimmed: true,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDug6j0D7qIsZDPa-99P9R5rAs5s4NJ7grl3U1qoZuH-UiI85_pUSQAWSkeHG_a57EoDIV_iIrn822EJZD0QDgFqN9ULUk7MgqS17f6QumsjuZKlifMbQFtnym38SrQgHv2fjdAVnFhF0kbUdtIA6AzyhiVGW7b4R5S2CXUh1VtLdLsDNBYGOo6MwItb8LJwo4HhOIpU5kipWokTLzRRVhajq2jK75ZNd2foeSmjUg9qtE5KwriodPxmlkIFt3p0Ev-rnz5XguIzA',
  },
];

export default function ChatListPage() {
  return (
    <div className="min-h-screen bg-background pb-24 font-body-md text-on-background">
      <header className="sticky top-0 z-50 flex items-center justify-between bg-surface/80 px-container-margin py-4 shadow-sm backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 overflow-hidden rounded-full border-2 border-primary-container">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="h-full w-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDRhE09N16NECijGaiqIvOdKRjjT0lsELzaFym99RJ-8RM40OD8UYC-cPmWmfS8zPZ1w4sWGAbSw-2dyyMA20l3N_giPpc2XUikwqo525l_ffM4V0FdhuubFzSHWtjqZKYANrsYjEHh37vnvZi8KxvJ1r7NbBuPGNduUgpbFl_H5j54pW03Fw9Ctpd0DePRG6ME2E_lujBKXmWajPzvvxZLX-qTL9vcTQxYaogafZAaMPxZ8JTwdVOA16iJ8L9NMR_-kpATJkoVpg"
              alt="채팅 프로필"
            />
          </div>
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-primary">채팅</h1>
        </div>
        <button className="flex h-10 w-10 items-center justify-center rounded-full transition-transform hover:bg-surface-container active:scale-95" aria-label="검색">
          <span className="material-symbols-outlined text-on-surface-variant">search</span>
        </button>
      </header>

      <main className="pb-24 pt-4">
        <div className="mb-6 px-container-margin">
          <div className="scrollbar-hide flex gap-2 overflow-x-auto py-2">
            {FILTERS.map((filter, index) => (
              <button
                key={filter}
                className={`whitespace-nowrap rounded-full px-4 py-2 font-label-lg transition-transform active:scale-95 ${
                  index === 0
                    ? 'bg-gradient-to-br from-primary to-secondary-container text-white shadow-md'
                    : 'bg-surface-container text-on-surface-variant'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col space-y-2 px-container-margin">
          {CHATS.map((chat) => (
            <Link
              key={chat.name}
              href={chat.href}
              className={`group relative flex cursor-pointer items-center gap-4 rounded-xl border border-transparent bg-surface-container-lowest p-4 shadow-[0_4px_20px_rgba(0,0,0,0.04)] transition-all hover:border-outline-variant active:scale-95 ${
                chat.dimmed ? 'opacity-80' : ''
              }`}
            >
              <div className="relative flex-shrink-0">
                {chat.group ? (
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary-container text-white">
                    <span className="material-symbols-outlined text-3xl">groups</span>
                  </div>
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img className="h-14 w-14 rounded-full border-2 border-surface-container object-cover" src={chat.image} alt={chat.name} />
                )}
                {chat.online && <span className="absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-white bg-green-500" />}
              </div>
              <div className="min-w-0 flex-grow">
                <div className="mb-1 flex items-baseline justify-between">
                  <h3 className="truncate font-headline-md text-headline-md text-on-surface">{chat.name}</h3>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">{chat.time}</span>
                </div>
                <div className="flex items-center justify-between">
                  <p className={`truncate font-body-md text-body-md text-on-surface-variant ${chat.unread ? 'font-semibold' : ''}`}>{chat.message}</p>
                  {chat.unread && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-[10px] font-bold text-white shadow-sm">
                      {chat.unread}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        <button className="fixed bottom-24 right-6 z-10 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary-container text-white shadow-lg shadow-primary-container/40 transition-transform active:scale-95" aria-label="새 채팅">
          <span className="material-symbols-outlined text-3xl">chat_add_on</span>
        </button>
      </main>
    </div>
  );
}
