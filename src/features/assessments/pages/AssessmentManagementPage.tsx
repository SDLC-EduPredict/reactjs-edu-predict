import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ClipboardList, Pencil, Plus, Trash2 } from 'lucide-react';
import { Badge, Button, Card, ConfirmDialog, DataTable, Input, Modal, PageHeader, Pagination, SearchInput, Select, Spinner, Switch, Textarea, type Column } from '@/components/ui';
import { getErrorMessage } from '@/lib/api/apiError';
import { useDocumentTitle } from '@/lib/hooks/useDocumentTitle';
import { useListFilter } from '@/lib/hooks/useListFilter';
import { formatDate, formatNumber, humanize } from '@/lib/utils/format';
import { useCourseOptions } from '@/features/courses/hooks/useCourses';
import { useCourseRoster } from '@/features/performance/hooks/usePerformance';
import type { MonitoredStudent } from '@/features/performance/types';
import { useAssessmentResults, useAssessments, useCreateAssessment, useDeleteAssessment, useRecordResult, useUpdateAssessment } from '../hooks/useAssessments';
import { ASSESSMENT_TYPES, type Assessment, type AssessmentResult } from '../types';

const schema = z
  .object({
    course: z.coerce.number<string>().int().positive('Choose a course.'),
    title: z.string().trim().min(3, 'Enter a title.'),
    description: z.string().trim(),
    assessment_type: z.enum(['MOCK_TEST', 'QUIZ', 'MIDTERM', 'FINAL']),
    scheduled_date: z.string().min(1, 'Choose a date.'),
    duration_minutes: z.coerce.number<string>().int().positive('Enter a duration.'),
    total_marks: z.coerce.number<string>().positive('Enter total marks.'),
    passing_marks: z.coerce.number<string>().min(0),
    is_published: z.boolean(),
  })
  .refine((values) => values.passing_marks <= values.total_marks, { path: ['passing_marks'], message: 'Cannot exceed total marks.' });
type FormInput = z.input<typeof schema>;
type FormOutput = z.output<typeof schema>;

const LIST_KEY = 'assessments';

const MarkRow = ({ student, assessment, existing }: { student: MonitoredStudent; assessment: Assessment; existing?: AssessmentResult }) => {
  const record = useRecordResult(assessment.id);
  const [marks, setMarks] = useState(existing?.marks_obtained?.toString() ?? '');
  const value = Number(marks);
  const invalid = marks === '' || Number.isNaN(value) || value < 0 || value > assessment.total_marks;
  const enrolment = student.enrolment_id ?? student.id ?? 0;
  return (
    <li className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-semibold text-slate-900">{student.student.full_name}</p>
        <p className="text-[11px] text-slate-400">{existing ? `Recorded: ${formatNumber(existing.marks_obtained, 1)} / ${assessment.total_marks}` : 'Not recorded'}</p>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="number"
          min={0}
          max={assessment.total_marks}
          value={marks}
          onChange={(event) => setMarks(event.target.value)}
          className="h-9 w-24 rounded-lg border border-slate-200 px-2 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
          aria-label={`Marks for ${student.student.full_name}`}
        />
        <span className="text-xs text-slate-400">/ {assessment.total_marks}</span>
        <Button size="sm" disabled={invalid} loading={record.isPending} onClick={() => record.mutate({ assessmentId: assessment.id, enrolment, marks_obtained: value })}>
          Save
        </Button>
      </div>
    </li>
  );
};

const MarksPanel = ({ assessment }: { assessment: Assessment }) => {
  const roster = useCourseRoster(String(assessment.course.id));
  const results = useAssessmentResults(assessment.id);
  if (roster.isPending || results.isPending) return <Spinner className="py-10" />;
  if (roster.isError) return <p className="text-sm text-rose-600">{getErrorMessage(roster.error)}</p>;
  if (roster.data.rows.length === 0) return <p className="py-10 text-center text-sm text-slate-500">No students enrolled in this course.</p>;
  const byStudent = new Map((results.data ?? []).map((result) => [result.student?.id, result]));
  return (
    <ul className="divide-y divide-slate-100">
      {roster.data.rows.map((row) => (
        <MarkRow key={row.enrolment_id ?? row.id ?? row.student.id} student={row} assessment={assessment} existing={byStudent.get(row.student.id)} />
      ))}
    </ul>
  );
};

