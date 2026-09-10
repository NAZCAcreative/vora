begin;
select set_config('test.teacher','4e827ccb-c588-49c0-a78c-be9cde1a772e',true);
select set_config('test.student','3429c1b9-9b35-45dd-87fb-64fccf769a9a',true);
select set_config('test.other',(select id::text from public.profiles where id not in ('4e827ccb-c588-49c0-a78c-be9cde1a772e','3429c1b9-9b35-45dd-87fb-64fccf769a9a') limit 1),true);
set local role authenticated;
select set_config('request.jwt.claim.sub',current_setting('test.teacher'),true);
select set_config('request.jwt.claim.role','authenticated',true);
do $$ declare r jsonb; begin
  r:=public.create_teacher_lesson(jsonb_build_object('title','INTEGRITY_FIXTURE','type','1on1','category','test','price',0,'capacity',1,'scheduledAt',now()+interval '120 days','durationMinutes',50));
  perform set_config('test.lesson',r->>'lessonId',true); perform set_config('test.session',r->>'sessionId',true);
  assert jsonb_array_length(public.lesson_booking_slots((r->>'lessonId')::uuid,((now()+interval '120 days') at time zone 'Asia/Seoul')::date))>=1,'Published slots include explicit teacher session';
  perform public.set_notification_preference('chat_message',false);
  assert (select not chat_message from public.notification_preferences where user_id=auth.uid()),'Preference persistence';
  begin update public.teacher_profiles set rating_avg=5 where profile_id=auth.uid(); raise exception 'Rating spoof allowed'; exception when insufficient_privilege then null; end;
  begin perform public.run_weekly_settlement(current_date-7,current_date-1); raise exception 'Client settlement allowed'; exception when insufficient_privilege then null; end;
  begin perform public.request_withdrawal(-1,gen_random_uuid()); raise exception 'Negative withdrawal allowed' using errcode='P0099'; exception when sqlstate 'P0001' then null; end;
  begin insert into public.withdrawal_requests(teacher_id,amount) values(auth.uid(),99999); raise exception 'Direct withdrawal allowed'; exception when insufficient_privilege then null; end;
end $$;
select set_config('request.jwt.claim.sub',current_setting('test.student'),true);
do $$ declare r jsonb; again jsonb; start_at timestamptz; begin
  select scheduled_at into start_at from public.lesson_sessions where id=current_setting('test.session')::uuid;
  r:=public.reserve_lesson(current_setting('test.lesson')::uuid,start_at);
  perform set_config('test.enrollment',r->>'enrollmentId',true);
  again:=public.reserve_lesson(current_setting('test.lesson')::uuid,start_at);
  assert r=again,'Reservation retry must be idempotent';
  begin insert into public.payments(student_id,amount,method,status) values(auth.uid(),1,'card','succeeded'); raise exception 'Fake payment allowed'; exception when insufficient_privilege then null; end;
  begin update public.enrollments set status='confirmed' where id=(r->>'enrollmentId')::uuid; raise exception 'Self confirmation allowed'; exception when insufficient_privilege then null; end;
  perform public.checkout_free_booking((r->>'enrollmentId')::uuid);
  perform public.checkout_free_booking((r->>'enrollmentId')::uuid);
  assert (select count(*)=1 from public.payments where enrollment_id=(r->>'enrollmentId')::uuid),'Checkout retry must be idempotent';
  begin insert into public.reviews(student_id,teacher_id,session_id,rating,text) values(auth.uid(),current_setting('test.teacher')::uuid,current_setting('test.session')::uuid,5,'Not completed'); raise exception 'Premature review allowed'; exception when insufficient_privilege then null; end;
end $$;
select set_config('request.jwt.claim.sub',current_setting('test.other'),true);
do $$ declare start_at timestamptz; begin
  select scheduled_at into start_at from public.lesson_sessions where id=current_setting('test.session')::uuid;
  begin perform public.reserve_lesson(current_setting('test.lesson')::uuid,start_at); raise exception 'Overbooking allowed' using errcode='P0099'; exception when sqlstate 'P0001' then null; end;
