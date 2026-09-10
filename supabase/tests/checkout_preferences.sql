begin;
select set_config('test.teacher','4e827ccb-c588-49c0-a78c-be9cde1a772e',true);
select set_config('test.student','3429c1b9-9b35-45dd-87fb-64fccf769a9a',true);
insert into public.coupons(code,title,discount_type,discount_value,expires_at) values('CHECKOUT_FIXTURE_'||gen_random_uuid(),'Checkout fixture','percent',100,now()+interval '1 day');
select set_config('test.coupon',(select id::text from public.coupons where title='Checkout fixture' order by created_at desc limit 1),true);
set local role authenticated;
select set_config('request.jwt.claim.sub',current_setting('test.teacher'),true);
do $$ declare r jsonb; begin
  r:=public.create_teacher_lesson(jsonb_build_object('title','PAID_FIXTURE','type','1on1','category','test','price',10000,'capacity',1,'scheduledAt',now()+interval '121 days','durationMinutes',50));
  perform set_config('test.lesson',r->>'lessonId',true); perform set_config('test.session',r->>'sessionId',true);
end $$;
select set_config('request.jwt.claim.sub',current_setting('test.student'),true);
do $$ declare r jsonb; coupon_id uuid; begin
  r:=public.reserve_lesson(current_setting('test.lesson')::uuid,now()+interval '121 days');
  perform set_config('test.enrollment',r->>'enrollmentId',true);
  begin perform public.checkout_free_booking((r->>'enrollmentId')::uuid); raise exception 'Unverified paid checkout allowed'; exception when sqlstate 'P0003' then null; end;
  assert not exists(select 1 from public.payments where enrollment_id=(r->>'enrollmentId')::uuid),'Blocked checkout must not write payment';
  insert into public.user_coupons(user_id,coupon_id) values(auth.uid(),current_setting('test.coupon')::uuid) returning id into coupon_id;
  perform set_config('test.usercoupon',coupon_id::text,true);
end $$;
reset role;
update public.coupons set expires_at=now()-interval '1 second' where id=current_setting('test.coupon')::uuid;
set local role authenticated;
do $$ begin
  begin perform public.checkout_free_booking(current_setting('test.enrollment')::uuid,current_setting('test.usercoupon')::uuid); raise exception 'Expired coupon accepted' using errcode='P0099'; exception when sqlstate 'P0001' then null; end;
  begin update public.user_coupons set status='available' where id=current_setting('test.usercoupon')::uuid; raise exception 'Coupon reset allowed'; exception when insufficient_privilege then null; end;
end $$;
reset role;
update public.coupons set expires_at=now()+interval '1 day' where id=current_setting('test.coupon')::uuid;
set local role authenticated;
do $$ begin
  perform public.checkout_free_booking(current_setting('test.enrollment')::uuid,current_setting('test.usercoupon')::uuid);
  assert (select status='used' from public.user_coupons where id=current_setting('test.usercoupon')::uuid),'Coupon atomically consumed';
  assert (select amount=0 and verified_payment from public.payments where enrollment_id=current_setting('test.enrollment')::uuid),'Server computed discounted amount';
  perform public.set_notification_preference('lesson_start',false);
end $$;
reset role;
update public.lesson_sessions set scheduled_at=now()+interval '5 minutes' where id=current_setting('test.session')::uuid;
select public.maintain_reservations();
select public.maintain_reservations();
do $$ begin
  assert (select count(*)=1 from public.lesson_reminder_deliveries where enrollment_id=current_setting('test.enrollment')::uuid),'Reminder deduplication';
  assert not exists(select 1 from public.notifications where user_id=current_setting('test.student')::uuid and type='lesson_reminder' and body='PAID_FIXTURE'),'Disabled reminder suppressed';
end $$;
rollback;
select 'PASS: paid checkout denied without writes, expired coupon rejected, atomic full discount and coupon consumption, notification persistence/suppression/deduplication; rolled back' as result;
