import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ExternalLink, FileText, Paperclip, Pencil, Plus, Trash2, Users } from 'lucide-react';
import { Button, Card, ConfirmDialog, DataTable, Input, Modal, PageHeader, Pagination, SearchInput, Skeleton, StatusBadge, Textarea } from '@/components/ui';
import { fmtScore } from '@/components/domain/Metric';
import { QueryView } from '@/components/domain/QueryView';
import { StaffCourseSelect, useStaffCourseOptions } from '@/components/domain/StaffCourseSelect';
import { useDocumentTitle } from '@/lib/hooks/useDocumentTitle';
import { useListFilter } from '@/lib/hooks/useListFilter';
import { formatDate, resolveMediaUrl } from '@/lib/utils/format';
import { Select } from '@/components/ui';
import {
  useAssignment,
  useAssignments,
  useCreateAssignment,
  useDeleteAssignment,
  useGradeSubmissions,
  useSubmissions,
  useUpdateAssignment,
} from '../hooks/useAssignments';
import type { Assignment, Submission } from '../types';

interface FormValues {
  course: string;
  title: string;
  description: string;
  due_date: string;
  max_marks: number;
}

const toLocalInput = (iso: string) => (iso ? new Date(iso).toISOString().slice(0, 16) : '');

const AssignmentFormModal = ({ editId, open, onClose }: { editId: number | null; open: boolean; onClose: () => void }) => {
  const { options } = useStaffCourseOptions();
  const detail = useAssignment(editId);
  const create = useCreateAssignment();
  const update = useUpdateAssignment();
  const { register, handleSubmit, reset, formState } = useForm<FormValues>({ defaultValues: { course: '', title: '', description: '', due_date: '', max_marks: 100 } });

  useEffect(() => {
    if (editId === null) reset({ course: '', title: '', description: '', due_date: '', max_marks: 100 });
    else if (detail.data)
      reset({ course: String(detail.data.course.id), title: detail.data.title, description: detail.data.description, due_date: toLocalInput(detail.data.due_date), max_marks: detail.data.max_marks });
  }, [editId, detail.data, reset]);

  const onSubmit = handleSubmit((values) => {
    const payload = { ...values, course: Number(values.course), max_marks: Number(values.max_marks), due_date: new Date(values.due_date).toISOString() };
    if (editId === null) create.mutate(payload, { onSuccess: onClose });
    else update.mutate({ id: editId, ...payload }, { onSuccess: onClose });
  });

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editId === null ? 'Create assignment' : 'Edit assignment'}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="assignment-form" loading={create.isPending || update.isPending}>
            {editId === null ? 'Create' : 'Save changes'}
          </Button>
        </>
      }
    >
      {editId !== null && detail.isPending ? (
        <Skeleton className="h-60 w-full" />
      ) : (
        <form id="assignment-form" onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
          <Select label="Course" required containerClassName="sm:col-span-2" placeholder="Select course" options={options} {...register('course', { required: 'Select a course' })} error={formState.errors.course?.message} />
          <Input label="Title" required containerClassName="sm:col-span-2" {...register('title', { required: 'Title is required' })} error={formState.errors.title?.message} />
          <Textarea label="Instructions" rows={4} containerClassName="sm:col-span-2" {...register('description')} />
          <Input label="Due date" type="datetime-local" required {...register('due_date', { required: 'Due date is required' })} error={formState.errors.due_date?.message} />
          <Input label="Max marks" type="number" min={1} required {...register('max_marks', { required: true, min: 1 })} />
        </form>
      )}
    </Modal>
  );
};

const GradeModal = ({ assignment, row, onClose }: { assignment: Assignment; row: { enrolment_id: number; name: string; submission: Submission | null } | null; onClose: () => void }) => {
  const grade = useGradeSubmissions();
  const [marks, setMarks] = useState(row?.submission?.marks !== null && row?.submission?.marks !== undefined ? String(row.submission.marks) : '');
  const [feedback, setFeedback] = useState(row?.submission?.feedback ?? '');
  if (!row) return null;
  const value = Number(marks);
  const invalid = marks === '' || Number.isNaN(value) || value < 0 || value > assignment.max_marks;
  return (
    <Modal
      open
      onClose={onClose}
      title="Grade Student Submission"
      description={`${row.name} · ${assignment.title}`}
      size="sm"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button loading={grade.isPending} disabled={invalid} onClick={() => grade.mutate({ id: assignment.id, records: [{ enrolment: row.enrolment_id, marks: value, feedback }] }, { onSuccess: onClose })}>
            Save Grade
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        {row.submission?.submission_text && <p className="max-h-40 overflow-y-auto rounded-2xl bg-slate-50 p-3 text-xs text-slate-600">{row.submission.submission_text}</p>}
        <Input label={`Marks (out of ${assignment.max_marks})`} type="number" min={0} max={assignment.max_marks} value={marks} onChange={(event) => setMarks(event.target.value)} error={marks !== '' && invalid ? `Enter 0–${assignment.max_marks}` : undefined} />
        <Textarea label="Feedback" rows={4} value={feedback} onChange={(event) => setFeedback(event.target.value)} placeholder="Strengths, gaps and next steps…" />
      </div>
    </Modal>
  );
};

