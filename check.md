# 사이트 버튼/링크 동작 체크리스트

## 실시간 채팅 검증 + 관련 버그 3건 수정, 실계정 오염 사고 정리 (2026-08-11)

"학생과 선생님이 실시간 채팅이 되는지 확인" 요청에 대한 결과.

### 검증 방법과 결과

같은 브라우저 프로필 안에서는 로그인 세션이 쿠키로 공유돼서 두 계정을 동시에 로그인한 채 테스트할 수 없다(로그인 하나 하면 다른 탭도 같이 바뀜). 그래서 Node 스크립트로 직접 검증: 실제 교사 계정으로 로그인해 Realtime 채널을 구독하고, 완전히 다른 연결(서비스 롤)로 학생인 척 메시지를 INSERT한 뒤 교사 쪽 구독이 그 이벤트를 실시간으로 받는지 확인. **PASS** — cross-user 실시간 전달 자체는 정상 동작.

### 발견해서 고친 버그

- **보낸 사람 화면에 자기 메시지가 즉시 안 뜸(치명적, 오늘 낮 선생님 페이지 감사에서도 독립적으로 재현됨)**: `/student/chat/[id]`, `/teacher/chat/[id]` 둘 다 메시지 전송 후 오직 Realtime 이벤트만 기다려서 화면에 반영했는데, 전송 시점에 Realtime 웹소켓 구독이 아직 완전히 맺어지지 않았으면 그 이벤트를 놓친다(레이스 컨디션). DB엔 정상 저장되지만 새로고침 전까진 안 보여서 "전송 실패"로 오해하기 쉬움. `sendMessage()`(`src/lib/queries/chat.ts`)가 insert된 실제 row를 반환하도록 고치고, 두 페이지 다 전송 성공 시 그 row를 즉시 로컬 상태에 추가(낙관적 업데이트)하도록 수정. Realtime 이벤트가 나중에 와도 id로 중복 제거됨.
- **`/teacher/register/confirm` 등록 완료 후 1단계로 튕김(치명적)**: `handleSubmit`에서 `reset()`을 `router.push(...)`보다 먼저 호출해서, draft 초기화로 인한 가드 effect(`!draft.type → router.replace('/teacher/register')`)가 완료 화면 이동과 경합해 이겨버림. DB엔 정상 저장되는데 화면만 1단계로 돌아가서 등록이 실패한 것처럼 보임. `router.push`를 `reset()`보다 먼저 호출하도록 순서 교체.
- **`/teacher/lessons/edit`의 레벨/카테고리 드롭다운이 실제 저장값과 다른 목록을 씀(치명적)**: `/teacher/register/details`에서 쓰는 값(`입문/초급/중급/고급/비즈니스`, `TOPIK/회화/비즈니스/발음 교정/취미문화`)과 수정 화면의 하드코딩된 옵션(`입문/초급/중급/고급/전문가`, `말하기/비즈니스/TOPIK 대비/문화K-Pop`)이 서로 달라서, 저장된 값이 옵션 목록에 없으면 `<select>`가 조용히 첫 번째 옵션으로 표시됨 — 그 상태로 저장하면 실제 값이 잘못된 값으로 덮어써짐. `src/lib/lessonOptions.ts`로 공통 상수 추출해서 두 화면이 같은 목록을 쓰도록 수정.

### 실계정 오염 사고와 정리

검증 도중 테스트용으로 "아무 학생 계정"을 조회했는데, 그게 사용자의 **실제 계정**(dkpark55@gmail.com, 프로필명 "박대건")이었다. 확인해보니 이미 두 가지 경로로 오염되어 있었음:
1. 이전 세션 작업(정산/평점 히스토리 시딩)에서 "학생 역할 전체"를 대상으로 조회하는 바람에 실계정이 가짜 학생 풀에 포함돼 **가짜 리뷰 23건 + 가짜 수강기록(enrollments) 36건**이 붙어있었음.
2. 오늘 돌린 선생님 화면 자동 점검(fork agent)이 같은 브라우저의 공유 쿠키 세션 때문에 실계정으로 **찜하기 2건**을 생성.

사용자 확인 받고 전부 삭제, `enrollments`/`reviews`/`wishlists`/`chat_rooms`/`payments` 전 테이블에서 해당 계정 관련 row가 0건인 것까지 확인 완료. **교훈**: 앞으로 테스트 데이터를 만들거나 조회할 때는 반드시 이메일이 `vora-seed-*@mailinator.com` 패턴인 합성 계정으로만 필터링하고, "role=student 전체" 같은 광범위한 쿼리는 실계정을 오염시킬 수 있으므로 피한다.

## 보호 라우트 인증 가드 부재 (2026-08-11)

사용자가 "마이페이지가 로그인 없이 들어가진다"고 제보 — 실제로 `middleware.ts`는 세션 쿠키 갱신만 하고 어떤 경로도 로그인 여부로 막지 않고 있었다. `/student/*`, `/teacher/*`, `/notifications` 등 개인 데이터를 보여주는 모든 페이지가 로그인 없이도 URL로 직접 들어가지면(그냥 빈 상태/기본값으로 렌더) 그대로 열렸음.

**수정**: `middleware.ts`에 인증 가드 추가. `/`, `/login`, `/onboarding`, `/register`, `/signup`, `/support`, `/student/search`, `/teachers/[id]`, `/auth/callback`만 로그인 없이 접근 가능(공개 라우트)하고, 나머지는 세션이 없으면 `/login?next=<원래경로>`로 307 리다이렉트. `mailer_autoconfirm: true`(이메일 확인 없이 즉시 세션 발급)를 Supabase 설정에서 확인한 뒤 적용해서 회원가입 직후 리다이렉트가 깨지지 않는 것도 확인. `/login` 페이지는 `next` 쿼리 파라미터를 읽어 로그인 후 원래 가려던 페이지로 돌려보내도록 수정.

**검증**: 쿠키 없는 `curl`로 보호 라우트(`/student/profile`, `/teacher/home`, `/student/wishlist`, `/notifications`)가 전부 `/login?next=...`로 307 리다이렉트되는 것, 공개 라우트(`/`, `/student/search`, `/teachers/[id]`, `/support`, `/onboarding`)는 200으로 정상 응답하는 것 확인. 실제 회원가입 후에는 보호 라우트도 정상적으로 200 렌더되는 것까지 브라우저로 확인.

