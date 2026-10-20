import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ClipboardCheck, Pencil, Plus, Trash2 } from 'lucide-react';
import { Badge, Button, Card, ConfirmDialog, DataTable, Input, Modal, PageHeader, Pagination, SearchInput, Select, Spinner, StatusBadge, Switch, Textarea, type Column } from '@/components/ui';
import { getErrorMessage } from '@/lib/api/apiError';
import { useDocumentTitle } from '@/lib/hooks/useDocumentTitle';
import { useListFilter } from '@/lib/hooks/useListFilter';
import { formatDate, formatNumber, resolveMediaUrl } from '@/lib/utils/format';
import { useCourseOptions } from '@/features/courses/hooks/useCourses';
import { useAssignments, useCreateAssignment, useDeleteAssignment, useGradeSubmission, useSubmissions, useUpdateAssignment } from '../hooks/useAssignments';
import type { Assignment, Submission } from '../types';

const schema = z.object({
  course: z.coerce.number<string>().int().positive('Choose a course.'),
  title: z.string().trim().min(3, 'Enter a title.'),
  description: z.string().trim().min(10, 'Describe the assignment (10+ characters).'),
  due_date: z.string().min(1, 'Choose a due date.'),
  max_marks: z.coerce.number<string>().positive('Max marks must be above 0.'),
  is_published: z.boolean(),
});
type FormInput = z.input<typeof schema>;
type FormOutput = z.output<typeof schema>;

const LIST_KEY = 'assignments';

const GradeRow = ({ submission, maxMarks, assignmentId }: { submission: Submission; maxMarks: number; assignmentId: number }) => {
  const grade = useGradeSubmission(assignmentId);
  const [marks, setMarks] = useState(submission.marks_obtained?.toString() ?? '');
  const [feedback, setFeedback] = useState(submission.feedback ?? '');
  const fileUrl = resolveMediaUrl(submission.file);
  const value = Number(marks);
  const invalid = marks === '' || Number.isNaN(value) || value < 0 || value > maxMarks;
  return (
    <li className="space-y-3 py-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-slate-900">{submission.student?.full_name ?? 'Student'}</p>
          <p className="text-[11px] text-slate-400">Submitted {formatDate(submission.submitted_at, true)}</p>
        </div>
        <StatusBadge status={submission.status} label={submission.status_display} />
      </div>
      {submission.submission_text && <p className="whitespace-pre-line rounded-xl bg-slate-50 p-3 text-xs text-slate-700">{submission.submission_text}</p>}
      {fileUrl && (
        <a href={fileUrl} target="_blank" rel="noreferrer" className="text-xs font-semibold text-brand-700 hover:underline">
          Open attached file
        </a>
      )}
      <div className="grid gap-3 sm:grid-cols-[140px_1fr_auto] sm:items-end">
        <Input label={`Marks (max ${maxMarks})`} type="number" min={0} max={maxMarks} value={marks} onChange={(event) => setMarks(event.target.value)} error={marks !== '' && invalid ? 'Out of range' : undefined} />
        <Input label="Feedback" value={feedback} onChange={(event) => setFeedback(event.target.value)} />
        <Button size="md" disabled={invalid} loading={grade.isPending} onClick={() => grade.mutate({ id: submission.id, marks_obtained: value, feedback })}>
          Save
        </Button>
      </div>
    </li>
  );
};

const SubmissionsPanel = ({ assignment }: { assignment: Assignment }) => {
  const submissions = useSubmissions(assignment.id);
  if (submissions.isPending) return <Spinner className="py-10" />;
  if (submissions.isError) return <p className="text-sm text-rose-600">{getErrorMessage(submissions.error)}</p>;
  if (submissions.data.length === 0) return <p className="py-10 text-center text-sm text-slate-500">No submissions yet.</p>;
  return (
    <ul className="divide-y divide-slate-100">
      {submissions.data.map((submission) => (
        <GradeRow key={submission.id} submission={submission} maxMarks={assignment.max_marks} assignmentId={assignment.id} />
      ))}
    </ul>
  );
};

