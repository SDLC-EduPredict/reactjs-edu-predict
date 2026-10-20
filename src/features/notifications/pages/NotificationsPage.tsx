import { useState } from 'react';
import { Bell, CheckCheck, Trash2 } from 'lucide-react';
import { Badge, Button, Card, EmptyState, ErrorState, PageHeader, Pagination, Select, Skeleton, Tabs } from '@/components/ui';
import { env } from '@/config/env';
import { getErrorMessage } from '@/lib/api/apiError';
import { useDocumentTitle } from '@/lib/hooks/useDocumentTitle';
import { cn } from '@/lib/utils/cn';
import { formatRelative, humanize } from '@/lib/utils/format';
import { useDeleteNotification, useMarkAllNotificationsRead, useMarkNotificationRead, useNotifications } from '../hooks/useNotifications';
import { NOTIFICATION_TYPES } from '../types';

type ReadFilter = 'all' | 'unread' | 'read';

export const NotificationsPage = () => {
  useDocumentTitle('Notifications');
  const [readFilter, setReadFilter] = useState<ReadFilter>('all');
  const [type, setType] = useState('');
  const [page, setPage] = useState(1);
  const notifications = useNotifications({
    page,
    page_size: env.defaultPageSize,
    notification_type: type,
    is_read: readFilter === 'all' ? undefined : String(readFilter === 'read'),
  });
  const markRead = useMarkNotificationRead();
  const markAll = useMarkAllNotificationsRead();
  const remove = useDeleteNotification();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Inbox"
        title="Notifications"
        description="Course, assignment, assessment, academic and administrative updates."
        actions={
          <Button variant="outline" icon={<CheckCheck className="h-4 w-4" />} onClick={() => markAll.mutate()} loading={markAll.isPending} disabled={!notifications.data?.unread_count}>
            Mark all as read
          </Button>
        }
      />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Tabs
          value={readFilter}
          onChange={(value) => {
            setReadFilter(value);
            setPage(1);
          }}
          tabs={[
            { value: 'all', label: 'All' },
            { value: 'unread', label: 'Unread', count: notifications.data?.unread_count },
            { value: 'read', label: 'Read' },
          ]}
        />
        <Select
          aria-label="Notification type"
          containerClassName="sm:w-56"
          value={type}
          onChange={(event) => {
            setType(event.target.value);
            setPage(1);
          }}
          placeholder="All types"
          options={NOTIFICATION_TYPES.map((item) => ({ value: item.value, label: item.label }))}
        />
      </div>
      <Card>
        {notifications.isError ? (
          <ErrorState message={getErrorMessage(notifications.error)} onRetry={() => notifications.refetch()} />
        ) : notifications.isPending ? (
          <div className="space-y-3 p-5">
            {Array.from({ length: 4 }, (_, index) => (
              <Skeleton key={index} className="h-16" />
            ))}
          </div>
        ) : notifications.data.results.length === 0 ? (
          <EmptyState icon={<Bell className="h-6 w-6" />} title="You're all caught up" description="New notifications will appear here." />
        ) : (
          <>
            <ul className="divide-y divide-slate-100">
              {notifications.data.results.map((item) => (
                <li key={item.id} className={cn('flex gap-4 px-5 py-4 transition-colors', !item.is_read && 'bg-brand-50/40')}>
                  <span className={cn('mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full', item.is_read ? 'bg-slate-200' : 'bg-brand-500')} />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                      <Badge tone="violet">{item.notification_type_display ?? humanize(item.notification_type)}</Badge>
                      {item.course && <Badge tone="slate">{item.course.title}</Badge>}
                    </div>
                    <p className="mt-1 text-sm text-slate-600">{item.message}</p>
                    <p className="mt-1 text-[11px] text-slate-400">{formatRelative(item.created_at)}</p>
                  </div>
                  <div className="flex shrink-0 items-start gap-1">
                    {!item.is_read && (
                      <Button size="sm" variant="ghost" onClick={() => markRead.mutate(item.id)}>
                        Mark read
                      </Button>
                    )}
                    <button type="button" onClick={() => remove.mutate(item.id)} className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600" aria-label="Delete notification">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <Pagination page={page} pageSize={env.defaultPageSize} count={notifications.data.count} onPageChange={setPage} />
          </>
        )}
      </Card>
    </div>
  );
};

export default NotificationsPage;
