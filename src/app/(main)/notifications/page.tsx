import { NotificationCenterContent } from '@/components/shared/NotificationLayer';

export default function NotificationsPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col px-container-margin pb-32 pt-stack-lg text-on-background">
      <NotificationCenterContent />
    </main>
  );
}
