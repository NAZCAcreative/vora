# 전체 검증 결과 — 2026-09-08

판정: 빌드/타입/비로그인 경로 검사는 통과. 아래 서버 검증 문제가 남아 있어 서비스 전체 정상 또는 운영 배포 가능 판정은 보류한다.

## 실행 결과

| 검사 | 결과 |
| --- | --- |
| `npm run type-check` | 통과 |
| `npm run lint` | 오류 0, 경고 5 |
| `npm run build` | 통과, 정적 페이지 생성 40/40 |
| 프로덕션 서버 HTTP 검사 | 페이지 39개 + 인증 콜백 1개, 총 40개 통과 |

HTTP 검사는 빌드 manifest의 모든 사용자 페이지를 순회했다. 공개 페이지 8개는 200, 보호 페이지 31개는 307 및 `/login?next=<원래 pathname>`을 확인했다. 동적 `[id]`는 존재하지 않는 UUID로 대체했으므로 실제 데이터 렌더링을 검증한 것은 아니다. 코드 없는 `/auth/callback`은 로그인 오류 경로로 307을 확인했다. 검사 전용 서버는 127.0.0.1:3100에서 실행 후 종료했다.

기존 ESLint 설정이 없어 `npm run lint`가 설정 질문과 함께 종료되었다. `.eslintrc.json`에 `next/core-web-vitals`를 추가해 재실행 가능한 상태로 수정했다. 애플리케이션 코드와 DB는 변경하지 않았다.

경고: 예약 확인 페이지의 `viewedMonth` useMemo 의존성 1건, 학생 홈의 img 1건, 루트 layout의 폰트 로딩 3건.

## 확인된 문제

아래는 저장소 코드와 SQL에 근거한 판정이다. 운영 DB의 실제 정책 적용 상태와 공격 재현 결과를 의미하지 않는다.

### P1 — 결제 성공을 클라이언트가 직접 기록

- 근거: `src/lib/queries/bookings.ts`의 `confirmPayment`, `supabase/migrations/0001_init.sql`의 `payments_insert_own`, `payments_update_own`, `enrollments_update`.
- 브라우저가 전달한 금액으로 `status: succeeded`를 INSERT하고 예약을 confirmed로 UPDATE한다. PG 승인 검증 단계가 없다. SQL 정책은 사용자 소유권을 확인하지만 결제 금액/성공 상태를 신뢰할 수 있는 서버만 변경하도록 제한하지 않는다.
- 결제 생성, 예약 확정, 쿠폰 사용 처리가 별도 요청이라 중간 실패 후 일부만 반영될 수 있다. 결제 테이블의 enrollment_id에도 중복 방지 UNIQUE가 없다.
- 필요한 조치: 서버에서 가격/쿠폰 계산 및 PG 승인 확인, 결제 요청 멱등성, 원자적인 예약 확정 처리, 클라이언트의 결제 성공 상태 쓰기 제한.

### P1 — 예약 상품 혼동 및 초과/중복 예약 가능

- 근거: `src/lib/queries/bookings.ts`의 `createBookingDraft`, `0001_init.sql`의 `sync_session_enrolled_count`, `0003_fix_lesson_sessions_rls.sql`.
- 기존 세션을 선생님과 시작 시각만으로 찾고 첫 번째 결과에 합류한다. 다른 수업 상품을 선택해도 같은 시각이면 기존 상품 세션으로 연결될 수 있다.
- 조회 후 INSERT가 분리되어 동시에 빈 시간에 예약하면 복수 세션이 생성될 수 있다. 정원 검사는 confirmed만 집계한 값에 의존하고 확정 시점의 정원 강제 검증이 없다.
- 시간 구간 겹침과 teacher_availability를 검증하지 않는다. 세션 INSERT 정책은 로그인 여부만 검사한다.
- 필요한 조치: 서버 트랜잭션/RPC에서 상품 일치, 가능 시간, 겹침, 정원을 강제하고 동시성 제어 적용.

### P1 — 출금 금액 UPDATE로 잔액 검증 우회 가능

- 근거: `0001_init.sql`의 `withdrawal_update_own_pending`, `0009_withdrawal_balance_check.sql`.
- requested 상태의 본인 출금 행은 UPDATE할 수 있으나 잔액 트리거는 BEFORE INSERT에만 적용된다. requested 상태를 유지하며 금액을 늘리는 UPDATE에는 잔액 검증이 없다.
- INSERT 검사도 사용자별 잠금 없이 잔액을 조회하므로 동시 요청은 같은 잔액을 보고 함께 통과할 수 있다.
- 필요한 조치: 금액 수정 권한 제한 또는 UPDATE까지 검증, 사용자별 동시성 제어. 운영 DB에 0009가 적용되었는지는 미확인.

### P2 — 로그인 경유 시 예약/결제 쿼리 유실

- 근거: `src/middleware.ts`가 next에 pathname만 저장한다.
- 예: 비로그인 상태에서 `/student/payment?enrollment=<id>`에 접근하면 로그인 후 `/student/payment`로 이동해 결제할 예약을 찾지 못한다. 예약 확인의 teacher 쿼리도 동일하게 유실된다.
- 필요한 조치: 안전한 내부 리다이렉트 검증과 함께 pathname + search 보존.

### P2 — 만료된 쿠폰이 결제 할인에 포함될 수 있음

- 근거: `src/lib/queries/coupons.ts`의 `listMyCoupons`, `computeDiscount`.
- 쿠폰 등록 시 만료일을 검사하지만 이미 등록된 쿠폰의 목록과 할인 계산에서는 만료일을 검사하지 않는다. 등록 후 만료된 available 쿠폰에 할인이 적용될 수 있다.
- 필요한 조치: 결제 서버에서 만료/활성/소유권/사용 상태/최소 금액 재검증.

### P2 — 환경변수 누락 시 보호 경로 검사 생략

- 근거: `src/middleware.ts`의 Supabase URL/key 부재 분기.
- 환경변수가 없으면 모든 요청을 통과시킨다. 이번 환경은 값이 있어 보호 경로 검사가 통과했지만 설정 누락 환경에서는 인증 가드가 작동하지 않는다. 이것만으로 DB 정보 노출을 입증한 것은 아니다.
- 필요한 조치: 운영 환경의 필수 설정 검증과 보호 경로의 명시적인 실패 처리.

## 검증 한계

- 저장소에 자동화된 단위/통합/E2E 테스트와 브라우저 자동화 패키지가 없다.
- 로그인 후 학생/교사 권한 분리, 모든 버튼 동작, 모바일 레이아웃, 브라우저 콘솔/하이드레이션, 실시간 채팅, 업로드, OAuth 성공 흐름은 미검증.
- 실제 PG, 원격 DB 마이그레이션 적용 여부, RLS 동작, 출금 동시성은 미검증. 원격 데이터 쓰기 및 테스트 계정 생성은 하지 않았다.
- HTTP 200은 공개 페이지 HTML 응답 검증이며 클라이언트 데이터 로딩 성공을 보장하지 않는다.
- 기존 staged/unstaged/untracked 변경이 다수인 작업 트리 그대로 검사했다. 커밋/푸시는 하지 않았다.
