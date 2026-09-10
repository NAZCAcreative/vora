# Navigation Flow

## 페이지 이동 흐름

```
/ (시작화면)
  ├─ 시작하기  → /onboarding
  ├─ 로그인    → /login
  └─ 회원가입  → /signup

/onboarding (슬라이드 1/3)
  ├─ 건너뛰기  → /signup
  └─ 다음      → /onboarding/2  (미구현 → 임시 /signup)

/onboarding/2 (슬라이드 2/3) — 미구현
  ├─ 건너뛰기  → /signup
  └─ 다음      → /onboarding/3

/onboarding/3 (슬라이드 3/3) — 미구현
  ├─ 건너뛰기  → /signup
  └─ 시작하기  → /signup

/signup
  ├─ Google로 계속하기  → (OAuth)
  ├─ Apple로 계속하기   → (OAuth)
  ├─ 시작하기           → /register
  └─ 로그인             → /login

/login — 기존 구현
  └─ 로그인 성공        → /student/home (또는 /dashboard)

/register — 기존 구현
  └─ 가입 완료          → /student/profile

/student/profile
  └─ 프로필 저장        → /student/home

/student/home (메인 홈)
  ├─ 검색 탭        → /student/search
  ├─ 마이 탭        → /student/profile
  └─ 검색 버튼      → /student/search (미연결)

/student/search (선생님 찾기)
  └─ 프로필 보기        → /teachers/[id]

/teachers/[id] (선생님 상세)
  ├─ 즐겨찾기 토글      → (로컬 state)
  ├─ 날짜 선택          → (로컬 state)
  └─ 예약하기           → /student/booking/confirm

/student/booking/confirm (수업 시간 선택)
  ├─ 날짜 선택          → (로컬 state)
  ├─ 시간 슬롯 선택     → (로컬 state)
  ├─ 수업 횟수 선택     → (로컬 state)
  └─ 선생님 찾기        → /student/booking/confirm/results

/student/booking/confirm/results (맞춤 선생님 추천)
  ├─ 필터 칩 선택       → (로컬 state)
  ├─ 즐겨찾기 토글      → (로컬 state)
  └─ 프로필 보기        → /teachers/[id]

/student/payment (결제)
  ├─ 결제 수단 선택     → (로컬 state)
  └─ 결제하기           → /student/confirmation

/student/confirmation (결제 완료)
  ├─ 닫기              → /student/home
  ├─ 수업 링크 확인     → (준비 중 토스트)
  └─ 내 예약 보기       → /student/bookings

/student/bookings (내 예약 목록 — Supabase enrollments 실 데이터)

/student/booking (예약 시간 선택 — 새 예약 시작 지점, 목록 아님)
  ├─ 예정된 수업 탭     → (로컬 state)
  ├─ 지난 수업 탭       → (로컬 state)
  ├─ 예약 변경          → (미연결)
  ├─ 강의실 입장        → (미연결)
  ├─ 예약 취소          → (미연결)
  ├─ 리뷰 작성          → (미연결)
  └─ 다시 예약          → /student/booking/confirm
```

## 구현 현황

| 페이지 | 경로 | 상태 |
|--------|------|------|
| 시작화면 | `/` | ✅ |
| 온보딩 1 | `/onboarding` | ✅ |
| 온보딩 2 | `/onboarding/2` | ⬜ 미구현 |
| 온보딩 3 | `/onboarding/3` | ⬜ 미구현 |
| 회원가입 진입 | `/signup` | ✅ |
| 회원가입 폼 | `/register` | ✅ (기존) |
| 로그인 | `/login` | ✅ (기존) |
| 프로필 설정 | `/student/profile` | ✅ |
| 홈 | `/student/home` | ✅ |
| 선생님 찾기 | `/student/search` | ✅ |
| 선생님 상세 | `/teachers/[id]` | ✅ |
| 수업 시간 선택 | `/student/booking/confirm` | ✅ |
| 맞춤 선생님 추천 | `/student/booking/confirm/results` | ✅ |
| 결제 | `/student/payment` | ✅ |
| 결제 완료 | `/student/confirmation` | ✅ |
| 내 예약 목록 | `/student/booking` | ✅ |
| 대시보드 | `/dashboard` | ✅ (기존) |
