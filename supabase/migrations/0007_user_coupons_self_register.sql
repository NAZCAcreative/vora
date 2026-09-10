-- /student/coupons의 "쿠폰 코드 등록" 기능은 사용자가 코드로 활성 쿠폰을 직접 발급받는 것을 전제로 한다.
-- 0001에서는 발급을 서비스 롤 전용으로 막아뒀지만, 실제 UI가 자가 등록 플로우이므로 본인 발급만 허용한다.
-- (활성/만료 검증은 애플리케이션 코드에서 하고, unique(coupon_id, user_id) 제약이 중복 발급을 막는다.)
create policy user_coupons_insert_own on user_coupons for insert with check (auth.uid() = user_id);
