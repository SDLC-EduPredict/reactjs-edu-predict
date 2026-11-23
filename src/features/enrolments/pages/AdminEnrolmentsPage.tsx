import { useState } from 'react';
import { Eye, Plus, Trash2 } from 'lucide-react';
import { Button, Card, ConfirmDialog, DataTable, Modal, PageHeader, Pagination, SearchInput, Select, Skeleton, StatusBadge, Tabs } from '@/components/ui';
import { fmtPct, fmtScore } from '@/components/domain/Metric';
import { QueryView } from '@/components/domain/QueryView';
import { StaffCourseSelect, useStaffCourseOptions } from '@/components/domain/StaffCourseSelect';
import { useDebouncedValue } from '@/lib/hooks/useDebouncedValue';
import { useDocumentTitle } from '@/lib/hooks/useDocumentTitle';
import { useListFilter } from '@/lib/hooks/useListFilter';
import { formatDate } from '@/lib/utils/format';
import { ENROLMENT_STATUSES, type EnrolmentStatus } from '@/types';
import { useAdminStudents } from '@/features/students/hooks/useStudents';
import { useCreateEnrolment, useDeleteEnrolment, useEnrolment, useEnrolments, useUpdateEnrolment } from '../hooks/useEnrolments';
import type { Enrolment } from '../types';

const CreateEnrolmentModal = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [search, setSearch] = useState('');
  const debounced = useDebouncedValue(search);
  const students = useAdminStudents({ page: 1, page_size: 50, search: debounced, is_active: 'true' }, open);
  const { options } = useStaffCourseOptions();
  const create = useCreateEnrolment();
  const [student, setStudent] = useState('');
  const [course, setCourse] = useState('');
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Enrol a student"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button disabled={!student || !course} loading={create.isPending} onClick={() => create.mutate({ student: Number(student), course: Number(course) }, { onSuccess: onClose })}>
            Create enrolment
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <SearchInput value={search} onChange={setSearch} placeholder="Find student by name, email or code…" />
        <Select label="Student" placeholder={students.isPending ? 'Loading…' : 'Select student'} value={student} onChange={(e) => setStudent(e.target.value)} options={(students.data?.results ?? []).map((s) => ({ value: s.id, label: `${s.user.full_name} (${s.student_code})` }))} />
        <Select label="Course" placeholder="Select course" value={course} onChange={(e) => setCourse(e.target.value)} options={options} />
      </div>
    </Modal>
  );
};

const EnrolmentDetailModal = ({ id, onClose }: { id: number | null; onClose: () => void }) => {
  const detail = useEnrolment(id);
  const update = useUpdateEnrolment();
  return (
    <Modal open={id !== null} onClose={onClose} title={detail.data ? `${detail.data.student.full_name} · ${detail.data.course.title}` : 'Enrolment'} size="lg">
      <QueryView query={detail} loading={<Skeleton className="h-48 w-full" />}>
        {(e) => (
          <div className="space-y-5">
            <div className="grid gap-3 sm:grid-cols-4">
              {[
                { label: 'Student code', value: e.student.student_code },
                { label: 'Enrolled', value: formatDate(e.enrolled_on) },
                { label: 'Starts', value: formatDate(e.start_date) },
                { label: 'Ends', value: formatDate(e.end_date) },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl bg-slate-50 p-3">
                  <p className="text-[11px] text-slate-500">{item.label}</p>
                  <p className="text-sm font-semibold text-slate-900">{item.value}</p>
                </div>
              ))}
            </div>
            {e.progress && (
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl bg-brand-50 p-4">
                  <p className="text-xs text-brand-700">Attendance</p>
                  <p className="font-display text-2xl font-bold">{fmtPct(e.progress.attendance.attendance_percentage)}</p>
                </div>
                <div className="rounded-2xl bg-sun-100 p-4">
                  <p className="text-xs text-amber-800">Assignments</p>
                  <p className="font-display text-2xl font-bold">{fmtScore(e.progress.assignments.assignment_average)}</p>
                </div>
                <div className="rounded-2xl bg-lime-soft p-4">
                  <p className="text-xs text-lime-ink">Assessments</p>
                  <p className="font-display text-2xl font-bold">{fmtScore(e.progress.assessments.assessment_average)}</p>
                </div>
              </div>
            )}
            <div>
              <p className="mb-2 text-xs font-semibold text-slate-500">Change status</p>
              <Tabs tabs={ENROLMENT_STATUSES} value={e.status as EnrolmentStatus} onChange={(status) => update.mutate({ id: e.id, status })} />
            </div>
          </div>
        )}
      </QueryView>
    </Modal>
  );
};

