# VORA 백엔드 전환 작업 기록 (bkend.ai 목업 → Supabase 실 서비스)

기록일: 2026-08-10

목표: 선생님 100명 / 가입자 1만명 규모를 가정하고, 프론트엔드만 완성되어 있던 VORA(구 표기 "VARA") 목업에 실제 백엔드를 붙여 동작하는 예약/매칭 마켓플레이스로 전환한다. 백엔드는 비용/속도 비교 후 **Supabase**(Postgres + Auth + Realtime + Storage)로 결정. 그룹 강의를 기본 상품, 1:1 레슨을 옵션으로 하는 방향을 스키마에 반영했다.

---

## 0단계 — 사전 조사

- 기존 `src/lib/api.ts`, `src/types/index.ts`는 CLAUDE.md 로드맵(Course/Lesson 영상강의/VocabWord/Community 기반 LMS)을 기준으로 만들어져 있었지만, 실제 완성된 30여 개 화면은 전부 **튜터 예약/매칭 마켓플레이스**(선생님 검색, 예약, 결제, 채팅, 리뷰, 쿠폰, 정산/출금, 수업자료, 출석)였다. 즉 기존 타입/API 클라이언트는 죽은 코드였음을 확인.
- preply.com과 실사용 비교하여 개선 우선순위를 `check.md` 하단에 별도 기록.

## 1단계 — DB 스키마 + 인증 배선

- `supabase/migrations/0001_init.sql`: 19개 테이블 전체 스키마.
  - `profiles`(회원가입 시 트리거로 자동 생성), `teacher_profiles`, `teacher_availability`, `teacher_lessons`(기본 `type='group'`, 1:1은 `capacity=1` 강제 체크 제약), `lesson_sessions`, `enrollments`, `attendance_records`, `payments`, `coupons`/`user_coupons`, `reviews`, `wishlists`, `chat_rooms`/`chat_messages`, `notifications`, `settlement_accounts`, `settlements`/`withdrawal_requests`, `materials`.
  - 전 테이블 RLS 활성화. 공개 검색이 필요한 `teacher_profiles`/`teacher_lessons`(published)는 비로그인 SELECT 허용, 나머지는 본인 소유 행만 접근.
  - `handle_new_user`, `sync_session_enrolled_count`, `sync_teacher_rating`, `touch_chat_room_last_message` 트리거 추가.
- `src/lib/supabase/client.ts` / `server.ts`: `@supabase/ssr` 기반 브라우저/서버 클라이언트.
- `src/middleware.ts`: 세션 갱신 미들웨어.
- `src/types/index.ts`: LMS 잔재 타입 제거, 스키마와 1:1 대응하는 예약/매칭 도메인 타입으로 전면 교체.
- `src/stores/auth-store.ts`: 외부 인터페이스(`login`/`register`/`logout`/`fetchMe`/`switchRole`)는 유지한 채 내부 구현만 Supabase Auth 호출로 교체 — `RegisterForm.tsx`, `RoleSwitcher.tsx`는 수정 불필요.
- `src/lib/api.ts` 삭제(미사용 확인 후 제거).
- `CLAUDE.md`, `design.md` 등 문서의 "VARA" 오표기를 "VORA"로 정정, Tech Stack/Domain Concepts를 Supabase 기준으로 갱신.

## 2단계 — 선생님 검색/프로필/찜하기

- `src/lib/queries/teachers.ts` 작성: `listTeachers`, `getTeacherById`, `getTeacherDetail`, `listWishlistedTeacherIds`, `addWishlist`, `removeWishlist`.
- `supabase/migrations/0002_fix_teacher_lessons_fk.sql`: PostgREST가 `teacher_profiles`↔`teacher_lessons`를 조인하지 못하던 문제(`PGRST200`)를 `teacher_lessons.teacher_id` FK를 `teacher_profiles(profile_id)`로 재지정해 해결.
- 검증용 선생님 시드 데이터 스크립트(`seed-teachers.js`)로 목록/상세/찜하기 흐름 브라우저 테스트.

