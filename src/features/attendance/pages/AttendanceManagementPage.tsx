import { useMemo, useState } from 'react';
import { CalendarCheck2, Save } from 'lucide-react';
import { Alert, Button, Card, CardHeader, DataTable, EmptyState, Input, PageHeader, Pagination, Select, StatusBadge, type Column } from '@/components/ui';
import { getErrorMessage } from '@/lib/api/apiError';
import { useDocumentTitle } from '@/lib/hooks/useDocumentTitle';
import { useListFilter } from '@/lib/hooks/useListFilter';
import { cn } from '@/lib/utils/cn';
import { formatDate } from '@/lib/utils/format';
import { useCourseOptions } from '@/features/courses/hooks/useCourses';
import { useCourseRoster } from '@/features/performance/hooks/usePerformance';
import { useAttendanceRecords, useMarkAttendanceBatch, useUpdateAttendance } from '../hooks/useAttendance';
import { ATTENDANCE_STATUSES, type AttendanceRecord, type AttendanceStatus } from '../types';

const today = () => new Date().toISOString().slice(0, 10);
const LIST_KEY = 'attendance-records';

export const AttendanceManagementPage = () => {
  useDocumentTitle('Attendance management');
  const courseOptions = useCourseOptions();
  const [courseId, setCourseId] = useState('');
  const [sessionDate, setSessionDate] = useState(today());
  const [topic, setTopic] = useState('');
  const [marks, setMarks] = useState<Record<number, AttendanceStatus>>({});
  const roster = useCourseRoster(courseId);
  const save = useMarkAttendanceBatch();
  const update = useUpdateAttendance();
  const list = useListFilter(LIST_KEY);
  const records = useAttendanceRecords({ ...list.params, course: courseId || list.filters.course }, true);

  const students = useMemo(() => (courseId ? (roster.data?.rows ?? []) : []), [courseId, roster.data]);

  const submit = () =>
    save.mutate(
      students.map((row) => {
        const enrolment = row.enrolment_id ?? row.id ?? 0;
        return { enrolment, session_date: sessionDate, session_topic: topic || undefined, status: marks[enrolment] ?? 'PRESENT' };
      }),
      {
        onSuccess: () => {
          setTopic('');
          setMarks({});
        },
      },
    );

  const columns: Column<AttendanceRecord>[] = [
    { key: 'date', header: 'Date', render: (row) => formatDate(row.session_date) },
    { key: 'student', header: 'Student', render: (row) => row.student?.full_name ?? '—' },
    { key: 'course', header: 'Course', render: (row) => row.course?.title ?? '—' },
    { key: 'topic', header: 'Session', render: (row) => row.session_topic || '—' },
    { key: 'status', header: 'Status', render: (row) => <StatusBadge status={row.status} label={row.status_display} /> },
    {
      key: 'edit',
      header: 'Correct',
      render: (row) => (
        <Select
          aria-label="Correct status"
          containerClassName="w-32"
          className="py-1.5 text-xs"
          value={row.status}
          onChange={(event) => update.mutate({ id: row.id, status: event.target.value as AttendanceStatus })}
          options={ATTENDANCE_STATUSES}
        />
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Academics" title="Attendance management" description="Mark attendance for a class session and correct past records." />
      <Card>
        <CardHeader icon={<CalendarCheck2 className="h-4 w-4" />} title="Mark a session" description="Choose a course and date, then set each student's status." />
        <div className="grid gap-4 border-b border-slate-100 p-5 md:grid-cols-3">
          <Select label="Course" value={courseId} onChange={(event) => {
              setCourseId(event.target.value);
              setMarks({});
            }}
            placeholder="Select a course" options={courseOptions.options} />
          <Input label="Session date" type="date" value={sessionDate} max={today()} onChange={(event) => setSessionDate(event.target.value)} />
          <Input label="Topic (optional)" value={topic} onChange={(event) => setTopic(event.target.value)} placeholder="e.g. Django ORM basics" />
        </div>
        {!courseId ? (
          <EmptyState title="Select a course to load its students" />
        ) : roster.isError ? (
          <div className="p-5">
            <Alert tone="error">{getErrorMessage(roster.error)}</Alert>
          </div>
        ) : students.length === 0 && !roster.isPending ? (
          <EmptyState title="No active students in this course" />
        ) : (
          <>
            <ul className="divide-y divide-slate-100">
              {students.map((row) => {
                const key = row.enrolment_id ?? row.id ?? 0;
                return (
                  <li key={key} className="flex flex-col gap-3 px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{row.student.full_name}</p>
                      <p className="text-[11px] text-slate-400">{row.student.student_code ?? row.student.email}</p>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {ATTENDANCE_STATUSES.map((status) => (
                        <button
                          key={status.value}
                          type="button"
                          onClick={() => setMarks((current) => ({ ...current, [key]: status.value }))}
                          className={cn(
                            'rounded-lg px-3 py-1.5 text-xs font-semibold ring-1 transition',
                            (marks[key] ?? 'PRESENT') === status.value
                              ? status.value === 'ABSENT'
                                ? 'bg-rose-600 text-white ring-rose-600'
                                : status.value === 'PRESENT'
                                  ? 'bg-emerald-600 text-white ring-emerald-600'
                                  : 'bg-brand-600 text-white ring-brand-600'
                              : 'bg-white text-slate-600 ring-slate-200 hover:ring-brand-300',
                          )}
                        >
                          {status.label}
                        </button>
                      ))}
                    </div>
                  </li>
                );
              })}
            </ul>
            <div className="flex justify-end border-t border-slate-100 p-4">
              <Button icon={<Save className="h-4 w-4" />} loading={save.isPending} disabled={students.length === 0} onClick={submit}>
                Save attendance for {students.length} student{students.length === 1 ? '' : 's'}
              </Button>
            </div>
          </>
        )}
      </Card>
      <Card>
        <CardHeader title="Attendance records" description={courseId ? 'Filtered by the selected course' : 'All courses you can access'} />
        <DataTable
          columns={columns}
          rows={records.data?.results}
          rowKey={(row) => row.id}
          loading={records.isPending}
          error={records.isError ? getErrorMessage(records.error) : null}
          onRetry={() => records.refetch()}
          emptyTitle="No attendance recorded"
        />
        {records.data && <Pagination page={list.page} pageSize={list.pageSize} count={records.data.count} onPageChange={list.setPage} />}
      </Card>
    </div>
  );
};

export default AttendanceManagementPage;
