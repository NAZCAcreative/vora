-- 학생이 예약 시점에 lesson_sessions를 직접 생성해야 하므로(선생님 전용이 아님),
-- INSERT는 로그인한 사용자 전체에게 허용하고 UPDATE/DELETE는 담당 선생님만 유지한다.
-- 실제 참여자 제한은 enrollments 테이블의 RLS(auth.uid() = student_id)가 담당한다.

drop policy lesson_sessions_write_own on lesson_sessions;

create policy lesson_sessions_insert_authenticated on lesson_sessions for insert
  with check (auth.role() = 'authenticated');

create policy lesson_sessions_update_teacher on lesson_sessions for update
  using (auth.uid() = teacher_id);

create policy lesson_sessions_delete_teacher on lesson_sessions for delete
  using (auth.uid() = teacher_id);
