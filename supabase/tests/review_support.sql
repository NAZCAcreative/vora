-- Real RPC and permission checks; all sample data is rolled back.
begin;
insert into public.support_tickets(requester_id,kind,category,title,body,created_at)
select '4e827ccb-c588-49c0-a78c-be9cde1a772e','inquiry','lesson','PAGING_FIXTURE_'||n,'Test ticket with enough content',now()-interval '2 hours' from generate_series(1,21) n;
set local role authenticated;
select set_config('request.jwt.claim.sub','4e827ccb-c588-49c0-a78c-be9cde1a772e',true);
do $$
declare r jsonb; r2 jsonb; request_id uuid := '10000000-0000-4000-8000-000000000012';
begin
  perform public.create_support_ticket('report','lesson','REPORT_FIXTURE','A report with enough detail',request_id);
  perform public.create_support_ticket('report','lesson','REPORT_FIXTURE','A report with enough detail',request_id);
  r:=public.my_support_tickets(1); r2:=public.my_support_tickets(2);
  assert jsonb_array_length(r->'rows')=10,'User page size';
  assert not exists(select 1 from jsonb_array_elements(r->'rows') a join jsonb_array_elements(r2->'rows') b on a->>'id'=b->>'id'),'User pages must not overlap';
  assert (public.my_support_tickets(2147483647)->>'page')::int=ceil((r->>'total')::numeric/10)::int,'User page clamping';
  assert (r->'rows'->0->>'id')::uuid=request_id,'Newest ticket first';
  assert not(r->'rows'->0 ? 'internal_note'),'No private support notes';
  begin perform 1 from public.support_tickets; raise exception 'Direct support reads allowed'; exception when insufficient_privilege then null; end;
  begin update public.teacher_applications set status='approved' where profile_id=auth.uid(); raise exception 'Self approval allowed'; exception when insufficient_privilege then null; end;
  begin perform public.admin_mutate_legacy('teacher_verified',auth.uid(),'{"is_verified":true}','Bypass attempt','{"is_verified":false}'); raise exception 'Legacy bypass'; exception when insufficient_privilege then null; end;
  begin perform public.create_support_ticket('inquiry','other','X','too short',gen_random_uuid()); raise exception 'Invalid ticket accepted'; exception when check_violation then null; end;
  begin perform public.admin_list('tickets'); raise exception 'Nonadmin ticket listing allowed'; exception when insufficient_privilege then null; end;
end $$;

select set_config('request.jwt.claim.sub','3429c1b9-9b35-45dd-87fb-64fccf769a9a',true);
do $$
declare m jsonb; r jsonb; expected jsonb; teacher uuid := '4e827ccb-c588-49c0-a78c-be9cde1a772e'; request_id uuid := '10000000-0000-4000-8000-000000000012';
begin
  assert not exists(select 1 from jsonb_array_elements(public.my_support_tickets()->'rows') a where a->>'id'=request_id::text),'Admin user support only sees own tickets';
  m:=public.admin_member(teacher); expected:=jsonb_build_object('updated_at',m->'application'->'updated_at');
  begin
    perform public.admin_mutate('teacher_review',teacher,'{"status":"needs_changes","feedback":""}','Review validation',expected);
    raise exception 'Missing feedback accepted' using errcode='P0099';
  exception when sqlstate 'P0001' then null; end;
  perform public.admin_mutate('teacher_review',teacher,'{"status":"needs_changes","feedback":"Please update your introduction","internal_note":"PRIVATE_REVIEW_NOTE"}','Review fixture',expected);
  m:=public.admin_member(teacher);
  assert m->'application'->>'status'='needs_changes','Review status persistence';
  assert not(m->'teacher'->>'is_verified')::boolean,'Review revokes verification';
  begin perform public.admin_mutate('teacher_review',teacher,'{"status":"approved"}','Stale review',expected); raise exception 'Stale review accepted'; exception when serialization_failure then null; end;
  r:=public.admin_list('tickets',1,10,'REPORT_FIXTURE');
  assert (r->>'total')::int=1,'Idempotent ticket creation';
  expected:=jsonb_build_object('updated_at',r->'rows'->0->'updated_at');
  begin
    perform public.admin_mutate('support_ticket',request_id,'{"status":"ticket_resolved","response":""}','Response validation',expected);
    raise exception 'Empty resolution accepted' using errcode='P0099';
  exception when sqlstate 'P0001' then null; end;
  perform public.admin_mutate('support_ticket',request_id,'{"status":"ticket_resolved","response":"We have reviewed your report","internal_note":"PRIVATE_SUPPORT_NOTE"}','Support fixture',expected);
  begin perform public.admin_mutate('support_ticket',request_id,'{"status":"ticket_open"}','Stale ticket',expected); raise exception 'Stale ticket accepted'; exception when serialization_failure then null; end;
  r:=public.admin_list('tickets',1,10,'REPORT_FIXTURE','ticket_resolved',null,null,teacher);
  assert (r->>'total')::int=1,'Admin ticket filters';
  assert r->'rows'->0->>'internal_note'='PRIVATE_SUPPORT_NOTE','Admin notes saved';
  assert (public.admin_list('audit',1,10,'Support fixture')->>'total')::int=1,'Ticket audit';
  assert (public.admin_dashboard()->>'openTickets')::int>=21,'Work queue count';
