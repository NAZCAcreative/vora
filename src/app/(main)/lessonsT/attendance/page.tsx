'use client';

import Link from 'next/link';
import { useState } from 'react';

type AttendanceStatus = 'present' | 'late' | 'absent' | null;

const STUDENTS = [
  {
    name: 'Sophia',
    initialStatus: 'present' as AttendanceStatus,
    lessonType: 'TOPIK II 스터디 그룹',
    attended: 11,
    total: 12,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAdLBLimsf04MPz3KIyT4xkDtvwEoIZELKmpguqO3Vzy8PlMGJNkelk1vtI_siSSxH-XAc517Yhz7CLqJ4v1vuRmP5_UfXj-E584I6F7jgr_EkWx7aVIvJdvsRqX9kzQBj2Dgy9Kc-J1I0l3VBfelJ-a97tTvcz8l32wlZMdCuvIvUWZI-_E7Q7ThhOOnsVXW0BrAuso9AF0CD9g2QvU44iaGLUBgGZx0v1bHumLH5MVfSTv61zxG96bcfSGmQ3mj5FqtnhqTEWsw',
  },
  {
    name: 'James',
    initialStatus: null,
    lessonType: 'TOPIK II 스터디 그룹',
    attended: 8,
    total: 10,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDqJTTW7B90U1eJd17l90R7CVWVPhdJNgXDXV4rVEYpsAZcd049Y_dniBjHdhlcLz9DuCgioLrZQTni_6GAP2eoAG4bl7PXCEZbDf2ZB84K8I8xH9cMPBEDXy4hT1lBC73cL9UYhOpPiioSLIR3s6mixcgFMt5GIvmIeOTD4zxYHQixI5jlMMBIarLEqTbe5NESo2sJJcD3dVreQhdSBGHGHRAHWPlfdhOAbh5C7JCbk0d_n0yVHlSvyGfnr8rXi0mH6jbyTWySQQ',
  },
  {
    name: 'Olivia',
    initialStatus: null,
    lessonType: 'TOPIK II 스터디 그룹',
    attended: 4,
    total: 4,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA8g9XuDZqrxuB9uotrlybLAsh5kaQBO4Szv6YoQ_TXRqeK-uOta-4Uu2d3Gv8fAAxCZ49fmmayjGGRA1Po7bKzwODL-H_Oy-goFd8Z_W0zDeC_wBUMjkGRAT9Ia9Ac9sC3qQz8Ny1Cs2P_UeD72gatTnDK7eOJvhu3QrEdrsjS8VLvj4MIvoM6d9nu92Q0HEI-izaT5fE1Zj_CXZzsrVUufGSpE-GFECvsAMImGkaPnr_GCwb_M8XRRIOy2gLnvRgX4ksDBnue0Q',
  },
  {
    name: 'Emma',
    initialStatus: null,
    lessonType: 'TOPIK II 스터디 그룹',
    attended: 6,
    total: 8,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCsGMQCEg_1JHeU-anHx9elQMVt4p5pN1imDeaSDFYDnVAihFo5SrukOK1vFjkA5xmEI7Bbtp_O3IkjA-OHVXhW21D_Ea41UfPOMddV_qzJ4UDkkz0xlXK7igGRLYblVHB78MS1jy-syrZPaVuz4XsQ-q19sgPLifHvSE50zj7MxFOjZ37k9lCztbRtOrM5j_WuADmHhEPIN65-ACHtD2Tq7P_sVNViuR_9VDQD91tgtNVfb_L2UF4BcMmiODjBlC2peVedcscV_g',
  },
];

const STATUS_OPTIONS: { label: string; value: Exclude<AttendanceStatus, null> }[] = [
  { label: '출석', value: 'present' },
  { label: '지각', value: 'late' },
  { label: '결석', value: 'absent' },
];

