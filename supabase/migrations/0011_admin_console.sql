begin;

create table if not exists public.admin_members (
  profile_id uuid primary key references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint single_initial_admin check (profile_id = '3429c1b9-9b35-45dd-87fb-64fccf769a9a'::uuid)
);
alter table public.admin_members enable row level security;
revoke all on public.admin_members from anon, authenticated;
insert into public.admin_members(profile_id)
select id from public.profiles where id='3429c1b9-9b35-45dd-87fb-64fccf769a9a'
on conflict do nothing;

create or replace function public.admin_is_authorized() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists(select 1 from public.admin_members where profile_id = auth.uid());
$$;
revoke all on function public.admin_is_authorized() from public, anon;
grant execute on function public.admin_is_authorized() to authenticated;

create table if not exists public.admin_profile_notes (
  profile_id uuid primary key references public.profiles(id) on delete cascade,
  note text not null default '' check (length(note)<=2000),
  updated_by uuid not null references public.profiles(id),
  updated_at timestamptz not null default now()
);
create table if not exists public.admin_audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid not null references public.profiles(id),
  action text not null,
  target_id uuid not null,
  reason text not null,
  before_data jsonb,
  after_data jsonb,
  created_at timestamptz not null default now()
);
alter table public.admin_profile_notes enable row level security;
alter table public.admin_audit_logs enable row level security;
revoke all on public.admin_profile_notes, public.admin_audit_logs from anon, authenticated;
create index if not exists admin_audit_logs_created_idx on public.admin_audit_logs(created_at desc,id);
create index if not exists admin_audit_logs_target_idx on public.admin_audit_logs(target_id,created_at desc);
create index if not exists profiles_created_id_idx on public.profiles(created_at desc,id);
create index if not exists teacher_lessons_created_id_idx on public.teacher_lessons(created_at desc,id);
create index if not exists enrollments_created_id_idx on public.enrollments(created_at desc,id);

create or replace function public.admin_dashboard() returns jsonb
language plpgsql stable security definer set search_path = '' as $$
begin
  if not public.admin_is_authorized() then raise exception 'Admin access required' using errcode='42501'; end if;
  return jsonb_build_object(
    'members',(select count(*) from public.profiles),
    'students',(select count(*) from public.profiles p where p.role='student' or exists(select 1 from public.enrollments e where e.student_id=p.id)),
    'teachers',(select count(*) from public.teacher_profiles),
    'newMembers',(select count(*) from public.profiles where created_at>=now()-interval '7 days'),
    'unverifiedTeachers',(select count(*) from public.teacher_profiles where not is_verified),
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
        u.last_sign_in_at,t.is_verified,t.headline,t.rating_avg,t.rating_count,t.specialties,
        (select count(*) from public.enrollments e where e.student_id=p.id) as bookings,
        (select count(*) from public.teacher_lessons l where l.teacher_id=p.id) as lessons,
        (n.profile_id is not null and n.note<>'') as has_note,
        concat_ws(' ',p.name,u.email,p.id::text,p.native_language,t.headline,array_to_string(t.specialties,' ')) as _search,
        case when t.is_verified then 'verified' else 'unverified' end as _status,
        array[p.id] as _members
        from public.profiles p join auth.users u on u.id=p.id
        left join public.teacher_profiles t on t.profile_id=p.id
        left join public.admin_profile_notes n on n.profile_id=p.id$q$;
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
    'teacher',to_jsonb(t),'note',coalesce(n.note,''),'noteUpdatedAt',n.updated_at,
    'bookings',(select count(*) from public.enrollments where student_id=p.id),
    'lessons',(select count(*) from public.teacher_lessons where teacher_id=p.id),
    'sessions',(select count(*) from public.lesson_sessions where teacher_id=p.id),
    'reviews',(select count(*) from public.reviews where teacher_id=p.id or student_id=p.id))
    into result from public.profiles p join auth.users u on u.id=p.id
    left join public.teacher_profiles t on t.profile_id=p.id left join public.admin_profile_notes n on n.profile_id=p.id where p.id=p_id;
  if result is null then raise exception 'Member not found' using errcode='P0002'; end if;
  return result;
end;
$$;