export const AssignmentManagementPage = () => {
  useDocumentTitle('Assignment management');
  const list = useListFilter(LIST_KEY);
  const assignments = useAssignments(list.params);
  const courseOptions = useCourseOptions();
  const create = useCreateAssignment();
  const update = useUpdateAssignment();
  const remove = useDeleteAssignment();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Assignment | null>(null);
  const [grading, setGrading] = useState<Assignment | null>(null);
  const [deleting, setDeleting] = useState<Assignment | null>(null);
  const { register, handleSubmit, reset, formState } = useForm<FormInput, unknown, FormOutput>({ resolver: zodResolver(schema) });

  const open = (row: Assignment | null) => {
    setEditing(row);
    reset({
      course: row ? String(row.course.id) : '',
      title: row?.title ?? '',
      description: row?.description ?? '',
      due_date: row?.due_date ? row.due_date.slice(0, 16) : '',
      max_marks: String(row?.max_marks ?? 100),
      is_published: row?.is_published ?? true,
    });
    setFormOpen(true);
  };

  const onSubmit = (values: FormOutput) => {
    const options = { onSuccess: () => setFormOpen(false) };
    if (editing) update.mutate({ id: editing.id, ...values }, options);
    else create.mutate(values, options);
  };

  const columns: Column<Assignment>[] = [
    {
      key: 'title',
      header: 'Assignment',
      render: (row) => (
        <div>
          <p className="font-semibold text-slate-900">{row.title}</p>
          <p className="text-[11px] text-slate-400">{row.course.title}</p>
        </div>
      ),
    },
    { key: 'due', header: 'Due', render: (row) => formatDate(row.due_date, true) },
    { key: 'marks', header: 'Max marks', render: (row) => row.max_marks },
    { key: 'subs', header: 'Submitted / graded', render: (row) => `${row.submission_count ?? 0} / ${row.graded_count ?? 0}` },
    { key: 'avg', header: 'Average', render: (row) => formatNumber(row.average_marks, 1) },
    { key: 'pub', header: 'Visibility', render: (row) => <Badge tone={row.is_published === false ? 'slate' : 'green'}>{row.is_published === false ? 'Draft' : 'Published'}</Badge> },
    {
      key: 'actions',
      header: '',
      render: (row) => (
        <div className="flex justify-end gap-1">
          <Button size="sm" variant="secondary" icon={<ClipboardCheck className="h-3.5 w-3.5" />} onClick={() => setGrading(row)}>
            Grade
          </Button>
          <Button size="sm" variant="ghost" icon={<Pencil className="h-3.5 w-3.5" />} onClick={() => open(row)}>
            Edit
          </Button>
          <Button size="sm" variant="ghost" className="text-rose-600 hover:bg-rose-50" icon={<Trash2 className="h-3.5 w-3.5" />} onClick={() => setDeleting(row)} aria-label="Delete" />
        </div>
      ),
    },
  ];

  const e = formState.errors;

  return (
    <div>
      <PageHeader
        eyebrow="Academics"
        title="Assignment management"
        description="Publish assignments, review submissions and record marks."
        actions={
          <Button icon={<Plus className="h-4 w-4" />} onClick={() => open(null)}>
            New assignment
          </Button>
        }
      />
      <Card>
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center">
          <SearchInput value={list.search} onChange={list.setSearch} placeholder="Search assignments…" />
          <Select
            aria-label="Course"
            containerClassName="sm:w-60"
            value={list.filters.course ?? ''}
            onChange={(event) => list.setFilter('course', event.target.value)}
            placeholder="All courses"
            options={courseOptions.options}
          />
        </div>
        <DataTable
          columns={columns}
          rows={assignments.data?.results}
          rowKey={(row) => row.id}
          loading={assignments.isPending}
          error={assignments.isError ? getErrorMessage(assignments.error) : null}
          onRetry={() => assignments.refetch()}
          emptyTitle="No assignments yet"
        />
        {assignments.data && <Pagination page={list.page} pageSize={list.pageSize} count={assignments.data.count} onPageChange={list.setPage} />}
      </Card>

      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        size="lg"
        title={editing ? 'Edit assignment' : 'New assignment'}
        footer={
          <>
            <Button variant="outline" onClick={() => setFormOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit(onSubmit)} loading={create.isPending || update.isPending}>
              {editing ? 'Save changes' : 'Create assignment'}
            </Button>
          </>
        }
      >
        <form className="grid gap-4 sm:grid-cols-2" noValidate>
          <Select label="Course" required placeholder="Select a course" options={courseOptions.options} {...register('course')} error={e.course?.message} />
          <Input label="Title" required {...register('title')} error={e.title?.message} />
          <Input label="Due date & time" type="datetime-local" required {...register('due_date')} error={e.due_date?.message} />
          <Input label="Max marks" type="number" min={1} required {...register('max_marks')} error={e.max_marks?.message} />
          <div className="sm:col-span-2">
            <Textarea label="Instructions" rows={5} required {...register('description')} error={e.description?.message} />
          </div>
          <Switch label="Publish to students" description="Students are notified when an assignment is published." className="sm:col-span-2" {...register('is_published')} />
        </form>
      </Modal>

      <Modal open={grading !== null} onClose={() => setGrading(null)} size="lg" title={grading ? `Submissions · ${grading.title}` : 'Submissions'} description={grading ? `${grading.course.title} · max ${grading.max_marks} marks` : undefined}>
        {grading && <SubmissionsPanel assignment={grading} />}
      </Modal>

      <ConfirmDialog
        open={deleting !== null}
        title="Delete assignment?"
        message={`“${deleting?.title}” and its submissions will be deleted.`}
        confirmLabel="Delete"
        loading={remove.isPending}
        onClose={() => setDeleting(null)}
        onConfirm={() => deleting && remove.mutate(deleting.id, { onSuccess: () => setDeleting(null) })}
      />
    </div>
  );
};

export default AssignmentManagementPage;