export const AssessmentManagementPage = () => {
  useDocumentTitle('Assessments & marks');
  const list = useListFilter(LIST_KEY);
  const assessments = useAssessments(list.params);
  const courseOptions = useCourseOptions();
  const create = useCreateAssessment();
  const update = useUpdateAssessment();
  const remove = useDeleteAssessment();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Assessment | null>(null);
  const [marking, setMarking] = useState<Assessment | null>(null);
  const [deleting, setDeleting] = useState<Assessment | null>(null);
  const { register, handleSubmit, reset, formState } = useForm<FormInput, unknown, FormOutput>({ resolver: zodResolver(schema) });

  const open = (row: Assessment | null) => {
    setEditing(row);
    reset({
      course: row ? String(row.course.id) : '',
      title: row?.title ?? '',
      description: row?.description ?? '',
      assessment_type: (row?.assessment_type as FormInput['assessment_type']) ?? 'MOCK_TEST',
      scheduled_date: row?.scheduled_date ? row.scheduled_date.slice(0, 16) : '',
      duration_minutes: String(row?.duration_minutes ?? 60),
      total_marks: String(row?.total_marks ?? 100),
      passing_marks: String(row?.passing_marks ?? 40),
      is_published: row?.is_published ?? false,
    });
    setFormOpen(true);
  };

  const onSubmit = (values: FormOutput) => {
    const options = { onSuccess: () => setFormOpen(false) };
    if (editing) update.mutate({ id: editing.id, ...values }, options);
    else create.mutate(values, options);
  };

  const columns: Column<Assessment>[] = [
    {
      key: 'title',
      header: 'Assessment',
      render: (row) => (
        <div>
          <p className="font-semibold text-slate-900">{row.title}</p>
          <p className="text-[11px] text-slate-400">{row.course.title}</p>
        </div>
      ),
    },
    { key: 'type', header: 'Type', render: (row) => <Badge tone="violet">{row.assessment_type_display ?? humanize(row.assessment_type)}</Badge> },
    { key: 'date', header: 'Scheduled', render: (row) => formatDate(row.scheduled_date, true) },
    { key: 'marks', header: 'Total / pass', render: (row) => `${row.total_marks} / ${row.passing_marks ?? '—'}` },
    { key: 'results', header: 'Results', render: (row) => row.result_count ?? '—' },
    { key: 'avg', header: 'Average', render: (row) => formatNumber(row.average_marks, 1) },
    { key: 'pub', header: 'Results', render: (row) => <Badge tone={row.is_published ? 'green' : 'amber'}>{row.is_published ? 'Published' : 'Unpublished'}</Badge> },
    {
      key: 'actions',
      header: '',
      render: (row) => (
        <div className="flex justify-end gap-1">
          <Button size="sm" variant="secondary" icon={<ClipboardList className="h-3.5 w-3.5" />} onClick={() => setMarking(row)}>
            Marks
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
        title="Assessments & marks"
        description="Schedule mock tests and exams, record marks and publish results."
        actions={
          <Button icon={<Plus className="h-4 w-4" />} onClick={() => open(null)}>
            New assessment
          </Button>
        }
      />
      <Card>
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 md:flex-row md:items-center">
          <SearchInput value={list.search} onChange={list.setSearch} placeholder="Search assessments…" />
          <Select aria-label="Course" containerClassName="md:w-56" value={list.filters.course ?? ''} onChange={(event) => list.setFilter('course', event.target.value)} placeholder="All courses" options={courseOptions.options} />
          <Select aria-label="Type" containerClassName="md:w-44" value={list.filters.assessment_type ?? ''} onChange={(event) => list.setFilter('assessment_type', event.target.value)} placeholder="All types" options={ASSESSMENT_TYPES} />
        </div>
        <DataTable
          columns={columns}
          rows={assessments.data?.results}
          rowKey={(row) => row.id}
          loading={assessments.isPending}
          error={assessments.isError ? getErrorMessage(assessments.error) : null}
          onRetry={() => assessments.refetch()}
          emptyTitle="No assessments scheduled"
        />
        {assessments.data && <Pagination page={list.page} pageSize={list.pageSize} count={assessments.data.count} onPageChange={list.setPage} />}
      </Card>

      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        size="lg"
        title={editing ? 'Edit assessment' : 'New assessment'}
        footer={
          <>
            <Button variant="outline" onClick={() => setFormOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit(onSubmit)} loading={create.isPending || update.isPending}>
              {editing ? 'Save changes' : 'Create assessment'}
            </Button>
          </>
        }
      >
        <form className="grid gap-4 sm:grid-cols-2" noValidate>
          <Select label="Course" required placeholder="Select a course" options={courseOptions.options} {...register('course')} error={e.course?.message} />
          <Select label="Type" options={ASSESSMENT_TYPES} {...register('assessment_type')} />
          <Input label="Title" required containerClassName="sm:col-span-2" {...register('title')} error={e.title?.message} />
          <Input label="Date & time" type="datetime-local" required {...register('scheduled_date')} error={e.scheduled_date?.message} />
          <Input label="Duration (minutes)" type="number" min={1} {...register('duration_minutes')} error={e.duration_minutes?.message} />
          <Input label="Total marks" type="number" min={1} {...register('total_marks')} error={e.total_marks?.message} />
          <Input label="Passing marks" type="number" min={0} {...register('passing_marks')} error={e.passing_marks?.message} />
          <div className="sm:col-span-2">
            <Textarea label="Description" rows={3} {...register('description')} />
          </div>
          <Switch label="Publish results" description="Students see their marks once results are published." className="sm:col-span-2" {...register('is_published')} />
        </form>
      </Modal>

      <Modal open={marking !== null} onClose={() => setMarking(null)} size="lg" title={marking ? `Marks · ${marking.title}` : 'Marks'} description={marking ? `${marking.course.title} · total ${marking.total_marks}` : undefined}>
        {marking && <MarksPanel assessment={marking} />}
      </Modal>

      <ConfirmDialog
        open={deleting !== null}
        title="Delete assessment?"
        message={`“${deleting?.title}” and its recorded marks will be deleted.`}
        confirmLabel="Delete"
        loading={remove.isPending}
        onClose={() => setDeleting(null)}
        onConfirm={() => deleting && remove.mutate(deleting.id, { onSuccess: () => setDeleting(null) })}
      />
    </div>
  );
};

export default AssessmentManagementPage;
