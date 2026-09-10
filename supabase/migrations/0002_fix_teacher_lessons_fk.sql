-- teacher_lessons.teacher_id가 profiles(id)를 직접 참조하고 있어 PostgREST가
-- teacher_profiles <-> teacher_lessons 관계를 자동으로 찾지 못하는 문제 수정.
-- teacher_profiles.profile_id도 profiles(id)를 참조하는 1:1 관계이므로,
-- teacher_lessons.teacher_id를 teacher_profiles(profile_id)로 재타겟팅해도 참조 무결성은 동일하게 유지된다.

alter table teacher_lessons drop constraint teacher_lessons_teacher_id_fkey;
alter table teacher_lessons
  add constraint teacher_lessons_teacher_id_fkey
  foreign key (teacher_id) references teacher_profiles(profile_id) on delete cascade;
