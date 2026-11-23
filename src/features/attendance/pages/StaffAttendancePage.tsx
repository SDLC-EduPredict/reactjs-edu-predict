import { useMemo, useState } from 'react';
import { CalendarCheck2, Eye, Pencil, Save, Trash2 } from 'lucide-react';
import { Button, Card, CardHeader, ConfirmDialog, DataTable, EmptyState, Input, Modal, PageHeader, Pagination, Select, Skeleton, StatusBadge, Tabs } from '@/components/ui';
import { fmtPct } from '@/components/domain/Metric';
import { QueryView } from '@/components/domain/QueryView';
import { StaffCourseSelect, useStaffCourseOptions } from '@/components/domain/StaffCourseSelect';
import { useDocumentTitle } from '@/lib/hooks/useDocumentTitle';
import { useListFilter } from '@/lib/hooks/useListFilter';
import { cn } from '@/lib/utils/cn';
import { formatDate } from '@/lib/utils/format';
import {
  useAttendanceRecord,
  useAttendanceRecords,
  useAttendanceSummary,
  useDeleteAttendance,
  useMarkAttendance,
  useUpdateAttendance,
} from '../hooks/useAttendance';
import { ATTENDANCE_STATUSES, type AttendanceRecord, type AttendanceStatus, type AttendanceSummaryData } from '../types';

const today = () => new Date().toISOString().slice(0, 10);

const STATUS_STYLE: Record<AttendanceStatus, string> = {
  PRESENT: 'bg-lime-brand text-brand-950',
  LATE: 'bg-sun-300 text-brand-950',
  ABSENT: 'bg-rose-500 text-white',
};

type Marks = Record<number, { status: AttendanceStatus; remarks: string }>;

const AttendanceRoster = ({ data, date }: { data: AttendanceSummaryData; date: string }) => {
  const mark = useMarkAttendance();
  const [marks, setMarks] = useState<Marks>(() => Object.fromEntries(data.students.map((row) => [row.enrolment_id, { status: 'PRESENT' as AttendanceStatus, remarks: '' }])));

  const counts = useMemo(() => {
    const values = Object.values(marks);
    return { PRESENT: values.filter((v) => v.status === 'PRESENT').length, LATE: values.filter((v) => v.status === 'LATE').length, ABSENT: values.filter((v) => v.status === 'ABSENT').length };
  }, [marks]);

  const setAll = (status: AttendanceStatus) => setMarks((prev) => Object.fromEntries(Object.entries(prev).map(([key, value]) => [key, { ...value, status }])));

  if (data.students.length === 0) return <EmptyState title="No active students in this course" />;

  return (
    <>
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 px-5 py-3 text-xs">
        <span className="font-semibold text-slate-500">Mark all:</span>
        {ATTENDANCE_STATUSES.map((status) => (
          <button key={status.value} type="button" onClick={() => setAll(status.value)} className="rounded-full bg-slate-100 px-3 py-1 font-semibold text-slate-600 hover:bg-slate-200">
            {status.label}
          </button>
        ))}
        <span className="ml-auto flex gap-3 font-semibold">
          <span className="text-lime-ink">{counts.PRESENT} present</span>
          <span className="text-amber-700">{counts.LATE} late</span>
          <span className="text-rose-600">{counts.ABSENT} absent</span>
        </span>
      </div>
      <ul className="divide-y divide-slate-100">
        {data.students.map((row) => {
          const value = marks[row.enrolment_id] ?? { status: 'PRESENT' as AttendanceStatus, remarks: '' };
          return (
            <li key={row.enrolment_id} className="grid items-center gap-3 px-5 py-3 md:grid-cols-[1.3fr_auto_1fr]">
              <div>
                <p className="text-sm font-semibold text-slate-900">{row.student.full_name}</p>
                <p className="text-[11px] text-slate-500">
                  {row.student.student_code} · {fmtPct(row.attendance_percentage)} overall · {row.total_classes} classes
                </p>
              </div>
              <div className="flex gap-1.5">
                {ATTENDANCE_STATUSES.map((status) => (
                  <button
                    key={status.value}
                    type="button"
                    onClick={() => setMarks((prev) => ({ ...prev, [row.enrolment_id]: { ...value, status: status.value } }))}
                    className={cn('rounded-full px-3 py-1.5 text-xs font-semibold transition', value.status === status.value ? STATUS_STYLE[status.value] : 'bg-slate-100 text-slate-500 hover:bg-slate-200')}
                  >
                    {status.label}
                  </button>
                ))}
              </div>
              <input
                aria-label={`Remarks for ${row.student.full_name}`}
                className="h-9 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs outline-none focus:border-brand-400 focus:bg-white"
                placeholder="Remarks (optional)"
                value={value.remarks}
                onChange={(event) => setMarks((prev) => ({ ...prev, [row.enrolment_id]: { ...value, remarks: event.target.value } }))}
              />
            </li>
          );
        })}
      </ul>
      <div className="flex justify-end border-t border-slate-100 px-5 py-4">
        <Button
          icon={<Save className="h-4 w-4" />}
          loading={mark.isPending}
          onClick={() =>
            mark.mutate({
              date,
              records: Object.entries(marks).map(([enrolment, value]) => ({ enrolment: Number(enrolment), status: value.status, remarks: value.remarks || undefined })),
            })
          }
        >
          Save attendance for {formatDate(date)}
        </Button>
      </div>
    </>
  );
};