const AdminEnrolmentsPage = () => {
  useDocumentTitle('Enrolments');
  const list = useListFilter('admin-enrolments');
  const f = list.filters;
  const enrolments = useEnrolments({ ...list.params, status: f.status || undefined, course: f.course || undefined });
  const update = useUpdateEnrolment();
  const remove = useDeleteEnrolment();
  const [creating, setCreating] = useState(false);
  const [viewId, setViewId] = useState<number | null>(null);
  const [target, setTarget] = useState<Enrolment | null>(null);

  return (
    <>
      <PageHeader eyebrow="Administration" title="Enrolments" description="Who is learning what — enrol students, update status and clean up records." actions={<Button icon={<Plus className="h-4 w-4" />} onClick={() => setCreating(true)}>Enrol student</Button>} />
      <Card className="overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 md:flex-row md:items-center">
          <SearchInput value={list.search} onChange={list.setSearch} placeholder="Search student or course…" className="flex-1" />
          <StaffCourseSelect value={f.course ?? ''} onChange={(value) => list.setFilter('course', value)} className="md:w-56" />
          <Tabs tabs={[{ value: '', label: 'All' }, ...ENROLMENT_STATUSES]} value={f.status ?? ''} onChange={(value) => list.setFilter('status', value)} />
        </div>
        <DataTable
          rows={enrolments.data?.results}
          loading={enrolments.isPending}
          rowKey={(row) => row.id}
          emptyTitle="No enrolments"
          columns={[
            {
              key: 'student',
              header: 'Student',
              render: (row) => (
                <div>
                  <p className="font-semibold text-slate-900">{row.student.full_name}</p>
                  <p className="text-[11px] text-slate-500">{row.student.email}</p>
                </div>
              ),
            },
            { key: 'course', header: 'Course', render: (row) => row.course.title },
            { key: 'enrolled', header: 'Enrolled', render: (row) => formatDate(row.enrolled_on) },
            { key: 'period', header: 'Period', render: (row) => <span className="text-xs">{formatDate(row.start_date)} – {formatDate(row.end_date)}</span> },
            {
              key: 'status',
              header: 'Status',
              render: (row) => (
                <select
                  aria-label="Status"
                  className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold"
                  value={row.status}
                  onChange={(event) => update.mutate({ id: row.id, status: event.target.value as EnrolmentStatus })}
                >
                  {ENROLMENT_STATUSES.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              ),
            },
            { key: 'badge', header: '', render: (row) => <StatusBadge status={row.status} label={row.status_display} /> },
            {
              key: 'actions',
              header: '',
              className: 'text-right',
              render: (row) => (
                <div className="flex justify-end gap-1">
                  <Button size="sm" variant="ghost" aria-label="View" icon={<Eye className="h-3.5 w-3.5" />} onClick={() => setViewId(row.id)} />
                  <Button size="sm" variant="ghost" aria-label="Delete" icon={<Trash2 className="h-3.5 w-3.5 text-rose-500" />} onClick={() => setTarget(row)} />
                </div>
              ),
            },
          ]}
        />
        <Pagination page={list.page} pageSize={list.pageSize} count={enrolments.data?.count ?? 0} onPageChange={list.setPage} />
      </Card>
      {creating && <CreateEnrolmentModal open onClose={() => setCreating(false)} />}
      <EnrolmentDetailModal id={viewId} onClose={() => setViewId(null)} />
      <ConfirmDialog
        open={target !== null}
        title="Delete enrolment?"
        message={`${target?.student.full_name ?? ''} will be removed from ${target?.course.title ?? ''}, including attendance and marks. Prefer “Dropped” to keep history.`}
        confirmLabel="Delete"
        loading={remove.isPending}
        onClose={() => setTarget(null)}
        onConfirm={() => target && remove.mutate(target.id, { onSuccess: () => setTarget(null) })}
      />
    </>
  );
};

export default AdminEnrolmentsPage;
