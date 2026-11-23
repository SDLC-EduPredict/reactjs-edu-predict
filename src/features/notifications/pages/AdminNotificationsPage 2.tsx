import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Inbox, Megaphone, Send, Trash2 } from 'lucide-react';
import { Badge, Button, ButtonLink, Card, CardBody, CardHeader, ConfirmDialog, DataTable, Input, PageHeader, Pagination, Select, Textarea, type Column } from '@/components/ui';
import { PATHS } from '@/app/router/paths';
import { env } from '@/config/env';
import { getErrorMessage } from '@/lib/api/apiError';
import { useDocumentTitle } from '@/lib/hooks/useDocumentTitle';
import { formatDate, humanize } from '@/lib/utils/format';
import { useCurrentUser } from '@/features/auth/hooks/useAuth';
import { useCourseOptions } from '@/features/courses/hooks/useCourses';
import { useAdminNotifications, useBroadcastNotification, useDeleteBroadcast } from '../hooks/useNotifications';
import { NOTIFICATION_AUDIENCES, NOTIFICATION_TYPES, type BroadcastNotification } from '../types';
import { NotificationsPage } from './NotificationsPage';

const schema = z
  .object({
    title: z.string().trim().min(3, 'Enter a title.').max(200),
    message: z.string().trim().min(5, 'Enter a message.'),
    notification_type: z.enum(['COURSE', 'ASSIGNMENT', 'ASSESSMENT', 'ACADEMIC_ALERT', 'ADMINISTRATIVE']),
    audience: z.enum(['ALL', 'STUDENTS', 'FACULTY', 'COURSE', 'USER']),
    course: z.string(),
    user: z.string().trim(),
  })
  .refine((values) => values.audience !== 'COURSE' || values.course, { path: ['course'], message: 'Choose a course.' })
  .refine((values) => values.audience !== 'USER' || values.user, { path: ['user'], message: 'Enter the user ID.' });
type Values = z.infer<typeof schema>;

export const AdminNotificationsPage = () => {
  useDocumentTitle('Notifications');
  const { isAdmin, hasPermission } = useCurrentUser();
  const canSend = isAdmin || hasPermission('SEND_NOTIFICATIONS');
  const [page, setPage] = useState(1);
  const sent = useAdminNotifications({ page, page_size: env.defaultPageSize }, canSend);
  const broadcast = useBroadcastNotification();
  const remove = useDeleteBroadcast();
  const courseOptions = useCourseOptions();
  const [deleting, setDeleting] = useState<BroadcastNotification | null>(null);
  const { register, handleSubmit, control, reset, formState } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { notification_type: 'ADMINISTRATIVE', audience: 'ALL', course: '', user: '', title: '', message: '' },
  });
  const audience = useWatch({ control, name: 'audience' });

  if (!canSend) return <NotificationsPage />;

  const onSubmit = (values: Values) =>
    broadcast.mutate(
      {
        title: values.title,
        message: values.message,
        notification_type: values.notification_type,
        audience: values.audience,
        course: values.audience === 'COURSE' ? Number(values.course) : undefined,
        user: values.audience === 'USER' ? values.user : undefined,
      },
      { onSuccess: () => reset() },
    );

  const columns: Column<BroadcastNotification>[] = [
    {
      key: 'title',
      header: 'Notification',
      render: (row) => (
        <div>
          <p className="font-semibold text-slate-900">{row.title}</p>
          <p className="line-clamp-1 max-w-sm text-[11px] text-slate-500">{row.message}</p>
        </div>
      ),
    },
    { key: 'type', header: 'Type', render: (row) => <Badge tone="violet">{row.notification_type_display ?? humanize(row.notification_type)}</Badge> },
    { key: 'audience', header: 'Audience', render: (row) => `${row.audience_display ?? humanize(row.audience)}${row.course ? ` · ${row.course.title}` : ''}` },
    { key: 'recipients', header: 'Recipients', render: (row) => row.recipient_count ?? '—' },
    { key: 'date', header: 'Sent', render: (row) => formatDate(row.created_at, true) },
    {
      key: 'actions',
      header: '',
      render: (row) => <Button size="sm" variant="ghost" className="text-rose-600 hover:bg-rose-50" icon={<Trash2 className="h-3.5 w-3.5" />} onClick={() => setDeleting(row)} aria-label="Delete" />,
    },
  ];

  const e = formState.errors;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Communication"
        title="Notifications"
        description="Send course, academic and administrative announcements to students and faculty."
        actions={
          <ButtonLink to={`${PATHS.admin.notifications}/inbox`} variant="outline" icon={<Inbox className="h-4 w-4" />}>
            My inbox
          </ButtonLink>
        }
      />
      <Card>
        <CardHeader icon={<Megaphone className="h-4 w-4" />} title="Compose notification" />
        <CardBody>
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 md:grid-cols-2" noValidate>
            <Input label="Title" required containerClassName="md:col-span-2" {...register('title')} error={e.title?.message} />
            <div className="md:col-span-2">
              <Textarea label="Message" rows={4} required {...register('message')} error={e.message?.message} />
            </div>
            <Select label="Type" options={NOTIFICATION_TYPES.map((item) => ({ value: item.value, label: item.label }))} {...register('notification_type')} />
            <Select label="Audience" options={NOTIFICATION_AUDIENCES.map((item) => ({ value: item.value, label: item.label }))} {...register('audience')} />
            {audience === 'COURSE' && <Select label="Course" placeholder="Select a course" options={courseOptions.options} {...register('course')} error={e.course?.message} />}
            {audience === 'USER' && <Input label="User ID" hint="The user's UUID from Student / Faculty management" {...register('user')} error={e.user?.message} />}
            <div className="flex justify-end md:col-span-2">
              <Button type="submit" icon={<Send className="h-4 w-4" />} loading={broadcast.isPending}>
                Send notification
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
      <Card>
        <CardHeader title="Sent notifications" action={<Link to={`${PATHS.admin.notifications}/inbox`} className="text-xs font-semibold text-brand-700 hover:underline">View my inbox</Link>} />
        <DataTable
          columns={columns}
          rows={sent.data?.results}
          rowKey={(row) => row.id}
          loading={sent.isPending}
          error={sent.isError ? getErrorMessage(sent.error) : null}
          onRetry={() => sent.refetch()}
          emptyTitle="Nothing sent yet"
        />
        {sent.data && <Pagination page={page} pageSize={env.defaultPageSize} count={sent.data.count} onPageChange={setPage} />}
      </Card>
      <ConfirmDialog
        open={deleting !== null}
        title="Delete notification?"
        message={`“${deleting?.title}” will be removed for all recipients.`}
        confirmLabel="Delete"
        loading={remove.isPending}
        onClose={() => setDeleting(null)}
        onConfirm={() => deleting && remove.mutate(deleting.id, { onSuccess: () => setDeleting(null) })}
      />
    </div>
  );
};

export default AdminNotificationsPage;