const MarkAttendance = () => {
  const { courses } = useStaffCourseOptions();
  const [courseId, setCourseId] = useState('');
  const activeCourse = courseId || (courses[0] ? String(courses[0].id) : '');
  const [date, setDate] = useState(today());
  const summary = useAttendanceSummary(activeCourse ? Number(activeCourse) : null);

  return (
    <Card>
      <CardHeader
        icon={<CalendarCheck2 className="h-4 w-4" />}
        title="Mark session attendance"
        description="Default is Present — tap a status to change it. Saving again for the same date updates existing records."
        action={
          <div className="flex flex-wrap items-end gap-2">
            <StaffCourseSelect value={activeCourse} onChange={setCourseId} placeholder="Select course" className="w-56" />
            <Input aria-label="Date" type="date" value={date} max={today()} onChange={(event) => setDate(event.target.value)} containerClassName="w-40" />
          </div>
        }
      />
      {!activeCourse ? (
        <EmptyState title="Select a course" description="Choose a batch to load its roster." />
      ) : (
        <QueryView query={summary} loading={<div className="space-y-2 p-5">{Array.from({ length: 4 }, (_, i) => <Skeleton key={i} className="h-14 w-full" />)}</div>}>
          {(data) => <AttendanceRoster key={`${activeCourse}-${date}`} data={data} date={date} />}
        </QueryView>
      )}
    </Card>
  );
};

const RecordEditor = ({ record, onClose }: { record: AttendanceRecord; onClose: () => void }) => {
  const update = useUpdateAttendance();
  const [status, setStatus] = useState<AttendanceStatus>(record.status as AttendanceStatus);
  const [remarks, setRemarks] = useState(record.remarks);
  return (
    <div className="space-y-4">
      <Select label="Status" value={status} onChange={(event) => setStatus(event.target.value as AttendanceStatus)} options={ATTENDANCE_STATUSES} />
      <Input label="Remarks" value={remarks} onChange={(event) => setRemarks(event.target.value)} />
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button loading={update.isPending} onClick={() => update.mutate({ id: record.id, status, remarks }, { onSuccess: onClose })}>
          Save changes
        </Button>
      </div>
    </div>
  );
};

const RecordModal = ({ id, editing, onClose }: { id: number | null; editing: boolean; onClose: () => void }) => {
  const record = useAttendanceRecord(id);
  return (
    <Modal open={id !== null} onClose={onClose} title={editing ? 'Edit attendance' : 'Attendance record'} footer={editing ? undefined : <Button onClick={onClose}>Close</Button>}>
      <QueryView query={record} loading={<Skeleton className="h-32 w-full" />}>
        {(data) => (
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-slate-50 p-3">
                <p className="text-[11px] text-slate-500">Student</p>
                <p className="font-semibold text-slate-900">{data.student.full_name}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-3">
                <p className="text-[11px] text-slate-500">Course · Date</p>
                <p className="font-semibold text-slate-900">
                  {data.course.title} · {formatDate(data.date)}
                </p>
              </div>
            </div>
            {editing ? (
              <RecordEditor key={data.id} record={data} onClose={onClose} />
            ) : (
              <div className="space-y-2">
                <StatusBadge status={data.status} label={data.status_display} />
                <p className="text-slate-600">{data.remarks || 'No remarks'}</p>
                <p className="text-[11px] text-slate-400">
                  Marked by {data.marked_by ?? '—'} · updated {formatDate(data.updated_at, true)}
                </p>
              </div>
            )}
          </div>
        )}
      </QueryView>
    </Modal>
  );
};

