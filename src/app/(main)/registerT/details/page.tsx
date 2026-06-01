'use client';

import Link from 'next/link';
import { ReactNode, useState } from 'react';

const LEVELS = ['입문', '초급', '중급', '고급', '비즈니스'];
const CATEGORIES = ['TOPIK', '회화', '비즈니스', '발음 교정', '취미/문화'];

export default function TeacherRegisterDetailsPage() {
  const [freeTrial, setFreeTrial] = useState(false);
  const [level, setLevel] = useState('초급');
  const [category, setCategory] = useState('회화');

  return (
    <main className="mx-auto min-h-screen w-full max-w-3xl bg-background px-container-margin pb-28 pt-stack-md font-body-md text-on-background">
      <section className="sticky top-[56px] z-40 -mx-container-margin bg-surface px-container-margin shadow-sm">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/registerT" className="text-primary transition-opacity hover:opacity-80 active:scale-95" aria-label="이전 단계">
              <span className="material-symbols-outlined">arrow_back</span>
            </Link>
            <h1 className="font-headline-lg-mobile text-headline-lg-mobile font-bold text-primary">수업 등록</h1>
          </div>
          <Link href="/homeT" className="text-primary transition-opacity hover:opacity-80 active:scale-95" aria-label="등록 취소">
            <span className="material-symbols-outlined">close</span>
          </Link>
        </div>
      </section>

      <section className="mb-section-gap mt-stack-md">
        <div className="mb-2 flex items-center justify-between">
          <span className="font-label-sm text-label-sm text-on-surface-variant">Step 2 of 3</span>
          <span className="font-label-sm text-label-sm font-semibold text-primary">상세 정보</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-surface-container-high">
          <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-primary to-secondary" />
        </div>
      </section>

      <h2 className="mb-stack-lg font-headline-md text-headline-md text-on-surface">어떤 수업을 진행하시나요?</h2>

      <form className="space-y-stack-lg">
        <section className="flex items-center justify-between rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-stack-md shadow-sm">
          <div className="flex flex-col pr-4">
            <span className="font-label-lg text-label-lg text-on-surface">무료 체험 레슨</span>
            <span className="text-xs text-on-surface-variant">첫 수업을 무료로 제공하여 더 많은 학생을 모집해보세요.</span>
          </div>
          <button
            type="button"
            onClick={() => setFreeTrial((current) => !current)}
            className={`relative h-6 w-11 rounded-full transition-colors ${freeTrial ? 'bg-primary' : 'bg-surface-container-high'}`}
            aria-pressed={freeTrial}
            aria-label="무료 체험 레슨 설정"
          >
            <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${freeTrial ? 'translate-x-[22px]' : 'translate-x-0.5'}`} />
          </button>
        </section>

        <FieldCard label="수업 제목" htmlFor="lesson-title">
          <input
            id="lesson-title"
            className="w-full rounded-md border border-outline-variant bg-surface-container-lowest px-4 py-3 font-body-md text-on-surface transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="예: 기초부터 탄탄하게! 실전 한국어 회화"
            type="text"
          />
        </FieldCard>

        <FieldCard label="수업 대상">
          <ChipGroup items={LEVELS} selected={level} onSelect={setLevel} />
        </FieldCard>

        <FieldCard label="카테고리">
          <ChipGroup items={CATEGORIES} selected={category} onSelect={setCategory} />
          <p className="mt-2 text-xs text-on-surface-variant">* 무료 체험 레슨으로 설정할 경우 0원으로 입력됩니다.</p>
        </FieldCard>

        <FieldCard label="수업 날짜 및 시간 설정">
          <div className="space-y-4">
            <div>
              <label className="mb-2 block font-label-sm text-label-sm text-on-surface-variant" htmlFor="lesson-date">
                수업 날짜
              </label>
              <InputWithIcon id="lesson-date" placeholder="YYYY.MM.DD" icon="calendar_today" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block font-label-sm text-label-sm text-on-surface-variant" htmlFor="start-time">
                  시작 시간
                </label>
                <InputWithIcon id="start-time" placeholder="HH:MM" icon="schedule" />
              </div>
              <div>
                <label className="mb-2 block font-label-sm text-label-sm text-on-surface-variant" htmlFor="end-time">
                  종료 시간
                </label>
                <InputWithIcon id="end-time" placeholder="HH:MM" icon="schedule" />
              </div>
            </div>
          </div>
        </FieldCard>

        <FieldCard label="회당 수강료 (원)" htmlFor="lesson-price">
          <div className="relative">
            <input
              id="lesson-price"
              className="w-full rounded-md border border-outline-variant bg-surface-container-lowest py-3 pl-4 pr-12 font-body-md text-on-surface transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary disabled:text-on-surface-variant"
              placeholder="0"
              type="number"
              disabled={freeTrial}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 font-body-md text-on-surface-variant">원</span>
          </div>
        </FieldCard>

        <FieldCard label="수업 상세 설명" htmlFor="lesson-description">
          <textarea
            id="lesson-description"
            className="w-full resize-none rounded-md border border-outline-variant bg-surface-container-lowest px-4 py-3 font-body-md text-on-surface transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="수강 대상, 커리큘럼, 수업 방식 등을 자세히 적어주세요."
            rows={5}
          />
        </FieldCard>
      </form>

      <div className="sticky bottom-24 mt-section-gap">
        <Link href="/registerT/confirm" className="block w-full rounded-xl bg-gradient-to-r from-primary to-secondary py-4 text-center font-label-lg text-label-lg text-on-primary shadow-lg transition-opacity hover:opacity-90 active:scale-95">
          다음 단계로
        </Link>
      </div>
    </main>
  );
}

function FieldCard({ label, htmlFor, children }: { label: string; htmlFor?: string; children: ReactNode }) {
  return (
    <section className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-stack-md shadow-sm">
      <label className="mb-stack-sm block font-label-lg text-label-lg text-on-surface" htmlFor={htmlFor}>
        {label}
      </label>
      {children}
    </section>
  );
}

function ChipGroup({ items, selected, onSelect }: { items: string[]; selected: string; onSelect: (value: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => {
        const active = selected === item;
        return (
          <button
            key={item}
            type="button"
            onClick={() => onSelect(item)}
            className={`rounded-full px-4 py-2 font-label-sm text-label-sm transition-colors ${
              active ? 'border-2 border-primary bg-primary-fixed font-semibold text-primary' : 'border border-outline-variant text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            {item}
          </button>
        );
      })}
    </div>
  );
}

function InputWithIcon({ id, placeholder, icon }: { id: string; placeholder: string; icon: string }) {
  return (
    <div className="relative">
      <input
        id={id}
        className="w-full rounded-md border border-outline-variant bg-surface-container-lowest px-4 py-3 pr-11 font-body-md text-on-surface transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
        placeholder={placeholder}
        type="text"
      />
      <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-lg text-on-surface-variant">{icon}</span>
    </div>
  );
}
