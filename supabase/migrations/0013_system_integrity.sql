begin;

-- Financial state and reservations are written only through trusted functions.
revoke insert,update,delete on public.payments,public.enrollments,public.lesson_sessions,public.withdrawal_requests,public.user_coupons from anon,authenticated;
grant insert on public.user_coupons to authenticated;
revoke update on public.chat_messages,public.chat_rooms,public.notifications from anon,authenticated;
grant update(read_at) on public.chat_messages to authenticated;
grant update(is_read) on public.notifications to authenticated;
revoke update on public.teacher_profiles from anon,authenticated;
grant update(headline,bio,intro_video_url,years_experience,specialties,country) on public.teacher_profiles to authenticated;
revoke insert on public.teacher_profiles from anon,authenticated;
grant insert(profile_id,headline,bio,intro_video_url,years_experience,specialties,country) on public.teacher_profiles to authenticated;
drop policy user_coupons_insert_own on public.user_coupons;
create policy user_coupons_insert_own on public.user_coupons for insert with check(auth.uid()=user_id and status='available' and used_at is null and exists(select 1 from public.coupons c where c.id=coupon_id and c.is_active and (c.expires_at is null or c.expires_at>now())));

alter table public.enrollments add column reserved_price integer,add column reserved_currency text,add column expires_at timestamptz;
update public.enrollments e set reserved_price=coalesce(l.price,0),reserved_currency=coalesce(l.currency,'KRW'),
  expires_at=case when e.status='pending_payment' then now() else null end
from public.lesson_sessions s left join public.teacher_lessons l on l.id=s.teacher_lesson_id where s.id=e.session_id;
alter table public.payments add column verified_payment boolean not null default false;
create unique index payments_verified_enrollment_idx on public.payments(enrollment_id) where verified_payment and status='succeeded';
create unique index payments_verified_transaction_idx on public.payments(pg_transaction_id) where verified_payment and pg_transaction_id is not null;
alter table public.settlements add column currency text not null default 'KRW',add column verified_settlement boolean not null default false;
create table public.settlement_payment_items(payment_id uuid primary key references public.payments(id),settlement_id uuid not null references public.settlements(id));
alter table public.settlement_payment_items enable row level security;
revoke all on public.settlement_payment_items from public,anon,authenticated;

-- One teacher lock serializes lesson creation, reservations and payment confirmation.
create function public.guard_session_schedule() returns trigger language plpgsql security definer set search_path='' as $$
begin
  perform 1 from public.profiles where id=new.teacher_id for update;
  if new.capacity<1 or new.capacity>100 or new.duration_minutes<10 or new.duration_minutes>240 then raise exception 'Invalid session dimensions'; end if;
  if new.status in ('scheduled','ongoing') and exists(select 1 from public.lesson_sessions s where s.teacher_id=new.teacher_id and s.id<>new.id and s.status in ('scheduled','ongoing')
    and tstzrange(s.scheduled_at,s.scheduled_at+make_interval(mins=>s.duration_minutes),'[)') && tstzrange(new.scheduled_at,new.scheduled_at+make_interval(mins=>new.duration_minutes),'[)')) then
    raise exception 'Teacher schedule overlaps' using errcode='23P01';
  end if;
  return new;
end $$;
create trigger session_schedule_guard before insert or update of teacher_id,scheduled_at,duration_minutes,capacity,status on public.lesson_sessions for each row execute function public.guard_session_schedule();

create function public.create_teacher_lesson(p_data jsonb) returns jsonb language plpgsql security definer set search_path='' as $$
declare lesson_id uuid; session_id uuid; price integer; capacity integer; start_at timestamptz;
begin
  if auth.uid() is null then raise exception 'Login required' using errcode='42501'; end if;
  price:=(p_data->>'price')::integer; capacity:=(p_data->>'capacity')::integer; start_at:=(p_data->>'scheduledAt')::timestamptz;
  if price is null or price<0 or price>10000000 or capacity is null or capacity<1 or capacity>100 or start_at is null or start_at<=now() or length(trim(coalesce(p_data->>'title','')))<2 then raise exception 'Invalid lesson'; end if;
  if p_data->>'type'='free_trial' and price<>0 then raise exception 'Free trial must be free'; end if;
  perform 1 from public.profiles where id=auth.uid() for update;
  insert into public.teacher_profiles(profile_id) values(auth.uid()) on conflict do nothing;
  insert into public.teacher_lessons(teacher_id,title,type,category,level,price,capacity,description,is_published)
    values(auth.uid(),trim(p_data->>'title'),(p_data->>'type')::public.lesson_type,p_data->>'category',p_data->>'level',price,capacity,p_data->>'description',true) returning id into lesson_id;
  insert into public.lesson_sessions(teacher_lesson_id,teacher_id,title,type,scheduled_at,duration_minutes,capacity)
    values(lesson_id,auth.uid(),trim(p_data->>'title'),(p_data->>'type')::public.lesson_type,start_at,coalesce((p_data->>'durationMinutes')::int,50),capacity) returning id into session_id;
  return jsonb_build_object('lessonId',lesson_id,'sessionId',session_id);
