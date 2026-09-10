-- VORA 1단계 스키마: 예약/매칭 마켓플레이스 도메인
-- 그룹 강의가 기본(capacity > 1), 1:1은 capacity = 1인 특수 케이스로 같은 구조를 공유한다.

-- ─── Extensions ─────────────────────────────────────────────────────────────
create extension if not exists "pgcrypto";

-- ─── Enums ──────────────────────────────────────────────────────────────────
create type user_role as enum ('student', 'teacher', 'admin');
create type korean_level as enum ('beginner', 'elementary', 'intermediate', 'advanced', 'topik1', 'topik2');
create type lesson_type as enum ('group', '1on1', 'free_trial');
create type session_status as enum ('scheduled', 'ongoing', 'completed', 'cancelled');
create type enrollment_status as enum ('pending_payment', 'confirmed', 'completed', 'cancelled', 'no_show');
create type attendance_status as enum ('present', 'late', 'absent');
create type payment_status as enum ('pending', 'succeeded', 'refunded', 'cancelled');
create type payment_method as enum ('card', 'paypal', 'kakaopay');
create type coupon_status as enum ('available', 'used', 'expired');
create type notification_type as enum ('lesson_reminder', 'booking_status', 'chat_message', 'payment', 'settlement');
create type withdrawal_status as enum ('requested', 'processing', 'completed', 'rejected');
create type message_type as enum ('text', 'file');
create type settlement_status as enum ('pending', 'paid');

-- ─── updated_at 공통 트리거 함수 ─────────────────────────────────────────────
create function set_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ─── profiles ───────────────────────────────────────────────────────────────
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role user_role not null default 'student',
  active_role user_role,
  name text not null,
  avatar_url text,
  native_language text,
  korean_level korean_level not null default 'beginner',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger profiles_set_updated_at
  before update on profiles
  for each row execute function set_updated_at();