end $$;
reset role;
update public.enrollments set status='completed' where id=current_setting('test.enrollment')::uuid;
set local role authenticated;
select set_config('request.jwt.claim.sub',current_setting('test.student'),true);
do $$ declare review_id uuid; room_id uuid; message_id uuid; begin
  insert into public.reviews(student_id,teacher_id,session_id,rating,text) values(auth.uid(),current_setting('test.teacher')::uuid,current_setting('test.session')::uuid,4,'Original review') returning id into review_id;
  perform set_config('test.review',review_id::text,true);
  begin insert into public.reviews(student_id,teacher_id,session_id,rating,text) values(auth.uid(),current_setting('test.teacher')::uuid,current_setting('test.session')::uuid,5,'Duplicate'); raise exception 'Duplicate review allowed'; exception when unique_violation then null; end;
  select id into room_id from public.chat_rooms where student_id=auth.uid() and teacher_id=current_setting('test.teacher')::uuid;
  if room_id is null then insert into public.chat_rooms(student_id,teacher_id) values(auth.uid(),current_setting('test.teacher')::uuid) returning id into room_id; end if;
  insert into public.chat_messages(room_id,sender_id,text) values(room_id,auth.uid(),'Integrity fixture') returning id into message_id;
  perform set_config('test.message',message_id::text,true); perform set_config('test.room',room_id::text,true);
  assert jsonb_array_length(public.chat_message_page(room_id))<=50,'Message paging';
end $$;
select set_config('request.jwt.claim.sub',current_setting('test.teacher'),true);
do $$ begin
  begin update public.reviews set text='Tampered' where id=current_setting('test.review')::uuid; raise exception 'Teacher changed student review'; exception when insufficient_privilege then null; end;
  update public.reviews set teacher_reply='Thank you' where id=current_setting('test.review')::uuid;
  begin update public.chat_messages set text='Tampered' where id=current_setting('test.message')::uuid; raise exception 'Changed peer message'; exception when insufficient_privilege then null; end;
  update public.chat_messages set read_at=now() where id=current_setting('test.message')::uuid;
  assert jsonb_array_length(public.my_chat_rooms('teacher',1))<=20,'Chat room page';
end $$;
reset role;
-- A disabled preference suppresses the notification generated by the fixture message.
do $$ begin
  assert not exists(select 1 from public.notifications where user_id=current_setting('test.teacher')::uuid and body='Integrity fixture'),'Notification preference applied';
end $$;
update public.lesson_sessions set scheduled_at=now()-interval '2 days',status='completed' where id=current_setting('test.session')::uuid;
update public.payments set amount=10000 where enrollment_id=current_setting('test.enrollment')::uuid;
select public.run_weekly_settlement(current_date-3,current_date-1);
select public.run_weekly_settlement(current_date-4,current_date-1);
do $$ begin
  assert (select count(*)=1 from public.settlement_payment_items i join public.payments p on p.id=i.payment_id where p.enrollment_id=current_setting('test.enrollment')::uuid),'Overlapping settlement retry must not duplicate credit';
end $$;
-- Trusted fixture credits are not real settlement or withdrawal transactions; rolled back below.
insert into public.settlements(teacher_id,period_start,period_end,net_amount,status,verified_settlement) values(current_setting('test.teacher')::uuid,current_date-2,current_date-1,10000,'paid',true);
insert into public.settlement_accounts(teacher_id,bank_name,account_holder,account_number) values(current_setting('test.teacher')::uuid,'TEST','TEST','TEST') on conflict(teacher_id) do nothing;
set local role authenticated;
select set_config('request.jwt.claim.sub',current_setting('test.teacher'),true);
do $$ declare balance bigint; request_id uuid:=gen_random_uuid(); begin
  balance:=(public.my_balance()->>'availableBalance')::bigint;
  if balance>0 then
    perform public.request_withdrawal(balance::int,request_id);
    perform public.request_withdrawal(balance::int,request_id);
    assert (public.my_balance()->>'availableBalance')::bigint=0,'Withdrawal consumes balance once';
    begin perform public.request_withdrawal(1,gen_random_uuid()); raise exception 'Overdraw allowed' using errcode='P0099'; exception when sqlstate 'P0001' then null; end;
  end if;
end $$;
set local role anon;
do $$ begin
  begin perform public.run_weekly_settlement(current_date-7,current_date-1); raise exception 'Anonymous settlement allowed'; exception when insufficient_privilege then null; end;
  begin perform public.my_balance(); raise exception 'Anonymous balance allowed'; exception when insufficient_privilege then null; end;
end $$;
rollback;
select 'PASS: direct financial writes blocked, atomic reservation/free checkout/retries, capacity, withdrawal balance/retries, completed-only reviews, field permissions and chat paging; rolled back' as result;
