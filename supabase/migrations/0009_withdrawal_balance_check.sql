-- 출금 신청 금액이 실제 정산 가능 잔액(지급완료 정산 합계 - 거절되지 않은 기존 출금 합계)을
-- 초과하지 않도록 서버(DB 트리거)에서 강제한다.
-- 이전에는 클라이언트가 계산한 availableBalance를 그대로 insert했을 뿐이라, 클라이언트를 거치지 않고
-- REST API를 직접 호출하거나 클라이언트 상태가 stale한 경우 실제 잔액을 초과한 출금 신청이 가능했다.
create function check_withdrawal_balance() returns trigger as $$
declare
  available integer;
begin
  if new.amount <= 0 then
    raise exception 'withdrawal amount must be positive';
  end if;

  select coalesce((select sum(net_amount) from settlements where teacher_id = new.teacher_id and status = 'paid'), 0)
       - coalesce((select sum(amount) from withdrawal_requests where teacher_id = new.teacher_id and status <> 'rejected'), 0)
  into available;

  if new.amount > available then
    raise exception 'withdrawal amount % exceeds available balance %', new.amount, available;
  end if;

  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger withdrawal_requests_check_balance
  before insert on withdrawal_requests
  for each row execute function check_withdrawal_balance();