end $$;

create function public.reserve_lesson(p_lesson uuid,p_start timestamptz) returns jsonb language plpgsql security definer set search_path='' as $$
declare l public.teacher_lessons; s public.lesson_sessions; e public.enrollments; occupied integer;
begin
  if auth.uid() is null then raise exception 'Login required' using errcode='42501'; end if;
  select * into l from public.teacher_lessons where id=p_lesson;
  if not found or not l.is_published or l.teacher_id=auth.uid() or l.price<0 then raise exception 'Lesson unavailable'; end if;
  perform 1 from public.profiles where id=l.teacher_id for update;
  select * into l from public.teacher_lessons where id=p_lesson for share;
  if not found or not l.is_published then raise exception 'Lesson unavailable'; end if;
  if p_start is null or p_start<=now() or p_start>now()+interval '180 days' then raise exception 'Choose a future lesson within 180 days'; end if;
  select * into s from public.lesson_sessions where teacher_lesson_id=l.id and scheduled_at=p_start and status='scheduled' order by id limit 1 for update;
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

create function public.checkout_free_booking(p_enrollment uuid,p_coupon uuid default null) returns void language plpgsql security definer set search_path='' as $$
declare e public.enrollments; s public.lesson_sessions; c record; due integer;
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
    select uc.id,uc.status,c.* into c from public.user_coupons uc join public.coupons c on c.id=uc.coupon_id where uc.id=p_coupon and uc.user_id=auth.uid() for update of uc,c;
    if not found or c.status<>'available' or not c.is_active or (c.expires_at is not null and c.expires_at<=now()) or due<c.min_order_amount or e.reserved_currency<>'KRW' then raise exception 'Coupon unavailable'; end if;
    if c.discount_value<0 or (c.discount_type='percent' and c.discount_value>100) then raise exception 'Invalid discount'; end if;
    due:=greatest(0,due-case when c.discount_type='fixed' then c.discount_value else floor(due::numeric*c.discount_value/100)::int end);
  end if;
  if due<>0 then raise exception 'Paid checkout is not connected yet' using errcode='P0003'; end if;
  if (select count(*) from public.enrollments where session_id=s.id and status in ('confirmed','completed'))>=s.capacity then raise exception 'Lesson is full'; end if;
  insert into public.payments(enrollment_id,student_id,amount,currency,method,status,user_coupon_id,verified_payment)
    values(e.id,auth.uid(),0,e.reserved_currency,'card','succeeded',p_coupon,true);
  update public.enrollments set status='confirmed',expires_at=null where id=e.id;
  if p_coupon is not null then update public.user_coupons set status='used',used_at=now() where id=p_coupon; end if;
end $$;

-- The previous public settlement RPC is removed from client access even while being replaced.
revoke all on function public.run_weekly_settlement(date,date) from public,anon,authenticated;
create or replace function public.run_weekly_settlement(period_start date,period_end date) returns void
language plpgsql security definer set search_path='' as $$
declare group_row record; settlement_id uuid; gross bigint; fee bigint;
begin
  if $1 is null or $2 is null or $1>$2 or $2>=current_date then raise exception 'Invalid settlement period'; end if;
  perform pg_advisory_xact_lock(1313001);
  for group_row in select distinct s.teacher_id,p.currency from public.payments p join public.enrollments e on e.id=p.enrollment_id join public.lesson_sessions s on s.id=e.session_id
    where p.verified_payment and p.status='succeeded' and e.status='completed' and (s.scheduled_at+make_interval(mins=>s.duration_minutes))::date between $1 and $2
      and not exists(select 1 from public.settlement_payment_items i where i.payment_id=p.id)
  loop
    select sum(p.amount) into gross from public.payments p join public.enrollments e on e.id=p.enrollment_id join public.lesson_sessions s on s.id=e.session_id
      where p.verified_payment and p.status='succeeded' and e.status='completed' and s.teacher_id=group_row.teacher_id and p.currency=group_row.currency
      and (s.scheduled_at+make_interval(mins=>s.duration_minutes))::date between $1 and $2 and not exists(select 1 from public.settlement_payment_items i where i.payment_id=p.id);
    if coalesce(gross,0)=0 then continue; end if;
    fee:=round(gross*0.2);
    insert into public.settlements(teacher_id,period_start,period_end,gross_amount,platform_fee,net_amount,status,paid_at,currency,verified_settlement)
      values(group_row.teacher_id,$1,$2,gross,fee,gross-fee,'paid',now(),group_row.currency,true) returning id into settlement_id;
    insert into public.settlement_payment_items(payment_id,settlement_id)
      select p.id,settlement_id from public.payments p join public.enrollments e on e.id=p.enrollment_id join public.lesson_sessions s on s.id=e.session_id
      where p.verified_payment and p.status='succeeded' and e.status='completed' and s.teacher_id=group_row.teacher_id and p.currency=group_row.currency
      and (s.scheduled_at+make_interval(mins=>s.duration_minutes))::date between $1 and $2 and not exists(select 1 from public.settlement_payment_items i where i.payment_id=p.id);
    insert into public.notifications(user_id,type,title,body,link_url) values(group_row.teacher_id,'settlement','정산 잔액이 적립됐어요',(gross-fee)::text||' '||group_row.currency||' 적립. 실제 송금은 출금 처리 후 완료됩니다.','/teacher/profile/withdraw');
  end loop;