## `/` 루트 페이지 데스크톱 히어로 + How it works 섹션 (2026-08-11)

`preply.com/en/referral` 참고해서 `/` 페이지를 다시 구성. 풀블리드 그라디언트 히어로(데스크톱은 좌우 2단 — 헤드라인/CTA 왼쪽, 이미지 오른쪽, 모바일은 세로 스택)와 "이렇게 시작해요" 3단계 컬러 카드 섹션(선생님 찾기 → 무료체험 예약 → 학습 시작)을 추가. 가입자 수는 이전과 동일하게 `profiles` 실 카운트 사용. 브라우저로 데스크톱 폭 렌더링과 "시작하기" → `/onboarding` 이동까지 확인.

## `/onboarding` 가짜 페이징 수정 (2026-08-11)

온보딩 화면 하단에 3개짜리 점 인디케이터가 있어 3단계 캐러셀처럼 보였지만, 실제로는 슬라이드 1개만 있고 나머지 2개 점은 클릭 핸들러가 없는 장식이었으며 "다음" 버튼은 바로 `/signup`으로 점프했다. 실제 3단계 캐러셀로 재작성: 1) 1:1 라이브 수업, 2) 그룹 클래스, 3) 무료 체험. 점 클릭으로 임의 이동 가능, "다음"은 마지막 단계에서 "시작하기"로 바뀌며 그때만 `/signup`으로 이동. 브라우저로 각 단계 전환/점 클릭/최종 이동까지 확인.

## 치명적 버그 수정 — 로그인 세션 캐시가 죽은 계정을 계속 물고 있던 문제 (2026-08-11)

사용자가 "찜하기 처리가 실패한다"고 제보. 재현해보니 앱 전역에 영향을 주는 근본 버그였다.

**증상**: 계정이 삭제되거나 세션이 만료된 뒤에도 브라우저에 예전 사용자 정보가 로그인된 것처럼 계속 남아있고, 그 상태로 찜하기/예약/리뷰 등 `user.id`를 쓰는 모든 쓰기 작업이 FK 위반으로 조용히 실패함(`...처리에 실패했습니다` 토스트만 뜨고 원인 불명).

**원인**: `auth-store.ts`가 zustand `persist`로 `{user, isAuthenticated}`를 `localStorage`(`vora-auth`)에 저장하는데, 서버 렌더는 항상 `user: null`로 시작하고 클라이언트는 마운트 즉시 캐시된 값을 적용하면서 렌더 결과가 어긋나 **React 하이드레이션 에러**가 발생("전체 트리가 클라이언트 렌더링으로 전환"). 이 에러와 경합하면서, 캐시된 사용자를 실제 Supabase 세션과 대조해 정리하기로 되어 있던 `AuthHydrator`(`providers.tsx`)의 로직이 제때 실행되지 않아 죽은 세션이 영구적으로 남았다.

**수정**: `auth-store.ts`의 persist 옵션에 `skipHydration: true` 추가(서버/클라이언트 첫 렌더가 항상 동일하게 `null`로 시작 → 하이드레이션 에러 자체가 안 남). `AuthHydrator`는 마운트 시 `useAuthStore.persist.rehydrate()`를 명시적으로 호출한 뒤 실제 세션과 대조하고, 세션이 없으면 캐시된 값 유무와 무관하게 항상 `logout()`을 호출하도록 변경(기존엔 캐시 값이 있을 때만 정리해서, 하이드레이션 타이밍에 따라 정리 자체가 스킵될 수 있었음).

**검증**: 실제로 삭제된 계정의 세션이 캐시된 브라우저에서 재현 → 하이드레이션 에러 확인 → 수정 후 재로드 시 자동으로 로그아웃 상태로 정리되는 것 확인. 신규 계정으로 찜하기 실제 성공(DB row 생성 확인) → 계정 삭제 후 재로드해도 정상적으로 로그아웃 상태로 자가복구되는 것까지 확인.

## 실사용 데이터 시딩 + 프로필 실 연동 + Preply 1~3순위 (2026-08-11)

`/student/profile`, `/teacher/home`, `/teacher/profile`이 로그인 계정과 무관한 하드코딩 데이터를 보여주던 문제를 고치면서, 검색/추천이 텅 비어 보이지 않도록 현실적인 규모의 임시 데이터를 함께 채워 넣었다.

### 임시 데이터 시딩

- 학생 50명 + 선생님 100명을 Admin Auth API로 실제 계정 생성(`handle_new_user` 트리거로 `profiles` 자동 생성). 선생님은 `teacher_profiles` + 1~3개의 `teacher_lessons`(랜덤 유형/가격/카테고리)까지 채움.
- 선생님 100명 전원에 `teacher_availability`(주간 가능시간) 시딩 — 검색의 "가능한 시간대" 필터가 실제로 걸러낼 데이터가 있도록.
- 활성 선생님 73명에 과거 완료된 `lesson_sessions` + `enrollments`(249건 세션, 619건 수강) + `reviews`(414건, 카테고리 세부평점 포함) 시딩. `sync_teacher_rating` 트리거가 실제 리뷰로부터 `rating_avg`/`rating_count`를 재계산하므로, 리뷰가 없는 선생님은 평점도 0으로 남도록 별도 SQL로 정합성을 맞춤(초기 시딩 때 넣은 랜덤 평점이 트리거 미적용 선생님에게 유령처럼 남아있던 버그를 발견해 수정).
- `supabase/migrations/0008_review_category_ratings.sql` — `reviews`에 `kindness/clarity/improvement/preparation` 세부평점 컬럼 추가, `teacher_profiles`에 대응 평균 컬럼 추가, `sync_teacher_rating` 트리거 확장.

### 프로필 실 데이터 연동

- `/student/profile` — 실제 이름/한국어 레벨/예약·찜·리뷰 개수. `/student/profile/edit` 신설(이름/모국어/한국어 레벨 저장).
- `/teacher/home` — 실제 이름/이번 달 정산액/예정·완료 수업 수/평점/오늘의 일정(`lesson_sessions` 기준).
- `/teacher/profile` — 실제 이름/헤드라인/인증 배지/총 수익/게시된 수업 수/평점.

