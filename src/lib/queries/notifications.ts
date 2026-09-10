import { createClient } from '@/lib/supabase/client';

export type NotificationRow = {
  id: string;
  type: 'lesson_reminder' | 'booking_status' | 'chat_message' | 'payment' | 'settlement';
  title: string;
  body: string | null;
  linkUrl: string | null;
  isRead: boolean;
  createdAt: string;
};

const TYPE_ICON: Record<NotificationRow['type'], string> = {
  lesson_reminder: 'notifications_active',
  booking_status: 'event_available',
  chat_message: 'chat_bubble',
  payment: 'payments',
  settlement: 'account_balance_wallet',
};

export function iconForNotification(type: NotificationRow['type']) {
  return TYPE_ICON[type] ?? 'notifications';
}

export async function listNotifications(userId: string, limit = 20, page = 1): Promise<NotificationRow[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('notifications')
    .select('id, type, title, body, link_url, is_read, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .order('id', { ascending: false }).range((page - 1) * limit, page * limit - 1);

  if (error) throw new Error(error.message);

  return (data ?? []).map((row) => ({
    id: row.id,
    type: row.type,
    title: row.title,
    body: row.body,
    linkUrl: row.link_url,
    isRead: row.is_read,
    createdAt: row.created_at,
  }));
}

export async function countUnreadNotifications(userId: string): Promise<number> {
  const supabase = createClient();
  const { count, error } = await supabase
    .from('notifications')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('is_read', false);

  if (error) throw new Error(error.message);
  return count ?? 0;
}

export async function markAllNotificationsRead(userId: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from('notifications').update({ is_read: true }).eq('user_id', userId).eq('is_read', false);
  if (error) throw new Error(error.message);
}

export function subscribeToNotifications(userId: string, onInsert: (notification: NotificationRow) => void) {
  const supabase = createClient();
  // 채널 이름은 고유해야 한다 — 같은 이름으로 여러 컴포넌트가 동시에 구독하면
  // 두 번째 subscribe() 호출이 "cannot add postgres_changes callbacks after subscribe()" 에러를 낸다.
  const channel = supabase
    .channel(`notifications-${userId}-${Math.random().toString(36).slice(2)}`)
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${userId}` },
      (payload) => {
        const row = payload.new as {
          id: string;
          type: NotificationRow['type'];
          title: string;
          body: string | null;
          link_url: string | null;
          is_read: boolean;
          created_at: string;
        };
        onInsert({
          id: row.id,
          type: row.type,
          title: row.title,
          body: row.body,
          linkUrl: row.link_url,
          isRead: row.is_read,
          createdAt: row.created_at,
        });
      },
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
