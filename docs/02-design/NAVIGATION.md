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
  └─ 로그인 성공        → /home (또는 /dashboard)

/register — 기존 구현
  └─ 가입 완료          → /profile-setup

/profile-setup
  └─ 프로필 저장        → /home

/home (메인 홈)
  ├─ 검색 탭        → /search
  ├─ 마이 탭        → /profile-setup
  └─ 검색 버튼      → /search (미연결)

/search (선생님 찾기)
  └─ 프로필 보기        → /teachers/[id]

/teachers/[id] (선생님 상세)
  ├─ 즐겨찾기 토글      → (로컬 state)
  ├─ 날짜 선택          → (로컬 state)
  └─ 예약하기           → /booking

/booking (수업 시간 선택)
  ├─ 날짜 선택          → (로컬 state)
  ├─ 시간 슬롯 선택     → (로컬 state)
  ├─ 수업 횟수 선택     → (로컬 state)
  └─ 선생님 찾기        → /booking/results

/booking/results (맞춤 선생님 추천)
  ├─ 필터 칩 선택       → (로컬 state)
  ├─ 즐겨찾기 토글      → (로컬 state)
  └─ 프로필 보기        → /teachers/[id]

/payment (결제)
  ├─ 결제 수단 선택     → (로컬 state)
  └─ 결제하기           → /confirmation

/confirmation (결제 완료)
  ├─ 닫기              → /home
  ├─ 수업 링크 확인     → (미연결)
  └─ 내 예약 보기       → /my-bookings

/my-bookings (내 예약 목록)
  ├─ 예정된 수업 탭     → (로컬 state)
  ├─ 지난 수업 탭       → (로컬 state)
  ├─ 예약 변경          → (미연결)
  ├─ 강의실 입장        → (미연결)
  ├─ 예약 취소          → (미연결)
  ├─ 리뷰 작성          → (미연결)
  └─ 다시 예약          → /booking
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
| 프로필 설정 | `/profile-setup` | ✅ |
| 홈 | `/home` | ✅ |
| 선생님 찾기 | `/search` | ✅ |
| 선생님 상세 | `/teachers/[id]` | ✅ |
| 수업 시간 선택 | `/booking` | ✅ |
| 맞춤 선생님 추천 | `/booking/results` | ✅ |
| 결제 | `/payment` | ✅ |
| 결제 완료 | `/confirmation` | ✅ |
| 내 예약 목록 | `/my-bookings` | ✅ |
| 대시보드 | `/dashboard` | ✅ (기존) |