### Preply 1순위 — 검색 필터 실질화 + 무료체험 플로우

- `/student/search`: 정렬(추천순/평점순/가격낮은순/인기순), 가격 구간(2만 이하/2~4만/4만 이상), 가능한 시간대(오전/오후/저녁 — `teacher_availability` 실 데이터 기준) 필터 추가. 결과 수 상시 표시.
- 무료체험: `teachers/[id]`에 "무료 체험 가능" 배너(해당 선생님의 free_trial 레슨을 아직 안 쓴 경우만 표시), `/student/booking/confirm`의 수업 선택 칩에 "무료체험" 배지 + 이미 사용한 경우 비활성화. `hasUsedFreeTrial()`로 학생·선생님 조합별 1회 제한을 실제로 검증.

### Preply 2순위 — 사회적 증거 / 평점 세분화 / 캘린더 구조화

- `/student/search`, `/student/home` 카드에 "최근 30일 N회 예약" 뱃지(`enrollments.created_at` 기준 실 집계).
- `/teachers/[id]`에 "학생들의 평가" 섹션 추가 — 친절함/설명 명확성/실력 향상/수업 준비 4개 항목을 실제 리뷰 평균으로 표시(리뷰 0건인 선생님은 섹션 자체를 숨김).
- `/student/booking/confirm` 시간 슬롯을 오전/오후/저녁으로 그룹화. GMT+9 안내는 기존 유지.
- 메시지 CTA는 `/teachers/[id]`에 이미 예약 CTA와 나란히 있어 별도 작업 불필요.

### Preply 3순위 — 전역 채팅 미니패널 / 이탈 방지 문구

- `ChatFab.tsx` + `ChatLayer.tsx` 신설 — 알림 레이어와 동일한 슬라이드 패턴으로 모든 주요 화면 우하단에 채팅 버튼(안읽음 총합 뱃지) 추가, 클릭 시 채팅방 목록 미니패널이 뜬다. 채팅 목록/상세 페이지, 인증 전 화면(랜딩/온보딩/가입/로그인)에서는 숨김.
- 인증 배지("인증" 필/태그)는 이미 선생님 카드·프로필에 있어 별도 작업 불필요.
- `/student/search` 빈 결과 상태에 "필터 초기화하고 전체 선생님 보기" CTA 추가(이탈 방지).

### 부가 작업

- `/` 루트 페이지가 VORA 리브랜딩 이전의 영어 bkend.ai 목업 그대로였던 것을 한글/VORA 톤으로 재작성. 가입자 수도 실제 `profiles` 카운트로 표시.
- `/auth/callback` 라우트 신설(매직링크/OAuth 코드 교환) — 아직 OAuth 프로바이더 자체는 미설정.

검사일: 2026-06-01

## 확인 기준

- [x] 주요 라우트 HTTP 응답 확인: 모두 `200 OK`
- [x] `Link href="/..."` 또는 `router.push(...)`로 이동하는 항목은 동작으로 분류
- [x] `onClick`으로 화면 상태가 바뀌는 항목은 동작으로 분류
- [ ] `href="#"`, `onClick` 없음, submit/라우팅 없음인 버튼은 미구현으로 분류
- [ ] 실제 로그인, 결제, 파일 업로드, 알림 발송 같은 백엔드 연동은 코드상 더미 UI로 판단

## 라우트 열림 상태

- [x] `/`
- [x] `/onboarding`
- [x] `/signup`
- [x] `/register`
- [x] `/student/home`
- [x] `/student/booking`
- [x] `/student/search?date=13&time=14%3A00`
- [x] `/student/booking/confirm`
- [x] `/student/payment`
- [x] `/student/confirmation`
- [x] `/student/chat`
- [x] `/student/chat/1`
- [x] `/teachers/1`
- [x] `/student/wishlist`
- [x] `/student/reviews`
- [x] `/student/coupons`
- [x] `/student/payment-history`
- [x] `/notifications`
- [x] `/notification-settings`
- [x] `/support`
- [x] `/student/profile`
- [x] `/teacher/home`
- [x] `/teacher/lessons`
- [x] `/teacher/lessons/edit`
- [x] `/teacher/lessons/attendance`
- [x] `/teacher/register`
- [x] `/teacher/register/details`
- [x] `/teacher/register/confirm`
- [x] `/teacher/register/complete`
- [x] `/teacher/chat`
- [x] `/teacher/chat/1`
- [x] `/teacher/profile`
- [x] `/teacher/profile/edit`
- [x] `/teacher/profile/account`
- [x] `/teacher/profile/materials`
- [x] `/teacher/profile/reviews`
- [x] `/teacher/profile/withdraw`

## 동작하는 주요 흐름

- [x] 시작 화면: 시작하기 `/onboarding`
- [x] 시작 화면: 선생님 모드 `/teacher/home`
- [x] 시작 화면: 회원가입 `/register`
- [x] 온보딩: 다음 단계/홈 이동 링크
- [x] 회원가입 폼: 제출 시 `/teacher/home` 이동
- [x] 역할 전환 버튼: 학생/선생님 모드 라우팅
- [x] 학생 홈: 검색, 예약, 추천 선생님, 카테고리 링크 이동
- [x] 학생 하단 네비: 홈/검색/예약/채팅/마이 이동
- [x] 예약 시간 선택 `/student/booking`: 뒤로가기, 날짜 선택, 시간 선택, 수업 횟수 선택
- [x] 예약 시간 선택 `/student/booking`: 선생님 찾기 버튼으로 `/student/search?date=...&time=...` 이동
- [x] 맞춤 선생님 추천 `/student/search`: 뒤로가기, 필터 칩 선택, 찜하기 토글
- [x] 맞춤 선생님 추천 `/student/search`: 프로필 보기 `/teachers/[id]`
- [x] 맞춤 선생님 추천 `/student/search`: 예약하기 `/student/booking/confirm?teacher=[id]`
- [x] 예약 상세 `/student/booking/confirm`: 날짜 선택, 시간 선택, 확인 `/student/confirmation`, 결제 단계 `/student/payment`
- [x] 결제 `/student/payment`: 뒤로가기 `/student/booking/confirm`, 결제 완료 `/student/confirmation`
- [x] 예약 완료 `/student/confirmation`: 홈으로 이동, 내 예약 보기
- [x] 채팅 목록 `/student/chat`: 탭 전환, 채팅방 `/student/chat/1` 이동
- [x] 채팅방 `/student/chat/1`: 뒤로가기, 메시지 입력 후 전송 버튼으로 입력값 초기화
- [x] 선생님 채팅 목록/상세: 목록 이동 및 채팅방 이동
- [x] 선생님 홈 `/teacher/home`: 학생 모드 전환, 수업 관리 이동, 일부 탭 선택 상태 변경
- [x] 수업 관리 `/teacher/lessons`: 상세 모달 열기/닫기, 수정, 출석 관리 이동
- [x] 출석 관리 `/teacher/lessons/attendance`: 출석/지각/결석 상태 선택
- [x] 수업 등록 `/teacher/register`: 수업 유형 선택 후 다음 단계 이동
- [x] 수업 등록 상세 `/teacher/register/details`: 요일 선택, 시간대 선택, 확인 단계 이동
- [x] 수업 등록 확인 `/teacher/register/confirm`: 이전/수정/등록 완료 이동
- [x] 선생님 프로필 `/teacher/profile`: 학생 모드 전환, 출금 신청, 메뉴 이동
- [x] 선생님 리뷰 관리 `/teacher/profile/reviews`: 답변 모달 열기/닫기
- [x] 알림센터: 상단 알림 아이콘 레이어 팝업 슬라이드, `/notifications` 직접 접근, 이전/다음 이동, 알림 상세 라우팅, 모두 읽음 상태 변경