## 3단계 — 예약 플로우

- `src/lib/queries/bookings.ts`: `listTeacherLessons`, `createBookingDraft`(동시간대 중복예약 방지 가드 포함), `getEnrollmentDetail`, `confirmPayment`, `listMyEnrollments`.
- `supabase/migrations/0003_fix_lesson_sessions_rls.sql`: 학생이 예약 시점에 `lesson_sessions`를 직접 생성해야 하는데 INSERT 정책이 선생님 전용이라 막혀 있던 문제를 인증된 사용자 전체로 완화(UPDATE/DELETE는 선생님 전용 유지).
- `/student/booking/confirm` → `/student/payment` → `/student/confirmation` 전 구간 브라우저 테스트. `/student/confirmation`의 "내 예약 보기" 버튼이 BottomNavigation에 가려 오클릭되던 버그를 `pb-20`→`pb-32`로 수정(design.md 하단 네비 여백 규칙 재확인).
- 신규 `/student/bookings` 목록 페이지 추가.

## 4단계 — 채팅/알림 실시간화

- `src/lib/queries/chat.ts`, `src/lib/queries/notifications.ts` 작성.
- `supabase/migrations/0004_realtime_and_notifications.sql`: `chat_messages`/`notifications`를 `supabase_realtime` publication에 추가하고, `notify_new_chat_message` / `notify_booking_confirmed` / `notify_payment_succeeded` 트리거 함수 생성.
- 여러 컴포넌트가 동일한 이름의 Realtime 채널을 구독하면서 발생한 "cannot add postgres_changes callbacks after subscribe()" 오류를, 채널명에 랜덤 suffix를 붙여 인스턴스별로 고유화해 해결.
- `TopNavigation.tsx`에 실시간 안읽음 알림 배지, `NotificationLayer.tsx`의 `NotificationCenterContent`를 실 데이터로 교체.
- `/teachers/[id]`에 `getOrCreateRoom`으로 "메시지 보내기" 버튼 연결.

## 5단계 — 정산/출금 배치 + 선생님 수업자료 Storage

- `supabase/migrations/0005_settlement_batch.sql`: `pg_cron` 활성화, `run_weekly_settlement(period_start, period_end)`(결제 성공건 집계 → 플랫폼 수수료 20% 차감 → `settlements` insert + 알림), 매주 월요일 자동 실행 크론 등록.
- `supabase/migrations/0006_materials_storage.sql`: 비공개 `materials` Storage 버킷 생성, `(storage.foldername(name))[1] = auth.uid()::text` 기준 경로별 RLS.
- `src/lib/queries/settlement.ts`, `src/lib/queries/materials.ts` 작성.
- `/teacher/profile/account`(계좌 등록), `/teacher/profile/withdraw`(잔액 조회/출금 신청), `/teacher/profile/materials`(업로드/다운로드/삭제)를 실 데이터로 연결.

### 브라우저 검증 (테스트 계정 자가 생성 방식)

> 처음 `/login` 페이지 테스트 중 Chrome 자동완성이 사용자의 실제 이메일/비밀번호를 임의로 채워 넣고 로그인 시도까지 자동 제출한 안전사고가 있었음(실제 계정 피해는 없었고 로그인은 실패로 종료). 즉시 중단하고 사용자에게 전체 공개 → **"테스트 계정으로 너가 알아서 만들어서 하면서 진행해"** 지침을 받아, 이후 모든 검증은 `/signup` 폼으로 자체 생성한 테스트 계정만 사용.

