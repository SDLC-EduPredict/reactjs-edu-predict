import { useState, type FormEvent } from 'react';
import { Megaphone, Send, Trash2 } from 'lucide-react';
import { Badge, Button, Card, CardBody, CardHeader, ConfirmDialog, DataTable, Input, PageHeader, Pagination, SearchInput, Select, Tabs, Textarea } from '@/components/ui';
import { StaffCourseSelect } from '@/components/domain/StaffCourseSelect';
import { useAppDispatch } from '@/app/store/hooks';
import { toastAdded } from '@/app/store/slices/uiSlice';
import { useDebouncedValue } from '@/lib/hooks/useDebouncedValue';
import { useDocumentTitle } from '@/lib/hooks/useDocumentTitle';
import { useListFilter } from '@/lib/hooks/useListFilter';
import { cn } from '@/lib/utils/cn';
import { formatRelative, humanize } from '@/lib/utils/format';
import { useAdminFaculty } from '@/features/faculty/hooks/useFaculty';
import { useAdminStudents } from '@/features/students/hooks/useStudents';
import { useAdminNotifications, useDeleteAdminNotification, useSendNotification } from '../hooks/useNotifications';
import { NOTIFICATION_AUDIENCES, NOTIFICATION_TYPES, type AdminNotification, type NotificationAudience, type NotificationType } from '../types';

const RecipientPicker = ({ value, onChange }: { value: string; onChange: (value: string) => void }) => {
  const [search, setSearch] = useState('');
  const debounced = useDebouncedValue(search);
  const students = useAdminStudents({ page: 1, page_size: 20, search: debounced }, debounced.length > 1);
  const faculty = useAdminFaculty({ page: 1, page_size: 20, search: debounced }, debounced.length > 1);
  const options = [
    ...(students.data?.results ?? []).map((s) => ({ value: s.user.id, label: `${s.user.full_name} · Student` })),
    ...(faculty.data?.results ?? []).map((f) => ({ value: f.user.id, label: `${f.user.full_name} · Faculty` })),
  ];
  return (
    <div className="space-y-2">
      <Input label="Find recipient" placeholder="Type at least 2 letters…" value={search} onChange={(e) => setSearch(e.target.value)} />
      <Select aria-label="Recipient" placeholder={debounced.length > 1 ? `${options.length} matches` : 'Search to list users'} value={value} onChange={(e) => onChange(e.target.value)} options={options} />
    </div>
  );
};

