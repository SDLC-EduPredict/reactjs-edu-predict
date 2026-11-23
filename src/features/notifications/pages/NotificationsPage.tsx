import { useState } from 'react';
import { Bell, BookOpen, CheckCheck, ClipboardList, FileText, Megaphone, ShieldAlert, Trash2 } from 'lucide-react';
import { Button, Card, ConfirmDialog, EmptyState, Modal, PageHeader, Pagination, Select, Skeleton, Tabs } from '@/components/ui';
import { QueryView } from '@/components/domain/QueryView';
import { useDocumentTitle } from '@/lib/hooks/useDocumentTitle';
import { useListFilter } from '@/lib/hooks/useListFilter';
import { cn } from '@/lib/utils/cn';
import { formatDate, formatRelative } from '@/lib/utils/format';
import { useDeleteNotification, useMarkRead, useNotification, useNotifications, useReadAll, useUnreadCount } from '../hooks/useNotifications';
import { NOTIFICATION_TYPES } from '../types';

const ICONS: Record<string, typeof Bell> = {
  COURSE: BookOpen,
  ASSIGNMENT: FileText,
  ASSESSMENT: ClipboardList,
  ACADEMIC_ALERT: ShieldAlert,
  ADMINISTRATIVE: Megaphone,
};

const DetailModal = ({ id, onClose, onDelete }: { id: number | null; onClose: () => void; onDelete: (id: number) => void }) => {
  const detail = useNotification(id);
  return (
    <Modal
      open={id !== null}
      onClose={onClose}
      title={detail.data?.title ?? 'Notification'}
      description={detail.data ? `${detail.data.notification_type_display} · ${formatDate(detail.data.created_at, true)}` : undefined}
      footer={
        id !== null && (
          <>
            <Button variant="ghost" icon={<Trash2 className="h-4 w-4" />} onClick={() => onDelete(id)}>
              Delete
            </Button>
            <Button onClick={onClose}>Close</Button>
          </>
        )
      }
    >
      <QueryView query={detail} loading={<Skeleton className="h-24 w-full" />}>
        {(item) => (
          <div className="space-y-3 text-sm">
            <p className="whitespace-pre-line leading-relaxed text-slate-700">{item.message}</p>
            <div className="flex flex-wrap gap-2 text-[11px] text-slate-500">
              {item.course && <span className="rounded-full bg-brand-50 px-2.5 py-0.5 font-semibold text-brand-700">{item.course.title}</span>}
              {item.sent_by && <span>Sent by {item.sent_by}</span>}
              {item.read_at && <span>· Read {formatRelative(item.read_at)}</span>}
            </div>
          </div>
        )}
      </QueryView>
    </Modal>
  );
};

const NotificationsPage = () => {
  useDocumentTitle('Notifications');
  const list = useListFilter('notifications');
  const readState = list.filters.is_read ?? '';
  const notifications = useNotifications({ ...list.params, is_read: readState || undefined, notification_type: list.filters.notification_type || undefined });
  const unread = useUnreadCount();
  const markRead = useMarkRead();
  const readAll = useReadAll();
  const remove = useDeleteNotification();
  const [openId, setOpenId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const open = (id: number, isRead: boolean) => {
    setOpenId(id);
    if (!isRead) markRead.mutate(id);
  };

  return (
    <>
      <PageHeader
        eyebrow="Inbox"
        title="Notifications"
        description="Course updates, assignment reminders, academic alerts and announcements."
        actions={
          <Button variant="secondary" icon={<CheckCheck className="h-4 w-4" />} loading={readAll.isPending} disabled={!unread.data} onClick={() => readAll.mutate()}>
            Mark all as read
          </Button>
        }
      />
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Tabs
          tabs={[
            { value: '', label: 'All' },
            { value: 'false', label: 'Unread', count: unread.data ?? 0 },
            { value: 'true', label: 'Read' },
          ]}
          value={readState}
          onChange={(value) => list.setFilter('is_read', value)}
        />
        <Select
          aria-label="Type"
          containerClassName="sm:w-56"
          value={list.filters.notification_type ?? ''}
          onChange={(event) => list.setFilter('notification_type', event.target.value)}
          placeholder="All types"
          options={NOTIFICATION_TYPES.map((item) => ({ value: item.value, label: item.label }))}
        />
      </div>
      <Card className="overflow-hidden">
        <QueryView query={notifications} loading={<div className="space-y-3 p-5">{Array.from({ length: 4 }, (_, i) => <Skeleton key={i} className="h-16 w-full" />)}</div>}>
          {(data) =>
            data.results.length === 0 ? (
              <EmptyState icon={<Bell className="h-6 w-6" />} title="No notifications" description="You're all caught up." />
            ) : (
              <>
                <ul className="divide-y divide-slate-100">
                  {data.results.map((item) => {
                    const Icon = ICONS[item.notification_type] ?? Bell;
                    return (
                      <li key={item.id} className={cn('group flex items-start gap-4 px-5 py-4 transition hover:bg-slate-50', !item.is_read && 'bg-brand-50/40')}>
                        <span className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-xl', item.notification_type === 'ACADEMIC_ALERT' ? 'bg-rose-50 text-rose-600' : 'bg-brand-50 text-brand-700')}>
                          <Icon className="h-4 w-4" />
                        </span>
                        <button type="button" className="min-w-0 flex-1 text-left" onClick={() => open(item.id, item.is_read)}>
                          <span className="flex items-center gap-2">
                            {!item.is_read && <span className="h-2 w-2 rounded-full bg-brand-700" />}
                            <span className={cn('truncate text-sm', item.is_read ? 'text-slate-700' : 'font-bold text-slate-900')}>{item.title}</span>
                          </span>
                          <span className="mt-0.5 line-clamp-1 block text-xs text-slate-500">{item.message}</span>
                          <span className="mt-1 block text-[11px] text-slate-400">
                            {item.notification_type_display}
                            {item.course ? ` · ${item.course.title}` : ''} · {formatRelative(item.created_at)}
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteId(item.id)}
                          className="rounded-lg p-2 text-slate-300 opacity-0 transition hover:bg-rose-50 hover:text-rose-600 group-hover:opacity-100"
                          aria-label="Delete notification"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </li>
                    );
                  })}
                </ul>
                <Pagination page={list.page} pageSize={list.pageSize} count={data.count} onPageChange={list.setPage} />
              </>
            )
          }
        </QueryView>
      </Card>
      <DetailModal id={openId} onClose={() => setOpenId(null)} onDelete={(id) => setDeleteId(id)} />
      <ConfirmDialog
        open={deleteId !== null}
        title="Delete notification?"
        message="This notification will be removed from your inbox."
        confirmLabel="Delete"
        loading={remove.isPending}
        onClose={() => setDeleteId(null)}
        onConfirm={() =>
          deleteId !== null &&
          remove.mutate(deleteId, {
            onSuccess: () => {
              if (openId === deleteId) setOpenId(null);
              setDeleteId(null);
            },
          })
        }
      />
    </>
  );
};

export default NotificationsPage;