## 미구현 또는 의미 없는 버튼/링크

### 공통

- [ ] 일부 화면의 페이지 내부 알림/설정 아이콘은 이동 또는 상태 변경이 없음

### `/signup`

- [ ] 소셜 로그인 버튼 2개: 클릭 액션 없음
- [ ] 이용약관 링크: `href="#"`
- [ ] 개인정보처리방침 링크: `href="#"`
- [ ] 하단 네비 5개: 모두 `href="#"`

### `/student/home`

- [ ] 추천 선생님 카드의 찜하기 버튼: 클릭 액션 없음

### `/student/profile`

- [ ] 알림 버튼: 클릭 액션 없음
- [ ] 프로필 편집 버튼: 클릭 액션 없음
- [ ] 학습 리포트 메뉴: `href="#"`
- [ ] 공지사항 메뉴: `href="#"`
- [ ] 이벤트 메뉴: `href="#"`
- [ ] 계정 관리 메뉴: `href="#"`
- [ ] 로그아웃 메뉴: `href="#"`

### `/student/coupons`

- [ ] 알림 버튼: 클릭 액션 없음
- [ ] 쿠폰 등록 버튼: 클릭 액션 없음
- [ ] 쿠폰 적용하기 버튼: 클릭 액션 없음

### `/student/wishlist`

- [ ] 찜 해제 버튼: 클릭 액션 없음

### `/student/reviews`

- [ ] 알림 버튼: 클릭 액션 없음
- [ ] 리뷰 카드 더보기/옵션 버튼: 클릭 액션 없음
- [ ] Edit Review 버튼: 클릭 액션 없음
- [ ] 리뷰 작성 CTA 버튼: 클릭 액션 없음

### `/student/payment-history`

- [ ] 필터 버튼: 클릭 액션 없음

### `/notification-settings`

- [ ] 설정 토글들이 실제 저장 로직 없이 UI 상태만 있거나 정적일 수 있음

### `/support`

- [ ] FAQ 항목은 펼침/닫힘 상태 변경은 동작
- [ ] 문의하기/상담 연결 버튼: 클릭 액션 없음

### `/teachers/[id]`

- [ ] 공유 버튼: 클릭 액션 없음
- [ ] 찜하기 버튼: 클릭 액션 없음
- [ ] 소개 영상 재생 버튼: 클릭 액션 없음
- [ ] 달력 보기 버튼: 클릭 액션 없음
- [ ] 일부 시간 선택 버튼은 상태 변경만 있고 예약 확정은 별도 링크 필요

### `/student/booking/confirm`

- [ ] 이전 달/다음 달 버튼: 클릭 액션 없음
- [ ] 하단의 일부 자체 네비는 CSS로 숨겨질 수 있음

### `/student/payment`

- [ ] 찜하기 버튼: 클릭 액션 없음
- [ ] 결제 수단 선택 버튼: 클릭 액션 없음

### `/student/confirmation`

- [ ] 화면 중간의 primary 버튼: 클릭 액션 없음

### `/student/chat`

- [ ] 검색 버튼: 클릭 액션 없음
- [ ] 새 채팅 버튼: 클릭 액션 없음

### `/student/chat/1`

- [ ] 영상 통화 버튼: 클릭 액션 없음
- [ ] 통화 종료 버튼: 클릭 액션 없음
- [ ] 파일 카드 액션 버튼: 클릭 액션 없음
- [ ] 첨부 버튼: 클릭 액션 없음
- [ ] 이모지 버튼: 클릭 액션 없음

### `/teacher/chat`

- [ ] 검색 버튼: 클릭 액션 없음

### `/teacher/chat/1`

- [ ] 영상 통화 버튼: 클릭 액션 없음
- [ ] 더보기 버튼: 클릭 액션 없음
- [ ] 다운로드 버튼: 클릭 액션 없음
- [ ] 첨부 버튼: 클릭 액션 없음
- [ ] 전송 버튼: 클릭 액션 없음

### `/teacher/lessons`

- [ ] 필터 버튼: 클릭 액션 없음
- [ ] 새로고침 버튼: 클릭 액션 없음
- [ ] 모달의 수업 링크 버튼: 클릭 액션 없음
- [ ] 비활성 버튼은 의도적으로 disabled

### `/teacher/lessons/edit`

- [ ] 수업 삭제 버튼: `alert`만 실행
- [ ] 이미지 업로드 영역: 클릭 액션 없음
- [ ] 저장 버튼: 클릭 액션 없음

### `/teacher/lessons/attendance`

- [ ] 더보기 버튼: 클릭 액션 없음
- [ ] 이전/다음 일정 버튼: 클릭 액션 없음
- [ ] 저장 버튼: 클릭 액션 없음

