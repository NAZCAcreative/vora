-- Realtime: 채팅 메시지와 알림을 postgres_changes로 구독할 수 있게 publication에 추가.
alter publication supabase_realtime add table chat_messages;
alter publication supabase_realtime add table notifications;

-- ─── 알림 트리거: 채팅 메시지 도착 ────────────────────────────────────────────
create function notify_new_chat_message() returns trigger as $$
declare
  room record;
  recipient_id uuid;
  recipient_path text;
  sender_name text;
begin
  select * into room from chat_rooms where id = new.room_id;

  if room.teacher_id = new.sender_id then
    recipient_id := room.student_id;
    recipient_path := '/student/chat/' || new.room_id;
  else
    recipient_id := room.teacher_id;
    recipient_path := '/teacher/chat/' || new.room_id;
  end if;

  select name into sender_name from profiles where id = new.sender_id;

  insert into notifications (user_id, type, title, body, link_url)
  values (
    recipient_id,
    'chat_message',
    coalesce(sender_name, '상대방') || '님의 새 메시지',
    coalesce(new.text, '파일을 보냈습니다'),
    recipient_path
  );

  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger chat_messages_notify
  after insert on chat_messages
  for each row execute function notify_new_chat_message();

-- ─── 알림 트리거: 예약 확정 ──────────────────────────────────────────────────
create function notify_booking_confirmed() returns trigger as $$
declare
  session record;
  teacher_name text;
begin
  if new.status = 'confirmed' and old.status is distinct from 'confirmed' then
    select * into session from lesson_sessions where id = new.session_id;
    select name into teacher_name from profiles where id = session.teacher_id;

    insert into notifications (user_id, type, title, body, link_url)
    values (
      new.student_id,
      'booking_status',
      '예약이 확정됐어요',
      coalesce(teacher_name, '선생님') || '쌤과의 수업이 확정되었습니다.',
      '/student/bookings'
    );
  end if;

  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger enrollments_notify_confirmed
  after update on enrollments
  for each row execute function notify_booking_confirmed();

-- ─── 알림 트리거: 결제 완료 ──────────────────────────────────────────────────
create function notify_payment_succeeded() returns trigger as $$
begin
  if new.status = 'succeeded' then
    insert into notifications (user_id, type, title, body, link_url)
    values (
      new.student_id,
      'payment',
      '결제가 완료됐어요',
      '₩' || to_char(new.amount, 'FM999,999,999') || ' 결제가 정상 처리되었습니다.',
      '/student/payment-history'
    );
  end if;

  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger payments_notify_succeeded
  after insert on payments
  for each row execute function notify_payment_succeeded();
