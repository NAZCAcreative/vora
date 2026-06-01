'use client';

import Link from 'next/link';
import { useState } from 'react';

const THUMBNAIL =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuA4jy0wh6KBi0jUgCUHOezfm4SKcvPdQiPsH4nzFLBWV2Z3jBBH3-4G5oY7o8Ihosm913Rb1AgrwgBFsSWR50V1NVovHXMqjqwusV_vTYdtQcow9mAqMTnQRIupfD_R2cCeaPnOvtWEXWzckYr_rAXHXchmuLLYjj3OUCIAxE8DQzkhymYUgc-h6wsGwwYuF9hs-YVr2EpKDy3RkHhn8SLtL2DUDi9VtPCIcaGAuIFcWJGZgQNSjw_-PepvRw1g58PwoqvcmKDv_w';

export default function TeacherLessonEditPage() {
  const [title, setTitle] = useState('실전 한국어 회화: 초급 비즈니스 편');
  const [level, setLevel] = useState('중급');
  const [category, setCategory] = useState('비즈니스');
  const [schedule, setSchedule] = useState('매주 월, 수 | 19:30 - 21:00');
  const [price, setPrice] = useState('150,000');
  const [description, setDescription] = useState(`실제 한국 기업에서 사용되는 핵심 표현들을 중심으로 구성된 커리큘럼입니다.
- 비즈니스 메일 작성법
- 회의 및 프레젠테이션 스킬
- 전문적인 경어체 사용법

초보자를 위한 맞춤형 피드백을 매 수업마다 제공합니다.`);

  function handleDelete() {
    window.alert('수업 정보가 삭제되었습니다.');
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl bg-background px-container-margin pb-32 pt-stack-lg font-body-md text-on-surface">
      <section className="mb-8 flex items-center justify-between">
        <Link href="/lessonsT" className="text-primary transition-transform active:scale-95" aria-label="뒤로가기">
          <span className="material-symbols-outlined text-2xl">arrow_back</span>
        </Link>
        <h1 className="font-headline-md text-headline-md font-bold text-primary">수업 수정</h1>
        <button className="text-error transition-transform active:scale-95" onClick={handleDelete} aria-label="수업 삭제">
          <span className="material-symbols-outlined text-2xl">delete</span>
        </button>
      </section>

      <section className="mb-8">
        <h2 className="mb-2 font-headline-lg text-2xl font-bold text-on-surface">기존 수업 정보 수정</h2>
        <p className="text-sm text-on-surface-variant">변경하고자 하는 내용을 입력하신 후 하단의 수정 완료 버튼을 눌러주세요.</p>
      </section>

      <form className="grid gap-section-gap lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
        <section className="space-y-6">
          <FormField label="수업 제목">
            <input className={inputClass} placeholder="수업 제목을 입력하세요" type="text" value={title} onChange={(event) => setTitle(event.target.value)} />
          </FormField>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="대상">
              <select className={selectClass} value={level} onChange={(event) => setLevel(event.target.value)}>
                <option>입문/초급</option>
                <option>중급</option>
                <option>고급</option>
                <option>전문가</option>
              </select>
            </FormField>
            <FormField label="카테고리">
              <select className={selectClass} value={category} onChange={(event) => setCategory(event.target.value)}>
                <option>말하기</option>
                <option>비즈니스</option>
                <option>TOPIK 대비</option>
                <option>문화/K-Pop</option>
              </select>
            </FormField>
          </div>

          <FormField label="날짜 및 시간">
            <IconInput icon="calendar_today" value={schedule} onChange={setSchedule} />
          </FormField>

          <FormField label="수강료 (월)">
            <div className="relative">
              <IconInput icon="payments" value={price} onChange={setPrice} />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 font-medium text-on-surface-variant">원</span>
            </div>
          </FormField>

          <FormField label="상세 설명">
            <textarea className="w-full resize-none rounded-xl border-0 bg-white p-4 shadow-sm ring-1 ring-inset ring-outline-variant transition-all outline-none focus:ring-2 focus:ring-primary" rows={8} value={description} onChange={(event) => setDescription(event.target.value)} />
          </FormField>
        </section>

        <aside className="rounded-xl border border-surface-container-high bg-surface-container-lowest p-4 shadow-[0px_4px_20px_rgba(0,0,0,0.04)] lg:sticky lg:top-24">
          <button className="group relative flex h-48 w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-outline-variant bg-surface-container-high" type="button">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt="Class Thumbnail" className="absolute inset-0 h-full w-full object-cover opacity-60 transition-opacity group-hover:opacity-40" src={THUMBNAIL} />
            <div className="relative z-10 flex flex-col items-center text-primary">
              <span className="material-symbols-outlined mb-1 text-3xl">photo_camera</span>
              <span className="text-xs font-semibold">사진 변경</span>
            </div>
          </button>
          <div className="mt-4 space-y-2 rounded-lg bg-surface-container-low p-3 text-sm text-on-surface-variant">
            <p>수업 정보는 저장 후 학생 화면에 반영됩니다.</p>
            <p>그룹/무료 체험 여부는 카테고리와 가격 정책에 맞춰 표시됩니다.</p>
          </div>
          <button className="mt-4 flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary-container font-headline-md text-lg font-bold text-white shadow-lg transition-all hover:shadow-xl active:scale-[0.98]" type="button">
            <span className="material-symbols-outlined">check_circle</span>
            수정 완료
          </button>
        </aside>
      </form>
    </main>
  );
}

const inputClass = 'h-12 w-full rounded-xl border-0 bg-white px-4 shadow-sm ring-1 ring-inset ring-outline-variant transition-all outline-none focus:ring-2 focus:ring-primary';
const selectClass = `${inputClass} appearance-none`;

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-2">
      <span className="block font-headline-md text-sm font-bold text-on-surface">{label}</span>
      {children}
    </label>
  );
}

function IconInput({ icon, value, onChange }: { icon: string; value: string; onChange: (value: string) => void }) {
  return (
    <div className="relative">
      <input className={`${inputClass} pl-12`} type="text" value={value} onChange={(event) => onChange(event.target.value)} />
      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary">{icon}</span>
    </div>
  );
}