### `/teacher/home`

- [ ] 오늘/주간 등 일부 기간 버튼: UI 상태 변경 여부 제한적
- [ ] 수업 상세 또는 추가 액션 버튼 일부 클릭 액션 없음

### `/teacher/register/details`

- [ ] 시간대 선택은 상태 변경 동작
- [ ] 커리큘럼/가격 등 입력값 저장은 실제 백엔드 연동 없음

### `/teacher/profile`

- [ ] 로그아웃 버튼: 클릭 액션 없음

### `/teacher/profile/edit`

- [ ] 프로필 사진 변경 버튼: 클릭 액션 없음
- [ ] 전문 분야/언어/태그 관련 버튼 일부는 클릭 액션 없음
- [ ] 저장하기는 링크 이동만 있고 실제 저장 로직 없음

### `/teacher/profile/account`

- [ ] 계좌 저장 버튼: 클릭 액션 없음

### `/teacher/profile/materials`

- [ ] 자료 업로드 버튼: 클릭 액션 없음
- [ ] 카테고리 탭은 상태 변경 동작
- [ ] 다운로드/삭제/더보기 버튼: 클릭 액션 없음
- [ ] 플랜 업그레이드 버튼: 클릭 액션 없음

### `/teacher/profile/reviews`

- [ ] 탭 전환은 상태 변경 동작
- [ ] 답변 수정 버튼: 클릭 액션 없음
- [ ] 더 보기 버튼: 클릭 액션 없음
- [ ] 답변 등록 버튼: 화면 닫힘/저장 로직 확인 필요

### `/teacher/profile/withdraw`

- [ ] 자세히 보기 버튼: 클릭 액션 없음
- [ ] 출금 신청하기 버튼: 클릭 액션 없음

## 우선 처리 추천

- [ ] `href="#"` 제거 또는 실제 라우트 연결
- [ ] 알림/찜하기/프로필 편집처럼 사용자가 반복해서 누를 아이콘 버튼에 최소 상태 변경 추가
- [ ] 결제/쿠폰/출금/계좌 저장 버튼은 “준비 중” 토스트라도 추가
- [ ] 채팅 첨부/영상통화/이모지 버튼은 disabled 처리 또는 모달 연결
- [ ] `signup` 하단 네비의 `href="#"`는 실제 학생 네비 라우트로 교체
- [ ] 저장/등록/신청 계열 버튼은 성공 상태 또는 다음 화면 이동을 명확히 연결

## Preply 벤치마킹 보완 항목 (2026-08-10 검토)

preply.com의 검색/선생님 프로필/예약/메시지 플로우를 실사용해 비교한 결과. 우선순위 순으로 정리.

### 1순위 — 효과 큼

- [ ] `/student/search` 필터 실질화: 가격 범위, 시간대별 가능 여부, 정렬(평점순/가격순/인기순) 추가. 현재는 칩 UI만 있고 실제 필터링 로직 없음.
- [ ] 무료 체험 레슨(1회) 개념을 예약 플로우에 도입. `/teachers/[id]` → `/student/booking/confirm`에서 "체험 25분 / 정규 50분" 선택 단계 추가하고, 잔여 무료 체험 횟수를 상시 노출.

### 2순위 — 중간

- [ ] 선생님 카드(`/student/search`, `/student/home`)에 "최근 N회 예약" 같은 실시간 사회적 증거 문구 추가.
- [ ] `/teachers/[id]` 프로필의 평점을 단일 점수 대신 항목별(친절함/설명 명확성/실력 향상/수업 준비 등)로 분해해서 표시.
- [ ] `/student/booking/confirm` 캘린더의 시간 슬롯을 오전/오후/저녁 그룹으로 구조화하고 타임존을 명시.
- [ ] 선생님 카드/프로필에 "Send message" 같은 채팅 바로가기 CTA를 예약 CTA와 나란히 배치.

### 3순위 — 선택

- [ ] 전역에서 열 수 있는 채팅 미니 패널(알림 레이어처럼 슬라이드) 도입. 현재는 `/student/chat` 페이지 진입이 유일한 접근 경로.
- [ ] "Professional Tutor" 같은 인증 배지, "Not a match? 무료 체험 N회 남음" 같은 이탈 방지 문구 추가.

## 뒤로가기 위치 + 레이아웃 깨짐 전수 점검 (2026-08-10)

37개 라우트 전체를 브라우저로 방문해 (1) 서브페이지 뒤로가기 버튼 위치, (2) 레이아웃 깨짐을 점검. 원인 하나가 8개 페이지에 동시에 영향을 준 것을 포함해 아래를 수정.

- [x] **근본 원인**: `src/app/globals.css`의 `header:not(.global-top-nav) { display: none !important; }` 규칙이 공통 `TopNavigation`(`global-top-nav`) 외의 모든 `<header>` 태그를 강제로 숨기고 있었음. 개별 페이지가 뒤로가기/닫기 버튼을 `<header>`로 감싼 8곳(`/teachers/[id]`, `/student/wishlist`, `/student/booking`, `/student/confirmation`, `/student/chat`, `/student/chat/[id]`, `/onboarding`, `/student/payment`)이 전부 뒤로가기·닫기 버튼을 잃었음(DOM엔 있지만 렌더링 0px). 8개 파일 모두 `<header>` → `<div>`로 교체해 해결(내용은 원래도 정상이었음). CSS 규칙 자체는 유지(현재 `<header>`는 `TopNavigation`뿐이라 안전).
- [x] `/teacher/register/details` — `sticky bottom-24` CTA가 스크롤 시 "종료 시간"/"수업 상세 설명" 입력창을 가리던 문제. CTA를 `fixed bottom-20`로 바꾸고 `<main>` 하단 여백을 `pb-28`→`pb-48`로 늘려 해결.
- [x] `/student/booking/confirm` — 뒤로가기 버튼이 아예 구현되어 있지 않던 것 발견, 추가. 동시에 "결제 단계로 계속하기" CTA가 마지막 시간 슬롯 행을 가리던 문제도 `pb-56`→`pb-64`로 여백을 늘려 해결.
- [x] `/student/chat/[id]` — 메시지 입력창이 `fixed`가 아니라 일반 flex 흐름의 마지막 요소였던 탓에 뷰포트 하단(고정 하단 네비 뒤)에 실제로 깔려 렌더링됨(`top: 1047px`, 뷰포트 1049px로 실측). 이미 정상 동작하던 `/teacher/chat/[id]`의 `fixed bottom-20` 패턴과 동일하게 맞춰 해결.
- [x] `/` (사이트 루트) — 점검 대상 37개 라우트 목록에서 빠져 있었는데 직접 확인해보니 VORA 리브랜딩 이전의 영어 bkend.ai 목업 화면이 그대로 남아있었고, "Register" 버튼이 죽은 `/register`(구버전 영어 회원가입 폼, `/signup`으로 대체됨) 링크였음. 링크만 `/signup`으로 수정. **`/` 페이지 전체를 VORA 브랜딩(한글, 그라디언트 톤)으로 다시 만드는 건 범위 밖 — 별도 작업으로 필요.**
- [x] `/signup` 소셜 로그인 버튼 — 좁은 화면에서 "Google로 계속하기"/"Apple로 계속하기" 텍스트가 단어 중간에서 줄바꿈되던 것을 `whitespace-nowrap` + 여백 축소로 해결.

