import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Button, Card, ConfirmDialog, DataTable, Modal, PageHeader, Pagination, SearchInput, Select, StatusBadge, Tabs, type Column } from '@/components/ui';
import { getErrorMessage } from '@/lib/api/apiError';
import { useDocumentTitle } from '@/lib/hooks/useDocumentTitle';
import { useListFilter } from '@/lib/hooks/useListFilter';
import { formatDate } from '@/lib/utils/format';
import { useCourseOptions } from '@/features/courses/hooks/useCourses';
import { useAdminStudents } from '@/features/students/hooks/useStudents';
import { useAdminCreateEnrolment, useAdminEnrolments, useAdminRemoveEnrolment, useAdminUpdateEnrolment } from '../hooks/useEnrolments';
import { ENROLMENT_STATUSES, type Enrolment, type EnrolmentStatus } from '../types';

const LIST_KEY = 'admin-enrolments';

export const EnrolmentManagementPage = () => {
  useDocumentTitle('Enrolment management');
  const list = useListFilter(LIST_KEY);
  const enrolments = useAdminEnrolments(list.params);
  const courseOptions = useCourseOptions();
  const students = useAdminStudents({ page: 1, page_size: 200, is_active: 'true' });
  const create = useAdminCreateEnrolment();
  const update = useAdminUpdateEnrolment();
  const remove = useAdminRemoveEnrolment();
  const [createOpen, setCreateOpen] = useState(false);
  const [studentId, setStudentId] = useState('');
  const [courseId, setCourseId] = useState('');
  const [removing, setRemoving] = useState<Enrolment | null>(null);

  const statusTab = list.filters.status ?? 'all';

  const columns: Column<Enrolment>[] = [
    {
      key: 'student',
      header: 'Student',
      render: (row) => (
        <div>
          <p className="font-semibold text-slate-900">{row.student?.full_name ?? '—'}</p>
          <p className="text-[11px] text-slate-400">{row.student?.email ?? row.student?.student_code}</p>
        </div>
      ),
    },
    { key: 'course', header: 'Course', render: (row) => row.course.title },
    { key: 'date', header: 'Enrolled', render: (row) => formatDate(row.enrolled_at) },
    { key: 'status', header: 'Status', render: (row) => <StatusBadge status={row.status} label={row.status_display} /> },
    {
      key: 'change',
      header: 'Update status',
      render: (row) => (
        <Select
          aria-label="Change status"
          containerClassName="w-40"
          className="py-1.5 text-xs"
          value={row.status}
          onChange={(event) => update.mutate({ id: row.id, status: event.target.value as EnrolmentStatus })}
          options={ENROLMENT_STATUSES}
          disabled={update.isPending && update.variables?.id === row.id}
        />
      ),
    },
    {
      key: 'actions',
      header: '',
      render: (row) => (
        <Button size="sm" variant="ghost" className="text-rose-600 hover:bg-rose-50" icon={<Trash2 className="h-3.5 w-3.5" />} onClick={() => setRemoving(row)}>
          Remove
        </Button>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        eyebrow="Academics"
        title="Enrolment management"
        description="Approve, update and track student-course enrolments."
        actions={
          <Button icon={<Plus className="h-4 w-4" />} onClick={() => setCreateOpen(true)}>
            Enrol a student
          </Button>
        }
      />
      <Card>
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 xl:flex-row xl:items-center xl:justify-between">
          <Tabs
            value={statusTab}
            onChange={(value) => list.setFilter('status', value === 'all' ? '' : value)}
            tabs={[{ value: 'all', label: 'All' }, ...ENROLMENT_STATUSES.slice(0, 3)]}
          />
          <div className="flex flex-col gap-3 sm:flex-row">
            <Select
              aria-label="Course"
              containerClassName="sm:w-56"
              value={list.filters.course ?? ''}
              onChange={(event) => list.setFilter('course', event.target.value)}
              placeholder="All courses"
              options={courseOptions.options}
            />
            <SearchInput value={list.search} onChange={list.setSearch} placeholder="Search student…" />
          </div>
        </div>
        <DataTable
          columns={columns}
          rows={enrolments.data?.results}
          rowKey={(row) => row.id}
          loading={enrolments.isPending}
          error={enrolments.isError ? getErrorMessage(enrolments.error) : null}
          onRetry={() => enrolments.refetch()}
          emptyTitle="No enrolments found"
        />
        {enrolments.data && <Pagination page={list.page} pageSize={list.pageSize} count={enrolments.data.count} onPageChange={list.setPage} />}
      </Card>

      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Enrol a student"
        footer={
          <>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button
              disabled={!studentId || !courseId}
              loading={create.isPending}
              onClick={() =>
                create.mutate(
                  { student: Number(studentId), course: Number(courseId), status: 'ACTIVE' },
                  {
                    onSuccess: () => {
                      setCreateOpen(false);
                      setStudentId('');
                      setCourseId('');
                    },
                  },
                )
              }
            >
              Enrol
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Select
            label="Student"
            value={studentId}
            onChange={(event) => setStudentId(event.target.value)}
            placeholder="Select a student"
            options={(students.data?.results ?? []).map((item) => ({ value: item.id, label: `${item.user.full_name} (${item.student_code})` }))}
          />
          <Select label="Course" value={courseId} onChange={(event) => setCourseId(event.target.value)} placeholder="Select a course" options={courseOptions.options} />
        </div>
      </Modal>

      <ConfirmDialog
        open={removing !== null}
        title="Remove enrolment?"
        message={`${removing?.student?.full_name ?? 'This student'} will be removed from ${removing?.course.title}.`}
        confirmLabel="Remove"
        loading={remove.isPending}
        onClose={() => setRemoving(null)}
        onConfirm={() => removing && remove.mutate(removing.id, { onSuccess: () => setRemoving(null) })}
      />
    </div>
  );
};

export default EnrolmentManagementPage;