const Composer = () => {
  const dispatch = useAppDispatch();
  const send = useSendNotification();
  const [audience, setAudience] = useState<NotificationAudience>('ALL');
  const [type, setType] = useState<NotificationType>('ADMINISTRATIVE');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [course, setCourse] = useState('');
  const [user, setUser] = useState('');

  const invalid = !title || !message || (audience === 'COURSE' && !course) || (audience === 'USER' && !user);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    send.mutate(
      { audience, notification_type: type, title, message, course: audience === 'COURSE' ? Number(course) : undefined, user: audience === 'USER' ? user : undefined },
      {
        onSuccess: (result) => {
          dispatch(toastAdded({ type: 'success', title: 'Notification sent', message: result.message || `Delivered to ${result.data.recipients} recipient(s).` }));
          setTitle('');
          setMessage('');
        },
      },
    );
  };

  return (
    <Card>
      <CardHeader icon={<Megaphone className="h-4 w-4" />} title="Compose announcement" description="Delivered instantly to each recipient's inbox." />
      <CardBody>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <p className="mb-2 text-xs font-semibold text-slate-600">Audience</p>
            <div className="flex flex-wrap gap-2">
              {NOTIFICATION_AUDIENCES.map((item) => (
                <button key={item.value} type="button" onClick={() => setAudience(item.value)} className={cn('rounded-full px-3.5 py-1.5 text-xs font-semibold transition', audience === item.value ? 'bg-brand-700 text-white' : 'bg-brand-50 text-brand-700 hover:bg-brand-100')}>
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          {audience === 'COURSE' && <StaffCourseSelect label="Course" value={course} onChange={setCourse} placeholder="Select course" />}
          {audience === 'USER' && <RecipientPicker value={user} onChange={setUser} />}
          <Select label="Type" value={type} onChange={(e) => setType(e.target.value as NotificationType)} options={NOTIFICATION_TYPES.map((t) => ({ value: t.value, label: t.label }))} />
          <Input label="Title" required value={title} onChange={(e) => setTitle(e.target.value)} />
          <Textarea label="Message" rows={5} required value={message} onChange={(e) => setMessage(e.target.value)} />
          <Button type="submit" fullWidth icon={<Send className="h-4 w-4" />} loading={send.isPending} disabled={invalid}>
            Send notification
          </Button>
        </form>
      </CardBody>
    </Card>
  );
};

const History = () => {
  const list = useListFilter('admin-notifications');
  const f = list.filters;
  const notifications = useAdminNotifications({ ...list.params, notification_type: f.notification_type || undefined, is_read: f.is_read || undefined });
  const remove = useDeleteAdminNotification();
  const [target, setTarget] = useState<AdminNotification | null>(null);
  return (
    <Card className="overflow-hidden">
      <CardHeader title="Delivery log" description="Every notification delivered across the institute" />
      <div className="flex flex-col gap-3 border-b border-slate-100 p-4 md:flex-row md:items-center">
        <SearchInput value={list.search} onChange={list.setSearch} placeholder="Search title or recipient…" className="flex-1" />
        <Select aria-label="Type" containerClassName="md:w-44" placeholder="All types" value={f.notification_type ?? ''} onChange={(e) => list.setFilter('notification_type', e.target.value)} options={NOTIFICATION_TYPES.map((t) => ({ value: t.value, label: t.label }))} />
        <Tabs tabs={[{ value: '', label: 'All' }, { value: 'false', label: 'Unread' }, { value: 'true', label: 'Read' }]} value={f.is_read ?? ''} onChange={(value) => list.setFilter('is_read', value)} />
      </div>
      <DataTable
        rows={notifications.data?.results}
        loading={notifications.isPending}
        rowKey={(row) => row.id}
        emptyTitle="Nothing sent yet"
        columns={[
          { key: 't', header: 'Notification', render: (row) => <div className="max-w-xs"><p className="truncate font-semibold text-slate-900">{row.title}</p><p className="truncate text-[11px] text-slate-500">{row.message}</p></div> },
          { key: 'r', header: 'Recipient', render: (row) => <div><p className="text-sm">{row.recipient.full_name}</p><p className="text-[11px] text-slate-500">{humanize(row.recipient.role)}</p></div> },
          { key: 'ty', header: 'Type', render: (row) => <Badge tone={row.notification_type === 'ACADEMIC_ALERT' ? 'rose' : 'brand'}>{row.notification_type_display}</Badge> },
          { key: 'st', header: 'Read', render: (row) => <Badge tone={row.is_read ? 'lime' : 'slate'}>{row.is_read ? 'Read' : 'Unread'}</Badge> },
          { key: 'd', header: 'Sent', render: (row) => <span className="text-xs">{formatRelative(row.created_at)}</span> },
          { key: 'x', header: '', render: (row) => <Button size="sm" variant="ghost" aria-label="Delete" icon={<Trash2 className="h-3.5 w-3.5 text-rose-500" />} onClick={() => setTarget(row)} /> },
        ]}
      />
      <Pagination page={list.page} pageSize={list.pageSize} count={notifications.data?.count ?? 0} onPageChange={list.setPage} />
      <ConfirmDialog
        open={target !== null}
        title="Delete notification?"
        message={`Removes “${target?.title ?? ''}” from ${target?.recipient.full_name ?? 'the recipient'}'s inbox.`}
        confirmLabel="Delete"
        loading={remove.isPending}
        onClose={() => setTarget(null)}
        onConfirm={() => target && remove.mutate(target.id, { onSuccess: () => setTarget(null) })}
      />
    </Card>
  );
};

const AdminNotificationsPage = () => {
  useDocumentTitle('Send Notifications');
  return (
    <>
      <PageHeader eyebrow="Communication" title="Send Notifications" description="Broadcast announcements to everyone, a role, a course batch or a single user." />
      <div className="grid gap-6 xl:grid-cols-[400px_1fr]">
        <Composer />
        <History />
      </div>
    </>
  );
};

export default AdminNotificationsPage;