-- auth.users 가입 시 profiles 자동 생성 (raw_user_meta_data에서 name/nativeLanguage/koreanLevel 전달)
create function handle_new_user() returns trigger as $$
begin
  insert into public.profiles (id, name, native_language, korean_level, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'name', 'New User'),
    new.raw_user_meta_data ->> 'native_language',
    coalesce((new.raw_user_meta_data ->> 'korean_level')::korean_level, 'beginner'),
    coalesce((new.raw_user_meta_data ->> 'role')::user_role, 'student')
  );
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ─── teacher_profiles ───────────────────────────────────────────────────────
create table teacher_profiles (
  profile_id uuid primary key references profiles(id) on delete cascade,
  headline text,
  bio text,
  intro_video_url text,
  years_experience integer,
  specialties text[] not null default '{}',
  country text,
  is_verified boolean not null default false,
  rating_avg numeric(2, 1) not null default 0,
  rating_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger teacher_profiles_set_updated_at
  before update on teacher_profiles
  for each row execute function set_updated_at();

-- ─── teacher_availability ───────────────────────────────────────────────────
create table teacher_availability (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references profiles(id) on delete cascade,
  weekday smallint not null check (weekday between 0 and 6),
  start_time time not null,
  end_time time not null,
  created_at timestamptz not null default now()
);

create index teacher_availability_teacher_id_idx on teacher_availability(teacher_id);

-- ─── teacher_lessons (선생님이 등록하는 수업 상품, 그룹이 기본) ──────────────
create table teacher_lessons (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references profiles(id) on delete cascade,
  type lesson_type not null default 'group',
  category text not null,
  title text not null,
  level text,
  price integer not null default 0,
  currency text not null default 'KRW',
  capacity integer not null default 6,
  description text,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint teacher_lessons_1on1_capacity check (type <> '1on1' or capacity = 1)
);

create index teacher_lessons_teacher_id_idx on teacher_lessons(teacher_id);
create index teacher_lessons_published_idx on teacher_lessons(is_published) where is_published = true;

create trigger teacher_lessons_set_updated_at
  before update on teacher_lessons
  for each row execute function set_updated_at();

-- ─── lesson_sessions (실제 예약 가능한 수업 1회차) ───────────────────────────
create table lesson_sessions (
  id uuid primary key default gen_random_uuid(),
  teacher_lesson_id uuid references teacher_lessons(id) on delete set null,
  teacher_id uuid not null references profiles(id) on delete cascade,
  title text not null,
  type lesson_type not null default 'group',
  scheduled_at timestamptz not null,
  duration_minutes integer not null default 50,
  capacity integer not null default 6,
  enrolled_count integer not null default 0,
  status session_status not null default 'scheduled',
  meeting_link text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint lesson_sessions_1on1_capacity check (type <> '1on1' or capacity = 1)
);

create index lesson_sessions_teacher_id_idx on lesson_sessions(teacher_id);
create index lesson_sessions_scheduled_at_idx on lesson_sessions(scheduled_at);

create trigger lesson_sessions_set_updated_at
  before update on lesson_sessions
  for each row execute function set_updated_at();

-- ─── enrollments (학생의 예약/참여 레코드) ───────────────────────────────────
create table enrollments (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references lesson_sessions(id) on delete cascade,
  student_id uuid not null references profiles(id) on delete cascade,
  status enrollment_status not null default 'pending_payment',
  package_type text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (session_id, student_id)
);

create index enrollments_student_id_idx on enrollments(student_id);
create index enrollments_session_id_idx on enrollments(session_id);

create trigger enrollments_set_updated_at
  before update on enrollments
  for each row execute function set_updated_at();

-- 세션의 enrolled_count를 confirmed 상태 enrollment 수와 동기화
create function sync_session_enrolled_count() returns trigger as $$
declare
  target_session_id uuid;
begin
  target_session_id := coalesce(new.session_id, old.session_id);

  update lesson_sessions
  set enrolled_count = (
    select count(*) from enrollments
    where session_id = target_session_id and status in ('confirmed', 'completed')
  )
  where id = target_session_id;

  return null;
end;
$$ language plpgsql security definer set search_path = public;

create trigger enrollments_sync_count
  after insert or update or delete on enrollments
  for each row execute function sync_session_enrolled_count();

-- ─── attendance_records ───────────────────────────────────────────────────
create table attendance_records (
  id uuid primary key default gen_random_uuid(),
  enrollment_id uuid not null references enrollments(id) on delete cascade,
  status attendance_status not null default 'present',
  recorded_by uuid references profiles(id),
  recorded_at timestamptz not null default now(),
  unique (enrollment_id)
);

-- ─── coupons / user_coupons ─────────────────────────────────────────────────
create table coupons (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  title text not null,
  discount_type text not null check (discount_type in ('fixed', 'percent')),
  discount_value integer not null,
  min_order_amount integer not null default 0,
  expires_at timestamptz,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table user_coupons (
  id uuid primary key default gen_random_uuid(),
  coupon_id uuid not null references coupons(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  status coupon_status not null default 'available',
  used_at timestamptz,
  created_at timestamptz not null default now(),
  unique (coupon_id, user_id)
);

create index user_coupons_user_id_idx on user_coupons(user_id);

-- ─── payments ───────────────────────────────────────────────────────────────
create table payments (
  id uuid primary key default gen_random_uuid(),
  enrollment_id uuid references enrollments(id) on delete set null,
  student_id uuid not null references profiles(id) on delete cascade,
  amount integer not null,
  currency text not null default 'KRW',
  method payment_method not null,
  status payment_status not null default 'pending',
  user_coupon_id uuid references user_coupons(id),
  pg_transaction_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index payments_student_id_idx on payments(student_id);

create trigger payments_set_updated_at
  before update on payments
  for each row execute function set_updated_at();

-- ─── reviews ────────────────────────────────────────────────────────────────
create table reviews (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references lesson_sessions(id) on delete set null,
  teacher_id uuid not null references profiles(id) on delete cascade,
  student_id uuid not null references profiles(id) on delete cascade,
  rating smallint not null check (rating between 1 and 5),
  text text,
  teacher_reply text,
  teacher_reply_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index reviews_teacher_id_idx on reviews(teacher_id);

create trigger reviews_set_updated_at
  before update on reviews
  for each row execute function set_updated_at();

-- teacher_profiles.rating_avg / rating_count를 reviews와 동기화
create function sync_teacher_rating() returns trigger as $$
declare
  target_teacher_id uuid;
begin
  target_teacher_id := coalesce(new.teacher_id, old.teacher_id);

  update teacher_profiles
  set
    rating_avg = coalesce((select round(avg(rating)::numeric, 1) from reviews where teacher_id = target_teacher_id), 0),
    rating_count = (select count(*) from reviews where teacher_id = target_teacher_id)
  where profile_id = target_teacher_id;

  return null;
end;
$$ language plpgsql security definer set search_path = public;

create trigger reviews_sync_rating
  after insert or update or delete on reviews
  for each row execute function sync_teacher_rating();

-- ─── wishlists ──────────────────────────────────────────────────────────────
create table wishlists (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references profiles(id) on delete cascade,
  teacher_id uuid not null references profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (student_id, teacher_id)
);

-- ─── chat_rooms / chat_messages ─────────────────────────────────────────────
create table chat_rooms (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references profiles(id) on delete cascade,
  student_id uuid not null references profiles(id) on delete cascade,
  last_message_at timestamptz,
  created_at timestamptz not null default now(),
  unique (teacher_id, student_id)
);

create table chat_messages (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references chat_rooms(id) on delete cascade,
  sender_id uuid not null references profiles(id) on delete cascade,
  type message_type not null default 'text',
  text text,
  file_name text,
  file_url text,
  file_size text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index chat_messages_room_id_created_at_idx on chat_messages(room_id, created_at);

create function touch_chat_room_last_message() returns trigger as $$
begin
  update chat_rooms set last_message_at = new.created_at where id = new.room_id;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger chat_messages_touch_room
  after insert on chat_messages
  for each row execute function touch_chat_room_last_message();

-- ─── notifications ──────────────────────────────────────────────────────────
create table notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  type notification_type not null,
  title text not null,
  body text,
  link_url text,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create index notifications_user_id_is_read_idx on notifications(user_id, is_read);

-- ─── settlement_accounts / settlements / withdrawal_requests ────────────────
create table settlement_accounts (
  teacher_id uuid primary key references profiles(id) on delete cascade,
  bank_name text not null,
  account_holder text not null,
  account_number text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger settlement_accounts_set_updated_at
  before update on settlement_accounts
  for each row execute function set_updated_at();

create table settlements (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references profiles(id) on delete cascade,
  period_start date not null,
  period_end date not null,
  gross_amount integer not null default 0,
  platform_fee integer not null default 0,
  net_amount integer not null default 0,
  status settlement_status not null default 'pending',
  paid_at timestamptz,
  created_at timestamptz not null default now()
);

create index settlements_teacher_id_idx on settlements(teacher_id);

create table withdrawal_requests (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references profiles(id) on delete cascade,
  amount integer not null,
  status withdrawal_status not null default 'requested',
  requested_at timestamptz not null default now(),
  processed_at timestamptz
);

create index withdrawal_requests_teacher_id_idx on withdrawal_requests(teacher_id);

-- ─── materials (선생님 수업자료 보관함) ──────────────────────────────────────
create table materials (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references profiles(id) on delete cascade,
  file_name text not null,
  file_url text not null,
  file_size text,
  folder text,
  created_at timestamptz not null default now()
);

create index materials_teacher_id_idx on materials(teacher_id);

-- ══════════════════════════════════════════════════════════════════════════
-- Row Level Security
-- ══════════════════════════════════════════════════════════════════════════

alter table profiles enable row level security;
alter table teacher_profiles enable row level security;
alter table teacher_availability enable row level security;
alter table teacher_lessons enable row level security;
alter table lesson_sessions enable row level security;
alter table enrollments enable row level security;
alter table attendance_records enable row level security;
alter table coupons enable row level security;
alter table user_coupons enable row level security;
alter table payments enable row level security;
alter table reviews enable row level security;
alter table wishlists enable row level security;
alter table chat_rooms enable row level security;
alter table chat_messages enable row level security;
alter table notifications enable row level security;
alter table settlement_accounts enable row level security;
alter table settlements enable row level security;
alter table withdrawal_requests enable row level security;
alter table materials enable row level security;

-- profiles: 이름/아바타 등은 예약·채팅·리뷰 전반에 노출되어야 하므로 공개 SELECT.
-- 민감정보(email)는 auth.users에만 있고 profiles에는 없음.
create policy profiles_select_all on profiles for select using (true);
create policy profiles_update_own on profiles for update using (auth.uid() = id);

-- teacher_profiles: 마켓플레이스 공개 열람.
create policy teacher_profiles_select_all on teacher_profiles for select using (true);
create policy teacher_profiles_insert_own on teacher_profiles for insert with check (auth.uid() = profile_id);
create policy teacher_profiles_update_own on teacher_profiles for update using (auth.uid() = profile_id);
create policy teacher_profiles_delete_own on teacher_profiles for delete using (auth.uid() = profile_id);

create policy teacher_availability_select_all on teacher_availability for select using (true);
create policy teacher_availability_write_own on teacher_availability for all
  using (auth.uid() = teacher_id) with check (auth.uid() = teacher_id);

-- teacher_lessons: 게시된 상품은 누구나, 비게시 상품은 소유 선생님만.
create policy teacher_lessons_select on teacher_lessons for select
  using (is_published = true or auth.uid() = teacher_id);
create policy teacher_lessons_write_own on teacher_lessons for all
  using (auth.uid() = teacher_id) with check (auth.uid() = teacher_id);

-- lesson_sessions: 로그인한 사용자는 열람 가능(예약 화면에서 빈 슬롯 탐색), 쓰기는 담당 선생님만.
-- 학생이 직접 예약을 생성하는 흐름은 이후 단계에서 서버(Edge Function, service role)로 처리.
create policy lesson_sessions_select_authenticated on lesson_sessions for select
  using (auth.role() = 'authenticated');
create policy lesson_sessions_write_own on lesson_sessions for all
  using (auth.uid() = teacher_id) with check (auth.uid() = teacher_id);

-- enrollments: 학생 본인 또는 담당 선생님만 조회.
create policy enrollments_select on enrollments for select
  using (
    auth.uid() = student_id
    or auth.uid() in (select teacher_id from lesson_sessions where id = enrollments.session_id)
  );
create policy enrollments_insert_own on enrollments for insert with check (auth.uid() = student_id);
create policy enrollments_update on enrollments for update
  using (
    auth.uid() = student_id
    or auth.uid() in (select teacher_id from lesson_sessions where id = enrollments.session_id)
  );
create policy enrollments_delete_own on enrollments for delete using (auth.uid() = student_id);

-- attendance_records: 담당 선생님이 기록/조회, 학생은 본인 기록만 조회.
create policy attendance_select on attendance_records for select
  using (
    auth.uid() in (select teacher_id from lesson_sessions ls join enrollments e on e.session_id = ls.id where e.id = attendance_records.enrollment_id)
    or auth.uid() in (select student_id from enrollments where id = attendance_records.enrollment_id)
  );
create policy attendance_write_teacher on attendance_records for all
  using (auth.uid() in (select teacher_id from lesson_sessions ls join enrollments e on e.session_id = ls.id where e.id = attendance_records.enrollment_id))
  with check (auth.uid() in (select teacher_id from lesson_sessions ls join enrollments e on e.session_id = ls.id where e.id = attendance_records.enrollment_id));

-- coupons: 활성 쿠폰 카탈로그는 공개, 생성/수정은 서비스 롤(관리자)만.
create policy coupons_select_active on coupons for select using (is_active = true);

-- user_coupons: 본인 발급분만. 발급 자체는 서비스 롤에서 처리(별도 INSERT 정책 없음).
create policy user_coupons_select_own on user_coupons for select using (auth.uid() = user_id);
create policy user_coupons_update_own on user_coupons for update using (auth.uid() = user_id);

-- payments: 본인 결제만.
create policy payments_select_own on payments for select using (auth.uid() = student_id);
create policy payments_insert_own on payments for insert with check (auth.uid() = student_id);
create policy payments_update_own on payments for update using (auth.uid() = student_id);

-- reviews: 공개 열람, 작성은 본인 학생, 수정은 작성자 또는 대상 선생님(답변).
create policy reviews_select_all on reviews for select using (true);
create policy reviews_insert_own on reviews for insert with check (auth.uid() = student_id);
create policy reviews_update on reviews for update using (auth.uid() = student_id or auth.uid() = teacher_id);
create policy reviews_delete_own on reviews for delete using (auth.uid() = student_id);

-- wishlists: 본인 것만.
create policy wishlists_all_own on wishlists for all
  using (auth.uid() = student_id) with check (auth.uid() = student_id);

-- chat_rooms / chat_messages: 참여자만.
create policy chat_rooms_select on chat_rooms for select
  using (auth.uid() = teacher_id or auth.uid() = student_id);
create policy chat_rooms_insert on chat_rooms for insert
  with check (auth.uid() = teacher_id or auth.uid() = student_id);
create policy chat_rooms_update on chat_rooms for update
  using (auth.uid() = teacher_id or auth.uid() = student_id);

create policy chat_messages_select on chat_messages for select
  using (auth.uid() in (select teacher_id from chat_rooms where id = chat_messages.room_id
                         union select student_id from chat_rooms where id = chat_messages.room_id));
create policy chat_messages_insert on chat_messages for insert
  with check (
    auth.uid() = sender_id
    and auth.uid() in (select teacher_id from chat_rooms where id = chat_messages.room_id
                        union select student_id from chat_rooms where id = chat_messages.room_id)
  );
create policy chat_messages_update on chat_messages for update
  using (auth.uid() in (select teacher_id from chat_rooms where id = chat_messages.room_id
                         union select student_id from chat_rooms where id = chat_messages.room_id));

-- notifications: 본인 것만 조회/읽음처리. 생성은 서비스 롤(트리거/Edge Function)만.
create policy notifications_select_own on notifications for select using (auth.uid() = user_id);
create policy notifications_update_own on notifications for update using (auth.uid() = user_id);

-- settlement_accounts / settlements / withdrawal_requests: 담당 선생님만.
create policy settlement_accounts_all_own on settlement_accounts for all
  using (auth.uid() = teacher_id) with check (auth.uid() = teacher_id);

create policy settlements_select_own on settlements for select using (auth.uid() = teacher_id);

create policy withdrawal_select_own on withdrawal_requests for select using (auth.uid() = teacher_id);
create policy withdrawal_insert_own on withdrawal_requests for insert with check (auth.uid() = teacher_id);
create policy withdrawal_update_own_pending on withdrawal_requests for update
  using (auth.uid() = teacher_id and status = 'requested');

-- materials: 담당 선생님만.
create policy materials_all_own on materials for all
  using (auth.uid() = teacher_id) with check (auth.uid() = teacher_id);
