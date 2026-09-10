begin;
create or replace function public.checkout_free_booking(p_enrollment uuid,p_coupon uuid default null) returns void language plpgsql security definer set search_path='' as $$
declare e public.enrollments; s public.lesson_sessions; discount_coupon record; due integer;
begin
  if auth.uid() is null then raise exception 'Login required' using errcode='42501'; end if;
  select z.* into s from public.lesson_sessions z join public.enrollments x on x.session_id=z.id where x.id=p_enrollment and x.student_id=auth.uid();
  if not found then raise exception 'Reservation not found' using errcode='42501'; end if;
  perform 1 from public.profiles where id=s.teacher_id for update;
  select * into e from public.enrollments where id=p_enrollment for update;
  if e.status='confirmed' and exists(select 1 from public.payments where enrollment_id=e.id and verified_payment and status='succeeded') then return; end if;
  if e.status<>'pending_payment' or e.expires_at is null or e.expires_at<=now() or s.scheduled_at<=now() or s.status<>'scheduled' then raise exception 'Reservation expired'; end if;
  due:=e.reserved_price;
  if due is null or due<0 then raise exception 'Invalid reservation price'; end if;
  if p_coupon is not null then
    select uc.status as coupon_status,promo.* into discount_coupon from public.user_coupons uc join public.coupons promo on promo.id=uc.coupon_id where uc.id=p_coupon and uc.user_id=auth.uid() for update of uc,promo;
    if not found or discount_coupon.coupon_status<>'available' or not discount_coupon.is_active or (discount_coupon.expires_at is not null and discount_coupon.expires_at<=now()) or due<discount_coupon.min_order_amount or e.reserved_currency<>'KRW' then raise exception 'Coupon unavailable'; end if;
    if discount_coupon.discount_value<0 or (discount_coupon.discount_type='percent' and discount_coupon.discount_value>100) then raise exception 'Invalid discount'; end if;
    due:=greatest(0,due-case when discount_coupon.discount_type='fixed' then discount_coupon.discount_value else floor(due::numeric*discount_coupon.discount_value/100)::int end);
  end if;
  if due<>0 then raise exception 'Paid checkout is not connected yet' using errcode='P0003'; end if;
  if (select count(*) from public.enrollments where session_id=s.id and status in ('confirmed','completed'))>=s.capacity then raise exception 'Lesson is full'; end if;
  insert into public.payments(enrollment_id,student_id,amount,currency,method,status,user_coupon_id,verified_payment)
    values(e.id,auth.uid(),0,e.reserved_currency,'card','succeeded',p_coupon,true);
  update public.enrollments set status='confirmed',expires_at=null where id=e.id;
  if p_coupon is not null then update public.user_coupons set status='used',used_at=now() where id=p_coupon; end if;
end $$;

create or replace function public.reserve_lesson(p_lesson uuid,p_start timestamptz) returns jsonb language plpgsql security definer set search_path='' as $$
declare l public.teacher_lessons; s public.lesson_sessions; e public.enrollments; occupied integer;
begin
  if auth.uid() is null then raise exception 'Login required' using errcode='42501'; end if;
  select * into l from public.teacher_lessons where id=p_lesson;
  if not found or not l.is_published or l.teacher_id=auth.uid() or l.price<0 then raise exception 'Lesson unavailable'; end if;
  perform 1 from public.profiles where id=l.teacher_id for update;
  select * into l from public.teacher_lessons where id=p_lesson for share;
  if not found or not l.is_published then raise exception 'Lesson unavailable'; end if;
  if p_start is null or p_start<=now() or p_start>now()+interval '180 days' then raise exception 'Choose a future lesson within 180 days'; end if;
  select * into s from public.lesson_sessions where teacher_lesson_id=l.id and teacher_id=l.teacher_id and scheduled_at=p_start and status='scheduled' order by id limit 1 for update;
  if not found then
    -- New sessions must match the teacher's published availability in Korean time.
    if not exists(select 1 from public.teacher_availability a where a.teacher_id=l.teacher_id
      and a.weekday=extract(dow from p_start at time zone 'Asia/Seoul')
      and a.start_time<=(p_start at time zone 'Asia/Seoul')::time and a.end_time>=((p_start+interval '50 minutes') at time zone 'Asia/Seoul')::time
      and (p_start at time zone 'Asia/Seoul')::date=((p_start+interval '50 minutes') at time zone 'Asia/Seoul')::date) then raise exception 'Teacher is unavailable at this time'; end if;
    insert into public.lesson_sessions(teacher_lesson_id,teacher_id,title,type,scheduled_at,duration_minutes,capacity)
      values(l.id,l.teacher_id,l.title,l.type,p_start,50,l.capacity) returning * into s;
  end if;
  select * into e from public.enrollments where session_id=s.id and student_id=auth.uid() for update;
  if found and (e.status in ('confirmed','completed') or (e.status='pending_payment' and e.expires_at>now())) then return jsonb_build_object('enrollmentId',e.id); end if;
  if l.type='free_trial' and exists(select 1 from public.enrollments x join public.lesson_sessions z on z.id=x.session_id where x.student_id=auth.uid() and z.teacher_id=l.teacher_id and z.type='free_trial'
    and (x.status in ('confirmed','completed','no_show') or (x.status='pending_payment' and x.expires_at>now()))) then raise exception 'Free trial already used'; end if;
  select count(*) into occupied from public.enrollments where session_id=s.id and (status in ('confirmed','completed') or (status='pending_payment' and expires_at>now()));
  if occupied>=s.capacity then raise exception 'Lesson is full'; end if;
  insert into public.enrollments(session_id,student_id,status,reserved_price,reserved_currency,expires_at)
    values(s.id,auth.uid(),'pending_payment',l.price,l.currency,least(now()+interval '15 minutes',s.scheduled_at))
    on conflict(session_id,student_id) do update set status='pending_payment',reserved_price=excluded.reserved_price,reserved_currency=excluded.reserved_currency,expires_at=excluded.expires_at
    returning * into e;
  return jsonb_build_object('enrollmentId',e.id);
end $$;
notify pgrst,'reload schema';
commit;