end $$;

create function public.my_balance() returns jsonb language plpgsql stable security definer set search_path='' as $$
declare credited bigint; withdrawn bigint;
begin
  if auth.uid() is null then raise exception 'Login required' using errcode='42501'; end if;
  select coalesce(sum(net_amount),0) into credited from public.settlements where teacher_id=auth.uid() and status='paid' and verified_settlement and currency='KRW';
  select coalesce(sum(amount),0) into withdrawn from public.withdrawal_requests where teacher_id=auth.uid() and status<>'rejected';
  return jsonb_build_object('totalSettled',credited,'totalWithdrawn',withdrawn,'availableBalance',greatest(0,credited-withdrawn));
end $$;
create function public.request_withdrawal(p_amount integer,p_request_id uuid) returns uuid language plpgsql security definer set search_path='' as $$
declare previous public.withdrawal_requests;
begin
  if auth.uid() is null then raise exception 'Login required' using errcode='42501'; end if;
  perform 1 from public.profiles where id=auth.uid() for update;
  select * into previous from public.withdrawal_requests where id=p_request_id;
  if found then
    if previous.teacher_id=auth.uid() and previous.amount=p_amount then return previous.id; end if;
    raise exception 'Request ID already used';
  end if;
  if p_request_id is null or p_amount is null or p_amount<=0 or p_amount>(public.my_balance()->>'availableBalance')::bigint then raise exception 'Insufficient available balance'; end if;
  if not exists(select 1 from public.settlement_accounts where teacher_id=auth.uid() and length(trim(account_number))>0) then raise exception 'Settlement account required'; end if;
  insert into public.withdrawal_requests(id,teacher_id,amount,status) values(p_request_id,auth.uid(),p_amount,'requested');
  return p_request_id;
end $$;

-- Reviews: ownership does not allow editing the other participant's fields.
create function public.guard_review_write() returns trigger language plpgsql security definer set search_path='' as $$
begin
  if auth.uid() is null then return new; end if;
  if tg_op='INSERT' then
    if new.student_id<>auth.uid() or new.teacher_id=auth.uid() or new.teacher_reply is not null or new.teacher_reply_at is not null then raise exception 'Invalid review author' using errcode='42501'; end if;
    perform 1 from public.profiles where id=auth.uid() for update;
    if not exists(select 1 from public.enrollments e join public.lesson_sessions s on s.id=e.session_id where e.student_id=auth.uid() and e.session_id=new.session_id and e.status='completed' and s.teacher_id=new.teacher_id) then raise exception 'Completed enrollment required' using errcode='42501'; end if;
    if exists(select 1 from public.reviews where student_id=auth.uid() and session_id=new.session_id) then raise exception 'Review already exists' using errcode='23505'; end if;
  else
    if new.id<>old.id or new.student_id<>old.student_id or new.teacher_id<>old.teacher_id or new.session_id is distinct from old.session_id or new.created_at<>old.created_at then raise exception 'Review identity is immutable' using errcode='42501'; end if;
    if auth.uid()=old.teacher_id then
      if (to_jsonb(new)-'teacher_reply'-'teacher_reply_at'-'updated_at') is distinct from (to_jsonb(old)-'teacher_reply'-'teacher_reply_at'-'updated_at') then raise exception 'Only reply can be changed' using errcode='42501'; end if;
      new.teacher_reply_at:=now();
    elsif auth.uid()=old.student_id then
      if new.teacher_reply is distinct from old.teacher_reply or new.teacher_reply_at is distinct from old.teacher_reply_at then raise exception 'Cannot edit teacher reply' using errcode='42501'; end if;
    else raise exception 'Review access denied' using errcode='42501'; end if;
  end if;
  return new;