### 확인했지만 손대지 않은 것

- `/login` 페이지의 Chrome 자동완성이 실제 개인 계정 정보를 채워 넣는 현상 재확인됨 — 코드 버그 아님, 이 폼으로 테스트/시연 시 계속 주의.
- `/student/profile`, `/teacher/home`, `/teacher/profile`이 로그인 계정과 무관한 하드코딩된 이름/통계를 보여줌 — 레이아웃은 안 깨지지만 실사용자 기준 "내 정보 아님"으로 보일 수 있음. 버튼 재점검 때 이미 알려진 하드코딩 잔재와 겹치는 부분이라 별도 후속 작업으로 남김.

## 미구현 버튼 재점검 및 수정 (2026-08-10)

`## 미구현 또는 의미 없는 버튼/링크` 섹션은 6월 초 작성분이라 이후 Supabase 백엔드 배선(검색/예약/채팅·알림/정산·자료) 과정에서 실제로는 고쳐진 항목이 많았음. 현재 코드 기준으로 전수 재점검한 뒤, 실제로 남아있던 가짜 버튼/하드코딩 페이지를 이번 라운드에서 실 데이터로 전환했다.

### 이번에 실 데이터로 전환 완료

- [x] `/teacher/lessons` — `LESSONS` 하드코딩 배열 제거, `lesson_sessions` 실 데이터로 전환. 선생님이 실제로 들어온 예약을 볼 수 있게 됨(이전에는 학생이 예약해도 이 화면엔 안 보였음). 새로고침 버튼도 실제 재조회로 연결.
- [x] `/teacher/register` 전체 플로우(종류 선택 → 상세정보 → 확인 → 완료) — `useLessonDraftStore`(zustand, 비영속)로 3단계 간 입력값을 유지하도록 재작성. 최종 등록 시 `teacher_lessons` + `lesson_sessions`를 실제로 insert함(이전에는 폼에 `onChange`조차 없어 어떤 값을 입력해도 저장되지 않았음).
- [x] `/teacher/lessons/edit` — `?id=` 쿼리로 대상 수업을 불러와 저장/삭제를 `teacher_lessons` 실 UPDATE/DELETE로 연결. 스키마에 없는 "썸네일 업로드", "날짜/시간 자유 입력" 필드는 저장되지 않는 채로 남겨두는 대신 제거함.
- [x] `/teacher/lessons/attendance` — `?session=` 쿼리로 실제 세션 목록/roster를 불러오고, 저장을 `attendance_records` upsert로 연결. "참여율" 카드도 `attendance_records` 실 집계로 계산.
- [x] `/teacher/profile/edit` — 이름/전문분야/자기소개 저장을 `profiles`/`teacher_profiles` 실 UPDATE로 연결. 스키마에 없는 "가능 언어", 프로필 사진 업로드(Storage 버킷 없음)는 제거함.
- [x] `/student/wishlist` — `INITIAL_TEACHERS` 하드코딩 제거, `listWishlistedTeachers`/`removeWishlist` 실 데이터로 전환.
- [x] `/student/reviews` — `INITIAL_WRITTEN`/`INITIAL_PENDING` 하드코딩 제거, `reviews` 테이블 실 CRUD(작성/수정, 완료된 예약 기준 작성 대기 목록)로 전환.
- [x] `/teacher/profile/reviews` — 답변 등록/수정을 `reviews.teacher_reply` 실 UPDATE로 연결.
- [x] `/student/payment` 찜하기 버튼 — 로컬 `useState`만 바꾸던 것을 `addWishlist`/`removeWishlist` 실 호출로 통일(`/teachers/[id]`와 동일 패턴).
- [x] `/student/coupons`, `/student/payment` 쿠폰 — `user_coupons`/`coupons` 실 데이터로 전환(코드 등록, 보유 쿠폰 목록, 결제 시 쿠폰 선택 및 할인 반영). **단, `supabase/migrations/0007_user_coupons_self_register.sql`(본인 발급용 INSERT 정책 추가)을 아직 운영 프로젝트에 적용하지 못함 — Management API 토큰이 이번 세션에 없어서 로컬 마이그레이션 파일만 작성된 상태. 적용 전까지는 쿠폰 등록이 RLS에 막혀 실패한다.**

### 그대로 두기로 한 것 (외부 인프라 필요 / 의도된 placeholder)

- `/signup` 소셜 로그인, 이용약관/개인정보처리방침 — OAuth 앱 등록 및 약관 콘텐츠 필요(기존에 이미 파악된 gap).
- `/student/chat/[id]`, `/teacher/chat/[id]` 영상통화, 파일 첨부 — 실시간 영상/파일 업로드 인프라 없음.
- `/teachers/[id]` 소개 영상 재생 — 영상 호스팅 없음.
- `/notification-settings` 토글 저장 — 저장할 테이블이 스키마에 없음(낮은 우선순위).
- `/support` 상담 연결 — 실제 상담 채널 없음(의도된 placeholder).
- `/teacher/lessons` "수업 링크"(Google Meet 모달) — 실제 화상회의 연동 없음, 복사 UX만 유지.

### 검증

