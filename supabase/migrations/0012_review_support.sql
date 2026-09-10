begin;

create table public.teacher_applications (
  profile_id uuid primary key references public.teacher_profiles(profile_id) on delete cascade,
  status text not null default 'review_pending' check(status in ('review_pending','needs_changes','approved','review_rejected')),
  feedback text not null default '' check(length(feedback)<=2000),
  internal_note text not null default '' check(length(internal_note)<=2000),
  reviewed_by uuid references public.profiles(id),
  reviewed_at timestamptz,
  updated_at timestamptz not null default clock_timestamp()
);
insert into public.teacher_applications(profile_id,status)
select profile_id,case when is_verified then 'approved' else 'review_pending' end from public.teacher_profiles;

create table public.support_tickets (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid not null references public.profiles(id),
  kind text not null check(kind in ('inquiry','report')),
  category text not null check(category in ('booking','payment','account','lesson','other')),
  title text not null check(length(trim(title)) between 2 and 120),
  body text not null check(length(trim(body)) between 10 and 5000),
  status text not null default 'ticket_open' check(status in ('ticket_open','ticket_processing','ticket_resolved')),
  response text not null default '' check(length(response)<=5000),
  internal_note text not null default '' check(length(internal_note)<=2000),
  updated_by uuid references public.profiles(id),
  created_at timestamptz not null default clock_timestamp(),
  updated_at timestamptz not null default clock_timestamp()
);
alter table public.teacher_applications enable row level security;
alter table public.support_tickets enable row level security;
revoke all on public.teacher_applications,public.support_tickets from public,anon,authenticated;
create index support_tickets_requester_idx on public.support_tickets(requester_id,created_at desc,id desc);
create index support_tickets_status_idx on public.support_tickets(status,created_at desc,id desc);
create index teacher_applications_status_idx on public.teacher_applications(status);

create function public.initialize_teacher_application() returns trigger
language plpgsql security definer set search_path='' as $$
begin
  insert into public.teacher_applications(profile_id,status) values(new.profile_id,case when new.is_verified then 'approved' else 'review_pending' end);
  return new;
end;
$$;
revoke all on function public.initialize_teacher_application() from public,anon,authenticated;
create trigger teacher_application_insert after insert on public.teacher_profiles for each row execute function public.initialize_teacher_application();

-- Verification is derived from the review decision, including direct REST updates.
create or replace function public.guard_teacher_verification() returns trigger
language plpgsql security definer set search_path='' as $$
begin
  if auth.uid() is not null then
    if tg_op='INSERT' and new.is_verified then
      raise exception 'New applications require review' using errcode='42501';
    elsif tg_op='UPDATE' and new.is_verified is distinct from old.is_verified then
      if not public.admin_is_authorized() or new.is_verified is distinct from
        (select status='approved' from public.teacher_applications where profile_id=new.profile_id) then
        raise exception 'Review decision required' using errcode='42501';
      end if;
    end if;
  end if;
  return new;
end;
$$;

create function public.my_teacher_application() returns jsonb
language plpgsql stable security definer set search_path='' as $$
begin
  if auth.uid() is null then raise exception 'Login required' using errcode='42501'; end if;
  return (select jsonb_build_object('status',status,'feedback',feedback,'reviewed_at',reviewed_at,'updated_at',updated_at)
    from public.teacher_applications where profile_id=auth.uid());
end;
$$;

create function public.submit_teacher_application(p_expected timestamptz) returns jsonb
language plpgsql security definer set search_path='' as $$
declare previous public.teacher_applications; result public.teacher_applications;
begin
  if auth.uid() is null then raise exception 'Login required' using errcode='42501'; end if;
  select * into previous from public.teacher_applications where profile_id=auth.uid() for update;
  if not found then raise exception 'Teacher not found' using errcode='P0002'; end if;
  if previous.updated_at is distinct from p_expected then raise exception 'Record changed' using errcode='40001'; end if;
  if previous.status not in ('needs_changes','review_rejected') then raise exception 'Already submitted or approved'; end if;
  update public.teacher_applications set status='review_pending',updated_at=clock_timestamp() where profile_id=auth.uid() returning * into result;
  insert into public.admin_audit_logs(actor_id,action,target_id,reason,before_data,after_data)
    values(auth.uid(),'teacher_resubmit',auth.uid(),'Teacher requested another review',to_jsonb(previous),to_jsonb(result));
  return public.my_teacher_application();
