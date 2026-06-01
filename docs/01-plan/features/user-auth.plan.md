# user-auth Planning Document

> **Summary**: 외국인 한국어 학습자/강사를 위한 이메일 회원가입·로그인·프로필·역할 전환 기능
>
> **Project**: KoreaLingoBridge
> **Version**: 0.1.0
> **Author**: dkpark55@gmail.com
> **Date**: 2026-05-22
> **Status**: Draft

---

## Executive Summary

| Perspective | Content |
|-------------|---------|
| **Problem** | 외국인 사용자가 한국어 교육 플랫폼에 가입·로그인하고, 학습자 또는 강사로 활동할 수 있는 인증 체계가 없다 |
| **Solution** | bkend.ai JWT 기반 이메일 인증으로 회원가입/로그인 구현, Zustand로 클라이언트 세션 관리, 역할 모드 전환 UI 제공 |
| **Function/UX Effect** | 가입 즉시 학습 시작 가능, 홈에서 학생↔강사 모드 전환으로 하나의 계정으로 두 역할 사용 |
| **Core Value** | 모든 플랫폼 기능의 전제 조건인 인증 레이어 확립; 이후 강좌·진도·커뮤니티 기능의 기반 |

---

## Context Anchor

| Key | Value |
|-----|-------|
| **WHY** | 플랫폼 사용자 식별 및 역할 기반 접근 제어가 없으면 어떤 기능도 동작하지 않음 |
| **WHO** | 외국인 한국어 학습자(student) + 강사(teacher); 단일 계정으로 두 역할 전환 |
| **RISK** | bkend.ai API 스펙 변경 시 토큰 처리 로직 깨짐; 다국어 UX 미흡 시 이탈 |
| **SUCCESS** | 회원가입→로그인→홈 도달 < 2분; 역할 전환 1-click; 새로고침 후 세션 유지 |
| **SCOPE** | Phase 1: 회원가입/로그인 UI + API 연동 / Phase 2: 프로필 수정 + 역할 전환 |

---

## 1. Overview

### 1.1 Purpose

외국인 사용자가 이메일·비밀번호로 회원가입하고, 이후 로그인하여 학습자 또는 강사로 플랫폼을 사용할 수 있는 인증 레이어를 구축한다.

### 1.2 Background

KoreaLingoBridge의 모든 기능(강좌 수강, 진도 관리, 커뮤니티)은 로그인된 사용자 정보에 의존한다. MVP에서는 이메일/비밀번호 방식만 지원하며, 소셜 로그인과 이메일 인증은 이후 단계에서 추가한다.

### 1.3 Related Documents

- 프로젝트 개요: `CLAUDE.md`
- API 클라이언트: `src/lib/api.ts`

---

## 2. Scope

### 2.1 In Scope

- [ ] 회원가입 페이지 (`/register`): 이메일, 비밀번호, 이름, 모국어, 한국어 수준
- [ ] 로그인 페이지 (`/login`): 이메일, 비밀번호
- [ ] 로그아웃
- [ ] JWT 토큰 저장 및 자동 갱신 (Zustand + localStorage)
- [ ] 프로필 조회/수정 페이지 (`/profile`)
- [ ] 역할 모드 전환 UI (student ↔ teacher) — 헤더 또는 홈화면
- [ ] Protected Route 컴포넌트 (비로그인 시 `/login` 리다이렉트)

### 2.2 Out of Scope

- 소셜 로그인 (Google / Kakao)
- 이메일 인증 (가입 후 확인 메일)
- 비밀번호 재설정
- 관리자(admin) 역할 부여 UI
- 2FA

---

## 3. Requirements

### 3.1 Functional Requirements

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-01 | 이메일·비밀번호·이름·모국어·한국어수준으로 회원가입 | High | Pending |
| FR-02 | 이메일·비밀번호로 로그인, JWT 토큰 localStorage 저장 | High | Pending |
| FR-03 | 로그아웃 시 토큰 제거 및 홈 리다이렉트 | High | Pending |
| FR-04 | 새로고침 후 인증 상태 유지 (Zustand persist) | High | Pending |
| FR-05 | 비로그인 접근 시 `/login` 리다이렉트 (ProtectedRoute) | High | Pending |
| FR-06 | 프로필 조회 (`/auth/me`) 및 수정 (이름, 아바타, 한국어수준) | Medium | Pending |
| FR-07 | 역할 모드 전환 (student ↔ teacher) — 헤더 토글 | Medium | Pending |
| FR-08 | 회원가입/로그인 폼 유효성 검증 (Zod) | High | Pending |
| FR-09 | API 에러 메시지 다국어 표시 (영어 우선) | Medium | Pending |

### 3.2 Non-Functional Requirements

| Category | Criteria | Measurement Method |
|----------|----------|-------------------|
| Performance | 로그인 API 응답 < 500ms | 브라우저 Network 탭 |
| Security | 비밀번호 클라이언트 평문 저장 금지; HTTPS 전송 | 코드 리뷰 |
| UX | 폼 에러 메시지 즉시 표시 (onBlur) | 수동 테스트 |
| Accessibility | 폼 label-input 연결, 키보드 탐색 | WAVE 도구 |

---

## 4. Success Criteria

### 4.1 Definition of Done

- [ ] FR-01 ~ FR-09 모두 구현 완료
- [ ] 회원가입→로그인→대시보드 E2E 플로우 작동
- [ ] 새로고침 후 세션 유지 확인
- [ ] 역할 전환 후 UI 반영 확인
- [ ] TypeScript 에러 0건, lint 에러 0건

