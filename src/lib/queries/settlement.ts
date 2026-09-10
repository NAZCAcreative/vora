import { createClient } from '@/lib/supabase/client';

export type SettlementAccount = {
  bankName: string;
  accountHolder: string;
  accountNumber: string;
};

export async function getSettlementAccount(teacherId: string): Promise<SettlementAccount | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('settlement_accounts')
    .select('bank_name, account_holder, account_number')
    .eq('teacher_id', teacherId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) return null;
  return { bankName: data.bank_name, accountHolder: data.account_holder, accountNumber: data.account_number };
}

export async function saveSettlementAccount(teacherId: string, account: SettlementAccount): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from('settlement_accounts').upsert({
    teacher_id: teacherId,
    bank_name: account.bankName,
    account_holder: account.accountHolder,
    account_number: account.accountNumber,
  });
  if (error) throw new Error(error.message);
}

export type SettlementRow = {
  id: string;
  periodStart: string;
  periodEnd: string;
  grossAmount: number;
  platformFee: number;
  netAmount: number;
  status: 'pending' | 'paid';
};

export async function listSettlements(teacherId: string, page = 1): Promise<SettlementRow[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('settlements')
    .select('id, period_start, period_end, gross_amount, platform_fee, net_amount, status')
    .eq('teacher_id', teacherId)
    .eq('currency', 'KRW').eq('verified_settlement', true)
    .order('period_start', { ascending: false }).order('id', { ascending: false }).range((page - 1) * 20, page * 20 - 1);

  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => ({
    id: row.id,
    periodStart: row.period_start,
    periodEnd: row.period_end,
    grossAmount: row.gross_amount,
    platformFee: row.platform_fee,
    netAmount: row.net_amount,
    status: row.status,
  }));
}

export type WithdrawalRow = {
  id: string;
  amount: number;
  status: 'requested' | 'processing' | 'completed' | 'rejected';
  requestedAt: string;
};

export async function listWithdrawals(teacherId: string, page = 1): Promise<WithdrawalRow[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('withdrawal_requests')
    .select('id, amount, status, requested_at')
    .eq('teacher_id', teacherId)
    .order('requested_at', { ascending: false }).order('id', { ascending: false }).range((page - 1) * 20, page * 20 - 1);

  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => ({ id: row.id, amount: row.amount, status: row.status, requestedAt: row.requested_at }));
}

export type BalanceSummary = {
  totalGross?: number;
  totalFee?: number;
  thisMonthSettled?: number;
  totalSettled: number;
  totalWithdrawn: number;
  availableBalance: number;
};

export async function getBalanceSummary(teacherId: string): Promise<BalanceSummary> {
  const { data, error } = await createClient().rpc('my_balance');
  if (error) throw new Error(error.message);
  return data as BalanceSummary;
}

export async function requestWithdrawal(teacherId: string, amount: number, requestId: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.rpc('request_withdrawal', { p_amount: amount, p_request_id: requestId });
  if (error) throw new Error(error.message);
}