end;
$$;

create function public.create_support_ticket(p_kind text,p_category text,p_title text,p_body text,p_request_id uuid) returns uuid
language plpgsql security definer set search_path='' as $$
declare existing public.support_tickets;
begin
  if auth.uid() is null then raise exception 'Login required' using errcode='42501'; end if;
  -- Serialize submissions by member and make network retries idempotent.
  perform 1 from public.profiles where id=auth.uid() for update;
  if not found then raise exception 'Profile required' using errcode='42501'; end if;
  if p_request_id is null then raise exception 'Request ID required'; end if;
  select * into existing from public.support_tickets where id=p_request_id;
  if found then
    if existing.requester_id=auth.uid() and existing.kind=p_kind and existing.category=p_category
      and existing.title=trim(p_title) and existing.body=trim(p_body) then return existing.id; end if;
    raise exception 'Request ID already used' using errcode='22023';
  end if;
  if (select count(*) from public.support_tickets where requester_id=auth.uid() and created_at>now()-interval '1 hour')>=10 then
    raise exception 'Please try again later' using errcode='P0001';
  end if;
  insert into public.support_tickets(id,requester_id,kind,category,title,body)
    values(p_request_id,auth.uid(),p_kind,p_category,trim(p_title),trim(p_body));
  return p_request_id;
end;
$$;

create function public.my_support_tickets(p_page integer default 1,p_status text default '') returns jsonb
language plpgsql stable security definer set search_path='' as $$
declare total bigint; page integer; rows jsonb;
begin
  if auth.uid() is null then raise exception 'Login required' using errcode='42501'; end if;
  select count(*) into total from public.support_tickets where requester_id=auth.uid() and (coalesce(p_status,'')='' or status=p_status);
  page:=greatest(1,least(coalesce(p_page,1),greatest(1,ceil(total::numeric/10)::integer)));
  select coalesce(jsonb_agg(to_jsonb(r)),'[]'::jsonb) into rows from (
    select id,kind,category,title,body,status,response,created_at,updated_at from public.support_tickets
    where requester_id=auth.uid() and (coalesce(p_status,'')='' or status=p_status)
    order by created_at desc,id desc limit 10 offset (page-1)*10
  ) r;
  return jsonb_build_object('rows',rows,'total',total,'page',page,'pageSize',10);
end;
$$;

-- Keep existing actions private behind the current entry point.
alter function public.admin_mutate(text,uuid,jsonb,text,jsonb) rename to admin_mutate_legacy;
revoke all on function public.admin_mutate_legacy(text,uuid,jsonb,text,jsonb) from public,anon,authenticated;
create function public.admin_mutate(p_action text,p_id uuid,p_data jsonb,p_reason text,p_expected jsonb)
returns jsonb language plpgsql security definer set search_path='' as $$
declare previous jsonb; result jsonb;
begin
  if not public.admin_is_authorized() then raise exception 'Admin access required' using errcode='42501'; end if;
  if p_action='teacher_verified' then raise exception 'Use teacher review'; end if;
  if p_action not in ('teacher_review','support_ticket') then
    return public.admin_mutate_legacy(p_action,p_id,p_data,p_reason,p_expected);
  end if;
  if length(trim(coalesce(p_reason,'')))<3 or length(p_reason)>500 then raise exception 'Reason required (3-500 characters)'; end if;
  if p_expected is null or not(p_expected ? 'updated_at') or p_expected->>'updated_at' is null then raise exception 'Expected timestamp required'; end if;
  if p_action='teacher_review' then
    select to_jsonb(t) into previous from public.teacher_applications t where profile_id=p_id for update;
  else
    select to_jsonb(t) into previous from public.support_tickets t where id=p_id for update;
  end if;
  if previous is null then raise exception 'Record not found' using errcode='P0002'; end if;
  if not(previous @> p_expected) then raise exception 'Record changed' using errcode='40001'; end if;
  if p_action='teacher_review' then
    if p_data->>'status' in ('needs_changes','review_rejected') and length(trim(coalesce(p_data->>'feedback','')))<3 then raise exception 'Feedback required'; end if;
    update public.teacher_applications set status=p_data->>'status',feedback=coalesce(p_data->>'feedback',''),internal_note=coalesce(p_data->>'internal_note',''),
      reviewed_by=auth.uid(),reviewed_at=clock_timestamp(),updated_at=clock_timestamp() where profile_id=p_id returning to_jsonb(teacher_applications.*) into result;
    update public.teacher_profiles set is_verified=(p_data->>'status'='approved') where profile_id=p_id;
  else
    if p_data->>'status'='ticket_resolved' and length(trim(coalesce(p_data->>'response','')))<3 then raise exception 'Response required to resolve'; end if;
    update public.support_tickets set status=p_data->>'status',response=coalesce(p_data->>'response',''),internal_note=coalesce(p_data->>'internal_note',''),
      updated_by=auth.uid(),updated_at=clock_timestamp() where id=p_id returning to_jsonb(support_tickets.*) into result;
  end if;
  insert into public.admin_audit_logs(actor_id,action,target_id,reason,before_data,after_data)
    values(auth.uid(),p_action,p_id,trim(p_reason),previous,result);
  return jsonb_build_object('ok',true);
