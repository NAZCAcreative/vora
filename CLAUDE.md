# VORA (KoreaLingoBridge)

외국인을 위한 한국어 튜터 예약/매칭 플랫폼 (Korean tutor booking & matching marketplace for foreigners)

## Project Level

**Dynamic** — Next.js 14 + Supabase (Postgres + Auth + Realtime + Storage) + Google Stitch MCP

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **State**: Zustand (auth), TanStack Query (server state)
- **Backend**: Supabase — Postgres(RLS) + Auth + Realtime + Storage + Edge Functions
- **MCP**: Google Stitch (`stitch` server in `.mcp.json`)
- **Validation**: Zod + react-hook-form
- **Deployment**: Vercel

## Domain Concepts

VORA는 강의 콘텐츠형 LMS가 아니라 **선생님-학생 예약/매칭 마켓플레이스**다. 그룹 강의가 기본 상품이고 1:1 레슨도 지원한다.

| Term | Description |
|------|-------------|
| TeacherProfile (선생님 프로필) | 선생님 공개 프로필(소개, 경력, 전문분야, 평점) |
| TeacherLesson (수업 상품) | 선생님이 등록하는 수업 유형(그룹 기본 / 1:1 / 무료체험), 가격, 정원 |
| LessonSession (수업 회차) | 실제 예약 가능한 특정 일시의 수업 1회 |
| Enrollment (예약) | 학생이 특정 `LessonSession`에 참여 신청한 레코드 |
| AttendanceRecord (출석) | 예약 건별 출석/지각/결석 상태 |
| Payment / Coupon | 결제 트랜잭션과 쿠폰 |
| Review | 수업 후기 + 선생님 답변 |
| ChatRoom / ChatMessage | 선생님-학생 1:1 채팅 |
| Notification | 수업 임박/예약 상태/채팅/결제/정산 알림 |
| Settlement / WithdrawalRequest | 선생님 정산 및 출금 |
| LanguageLevel | beginner / elementary / intermediate / advanced / topik1 / topik2 |

전체 스키마: `supabase/migrations/0001_init.sql`. TypeScript 타입: `src/types/index.ts`.

## Folder Structure

```
src/
├── app/
│   ├── (auth)/          # signup, register
│   └── (main)/
│       ├── student/     # home, search, booking, booking/confirm, payment, confirmation, chat, profile, ...
│       ├── teacher/     # home, lessons(+edit,+attendance), register(+details,+confirm,+complete), chat, profile(+edit,+account,+materials,+reviews,+withdraw)
│       ├── teachers/[id]      # 공용 — 선생님 공개 프로필
│       ├── notifications, notification-settings, support   # 공용
├── components/
│   ├── shared/          # TopNavigation, BottomNavigation, NotificationLayer, Toast
│   └── features/        # auth (RegisterForm, RoleSwitcher)
├── hooks/               # useAuth
├── lib/
│   ├── supabase/        # client.ts(브라우저), server.ts(RSC/Route Handler)
│   └── utils.ts
├── stores/
│   └── auth-store.ts    # Zustand auth store (Supabase Auth 연동, persisted)
└── types/
    └── index.ts         # 예약/매칭 도메인 타입 (스키마와 1:1 대응)

supabase/
└── migrations/          # SQL 마이그레이션 (0001_init.sql: 전체 스키마 + RLS)
```

## Key Env Vars

`.env.local.example` 참고. `.env.local`은 git에 커밋하지 않는다.

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...   # 서버 전용 (Edge Function/정산 배치)
```

## PDCA Status

프론트엔드 화면(학생/선생님 전 플로우) + Supabase 백엔드 연동 로드맵 7단계 전부 완료(스키마+인증 → 검색 → 예약 → 채팅/알림 → 정산/자료). 브라우저로 전 흐름 검증 및 테스트 데이터 정리 완료. 작업 상세 기록은 `docs/03-build/backend-migration-log.md` 참고.

남은 과제: `/auth/callback` 라우트(매직링크/OAuth 미배선), `/signup`의 Google/Apple 소셜 로그인(외부 OAuth 앱 등록 필요, 사용자 액션 대기), 고아 페이지 `.attic/` 정리(삭제 명령이 자동 모드 분류기에 막혀 이동만 해둔 상태, 사용자가 직접 `git rm` 필요).

## Mandatory Design Rule

Before any UI, layout, responsive, navigation, modal, button, form, notification, booking, chat, lesson-management, attendance, settlement, or profile design work, read and follow `designRule.skill` in the repository root. Treat it as the project-level design skill and keep new screens consistent with those rules.

## 백엔드 연동 로드맵 (순서)

1. `auth` — 회원가입/로그인/역할전환을 Supabase Auth로 연결 (완료)
2. `teacher-search` — 선생님 검색/프로필/찜하기를 `teacher_profiles`/`wishlists` 실 데이터로 연결
3. `booking` — 예약 플로우(`teacher_availability` → `lesson_sessions` → `enrollments` → `payments`), 이중예약 방지
4. `chat` — Supabase Realtime으로 `chat_messages` 실시간화
5. `notifications` — 필수 알림 5종 서버 트리거
6. `settlement` — 주간 정산 배치(Edge Function + `pg_cron`), 결제 웹훅
7. `materials` — 선생님 수업자료를 Storage 버킷에 연결