const SubmissionsModal = ({ id, onClose }: { id: number | null; onClose: () => void }) => {
  const submissions = useSubmissions(id);
  const [grading, setGrading] = useState<{ enrolment_id: number; name: string; submission: Submission | null } | null>(null);
  return (
    <Modal open={id !== null} onClose={onClose} title={submissions.data?.assignment.title ?? 'Submissions'} description={submissions.data ? `Due ${formatDate(submissions.data.assignment.due_date, true)} · ${submissions.data.assignment.max_marks} marks` : undefined} size="xl">
      <QueryView query={submissions} loading={<Skeleton className="h-60 w-full" />}>
        {(data) => (
          <>
            <DataTable
              rows={data.students}
              rowKey={(row) => row.enrolment_id}
              emptyTitle="No students enrolled"
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
                { key: 'status', header: 'Status', render: (row) => <StatusBadge status={row.submission?.is_late ? 'LATE' : row.status} label={row.submission?.is_late ? 'Late' : undefined} /> },
                { key: 'submitted', header: 'Submitted', render: (row) => formatDate(row.submission?.submitted_at, true) },
                {
                  key: 'work',
                  header: 'Work',
                  render: (row) => (
                    <div className="flex gap-2 text-xs">
                      {row.submission?.submission_link && (
                        <a href={row.submission.submission_link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-semibold text-brand-700">
                          <ExternalLink className="h-3.5 w-3.5" /> Link
                        </a>
                      )}
                      {row.submission?.submission_file && (
                        <a href={resolveMediaUrl(row.submission.submission_file) ?? '#'} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-semibold text-brand-700">
                          <Paperclip className="h-3.5 w-3.5" /> File
                        </a>
                      )}
                      {!row.submission?.submission_link && !row.submission?.submission_file && (row.submission?.submission_text ? 'Text' : '—')}
                    </div>
                  ),
                },
                { key: 'marks', header: 'Marks', render: (row) => (row.submission?.marks !== null && row.submission?.marks !== undefined ? `${row.submission.marks} (${fmtScore(row.submission.percentage)}%)` : '—') },
                {
                  key: 'grade',
                  header: '',
                  className: 'text-right',
                  render: (row) => (
                    <Button size="sm" variant={row.status === 'GRADED' ? 'outline' : 'primary'} onClick={() => setGrading({ enrolment_id: row.enrolment_id, name: row.student.full_name, submission: row.submission })}>
                      {row.status === 'GRADED' ? 'Regrade' : 'Grade'}
                    </Button>
                  ),
                },
              ]}
            />
            <GradeModal key={grading?.enrolment_id ?? 'none'} assignment={data.assignment} row={grading} onClose={() => setGrading(null)} />
          </>
        )}
      </QueryView>
    </Modal>
  );
};

const StaffAssignmentsPage = () => {
  useDocumentTitle('Assignments');
  const list = useListFilter('staff-assignments');
  const assignments = useAssignments({ ...list.params, course: list.filters.course || undefined });
  const remove = useDeleteAssignment();
  const [form, setForm] = useState<{ open: boolean; id: number | null }>({ open: false, id: null });
  const [subsId, setSubsId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState<Assignment | null>(null);

  return (
    <>
      <PageHeader eyebrow="Academics" title="Assignments" description="Create assignments, review submissions and publish grades with feedback." actions={<Button icon={<Plus className="h-4 w-4" />} onClick={() => setForm({ open: true, id: null })}>New assignment</Button>} />
      <Card className="overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row">
          <SearchInput value={list.search} onChange={list.setSearch} placeholder="Search assignments…" className="flex-1" />
          <StaffCourseSelect value={list.filters.course ?? ''} onChange={(value) => list.setFilter('course', value)} className="sm:w-60" />
        </div>
        <DataTable
          rows={assignments.data?.results}
          loading={assignments.isPending}
          rowKey={(row) => row.id}
          emptyTitle="No assignments yet"
          emptyAction={<Button size="sm" onClick={() => setForm({ open: true, id: null })}>Create the first one</Button>}
          columns={[
            {
              key: 'title',
              header: 'Assignment',
              render: (row) => (
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                    <FileText className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="font-semibold text-slate-900">{row.title}</p>
                    <p className="text-[11px] text-slate-500">{row.course.title}</p>
                  </div>
                </div>
              ),
            },
            { key: 'due', header: 'Due', render: (row) => <StatusBadge status={new Date(row.due_date) < new Date() ? 'CLOSED' : 'UPCOMING'} label={formatDate(row.due_date, true)} /> },
            { key: 'marks', header: 'Max marks', render: (row) => row.max_marks },
            { key: 'by', header: 'Created by', render: (row) => row.created_by ?? '—' },
            {
              key: 'actions',
              header: '',
              className: 'text-right',
              render: (row) => (
                <div className="flex justify-end gap-1">
                  <Button size="sm" variant="secondary" icon={<Users className="h-3.5 w-3.5" />} onClick={() => setSubsId(row.id)}>
                    Submissions
                  </Button>
                  <Button size="sm" variant="ghost" aria-label="Edit" icon={<Pencil className="h-3.5 w-3.5" />} onClick={() => setForm({ open: true, id: row.id })} />
                  <Button size="sm" variant="ghost" aria-label="Delete" icon={<Trash2 className="h-3.5 w-3.5 text-rose-500" />} onClick={() => setDeleting(row)} />
                </div>
              ),
            },
          ]}
        />
        <Pagination page={list.page} pageSize={list.pageSize} count={assignments.data?.count ?? 0} onPageChange={list.setPage} />
      </Card>
      <AssignmentFormModal open={form.open} editId={form.id} onClose={() => setForm({ open: false, id: null })} />
      <SubmissionsModal id={subsId} onClose={() => setSubsId(null)} />
      <ConfirmDialog
        open={deleting !== null}
        title="Delete assignment?"
        message={`“${deleting?.title ?? ''}” and all of its submissions will be permanently removed.`}
        confirmLabel="Delete"
        loading={remove.isPending}
        onClose={() => setDeleting(null)}
        onConfirm={() => deleting && remove.mutate(deleting.id, { onSuccess: () => setDeleting(null) })}
      />
    </>
  );
};

export default StaffAssignmentsPage;