create or replace function public.admin_mutate(p_action text,p_id uuid,p_data jsonb,p_reason text,p_expected jsonb)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare before_row jsonb; after_row jsonb;
begin
  if not public.admin_is_authorized() then raise exception 'Admin access required' using errcode='42501'; end if;
  if length(trim(coalesce(p_reason,'')))<3 or length(p_reason)>500 then raise exception 'A reason of 3 to 500 characters is required'; end if;
  if p_expected is null or p_expected='{}'::jsonb then raise exception 'Expected previous value is required'; end if;
  case p_action
    when 'profile' then
      select to_jsonb(p) into before_row from public.profiles p where id=p_id for update;
      if not (p_expected ? 'updated_at') then raise exception 'Expected timestamp required'; end if;
    when 'teacher_verified' then
      select to_jsonb(t) into before_row from public.teacher_profiles t where profile_id=p_id for update;
      if not (p_expected ? 'is_verified') then raise exception 'Expected verification required'; end if;
    when 'lesson_published' then
      select to_jsonb(l) into before_row from public.teacher_lessons l where id=p_id for update;
      if not (p_expected ? 'is_published') then raise exception 'Expected visibility required'; end if;
    when 'coupon_active' then
      select to_jsonb(c) into before_row from public.coupons c where id=p_id for update;
      if not (p_expected ? 'is_active') then raise exception 'Expected activity required'; end if;
    when 'note' then
      perform 1 from public.profiles where id=p_id for update;
      if not found then raise exception 'Member not found'; end if;
      select to_jsonb(n) into before_row from public.admin_profile_notes n where profile_id=p_id;
      before_row:=coalesce(before_row,jsonb_build_object('updated_at',null,'note',''));
      if not (p_expected ? 'updated_at') then raise exception 'Expected timestamp required'; end if;
    else raise exception 'Invalid admin action';
  end case;
  if before_row is null then raise exception 'Record not found' using errcode='P0002'; end if;
  if not (before_row @> p_expected) then raise exception 'Record changed; refresh before saving' using errcode='40001'; end if;
  case p_action
    when 'profile' then
      if length(trim(coalesce(p_data->>'name','')))<1 or length(p_data->>'name')>80 or length(coalesce(p_data->>'native_language',''))>80 then raise exception 'Invalid profile'; end if;
      update public.profiles set name=trim(p_data->>'name'),native_language=nullif(trim(p_data->>'native_language'),''),korean_level=(p_data->>'korean_level')::public.korean_level
        where id=p_id returning to_jsonb(profiles.*) into after_row;
    when 'teacher_verified' then
      if jsonb_typeof(p_data->'is_verified') is distinct from 'boolean' then raise exception 'Boolean required'; end if;
      update public.teacher_profiles set is_verified=(p_data->>'is_verified')::boolean where profile_id=p_id returning to_jsonb(teacher_profiles.*) into after_row;
    when 'lesson_published' then
      if jsonb_typeof(p_data->'is_published') is distinct from 'boolean' then raise exception 'Boolean required'; end if;
      update public.teacher_lessons set is_published=(p_data->>'is_published')::boolean where id=p_id returning to_jsonb(teacher_lessons.*) into after_row;
    when 'coupon_active' then
      if jsonb_typeof(p_data->'is_active') is distinct from 'boolean' then raise exception 'Boolean required'; end if;
      update public.coupons set is_active=(p_data->>'is_active')::boolean where id=p_id returning to_jsonb(coupons.*) into after_row;
    when 'note' then
      if p_data->>'note' is null or length(p_data->>'note')>2000 then raise exception 'Invalid note'; end if;
      insert into public.admin_profile_notes(profile_id,note,updated_by) values(p_id,p_data->>'note',auth.uid())
        on conflict(profile_id) do update set note=excluded.note,updated_by=excluded.updated_by,updated_at=clock_timestamp()
        returning to_jsonb(admin_profile_notes.*) into after_row;
  end case;
  insert into public.admin_audit_logs(actor_id,action,target_id,reason,before_data,after_data)
    values(auth.uid(),p_action,p_id,trim(p_reason),before_row,after_row);
  return jsonb_build_object('ok',true);
end;
$$;

revoke all on function public.admin_dashboard() from public,anon;
revoke all on function public.admin_list(text,integer,integer,text,text,date,date,uuid) from public,anon;
revoke all on function public.admin_member(uuid) from public,anon;
revoke all on function public.admin_mutate(text,uuid,jsonb,text,jsonb) from public,anon;
grant execute on function public.admin_dashboard() to authenticated;
grant execute on function public.admin_list(text,integer,integer,text,text,date,date,uuid) to authenticated;
grant execute on function public.admin_member(uuid) to authenticated;
grant execute on function public.admin_mutate(text,uuid,jsonb,text,jsonb) to authenticated;

-- A member must not be able to self-approve their teacher verification via REST.
create or replace function public.guard_teacher_verification() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if auth.uid() is not null and not public.admin_is_authorized() then
    if (tg_op='INSERT' and new.is_verified) or (tg_op='UPDATE' and new.is_verified is distinct from old.is_verified) then
      raise exception 'Only administrators can change verification' using errcode='42501';
    end if;
  end if;
  return new;
end;
$$;
revoke all on function public.guard_teacher_verification() from public,anon,authenticated;
drop trigger if exists teacher_profiles_guard_verification on public.teacher_profiles;
create trigger teacher_profiles_guard_verification before insert or update of is_verified on public.teacher_profiles
  for each row execute function public.guard_teacher_verification();
notify pgrst,'reload schema';
commit;
