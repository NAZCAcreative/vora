-- 리뷰에 카테고리별 세부 평점(친절함/설명 명확성/실력 향상/수업 준비)을 추가하고
-- teacher_profiles에 카테고리별 평균을 자동 동기화한다. (평점 세분화 표시용)
alter table reviews
  add column kindness smallint check (kindness between 1 and 5),
  add column clarity smallint check (clarity between 1 and 5),
  add column improvement smallint check (improvement between 1 and 5),
  add column preparation smallint check (preparation between 1 and 5);

alter table teacher_profiles
  add column kindness_avg numeric(2, 1) not null default 0,
  add column clarity_avg numeric(2, 1) not null default 0,
  add column improvement_avg numeric(2, 1) not null default 0,
  add column preparation_avg numeric(2, 1) not null default 0;

create or replace function sync_teacher_rating() returns trigger as $$
declare
  target_teacher_id uuid;
begin
  target_teacher_id := coalesce(new.teacher_id, old.teacher_id);

  update teacher_profiles
  set
    rating_avg = coalesce((select round(avg(rating)::numeric, 1) from reviews where teacher_id = target_teacher_id), 0),
    rating_count = (select count(*) from reviews where teacher_id = target_teacher_id),
    kindness_avg = coalesce((select round(avg(kindness)::numeric, 1) from reviews where teacher_id = target_teacher_id and kindness is not null), 0),
    clarity_avg = coalesce((select round(avg(clarity)::numeric, 1) from reviews where teacher_id = target_teacher_id and clarity is not null), 0),
    improvement_avg = coalesce((select round(avg(improvement)::numeric, 1) from reviews where teacher_id = target_teacher_id and improvement is not null), 0),
    preparation_avg = coalesce((select round(avg(preparation)::numeric, 1) from reviews where teacher_id = target_teacher_id and preparation is not null), 0)
  where profile_id = target_teacher_id;

  return null;
end;
$$ language plpgsql security definer set search_path = public;
