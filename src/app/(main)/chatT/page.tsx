import Link from 'next/link';

const MESSAGES = [
  {
    name: '소피아',
    message: '감사합니다 선생님!',
    time: '오전 10:45',
    unread: 2,
    online: true,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB7Axg8eA2mEnLdyc7kLkeHxHsaMG0PEMYZ9RSbDsfzJBDQPWtCin-vMxVu6kvNScdKYPCeo2vhOBuOAxCQtIeNaay3PqbpBycKSlTvq--u9QHYc03JuOp4BFwaoXbGk2U8SYb-Ka8nV4l1YNlSB778XfE6rdhAaqupRFpVBgrW3ovbD95w6k6o08u6cP3iIcPVoObWtnCiVO-FrLqwyQhHUcBFN5qnZYPRKpYwaBaLre_IcfqapxNx1X8lWvAL-WYtCxSyYdk3aA',
  },
  {
    name: '제임스',
    message: '숙제 다 했습니다.',
    time: '어제',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD3DQkxyAJDQ15SxyOirU-8FjwEGnrhpJRWlVUqgVJjJHiq92PRsYhs1sHe19k04-Q_hd2TprfIiZxktGQczc5ofnv4IDqOT0BKWfgsV9rPLie3rlLaT0wTwHMxsfSYtRJz32ye9LvbVg4k24sByzaHxejYA8iCwT98ha_Vj8cOeu8d3BLtZiQvbpWzev9CXf0Ucvug83czzg8xADXcsgAq2pQu8nYbt8ZLD8ucq_cw-ywfF_PG1IbG5v2KzznUyob2_xPpsl4lxg',
  },
  {
    name: '올리비아',
    message: '내일 수업 가능하신가요?',
    time: '어제',
    unread: 1,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBSvfmemexTyNSMN_47ZahJHQtWjqjzp93_PC4L4JPAndUtnUcjIuW-2cLLG4yJBvYXmjHFna7oFRxguhUzVQptTAypxk9Ma7NzIc66ZZhFILtZRFzGAyD_O-04FofdlRn2642_OPTOEDj-6VljNIGLjgiC2HwHu1dij71Es_jst0gHk4krWCyIJnD15vHLZ81hsZrEoNZcddNNo6vffrhRiAaShakTR9qrA5dVnLR-6M7-IfXFZTo1tGdFrilF7Tu3qF-j6yZlQQ',
  },
  {
    name: '민호',
    message: '수업 링크가 어디 있나요?',
    time: '화요일',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDhrROWlvW10bnfQfoviLWf_pRmW6q5-7C_IU_CLl3p8aCsiOeTpOOHKguh0-hLhy42jAFxu-4FcbRT2WrwPMdDXmQAJqOyyK3PaZgZDSY6VqDJhpOU8Yyt-deYJmys9ZU0o8PUzK8CcdUe1i3H5ZgZKTI3qFAxjjdScFaL_eOHokpkCHE0PAaXIT2PndRo1bym8NlMZI9gL3pwJhaZqlMTopHqxSOV0I5UHNAqP8g9aobsU8RXMEewj1ED4ppHVD3C7VxVBdzDfQ',
  },
];

export default function TeacherChatPage() {
  return (
    <main className="mx-auto min-h-screen max-w-4xl space-y-stack-md bg-background px-container-margin pb-28 pt-stack-lg font-body-md text-on-background md:px-10">
      <section>
        <div className="mb-stack-md flex items-center justify-between">
          <h1 className="font-headline-md text-headline-md font-semibold text-primary">메시지</h1>
          <button className="flex items-center justify-center rounded-full p-2 text-primary transition-colors hover:bg-surface-container-high active:scale-95" aria-label="검색">
            <span className="material-symbols-outlined">search</span>
          </button>
        </div>

        <label className="mb-stack-lg flex items-center rounded-xl border border-surface-variant bg-surface-container-lowest p-2 shadow-sm transition-all focus-within:ring-2 focus-within:ring-primary/20">
          <span className="material-symbols-outlined ml-2 mr-2 text-outline">search</span>
          <input className="w-full border-none bg-transparent text-left text-body-md text-on-surface placeholder:text-outline-variant focus:ring-0" placeholder="메시지 검색..." type="text" />
        </label>
      </section>

      <ul className="space-y-stack-sm">
        {MESSAGES.map((item) => (
          <li key={item.name}>
            <Link href="/chatT/1" className="group flex w-full cursor-pointer items-start gap-4 rounded-xl bg-surface-container-lowest p-4 text-left shadow-sm transition-colors hover:bg-surface-container-low active:scale-[0.99]">
              <div className="relative shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img alt={`${item.name} 아바타`} className="h-12 w-12 rounded-full border-2 border-surface-bright object-cover shadow-sm transition-colors group-hover:border-primary" src={item.image} />
                {item.online && <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-surface-container-lowest bg-green-500" />}
              </div>

              <div className="min-w-0 flex-grow">
                <div className="mb-1 flex items-baseline justify-between">
                  <h2 className="truncate font-headline-md text-body-lg font-bold text-on-surface">{item.name}</h2>
                  <span className={`ml-2 whitespace-nowrap text-label-sm ${item.unread ? 'font-semibold text-primary' : 'text-outline-variant'}`}>{item.time}</span>
                </div>
                <p className={`truncate text-body-md ${item.unread ? 'font-medium text-on-surface' : 'text-on-surface-variant'}`}>{item.message}</p>
              </div>

              <div className="flex shrink-0 self-stretch">
                {item.unread && <span className="mt-1 flex h-6 min-w-6 items-center justify-center rounded-full bg-secondary-container px-1.5 text-label-sm font-bold text-on-secondary-container shadow-sm">{item.unread}</span>}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