end;
$$;

revoke all on function public.my_teacher_application(),public.submit_teacher_application(timestamptz),
  public.create_support_ticket(text,text,text,text,uuid),public.my_support_tickets(integer,text),public.admin_mutate(text,uuid,jsonb,text,jsonb) from public,anon;
grant execute on function public.my_teacher_application(),public.submit_teacher_application(timestamptz),
  public.create_support_ticket(text,text,text,text,uuid),public.my_support_tickets(integer,text),public.admin_mutate(text,uuid,jsonb,text,jsonb) to authenticated;

-- Admin read functions are replaced below, keeping their original paging contract.

create or replace function public.admin_dashboard() returns jsonb
language plpgsql stable security definer set search_path = '' as $$
begin
  if not public.admin_is_authorized() then raise exception 'Admin access required' using errcode='42501'; end if;
  return jsonb_build_object(
    'members',(select count(*) from public.profiles),
    'students',(select count(*) from public.profiles p where p.role='student' or exists(select 1 from public.enrollments e where e.student_id=p.id)),
    'teachers',(select count(*) from public.teacher_profiles),
    'newMembers',(select count(*) from public.profiles where created_at>=now()-interval '7 days'),
    'unverifiedTeachers',(select count(*) from public.teacher_applications where status='review_pending'),
    'openTickets',(select count(*) from public.support_tickets where status='ticket_open'),
    'processingTickets',(select count(*) from public.support_tickets where status='ticket_processing'),
    'lessons',(select count(*) from public.teacher_lessons),
    'unpublishedLessons',(select count(*) from public.teacher_lessons where not is_published),
    'upcomingSessions',(select count(*) from public.lesson_sessions where status='scheduled' and scheduled_at>=now() and scheduled_at<now()+interval '7 days'),
    'pendingBookings',(select count(*) from public.enrollments where status='pending_payment'),
    'pendingPayments',(select count(*) from public.payments where status='pending'),
    'pendingWithdrawals',(select count(*) from public.withdrawal_requests where status in ('requested','processing')),
    'pendingSettlements',(select count(*) from public.settlements where status='pending'),
    'lowReviews',(select count(*) from public.reviews where rating<=2),
    'missingPortraits',(select count(*) from public.teacher_profiles t join public.profiles p on p.id=t.profile_id where nullif(p.avatar_url,'') is null),
    'revenue',(select coalesce(jsonb_agg(r),'[]'::jsonb) from (select currency,coalesce(sum(amount) filter(where status='succeeded'),0) as succeeded,coalesce(sum(amount) filter(where status='refunded'),0) as refunded from public.payments group by currency) r),
    'generatedAt',now()
  );
end;
$$;

create or replace function public.admin_list(
  p_section text, p_page integer default 1, p_page_size integer default 20,
  p_query text default '', p_status text default '', p_from date default null,
  p_to date default null, p_member_id uuid default null
) returns jsonb language plpgsql stable security definer set search_path = '' as $$
declare
  base text; predicate text; total bigint; rows jsonb; page integer; size integer;