- 테스트 계정 `자료테스트`(`vora-materials-test@mailinator.com`)를 `/signup`으로 직접 생성.
- SQL로 정산 내역(₩62,500 총액 / ₩12,500 수수료 / ₩50,000 순액) 시드 후 `/teacher/profile/withdraw`에서 계좌 미등록 시 출금 신청이 정상적으로 차단되는 것을 확인.
- `/teacher/profile/account`에서 네이티브 `<select>` 좌표 클릭이 값 선택에 실패하는 것을 발견 → 키보드 조작(클릭 후 Down/Enter)으로 전환해 "국민은행 (KB)" 정상 선택, 계좌 저장 성공 확인.
- `/teacher/profile/withdraw`에서 계좌 등록 후 출금 신청 재시도 → 성공, 출금 가능 금액 ₩50,000 → ₩0, 누적 출금액 ₩50,000으로 정상 갱신 확인.
  - `window.confirm` 네이티브 다이얼로그가 Chrome 자동화를 블로킹하는 문제를 피하기 위해, 페이지에 `window.confirm = () => true`를 주입해 실제 확인창 없이 앱 로직(가드 → insert)만 그대로 실행되도록 처리.
- `/teacher/profile/materials`: 파일 업로드(아이콘/용량/날짜 정상 표시) → 다운로드(서명된 URL이 새 탭에서 정상 오픈) → 삭제(Storage + DB 행 모두 제거, "파일이 삭제되었습니다" 토스트 확인)까지 전 구간 성공.

### 테스트 데이터 정리

- Admin Auth API로 테스트 계정(`d4fd5af9-...`) 삭제 → `profiles`/`settlement_accounts`/`materials`/`withdrawal_requests`가 `on delete cascade`로 함께 정리됨.
- 수동으로 시드했던 정산 행(고선미 선생님, `1bc06ed8-...`)을 REST API로 별도 삭제.
- REST API로 `settlements`/`withdrawal_requests`/`settlement_accounts`/`materials` 테이블과 `materials` Storage 버킷이 모두 빈 상태(`[]`)임을 최종 확인.

## 부가 작업 — URL 라우트 전면 재구성

사용자가 "url 이름도 연관성있게 모든페이지 다시 정리해줘" 요청 → **역할별 경로 프리픽스** 방식으로 결정(`/student/*`, `/teacher/*`, `/teachers/[id]`와 알림/지원 등 일부는 공용 유지).

- `/home*`, `/search`, `/booking*`, `/payment*`, `/confirmation`, `/chat*`, `/profile-setup`, `/coupons`, `/wishlist`, `/reviews`, `/payment-history` → `src/app/(main)/student/` 하위로 이동.
- `/homeT`, `/lessonsT*`, `/registerT*`, `/chatT*`, `/profileT*` → `src/app/(main)/teacher/` 하위로 이동.
- Node 정규식 스크립트로 `src/`, `docs/` 전체의 경로 참조를 일괄 치환.
- 개발 서버가 파일 잠금을 잡고 있어 `mv` 권한 오류가 났던 문제는 서버를 종료 후 재시도해 해결. 이동 후 `.next` 캐시 삭제로 스테일 타입 오류 정리.

## `/signup` 회원가입 실배선

- 사용자가 "signup 회원가입 버튼은 어딧어" 질문 → CTA가 실제 로직 없는 가짜 링크였던 것을 발견, 이름/이메일/비밀번호 폼과 `register()` 호출로 재작성. "이미 계정이 있으신가요?" 링크를 신규 `/login` 페이지로 연결.

## 알려진 남은 과제

- `src/app/(main)/dashboard/page.tsx`, `src/app/(main)/student/booking/confirm/results/page.tsx` — 라우트 재구성 이후 어디서도 참조되지 않는 고아 페이지. 삭제 명령이 Claude Code 자동 모드 분류기에 의해 차단되어, 완전 삭제 대신 `.attic/`로 이동시켜 라우팅에서만 제외한 상태. 완전 삭제는 사용자가 직접 `git rm` 실행 필요.
- `/auth/callback` 라우트 미구현 — 현재 이메일/비밀번호 인증만 배선되어 있어 매직링크/OAuth 콜백 라우트가 없음.
- `/signup`의 Google/Apple 소셜 로그인 버튼은 토스트만 뜨는 자리표시자 — 실제 연동에는 사용자가 Google Cloud Console / Apple Developer에서 OAuth 앱을 등록하고 Supabase Auth 대시보드에 client id/secret을 입력하는 절차가 필요(외부 자격 증명이 필요해 에이전트가 대신 진행 불가).