end $$;
create trigger review_write_guard before insert or update on public.reviews for each row execute function public.guard_review_write();

create table public.notification_preferences(user_id uuid primary key references public.profiles(id) on delete cascade,lesson_start boolean not null default true,chat_message boolean not null default true,marketing boolean not null default false);
alter table public.notification_preferences enable row level security;
revoke all on public.notification_preferences from anon,authenticated;
grant select,insert,update on public.notification_preferences to authenticated;
create policy notification_preferences_own on public.notification_preferences for all using(auth.uid()=user_id) with check(auth.uid()=user_id);
create function public.filter_notification_preferences() returns trigger language plpgsql security definer set search_path='' as $$
begin
  if new.type='chat_message' and exists(select 1 from public.notification_preferences where user_id=new.user_id and not chat_message) then return null; end if;
  if new.type='lesson_reminder' and exists(select 1 from public.notification_preferences where user_id=new.user_id and not lesson_start) then return null; end if;
  return new;
end $$;
create trigger notifications_preference_guard before insert on public.notifications for each row execute function public.filter_notification_preferences();

create function public.my_chat_rooms(p_role text,p_page integer default 1) returns jsonb language plpgsql stable security definer set search_path='' as $$
declare result jsonb;
begin
  if auth.uid() is null or p_role not in ('student','teacher') then raise exception 'Login and valid role required' using errcode='42501'; end if;
  select coalesce(jsonb_agg(to_jsonb(r)),'[]'::jsonb) into result from (
    select c.id,c.teacher_id as "teacherId",c.student_id as "studentId",p.id as "otherUserId",p.name as "otherUserName",p.avatar_url as "otherUserAvatar",c.last_message_at as "lastMessageAt",
      (select case when m.type='file' then '파일을 보냈습니다' else m.text end from public.chat_messages m where m.room_id=c.id order by m.created_at desc,m.id desc limit 1) as "lastMessagePreview",
      (select count(*) from public.chat_messages m where m.room_id=c.id and m.sender_id<>auth.uid() and m.read_at is null) as "unreadCount"
    from public.chat_rooms c join public.profiles p on p.id=case when p_role='teacher' then c.student_id else c.teacher_id end
    where (p_role='teacher' and c.teacher_id=auth.uid()) or (p_role='student' and c.student_id=auth.uid())
    order by c.last_message_at desc nulls last,c.id desc limit 20 offset (greatest(1,least(coalesce(p_page,1),1000000))-1)*20
  ) r;
  return result;
end $$;
create function public.my_chat_unread_count() returns bigint language plpgsql stable security definer set search_path='' as $$
begin
  if auth.uid() is null then raise exception 'Login required' using errcode='42501'; end if;
  return (select count(*) from public.chat_messages m join public.chat_rooms c on c.id=m.room_id where (c.teacher_id=auth.uid() or c.student_id=auth.uid()) and m.sender_id<>auth.uid() and m.read_at is null);
end $$;
create function public.chat_message_page(p_room uuid,p_before timestamptz default null,p_before_id uuid default null) returns jsonb language plpgsql stable security definer set search_path='' as $$
begin
  if auth.uid() is null or not exists(select 1 from public.chat_rooms where id=p_room and auth.uid() in (teacher_id,student_id)) then raise exception 'Room access denied' using errcode='42501'; end if;
  return (select coalesce(jsonb_agg(to_jsonb(r)),'[]'::jsonb) from (select * from public.chat_messages where room_id=p_room and (p_before is null or (created_at,id)<(p_before,p_before_id)) order by created_at desc,id desc limit 50) r);
end $$;

-- Explicit grants for every new function; trigger functions are never client RPCs.
revoke all on function public.guard_session_schedule(),public.guard_review_write(),public.filter_notification_preferences() from public,anon,authenticated;
revoke all on function public.create_teacher_lesson(jsonb),public.reserve_lesson(uuid,timestamptz),public.checkout_free_booking(uuid,uuid),public.my_balance(),public.request_withdrawal(integer,uuid),public.my_chat_rooms(text,integer),public.my_chat_unread_count(),public.chat_message_page(uuid,timestamptz,uuid) from public,anon;
grant execute on function public.create_teacher_lesson(jsonb),public.reserve_lesson(uuid,timestamptz),public.checkout_free_booking(uuid,uuid),public.my_balance(),public.request_withdrawal(integer,uuid),public.my_chat_rooms(text,integer),public.my_chat_unread_count(),public.chat_message_page(uuid,timestamptz,uuid) to authenticated;
notify pgrst,'reload schema';
commit;