브라우저로 신규 테스트 계정(`레슨테스트`)을 만들어 실제 취약 지점 두 곳을 확인했다.

- `0007_user_coupons_self_register.sql`을 운영 프로젝트에 적용 완료. 적용 전엔 쿠폰 등록이 RLS에 막혀 실패했고, 적용 후 실제로 코드 등록 → 보유 쿠폰 목록 표시까지 정상 동작 확인.
- `/teacher/register` 플로우 검증 중 별도 버그를 발견해 함께 고침: "선생님 모드"는 클라이언트 전용 상태 전환이라 `teacher_profiles` 행이 실제로 생성되는 지점이 어디에도 없었다. `teacher_lessons.teacher_id`가 `teacher_profiles(profile_id)`를 참조하므로, 신규 가입자가 바로 수업을 등록하면 FK 위반으로 실패했을 것. `createTeacherLessonWithSession`(`src/lib/queries/teacherLessons.ts`)에서 수업 등록 직전에 `teacher_profiles`를 upsert하도록 수정해 해결. 실제로 신규 계정으로 1:1 수업을 등록 → `teacher_lessons`/`lesson_sessions`에 정상 insert → `/teacher/lessons`에 실제 데이터로 표시되는 것까지 확인.

## 전수 테스트(학생 화면 + 크로스커팅) 및 버그 수정 (2026-08-11)

`전수 테스트 해서 버그 찾아` 요청으로 두 개의 병렬 조사(학생 화면 전수 감사, 크로스커팅 감사)를 진행해 발견한 문제를 수정.

### 근본 원인 하나가 20개 화면에 동시에 영향 — 인증 하이드레이션 레이스

- [x] **근본 원인**: `src/stores/auth-store.ts`(zustand `persist`, `skipHydration: true`)는 하드 새로고침 시 `user`가 `null`로 시작하고, `AuthHydrator`(`src/app/providers.tsx`)가 비동기로 localStorage 복원 + 실제 세션 대조를 마쳐야 `user`가 채워진다. 그런데 각 화면의 데이터 조회 `useEffect`가 `if (!user) { setLoading(false); return; }` 패턴으로 되어 있어, 하이드레이션이 끝나기 전에 먼저 실행되며 "로그인 안 됨" 상태로 굳어버렸다(실제로는 로그인되어 있고 데이터도 있는데 빈 화면). `/student/wishlist`가 항상 빈 화면으로 뜨고 `/student/chat` 목록이 하드 새로고침 시 비어 보이던 것(ChatFab을 건드리면 정상화됨)이 모두 이 문제였다.
- [x] **수정**: 스토어에 `isHydrated`(기본 `false`, `AuthHydrator`가 대조를 끝내면 `true`) 필드를 추가하고, 아래 20개 파일의 데이터 조회 effect에 `if (!isHydrated) return;` 가드를 `!user` 체크보다 먼저 추가(의존성 배열에도 `isHydrated` 추가) — `/student/wishlist`, `/student/chat`, `/student/chat/[id]`, `/teacher/chat`, `/teacher/chat/[id]`, `/student/profile`, `/student/profile/edit`, `/teacher/home`, `/teacher/profile`, `/teacher/profile/edit`, `/teacher/profile/reviews`, `/teacher/profile/materials`, `/teacher/profile/withdraw`, `/teacher/profile/account`, `/student/coupons`, `/student/reviews`, `/teacher/lessons`, `/teacher/lessons/attendance`, `/student/bookings`, `NotificationLayer.tsx`. `/student/payment-history`도 같은 패턴으로 새로 작성(아래 참고).

### 학생 화면 전수 감사에서 발견/수정

- [x] `/student/payment-history` — 완전히 하드코딩된 가짜 결제 내역 3건을 보여주고 있었음(실 데이터 연결 자체가 안 됨). `lib/queries/bookings.ts`에 `listPaymentHistory()` 추가해 `payments` 테이블(+연결된 `enrollments`→`lesson_sessions.title`)로 전환.
- [x] `/student/chat/[id]`, `/teacher/chat/[id]` 자동 스크롤 — `scrollIntoView({ behavior: 'smooth' })`가 `block` 기본값(`'start'`)이라 마지막 메시지가 뷰포트 "위"로 스크롤되어 하단 고정 입력창에 가려지기 전에 이미 화면 밖으로 나가던 문제. `block: 'end'`로 수정.
- [x] `/teachers/[id]` "학생들의 평가" 섹션이 하단 고정 CTA(`예약하기`) 바에 가려지는 문제 — 실측(브라우저 스크린샷)으로 재현: 히어로 이미지가 `aspect-[9/12]`(약 597px)로 지나치게 커서 리뷰 섹션이 스크롤 없이도 이미 CTA 바 영역과 겹치는 위치에 렌더링됨. 히어로를 `h-80`(고정 320px)로 축소해 해결(사진이 아니라 이니셜+그라디언트 배경이라 실제 사진 비율 유지 필요 없음). 스크린샷으로 수정 전/후 확인.
- [x] `/student/home` 찜하기(♥) 아이콘 — 두 가지 문제가 겹쳐 있었음: (1) 하트 `<button>`이 카드 전체를 감싸는 `<Link>` **안에 중첩**되어 있어(`<a><button/></a>`, 잘못된 HTML) 브라우저가 DOM을 임의로 정리하면서 클릭이 엉뚱한 곳(프로필 아이콘 등)으로 튀거나 씹히는 문제 — `Link`를 `display: contents`로 바꾸고 버튼을 형제 요소로 분리해 해결. (2) DB 반영은 되어도(REST 요청/`aria-pressed`/computed style 모두 정상 확인) 흰 배경 위 흰 하트 아이콘이라 outline↔filled 차이가 육안으로 거의 안 보이던 문제 — 찜 상태일 때 배경을 `bg-white`, 아이콘 색을 `text-secondary`로 바꿔 명확한 색 대비를 주도록 수정. 실제 브라우저 조작 + REST API/DB 조회로 add/remove 왕복 모두 검증.
- [x] `/login`의 `next` 쿼리 파라미터 — `next.startsWith('/')`만으로는 `//evil.com` 형태의 프로토콜 상대 오픈 리다이렉트를 막지 못함. `&& !next.startsWith('//')` 추가.

### 검증