const AttendanceRecords = () => {
  const list = useListFilter('attendance-records');
  const records = useAttendanceRecords({ ...list.params, course: list.filters.course || undefined, date: list.filters.date || undefined, status: list.filters.status || undefined });
  const remove = useDeleteAttendance();
  const [view, setView] = useState<{ id: number; editing: boolean } | null>(null);
  const [deleting, setDeleting] = useState<AttendanceRecord | null>(null);

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col gap-3 border-b border-slate-100 p-4 md:flex-row">
        <input
          className="h-10 flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-brand-400 focus:bg-white"
          placeholder="Search student name or code…"
          value={list.search}
          onChange={(event) => list.setSearch(event.target.value)}
        />
        <StaffCourseSelect value={list.filters.course ?? ''} onChange={(value) => list.setFilter('course', value)} className="md:w-52" />
        <Input aria-label="Date" type="date" value={list.filters.date ?? ''} onChange={(event) => list.setFilter('date', event.target.value)} containerClassName="md:w-40" />
        <Select aria-label="Status" containerClassName="md:w-36" value={list.filters.status ?? ''} onChange={(event) => list.setFilter('status', event.target.value)} placeholder="All statuses" options={ATTENDANCE_STATUSES} />
      </div>
      <DataTable
        rows={records.data?.results}
        loading={records.isPending}
        rowKey={(row) => row.id}
        emptyTitle="No attendance records"
        columns={[
          {
            key: 'student',
            header: 'Student',
            render: (row) => (
              <div>
                <p className="font-semibold text-slate-900">{row.student.full_name}</p>
                <p className="text-[11px] text-slate-500">{row.student.student_code}</p>
              </div>
            ),
          },
          { key: 'course', header: 'Course', render: (row) => row.course.title },
          { key: 'date', header: 'Date', render: (row) => formatDate(row.date) },
          { key: 'status', header: 'Status', render: (row) => <StatusBadge status={row.status} label={row.status_display} /> },
          { key: 'remarks', header: 'Remarks', render: (row) => row.remarks || '—' },
          {
            key: 'actions',
            header: '',
            className: 'text-right',
            render: (row) => (
              <div className="flex justify-end gap-1">
                <Button size="sm" variant="ghost" aria-label="View" onClick={() => setView({ id: row.id, editing: false })} icon={<Eye className="h-3.5 w-3.5" />} />
                <Button size="sm" variant="ghost" aria-label="Edit" onClick={() => setView({ id: row.id, editing: true })} icon={<Pencil className="h-3.5 w-3.5" />} />
                <Button size="sm" variant="ghost" aria-label="Delete" onClick={() => setDeleting(row)} icon={<Trash2 className="h-3.5 w-3.5 text-rose-500" />} />
              </div>
            ),
          },
        ]}
      />
      <Pagination page={list.page} pageSize={list.pageSize} count={records.data?.count ?? 0} onPageChange={list.setPage} />
      <RecordModal id={view?.id ?? null} editing={view?.editing ?? false} onClose={() => setView(null)} />
      <ConfirmDialog
        open={deleting !== null}
        title="Delete attendance record?"
        message={deleting ? `${deleting.student.full_name} · ${formatDate(deleting.date)} will be removed and attendance percentages recalculated.` : ''}
        confirmLabel="Delete"
        loading={remove.isPending}
        onClose={() => setDeleting(null)}
        onConfirm={() => deleting && remove.mutate(deleting.id, { onSuccess: () => setDeleting(null) })}
      />
    </Card>
  );
};

const StaffAttendancePage = () => {
  useDocumentTitle('Student Attendance');
  const [tab, setTab] = useState<'mark' | 'records'>('mark');
  return (
    <>
      <PageHeader eyebrow="Academics" title="Student Attendance" description="Mark daily attendance per batch and manage historical records." actions={<Tabs tabs={[{ value: 'mark', label: 'Mark attendance' }, { value: 'records', label: 'Records' }]} value={tab} onChange={setTab} />} />
      {tab === 'mark' ? <MarkAttendance /> : <AttendanceRecords />}
    </>
  );
};

export default StaffAttendancePage;