end $$;

select set_config('request.jwt.claim.sub','4e827ccb-c588-49c0-a78c-be9cde1a772e',true);
do $$
declare r jsonb; m jsonb;
begin
  m:=public.my_teacher_application();
  assert m->>'feedback'='Please update your introduction','Owner sees feedback';
  assert not(m ? 'internal_note') and not(m ? 'reviewed_by'),'Private review data excluded';
  r:=public.submit_teacher_application((m->>'updated_at')::timestamptz);
  assert r->>'status'='review_pending','Resubmission enters queue';
  begin perform public.submit_teacher_application((m->>'updated_at')::timestamptz); raise exception 'Stale resubmit accepted'; exception when serialization_failure then null; end;
  r:=public.my_support_tickets(1,'ticket_resolved');
  assert r->'rows'->0->>'response'='We have reviewed your report','Owner receives response';
  assert position('PRIVATE_SUPPORT_NOTE' in r::text)=0,'Internal support note leakage';
  begin update public.teacher_profiles set is_verified=true where profile_id=auth.uid(); raise exception 'Self verify allowed'; exception when insufficient_privilege then null; end;
end $$;

select set_config('request.jwt.claim.sub','3429c1b9-9b35-45dd-87fb-64fccf769a9a',true);
do $$
declare m jsonb; teacher uuid := '4e827ccb-c588-49c0-a78c-be9cde1a772e';
begin
  m:=public.admin_member(teacher);
  perform public.admin_mutate('teacher_review',teacher,'{"status":"approved","feedback":"Approved"}','Approve fixture',jsonb_build_object('updated_at',m->'application'->'updated_at'));
  assert (public.admin_member(teacher)->'teacher'->>'is_verified')::boolean,'Approval syncs verification';
  assert (public.admin_list('teachers',1,10,teacher::text,'approved')->>'total')::int=1,'Review filter';
end $$;

set local role anon;
do $$
begin
  begin perform public.my_support_tickets(); raise exception 'Anonymous support listing'; exception when insufficient_privilege then null; end;
  begin perform public.my_teacher_application(); raise exception 'Anonymous review listing'; exception when insufficient_privilege then null; end;
  begin perform public.create_support_ticket('inquiry','other','Anon','Anonymous attempt',gen_random_uuid()); raise exception 'Anonymous creation'; exception when insufficient_privilege then null; end;
end $$;
rollback;
select 'PASS: review/resubmit/approval, ticket create/retry/respond, paging/filtering, audit, stale writes, owner privacy and anonymous/nonadmin restrictions; rolled back' as result;