- `npx tsc --noEmit` 통과.
- `/teachers/[id]`, `/student/home`, `/student/wishlist`를 실제 테스트 계정(가입 즉시 삭제한 1회용 계정)으로 브라우저에서 직접 조작해 스크린샷/네트워크 요청/DB 조회로 확인. 테스트 계정과 테스트 찜 데이터는 검증 후 모두 삭제함.

## 정적 코드 감사 후속 수정 (2026-08-12)

`숙련된 테스터로 더 보완할게 없는지 확인` 요청으로 코드 리뷰 전용 감사(브라우저 미사용, 다른 회귀 점검 에이전트가 공유 브라우저 세션을 쓰고 있어 충돌 방지)를 진행해 발견한 문제를 수정.

- [x] **[CRITICAL] 학생 하단 네비 "예약" 탭이 완전히 가짜인 죽은 화면으로 연결됨.** `/student/booking`(단수)은 `DATES`/`TIME_GROUPS`/`DURATIONS`가 전부 하드코딩된 목업이었고, 유일한 액션 버튼이 `/student/search?date=X&time=Y`로 이동하지만 `/student/search`는 그 쿼리 파라미터를 아예 읽지 않아(grep 확인, 0 matches) 선택이 그냥 버려졌다. 반면 실제 예약 내역(`listMyEnrollments` 실 데이터, 이미 `isHydrated` 가드 적용됨)을 보여주는 `/student/bookings`(복수)는 결제 완료 직후 1회성 링크로만 도달 가능했고 하단 네비/프로필 어디에도 연결되어 있지 않았다. 즉 학생이 "예약" 탭을 누르면 항상 가짜 화면을 만나고, 진짜 내 예약 목록은 사실상 찾을 수 없었음.
  - **수정**: `/student/booking`(단수, 가짜)을 가리키던 4곳 — `BottomNavigation.tsx`, `NotificationLayer.tsx`(필수 알림 슬라이드 2곳), `(auth)/signup/page.tsx`(하단 네비 미리보기), `student/profile/page.tsx`("내 예약" 통계 카드) — 를 전부 `/student/bookings`(복수, 실 데이터)로 변경. `src/app/(main)/student/booking/page.tsx`(가짜 목업, 자체 중복 하단 네비까지 포함해 designRule.skill 위반이기도 했음) 삭제. `/student/booking/confirm`(실제 예약 확정 플로우, 정상 동작)은 그대로 유지. `designRule.skill`의 학생 하단 네비 표에서도 `/student/booking` → `/student/bookings`로 정정.
- [x] `/student/payment` — 다른 20개 화면과 같은 인증 하이드레이션 레이스 패턴이 이번 전수 수정 때 누락되어 있었음(`if (!enrollmentId || !user)`에 `isHydrated` 가드 없음). 하드 새로고침 시 실제로 로그인/결제 대상이 있어도 "결제할 예약 정보를 찾을 수 없습니다"로 잘못 뜰 수 있었음. 동일 패턴으로 수정.
- [x] **[MEDIUM] 출금 신청 금액에 서버 측 잔액 검증이 없었음.** `src/lib/queries/settlement.ts`의 `requestWithdrawal`이 클라이언트가 계산한 `amount`를 그대로 insert — UI는 항상 실제 `availableBalance`를 보내지만, RLS 정책(`withdrawal_insert_own`)은 `teacher_id` 소유만 검사할 뿐 금액을 검증하지 않아 REST API 직접 호출이나 stale 클라이언트 상태로 잔액을 초과하는 출금 신청이 가능했다. `supabase/migrations/0009_withdrawal_balance_check.sql` 작성 — `withdrawal_requests` insert 전 트리거로 (지급완료 정산 합계 − 거절되지 않은 기존 출금 합계)를 서버에서 재계산해 초과 시 예외를 던지고, `amount <= 0`도 함께 막는다.
  - **⚠️ 미적용**: 이번 세션엔 Supabase Management API PAT/직접 Postgres 연결이 없어서 이 마이그레이션을 운영 프로젝트에 실행하지 못했다(0007 때와 동일한 제약). 마이그레이션 파일만 로컬에 존재 — **Supabase 대시보드 SQL Editor에서 `0009_withdrawal_balance_check.sql`을 직접 실행해야 실제로 적용된다.** 적용 전까지는 위 취약점이 여전히 열려 있음.

### 발견했지만 이번 라운드에서 손대지 않은 것 (후속 작업 필요)

- **[MEDIUM]** "수업 10분 전" 알림(필수 알림 5종 중 하나, CLAUDE.md 로드맵엔 "완료"로 표기됨)이 실제로는 어디에도 구현되어 있지 않음 — 채팅/예약확정/결제완료/정산 4종은 DB 트리거로 정상 구현되어 있으나(`0004_realtime_and_notifications.sql`, `0005_settlement_batch.sql`), 수업 시작 임박을 감지해 알림을 쏘는 cron/Edge Function이 없다. `pg_cron` 기반 배치 작업 신규 설계가 필요해 별도 작업으로 남김.
- **[MEDIUM]** `/student/booking/confirm`의 날짜/시간 선택 UI가 완전히 장식용 — `teacher_availability`(선생님이 실제로 등록한 가능 시간)와 무관하게 아무 시간이나 선택 가능하고, `createBookingDraft`는 정확히 같은 타임스탬프의 기존 세션과만 중복을 걸러낼 뿐 선생님의 가능 시간 자체를 검증하지 않음.
- 정적 감사가 시간 예산 안에서 `/teacher/register` 전체 플로우 내부, `/teacher/lessons/edit`, `/teacher/lessons/attendance`, `/teacher/profile/materials`, `/teacher/profile/account`, `designRule.skill` 체크리스트 대입 점검까지는 도달하지 못함 — 필요하면 후속 라운드로.
- 별도로 실행한 회귀 점검(오늘 변경분이 실제로 깨진 곳 없는지 브라우저로 재확인)은 세션 사용량 한도로 중간에 중단됨(앱 자체 문제 아님) — 재확인 필요하면 다시 실행.

### 검증

`npx tsc --noEmit` 통과(삭제된 라우트의 stale `.next` 생성 타입 캐시는 수동 정리).
- 테스트 계정/쿠폰/수업 데이터는 모두 삭제 완료.
