-- 주간 정산 배치: 매주 월요일 00:00 UTC에 지난 7일간의 결제 완료 건을 선생님별로 집계해서
-- settlements에 기록하고 정산 알림을 보낸다. 플랫폼 수수료는 20%로 고정.
create extension if not exists pg_cron with schema extensions;

create function run_weekly_settlement(period_start date, period_end date) returns void as $$
declare
  teacher_row record;
  gross integer;
  fee integer;
  net integer;
begin
  for teacher_row in
    select distinct ls.teacher_id
    from payments p
    join enrollments e on e.id = p.enrollment_id
    join lesson_sessions ls on ls.id = e.session_id
    where p.status = 'succeeded'
      and p.created_at::date between period_start and period_end
      and not exists (
        select 1 from settlements s
        where s.teacher_id = ls.teacher_id and s.period_start = period_start and s.period_end = period_end
      )
  loop
    select coalesce(sum(p.amount), 0) into gross
    from payments p
    join enrollments e on e.id = p.enrollment_id
    join lesson_sessions ls on ls.id = e.session_id
    where p.status = 'succeeded'
      and ls.teacher_id = teacher_row.teacher_id
      and p.created_at::date between period_start and period_end;

    fee := round(gross * 0.2);
    net := gross - fee;

    insert into settlements (teacher_id, period_start, period_end, gross_amount, platform_fee, net_amount, status, paid_at)
    values (teacher_row.teacher_id, period_start, period_end, gross, fee, net, 'paid', now());

    insert into notifications (user_id, type, title, body, link_url)
    values (
      teacher_row.teacher_id,
      'settlement',
      '정산이 완료됐어요',
      to_char(period_start, 'MM/DD') || ' ~ ' || to_char(period_end, 'MM/DD') || ' 정산액 ₩' || to_char(net, 'FM999,999,999') || '이 처리되었습니다.',
      '/teacher/profile/withdraw'
    );
  end loop;
end;
$$ language plpgsql security definer set search_path = public;

select cron.schedule(
  'weekly-settlement',
  '0 0 * * 1',
  $$select run_weekly_settlement((current_date - interval '7 days')::date, (current_date - interval '1 day')::date)$$
);
