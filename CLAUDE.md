# KoreaLingoBridge

외국인을 위한 한국어 교육 플랫폼 (Korean Language Education Platform for Foreigners)

## Project Level

**Dynamic** — Next.js 14 + bkend.ai BaaS + Google Stitch MCP

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **State**: Zustand (auth), TanStack Query (server state)
- **Backend**: bkend.ai REST API
- **MCP**: Google Stitch (`stitch` server in `.mcp.json`)
- **Validation**: Zod + react-hook-form
- **Deployment**: Vercel

## Domain Concepts

| Term | Description |
|------|-------------|
| Course (강좌) | A collection of lessons on a topic |
| Lesson (수업) | Single learning unit (video, reading, quiz) |
| VocabWord (어휘) | Korean word with multilingual translations |
| UserProgress (진도) | Per-user course completion tracking |
| Post (게시글) | Community Q&A / sharing post |
| LanguageLevel | beginner / elementary / intermediate / advanced / topik1 / topik2 |

## Folder Structure

```
src/
├── app/
│   ├── (auth)/          # login, register, find-password
│   ├── (main)/          # dashboard, courses, vocabulary, grammar, community, profile
│   └── api/             # Next.js Route Handlers (proxy/edge logic if needed)
├── components/
│   ├── ui/              # Button, Input, Card, Badge, Modal, ...
│   ├── features/        # auth, courses, lessons, vocabulary, community, progress
│   ├── layout/          # Header, Sidebar, Footer, MobileNav
│   └── shared/          # ProtectedRoute, LanguageSelector, LevelBadge
├── hooks/               # useAuth, useCourses, useLessons, useVocabulary, ...
├── lib/
│   ├── api.ts           # bkend.ai REST client
│   └── utils.ts         # cn(), formatDate(), getInitials()
├── stores/
│   └── auth-store.ts    # Zustand auth store (persisted)
└── types/
    └── index.ts         # All TypeScript interfaces
```

## Key Env Vars

```
NEXT_PUBLIC_BKEND_API_URL=https://api.bkend.ai/v1
NEXT_PUBLIC_BKEND_PROJECT_ID=<from bkend console>
NEXT_PUBLIC_BKEND_ENV=dev
```

## PDCA Status

Project initialized. No features started yet.
Next: `/pdca plan <feature-name>`

## Mandatory Design Rule

Before any UI, layout, responsive, navigation, modal, button, form, notification, booking, chat, lesson-management, attendance, settlement, or profile design work, read and follow `designRule.skill` in the repository root. Treat it as the project-level design skill and keep new screens consistent with those rules.

## Feature Roadmap (순서)

1. `user-auth` — 회원가입 / 로그인 / 프로필
2. `course-list` — 강좌 목록 / 상세 / 수강신청
3. `lesson-player` — 수업 뷰어 (영상 / 텍스트 / 퀴즈)
4. `vocabulary` — 단어장 / 플래시카드 / 복습
5. `progress-tracking` — 학습 진도 대시보드
6. `community` — 게시판 / 댓글 / 강사 피드백