### 4.2 Quality Criteria

- [ ] Zod 스키마로 모든 폼 입력 검증
- [ ] 빌드 성공
- [ ] ProtectedRoute가 미인증 접근 차단 확인

---

## 5. Risks and Mitigation

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| bkend.ai 응답 스펙 변경 | High | Low | api.ts에 타입 캐스팅 집중; 스펙 변경 시 단일 파일만 수정 |
| localStorage 토큰 XSS 취약점 | Medium | Low | MVP에서 httpOnly 쿠키 대신 localStorage 사용, 추후 개선 |
| 다국어 사용자 UX 혼선 | Medium | Medium | 영어 UI 우선, i18n은 별도 feature로 분리 |
| Zustand persist 하이드레이션 불일치 | Low | Medium | `skipHydration` 옵션 + `useEffect`로 클라이언트에서 초기화 |

---

## 6. Impact Analysis

### 6.1 Changed Resources

| Resource | Type | Change Description |
|----------|------|--------------------|
| `src/stores/auth-store.ts` | Zustand Store | login / logout / fetchMe 액션 완성 |
| `src/lib/api.ts` | API Client | auth 엔드포인트 실제 연동 확인 |
| `src/types/index.ts` | TypeScript | User 인터페이스에 `activeRole` 필드 추가 |
| `src/app/(auth)/` | Route | login / register 페이지 구현 |
| `src/components/shared/ProtectedRoute.tsx` | Component | 신규 생성 |

### 6.2 Current Consumers

| Resource | Operation | Code Path | Impact |
|----------|-----------|-----------|--------|
| `auth-store` | READ | 이후 모든 feature에서 `useAuthStore()` 사용 | 스토어 인터페이스 안정성 중요 |
| `api.ts auth.*` | CREATE/READ | user-auth feature 전용 (현재 다른 사용처 없음) | None |

### 6.3 Verification

- [ ] auth-store 인터페이스 변경 시 하위 호환성 유지
- [ ] `activeRole` 필드 추가가 기존 User 타입 사용처에 영향 없음

---

## 7. Architecture Considerations

### 7.1 Project Level Selection

| Level | Characteristics | Selected |
|-------|-----------------|:--------:|
| Starter | 단순 구조 | ☐ |
| **Dynamic** | Feature 모듈, bkend.ai BaaS | ☑ |
| Enterprise | 마이크로서비스, strict DI | ☐ |

### 7.2 Key Architectural Decisions

| Decision | Selected | Rationale |
|----------|----------|-----------|
| Framework | Next.js 14 App Router | 프로젝트 기본 설정 |
| State Management | Zustand + persist | 경량, SSR 친화적, localStorage 동기화 |
| API Client | custom fetch (api.ts) | bkend.ai REST, 의존성 최소화 |
| Form Handling | react-hook-form + zod | 유효성 검증 + TypeScript 타입 안전성 |
| Styling | Tailwind CSS | 프로젝트 기본 설정 |
| Auth Token | localStorage (MVP) | httpOnly 쿠키는 추후 보안 강화 단계 |

### 7.3 Folder Structure

```
src/
├── app/
│   └── (auth)/
│       ├── login/page.tsx
│       └── register/page.tsx
├── components/
│   ├── features/auth/
│   │   ├── LoginForm.tsx
│   │   ├── RegisterForm.tsx
│   │   └── RoleSwitcher.tsx
│   └── shared/
│       └── ProtectedRoute.tsx
├── hooks/
│   └── useAuth.ts            ← auth-store 래퍼
└── stores/
    └── auth-store.ts         ← 완성
```

---

## 8. Convention Prerequisites

### 8.1 Existing Conventions

- [x] `CLAUDE.md` 존재 (프로젝트 개요)
- [x] `tsconfig.json` 존재 (`@/*` 경로 별칭)
- [ ] ESLint 설정 (package.json에 eslint-config-next 포함, 설정 파일 미생성)
- [ ] Prettier 설정

### 8.2 Conventions to Define

| Category | Rule |
|----------|------|
| 컴포넌트 네이밍 | PascalCase, 기능 접두사 (LoginForm, RegisterForm) |
| 훅 네이밍 | `use` 접두사, 도메인명 포함 (useAuth) |
| 폼 검증 | Zod 스키마를 컴포넌트와 같은 파일에 정의 |
| API 에러 | `try/catch` + toast 알림 (추후 toast 라이브러리 추가) |

### 8.3 Environment Variables

| Variable | Purpose | 현재 상태 |
|----------|---------|---------|
| `NEXT_PUBLIC_BKEND_API_URL` | bkend.ai API URL | `.env.local` 존재 |
| `NEXT_PUBLIC_BKEND_PROJECT_ID` | 프로젝트 ID | 값 입력 필요 |
| `NEXT_PUBLIC_BKEND_ENV` | dev/prod | `.env.local` 존재 |

---

## 9. Next Steps

1. [ ] `/pdca design user-auth` — 설계 문서 작성 (3가지 아키텍처 옵션)
2. [ ] bkend.ai 콘솔에서 프로젝트 생성 → `NEXT_PUBLIC_BKEND_PROJECT_ID` 입력
3. [ ] `/pdca do user-auth` — 구현 시작

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-05-22 | Initial draft | dkpark55@gmail.com |