export default function TeacherAttendancePage() {
  const [statuses, setStatuses] = useState<Record<string, AttendanceStatus>>(
    Object.fromEntries(STUDENTS.map((student) => [student.name, student.initialStatus])),
  );

  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl bg-background px-container-margin pb-32 pt-stack-lg font-body-md text-on-surface">
      <section className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/lessonsT" className="rounded-full p-2 transition-colors hover:bg-surface-container-high active:scale-95" aria-label="뒤로가기">
            <span className="material-symbols-outlined text-on-surface">arrow_back</span>
          </Link>
          <h1 className="font-headline-md text-headline-md font-semibold text-primary">출석 관리</h1>
        </div>
        <button className="rounded-full p-2 transition-colors hover:bg-surface-container-high active:scale-95" aria-label="더보기">
          <span className="material-symbols-outlined text-on-surface">more_vert</span>
        </button>
      </section>

      <section className="mb-6">
        <div className="rounded-xl border border-surface-container bg-surface-container-lowest p-6 shadow-sm">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <span className="mb-2 inline-block rounded-full bg-primary-fixed px-3 py-1 text-xs font-semibold text-on-primary-fixed">TOPIK II</span>
              <h2 className="font-headline-md text-xl font-bold text-on-surface">TOPIK II 스터디 그룹</h2>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-lg font-bold text-secondary">4/6명</span>
              <span className="text-xs text-outline">수강 인원</span>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 rounded-lg bg-surface-container-low p-3 text-on-surface-variant transition-colors hover:bg-surface-container-high">
            <button className="flex items-center justify-center rounded-full p-1 transition-transform hover:bg-surface-container-highest active:scale-90" aria-label="이전 일정">
              <span className="material-symbols-outlined text-xl">chevron_left</span>
            </button>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-xl font-bold text-primary">calendar_today</span>
              <span className="font-body-md text-body-md font-bold text-on-surface">2024년 3월 12일 (화) 20:00</span>
            </div>
            <button className="flex items-center justify-center rounded-full p-1 transition-transform hover:bg-surface-container-highest active:scale-90" aria-label="다음 일정">
              <span className="material-symbols-outlined text-xl">chevron_right</span>
            </button>
          </div>
        </div>
      </section>

      <section className="mb-8 rounded-xl border border-surface-container-high bg-surface-container-lowest p-4 shadow-[0px_4px_20px_rgba(0,0,0,0.04)]">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="font-headline-md text-headline-md text-on-surface">학생별 수업 참여율</h2>
            <p className="mt-1 font-body-md text-body-md text-on-surface-variant">학생별 전체 수업 대비 실제 참여한 수업 비율입니다.</p>
          </div>
          <span className="hidden rounded-full bg-primary-fixed px-3 py-1 font-label-sm text-label-sm text-primary sm:inline-flex">이번 달</span>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {STUDENTS.map((student) => {
            const rate = Math.round((student.attended / student.total) * 100);

            return (
              <article key={student.name} className="rounded-xl border border-surface-container bg-surface-container-low p-4">
                <div className="mb-4 flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img alt={student.name} className="h-11 w-11 shrink-0 rounded-full border-2 border-primary-fixed bg-surface-dim object-cover" src={student.image} />
                  <div className="min-w-0">
                    <h3 className="font-label-lg text-label-lg text-on-surface">{student.name}</h3>
                    <p className="truncate font-label-sm text-label-sm text-on-surface-variant">{student.lessonType}</p>
                  </div>
                </div>

                <div className="mb-2 flex items-end justify-between">
                  <span className="font-label-sm text-label-sm text-on-surface-variant">
                    {student.attended}/{student.total}회 참여
                  </span>
                  <span className="font-headline-md text-headline-md text-primary">{rate}%</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-surface-container-high">
                  <div className="h-full rounded-full bg-gradient-to-r from-primary to-secondary" style={{ width: `${rate}%` }} />
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-headline-md text-lg font-bold">수강생 명단</h3>
          <span className="font-body-md text-body-md text-outline">상태를 선택해주세요</span>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          {STUDENTS.map((student) => (
            <article key={student.name} className="flex flex-col gap-3 rounded-xl bg-surface-container-lowest p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img alt={student.name} className="h-12 w-12 rounded-full bg-primary-fixed object-cover" src={student.image} />
                <span className="font-bold text-on-surface">{student.name}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 sm:flex">
                {STATUS_OPTIONS.map((option) => (
                  <button key={option.value} className={getStatusClass(statuses[student.name], option.value)} onClick={() => setStatuses((current) => ({ ...current, [student.name]: option.value }))}>
                    {option.label}
                  </button>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <div className="mt-12">
        <button className="w-full rounded-xl bg-gradient-to-br from-primary-container to-secondary-container py-4 text-lg font-bold text-on-primary shadow-lg transition-all duration-200 active:scale-95">
          출석 완료 저장
        </button>
      </div>
    </main>
  );
}

function getStatusClass(current: AttendanceStatus, value: Exclude<AttendanceStatus, null>) {
  const base = 'rounded-lg border border-outline-variant px-3 py-1.5 text-sm font-semibold transition-all';
  if (current !== value) {
    return `${base} text-on-surface-variant hover:bg-surface-container-high`;
  }
  if (value === 'present') {
    return `${base} bg-primary-container text-on-primary-container ring-2 ring-primary`;
  }
  if (value === 'late') {
    return `${base} bg-secondary-container text-on-secondary-container ring-2 ring-secondary`;
  }
  return `${base} bg-error-container text-on-error-container ring-2 ring-error`;
}
