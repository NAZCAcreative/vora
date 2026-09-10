begin;
create function public.lesson_booking_slots(p_lesson uuid,p_day date) returns jsonb language plpgsql stable security definer set search_path='' as $$
declare l public.teacher_lessons;
begin
  if auth.uid() is null then raise exception 'Login required' using errcode='42501'; end if;
  select * into l from public.teacher_lessons where id=p_lesson and is_published;
  if not found or p_day is null or p_day<(now() at time zone 'Asia/Seoul')::date or p_day>(now() at time zone 'Asia/Seoul')::date+180 then return '[]'::jsonb; end if;
  return (with candidates as (
    select s.id,s.scheduled_at,s.duration_minutes,s.capacity from public.lesson_sessions s where s.teacher_lesson_id=l.id and s.status='scheduled' and (s.scheduled_at at time zone 'Asia/Seoul')::date=p_day
    union all
    select null::uuid,g.start_at,50,l.capacity from generate_series(p_day::timestamp at time zone 'Asia/Seoul',(p_day+1)::timestamp at time zone 'Asia/Seoul'-interval '1 hour',interval '30 minutes') g(start_at)
    where exists(select 1 from public.teacher_availability a where a.teacher_id=l.teacher_id and a.weekday=extract(dow from p_day)
      and a.start_time<=(g.start_at at time zone 'Asia/Seoul')::time and a.end_time>=((g.start_at+interval '50 minutes') at time zone 'Asia/Seoul')::time)
      and not exists(select 1 from public.lesson_sessions s where s.teacher_id=l.teacher_id and s.status in ('scheduled','ongoing') and tstzrange(s.scheduled_at,s.scheduled_at+make_interval(mins=>s.duration_minutes),'[)') && tstzrange(g.start_at,g.start_at+interval '50 minutes','[)'))
  ) select coalesce(jsonb_agg(jsonb_build_object('start',c.scheduled_at,'duration',c.duration_minutes) order by c.scheduled_at),'[]'::jsonb)
    from candidates c where c.scheduled_at>now() and (select count(*) from public.enrollments e where e.session_id=c.id and (e.status in ('confirmed','completed') or (e.status='pending_payment' and e.expires_at>now())))<c.capacity);
end $$;
create function public.my_pending_reviews(p_page integer default 1) returns jsonb language plpgsql stable security definer set search_path='' as $$
begin
  if auth.uid() is null then raise exception 'Login required' using errcode='42501'; end if;
  return (select coalesce(jsonb_agg(to_jsonb(r)),'[]'::jsonb) from (select s.id as "sessionId",s.teacher_id as "teacherId",p.name as "teacherName",p.avatar_url as "teacherAvatarUrl",s.scheduled_at as "scheduledAt",s.title as "sessionTitle"
    from public.enrollments e join public.lesson_sessions s on s.id=e.session_id join public.profiles p on p.id=s.teacher_id
    where e.student_id=auth.uid() and e.status='completed' and not exists(select 1 from public.reviews r where r.student_id=auth.uid() and r.session_id=s.id)
    order by s.scheduled_at desc,s.id desc limit 20 offset (greatest(1,least(coalesce(p_page,1),1000000))-1)*20) r);
end $$;
create function public.my_teacher_overview() returns jsonb language plpgsql stable security definer set search_path='' as $$
begin
  if auth.uid() is null then raise exception 'Login required' using errcode='42501'; end if;
  return (select jsonb_build_object('name',p.name,'avatarUrl',p.avatar_url,'headline',t.headline,'isVerified',coalesce(t.is_verified,false),'ratingAvg',coalesce(t.rating_avg,0),'ratingCount',coalesce(t.rating_count,0),
    'publishedLessonCount',(select count(*) from public.teacher_lessons where teacher_id=p.id and is_published),
    'upcomingSessionCount',(select count(*) from public.lesson_sessions where teacher_id=p.id and status in ('scheduled','ongoing') and scheduled_at>=now()),
    'completedSessionCount',(select count(*) from public.lesson_sessions s where teacher_id=p.id and (status='completed' or exists(select 1 from public.enrollments e where e.session_id=s.id and e.status='completed'))),
    'monthRevenue',(public.my_balance()->>'thisMonthSettled')::bigint,'totalRevenue',(public.my_balance()->>'totalSettled')::bigint)
    from public.profiles p left join public.teacher_profiles t on t.profile_id=p.id where p.id=auth.uid());
end $$;
revoke all on function public.lesson_booking_slots(uuid,date),public.my_pending_reviews(integer),public.my_teacher_overview() from public,anon;
grant execute on function public.lesson_booking_slots(uuid,date),public.my_pending_reviews(integer),public.my_teacher_overview() to authenticated;
notify pgrst,'reload schema';
commit;
