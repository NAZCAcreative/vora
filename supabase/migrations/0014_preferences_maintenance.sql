begin;
create function public.set_notification_preference(p_key text,p_enabled boolean) returns void language plpgsql security definer set search_path='' as $$
begin
  if auth.uid() is null then raise exception 'Login required' using errcode='42501'; end if;
  if p_key not in ('lesson_start','chat_message','marketing') or p_enabled is null then raise exception 'Invalid preference'; end if;
  insert into public.notification_preferences(user_id) values(auth.uid()) on conflict do nothing;
  update public.notification_preferences set lesson_start=case when p_key='lesson_start' then p_enabled else lesson_start end,
    chat_message=case when p_key='chat_message' then p_enabled else chat_message end,
    marketing=case when p_key='marketing' then p_enabled else marketing end where user_id=auth.uid();
end $$;
revoke all on function public.set_notification_preference(text,boolean) from public,anon;
grant execute on function public.set_notification_preference(text,boolean) to authenticated;

create or replace function public.my_balance() returns jsonb language plpgsql stable security definer set search_path='' as $$
declare credited bigint; withdrawn bigint; gross bigint; fee bigint; month_total bigint;
begin
  if auth.uid() is null then raise exception 'Login required' using errcode='42501'; end if;
  select coalesce(sum(net_amount),0),coalesce(sum(gross_amount),0),coalesce(sum(platform_fee),0),coalesce(sum(net_amount) filter(where period_start>=date_trunc('month',now() at time zone 'Asia/Seoul')::date),0)
    into credited,gross,fee,month_total from public.settlements where teacher_id=auth.uid() and status='paid' and verified_settlement and currency='KRW';
  select coalesce(sum(amount),0) into withdrawn from public.withdrawal_requests where teacher_id=auth.uid() and status<>'rejected';
  return jsonb_build_object('totalSettled',credited,'totalWithdrawn',withdrawn,'availableBalance',greatest(0,credited-withdrawn),'totalGross',gross,'totalFee',fee,'thisMonthSettled',month_total);
end $$;

create table public.lesson_reminder_deliveries(enrollment_id uuid primary key references public.enrollments(id) on delete cascade,created_at timestamptz not null default now());
alter table public.lesson_reminder_deliveries enable row level security;
revoke all on public.lesson_reminder_deliveries from public,anon,authenticated;
create function public.maintain_reservations() returns void language plpgsql security definer set search_path='' as $$
declare r record;
begin
  -- SKIP LOCKED leaves a concurrent confirmation alone; the next run handles leftovers.
  for r in select id from public.enrollments where status='pending_payment' and expires_at<=now() for update skip locked loop
    update public.enrollments set status='cancelled' where id=r.id and status='pending_payment';
  end loop;
  for r in select e.id,e.student_id,s.title from public.enrollments e join public.lesson_sessions s on s.id=e.session_id
    where e.status='confirmed' and s.status='scheduled' and s.scheduled_at>now() and s.scheduled_at<=now()+interval '10 minutes'
      and exists(select 1 from public.payments p where p.enrollment_id=e.id and p.verified_payment and p.status='succeeded')
  loop
    insert into public.lesson_reminder_deliveries(enrollment_id) values(r.id) on conflict do nothing;
    if found then insert into public.notifications(user_id,type,title,body,link_url) values(r.student_id,'lesson_reminder','곧 수업이 시작돼요',r.title,'/student/bookings'); end if;
  end loop;
end $$;
revoke all on function public.maintain_reservations() from public,anon,authenticated;
select cron.schedule('reservation-maintenance','* * * * *',$job$select public.maintain_reservations()$job$);

-- Attendance may finish an enrollment only after its scheduled end.
create function public.guard_attendance_write() returns trigger language plpgsql security definer set search_path='' as $$
declare s public.lesson_sessions; e public.enrollments;
begin
  select * into e from public.enrollments where id=new.enrollment_id;
  select * into s from public.lesson_sessions where id=e.session_id;
  if auth.uid() is not null and (s.teacher_id is distinct from auth.uid() or e.status not in ('confirmed','completed','no_show')) then raise exception 'Teacher and valid enrollment required' using errcode='42501'; end if;
  if tg_op='UPDATE' and new.enrollment_id<>old.enrollment_id then raise exception 'Attendance identity is immutable' using errcode='42501'; end if;
  if auth.uid() is not null then new.recorded_by:=auth.uid(); end if;
  new.recorded_at:=now();
  if s.scheduled_at+make_interval(mins=>s.duration_minutes)<=now() then
    update public.enrollments set status=case when new.status='absent' then 'no_show'::public.enrollment_status else 'completed'::public.enrollment_status end where id=e.id;
  end if;
  return new;
end $$;
create trigger attendance_write_guard before insert or update on public.attendance_records for each row execute function public.guard_attendance_write();
revoke all on function public.guard_attendance_write() from public,anon,authenticated;

-- Prevent changing or deleting the product behind existing bookings.
create function public.guard_lesson_product() returns trigger language plpgsql security definer set search_path='' as $$
begin
  if tg_op='DELETE' then
    if exists(select 1 from public.lesson_sessions s join public.enrollments e on e.session_id=s.id where s.teacher_lesson_id=old.id) then raise exception 'Booked lesson cannot be deleted; unpublish it'; end if;
    return old;
  end if;
  if new.price<0 or new.price>10000000 or new.capacity<1 or new.capacity>100 or (new.type='free_trial' and new.price<>0) then raise exception 'Invalid lesson values'; end if;
  if tg_op='UPDATE' and new.teacher_id<>old.teacher_id then raise exception 'Lesson owner is immutable'; end if;
  return new;
end $$;
create trigger lesson_product_guard before insert or update or delete on public.teacher_lessons for each row execute function public.guard_lesson_product();
revoke all on function public.guard_lesson_product() from public,anon,authenticated;
notify pgrst,'reload schema';
commit;