begin
  if not public.admin_is_authorized() then raise exception 'Admin access required' using errcode='42501'; end if;
  if length(coalesce(p_query,''))>100 then raise exception 'Search is too long'; end if;
  if p_from is not null and p_to is not null and p_from>p_to then raise exception 'Invalid date range'; end if;
  size:=case when p_page_size in (10,20,50) then p_page_size else 20 end;
  case p_section
    when 'members','students','teachers' then
      base:=$q$select p.id,p.name,u.email,p.avatar_url,p.avatar_is_generated,p.native_language,p.korean_level,p.role,p.created_at,p.updated_at,
        u.last_sign_in_at,t.is_verified,a.status as review_status,a.updated_at as review_updated_at,t.headline,t.rating_avg,t.rating_count,t.specialties,
        (select count(*) from public.enrollments e where e.student_id=p.id) as bookings,
        (select count(*) from public.teacher_lessons l where l.teacher_id=p.id) as lessons,
        (n.profile_id is not null and n.note<>'') as has_note,
        concat_ws(' ',p.name,u.email,p.id::text,p.native_language,t.headline,array_to_string(t.specialties,' ')) as _search,
        a.status as _status,
        array[p.id] as _members
        from public.profiles p join auth.users u on u.id=p.id
        left join public.teacher_profiles t on t.profile_id=p.id
        left join public.admin_profile_notes n on n.profile_id=p.id
        left join public.teacher_applications a on a.profile_id=p.id$q$;
      if p_section='teachers' then base:=base||' where t.profile_id is not null';
      elsif p_section='students' then base:=base||' where p.role=''student'' or exists(select 1 from public.enrollments e where e.student_id=p.id)'; end if;
    when 'lessons' then
      base:=$q$select l.id,l.teacher_id,p.name as teacher_name,l.title,l.type,l.category,l.price,l.currency,l.capacity,l.is_published,l.created_at,l.updated_at,
        concat_ws(' ',l.title,l.category,p.name,l.id::text) as _search,
        case when l.is_published then 'published' else 'unpublished' end as _status,array[l.teacher_id] as _members
        from public.teacher_lessons l join public.profiles p on p.id=l.teacher_id$q$;
    when 'sessions' then
      base:=$q$select s.id,s.teacher_id,p.name as teacher_name,s.title,s.type,s.scheduled_at,s.duration_minutes,s.capacity,s.enrolled_count,s.status,s.created_at,
        concat_ws(' ',s.title,p.name,s.id::text) as _search,s.status::text as _status,array[s.teacher_id] as _members
        from public.lesson_sessions s join public.profiles p on p.id=s.teacher_id$q$;
    when 'bookings' then
      base:=$q$select e.id,e.student_id,s.teacher_id,st.name as student_name,t.name as teacher_name,s.title,s.scheduled_at,e.status,e.package_type,e.created_at,
        concat_ws(' ',st.name,t.name,s.title,e.id::text) as _search,e.status::text as _status,array[e.student_id,s.teacher_id] as _members
        from public.enrollments e join public.lesson_sessions s on s.id=e.session_id
        join public.profiles st on st.id=e.student_id join public.profiles t on t.id=s.teacher_id$q$;
    when 'payments' then
      base:=$q$select pay.id,pay.student_id,s.teacher_id,st.name as student_name,t.name as teacher_name,s.title,pay.amount,pay.currency,pay.method,pay.status,pay.pg_transaction_id,pay.created_at,
        concat_ws(' ',st.name,t.name,s.title,pay.id::text,pay.pg_transaction_id) as _search,pay.status::text as _status,array[pay.student_id,s.teacher_id] as _members
        from public.payments pay join public.profiles st on st.id=pay.student_id
        left join public.enrollments e on e.id=pay.enrollment_id left join public.lesson_sessions s on s.id=e.session_id left join public.profiles t on t.id=s.teacher_id$q$;
    when 'settlements' then
      base:=$q$select s.id,s.teacher_id,p.name as teacher_name,s.period_start,s.period_end,s.gross_amount,s.platform_fee,s.net_amount,s.status,s.paid_at,s.created_at,
        concat_ws(' ',p.name,s.id::text) as _search,s.status::text as _status,array[s.teacher_id] as _members
        from public.settlements s join public.profiles p on p.id=s.teacher_id$q$;
    when 'withdrawals' then
      base:=$q$select w.id,w.teacher_id,p.name as teacher_name,w.amount,w.status,w.requested_at as created_at,w.processed_at,a.bank_name,a.account_holder,
        case when a.account_number is not null then '**** '||right(a.account_number,4) end as account_number,
        concat_ws(' ',p.name,w.id::text,a.bank_name) as _search,w.status::text as _status,array[w.teacher_id] as _members
        from public.withdrawal_requests w join public.profiles p on p.id=w.teacher_id left join public.settlement_accounts a on a.teacher_id=w.teacher_id$q$;
    when 'reviews' then
      base:=$q$select r.id,r.student_id,r.teacher_id,st.name as student_name,t.name as teacher_name,r.rating,r.text,r.teacher_reply,r.created_at,
        concat_ws(' ',st.name,t.name,r.text,r.id::text) as _search,case when r.rating<=2 then 'low' when r.teacher_reply is null then 'unanswered' else 'replied' end as _status,
        array[r.student_id,r.teacher_id] as _members from public.reviews r join public.profiles st on st.id=r.student_id join public.profiles t on t.id=r.teacher_id$q$;
    when 'coupons' then
      base:=$q$select c.id,c.code,c.title,c.discount_type,c.discount_value,c.min_order_amount,c.expires_at,c.is_active,c.created_at,
        (select count(*) from public.user_coupons uc where uc.coupon_id=c.id) as issued,
        concat_ws(' ',c.title,c.code,c.id::text) as _search,case when not c.is_active then 'inactive' when c.expires_at<now() then 'expired' else 'active' end as _status,
        array[]::uuid[] as _members from public.coupons c$q$;
    when 'tickets' then
      base:=$q$select s.*,p.name as requester_name,p.role as requester_role,
        concat_ws(' ',p.name,s.title,s.body,s.response,s.id::text) as _search,s.status as _status,array[s.requester_id] as _members
        from public.support_tickets s join public.profiles p on p.id=s.requester_id$q$;
    when 'audit' then
      base:=$q$select a.id,a.actor_id,p.name as actor_name,a.action,a.target_id,a.reason,a.before_data,a.after_data,a.created_at,
        concat_ws(' ',p.name,a.action,a.reason,a.target_id::text) as _search,a.action as _status,array[a.target_id] as _members
        from public.admin_audit_logs a join public.profiles p on p.id=a.actor_id$q$;
    else raise exception 'Invalid admin section';
  end case;
  predicate:=' where ($1='''' or position(lower($1) in lower(coalesce(b._search,'''')))>0)
    and ($2='''' or b._status=$2) and ($3 is null or b.created_at>=($3::timestamp at time zone ''Asia/Seoul''))
    and ($4 is null or b.created_at<(($4+1)::timestamp at time zone ''Asia/Seoul''))
    and ($5 is null or $5=any(b._members))';
  execute 'select count(*) from ('||base||') b'||predicate into total using coalesce(trim(p_query),''),coalesce(p_status,''),p_from,p_to,p_member_id;
  page:=greatest(1,least(coalesce(p_page,1),greatest(1,ceil(total::numeric/size)::integer)));
  execute 'select coalesce(jsonb_agg(to_jsonb(r)-''_search''-''_status''-''_members''),''[]''::jsonb) from
    (select b.* from ('||base||') b'||predicate||' order by b.created_at desc,b.id desc limit $6 offset $7) r'
    into rows using coalesce(trim(p_query),''),coalesce(p_status,''),p_from,p_to,p_member_id,size,(page-1)*size;
  return jsonb_build_object('rows',rows,'total',total,'page',page,'pageSize',size);
end;
$$;

create or replace function public.admin_member(p_id uuid) returns jsonb
language plpgsql stable security definer set search_path = '' as $$
declare result jsonb;
begin
  if not public.admin_is_authorized() then raise exception 'Admin access required' using errcode='42501'; end if;
  select jsonb_build_object('profile',to_jsonb(p),'email',u.email,'lastSignInAt',u.last_sign_in_at,
    'teacher',to_jsonb(t),'application',to_jsonb(a),'note',coalesce(n.note,''),'noteUpdatedAt',n.updated_at,
    'bookings',(select count(*) from public.enrollments where student_id=p.id),
    'lessons',(select count(*) from public.teacher_lessons where teacher_id=p.id),
    'sessions',(select count(*) from public.lesson_sessions where teacher_id=p.id),
    'reviews',(select count(*) from public.reviews where teacher_id=p.id or student_id=p.id))
    into result from public.profiles p join auth.users u on u.id=p.id
    left join public.teacher_profiles t on t.profile_id=p.id left join public.admin_profile_notes n on n.profile_id=p.id left join public.teacher_applications a on a.profile_id=p.id where p.id=p_id;
  if result is null then raise exception 'Member not found' using errcode='P0002'; end if;
  return result;
end;
$$;
notify pgrst,'reload schema';
commit;
