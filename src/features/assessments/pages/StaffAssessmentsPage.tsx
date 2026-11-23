import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Award, ListChecks, Pencil, Plus, Save, Trash2 } from 'lucide-react';
import { Button, Card, ConfirmDialog, DataTable, Input, Modal, PageHeader, Pagination, SearchInput, Select, Skeleton, StatusBadge, Textarea } from '@/components/ui';
import { fmtScore } from '@/components/domain/Metric';
import { QueryView } from '@/components/domain/QueryView';
import { StaffCourseSelect, useStaffCourseOptions } from '@/components/domain/StaffCourseSelect';
import { useDocumentTitle } from '@/lib/hooks/useDocumentTitle';
import { useListFilter } from '@/lib/hooks/useListFilter';
import { formatDate } from '@/lib/utils/format';
import {
  useAssessment,
  useAssessmentResults,
  useAssessments,
  useCreateAssessment,
  useDeleteAssessment,
  useDeleteResult,
  useEnterMarks,
  useUpdateAssessment,
} from '../hooks/useAssessments';
import { ASSESSMENT_TYPES, type Assessment, type AssessmentResultsData, type AssessmentType } from '../types';

interface FormValues {
  course: string;
  title: string;
  description: string;
  assessment_type: AssessmentType;
  assessment_date: string;
  max_marks: number;
  pass_marks: number;
}

const EMPTY: FormValues = { course: '', title: '', description: '', assessment_type: 'MOCK_TEST', assessment_date: '', max_marks: 100, pass_marks: 40 };

const AssessmentFormModal = ({ open, editId, onClose }: { open: boolean; editId: number | null; onClose: () => void }) => {
  const { options } = useStaffCourseOptions();
  const detail = useAssessment(editId);
  const create = useCreateAssessment();
  const update = useUpdateAssessment();
  const { register, handleSubmit, reset, formState } = useForm<FormValues>({ defaultValues: EMPTY });

  useEffect(() => {
    if (editId === null) reset(EMPTY);
    else if (detail.data)
      reset({
        course: String(detail.data.course.id),
        title: detail.data.title,
        description: detail.data.description,
        assessment_type: detail.data.assessment_type as AssessmentType,
        assessment_date: detail.data.assessment_date?.slice(0, 10) ?? '',
        max_marks: detail.data.max_marks,
        pass_marks: detail.data.pass_marks,
      });
  }, [editId, detail.data, reset]);

  const onSubmit = handleSubmit((values) => {
    const payload = { ...values, course: Number(values.course), max_marks: Number(values.max_marks), pass_marks: Number(values.pass_marks) };
    if (editId === null) create.mutate(payload, { onSuccess: onClose });
    else update.mutate({ id: editId, ...payload }, { onSuccess: onClose });
  });

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editId === null ? 'Create assessment' : 'Edit assessment'}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="assessment-form" loading={create.isPending || update.isPending}>
            {editId === null ? 'Create' : 'Save changes'}
          </Button>
        </>
      }
    >
      {editId !== null && detail.isPending ? (
        <Skeleton className="h-60 w-full" />
      ) : (
        <form id="assessment-form" onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
          <Select label="Course" required containerClassName="sm:col-span-2" placeholder="Select course" options={options} {...register('course', { required: 'Select a course' })} error={formState.errors.course?.message} />
          <Input label="Title" required containerClassName="sm:col-span-2" {...register('title', { required: 'Title is required' })} error={formState.errors.title?.message} />
          <Select label="Type" options={ASSESSMENT_TYPES} {...register('assessment_type')} />
          <Input label="Date" type="date" required {...register('assessment_date', { required: 'Date is required' })} error={formState.errors.assessment_date?.message} />
          <Input label="Max marks" type="number" min={1} {...register('max_marks', { required: true })} />
          <Input label="Pass marks" type="number" min={0} {...register('pass_marks', { required: true })} />
          <Textarea label="Description" rows={3} containerClassName="sm:col-span-2" {...register('description')} />
        </form>
      )}
    </Modal>
  );
};

type Draft = Record<number, { marks: string; remarks: string }>;

const draftFrom = (data: AssessmentResultsData): Draft =>
  Object.fromEntries(data.students.map((row) => [row.enrolment_id, { marks: row.result ? String(row.result.marks_obtained) : '', remarks: row.result?.remarks ?? '' }]));

const ResultsEditor = ({ data, onClose }: { data: AssessmentResultsData; onClose: () => void }) => {
  const enter = useEnterMarks();
  const removeResult = useDeleteResult();
  const [draft, setDraft] = useState<Draft>(() => draftFrom(data));
  const [deleting, setDeleting] = useState<{ id: number; name: string } | null>(null);
  const max = data.assessment.max_marks;
  const records = Object.entries(draft)
    .filter(([, value]) => value.marks !== '' && !Number.isNaN(Number(value.marks)))
    .map(([enrolment, value]) => ({ enrolment: Number(enrolment), marks_obtained: Number(value.marks), remarks: value.remarks || undefined }));
  const invalid = records.some((record) => record.marks_obtained < 0 || record.marks_obtained > max);
  const set = (enrolment: number, patch: Partial<{ marks: string; remarks: string }>) =>
    setDraft((prev) => ({ ...prev, [enrolment]: { marks: prev[enrolment]?.marks ?? '', remarks: prev[enrolment]?.remarks ?? '', ...patch } }));

  return (
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
          {
            key: 'marks',
            header: `Marks / ${max}`,
            render: (row) => (
              <input
                type="number"
                min={0}
                max={max}
                aria-label={`Marks for ${row.student.full_name}`}
                className="h-9 w-24 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-brand-400 focus:bg-white"
                value={draft[row.enrolment_id]?.marks ?? ''}
                onChange={(event) => set(row.enrolment_id, { marks: event.target.value })}
              />
            ),
          },
          {
            key: 'remarks',
            header: 'Remarks',
            render: (row) => (
              <input
                aria-label={`Remarks for ${row.student.full_name}`}
                className="h-9 w-full min-w-40 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs outline-none focus:border-brand-400 focus:bg-white"
                value={draft[row.enrolment_id]?.remarks ?? ''}
                onChange={(event) => set(row.enrolment_id, { remarks: event.target.value })}
              />
            ),
          },
          { key: 'pct', header: '%', render: (row) => fmtScore(row.result?.percentage) },
          { key: 'result', header: 'Result', render: (row) => (row.result ? <StatusBadge status={row.result.result} /> : <span className="text-slate-400">—</span>) },
          {
            key: 'del',
            header: '',
            render: (row) => {
              const result = row.result;
              return result ? (
                <Button size="sm" variant="ghost" aria-label="Delete result" icon={<Trash2 className="h-3.5 w-3.5 text-rose-500" />} onClick={() => setDeleting({ id: result.id, name: row.student.full_name })} />
              ) : null;
            },
          },
        ]}
      />
      <div className="mt-5 flex justify-end gap-2 border-t border-slate-100 pt-4">
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
        <Button icon={<Save className="h-4 w-4" />} loading={enter.isPending} disabled={!records.length || invalid} onClick={() => enter.mutate({ id: data.assessment.id, records })}>
          Save marks ({records.length})
        </Button>
      </div>
      <ConfirmDialog
        open={deleting !== null}
        title="Delete result?"
        message={`The recorded marks for ${deleting?.name ?? ''} will be removed.`}
        confirmLabel="Delete"
        loading={removeResult.isPending}
        onClose={() => setDeleting(null)}
        onConfirm={() => deleting && removeResult.mutate(deleting.id, { onSuccess: () => setDeleting(null) })}
      />
    </>
  );
};

const ResultsModal = ({ id, onClose }: { id: number | null; onClose: () => void }) => {
  const results = useAssessmentResults(id);
  return (
    <Modal
      open={id !== null}
      onClose={onClose}
      size="xl"
      title={results.data?.assessment.title ?? 'Results'}
      description={results.data ? `${results.data.assessment.assessment_type_display} · ${formatDate(results.data.assessment.assessment_date)} · pass ${results.data.assessment.pass_marks}/${results.data.assessment.max_marks}` : undefined}
    >
      <QueryView query={results} loading={<Skeleton className="h-60 w-full" />}>
        {(data) => <ResultsEditor key={results.dataUpdatedAt} data={data} onClose={onClose} />}
      </QueryView>
    </Modal>
  );
};

const StaffAssessmentsPage = () => {
  useDocumentTitle('Assessments & Marks');
  const list = useListFilter('staff-assessments');
  const assessments = useAssessments({ ...list.params, course: list.filters.course || undefined, assessment_type: list.filters.assessment_type || undefined });
  const remove = useDeleteAssessment();
  const [form, setForm] = useState<{ open: boolean; id: number | null }>({ open: false, id: null });
  const [resultsId, setResultsId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState<Assessment | null>(null);

  return (
    <>
      <PageHeader eyebrow="Academics" title="Assessments & Marks" description="Schedule mock tests and exams, then record marks for every learner." actions={<Button icon={<Plus className="h-4 w-4" />} onClick={() => setForm({ open: true, id: null })}>New assessment</Button>} />
      <Card className="overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 md:flex-row">
          <SearchInput value={list.search} onChange={list.setSearch} placeholder="Search assessments…" className="flex-1" />
          <StaffCourseSelect value={list.filters.course ?? ''} onChange={(value) => list.setFilter('course', value)} className="md:w-56" />
          <Select aria-label="Type" containerClassName="md:w-40" placeholder="All types" options={ASSESSMENT_TYPES} value={list.filters.assessment_type ?? ''} onChange={(event) => list.setFilter('assessment_type', event.target.value)} />
        </div>
        <DataTable
          rows={assessments.data?.results}
          loading={assessments.isPending}
          rowKey={(row) => row.id}
          emptyTitle="No assessments scheduled"
          columns={[
            {
              key: 'title',
              header: 'Assessment',
              render: (row) => (
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-sun-100 text-amber-700">
                    <Award className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="font-semibold text-slate-900">{row.title}</p>
                    <p className="text-[11px] text-slate-500">{row.course.title}</p>
                  </div>
                </div>
              ),
            },
            { key: 'type', header: 'Type', render: (row) => <StatusBadge status={row.assessment_type === 'EXAM' ? 'UPCOMING' : 'PUBLISHED'} label={row.assessment_type_display} /> },
            { key: 'date', header: 'Date', render: (row) => formatDate(row.assessment_date) },
            { key: 'marks', header: 'Pass / Max', render: (row) => `${row.pass_marks} / ${row.max_marks}` },
            {
              key: 'actions',
              header: '',
              className: 'text-right',
              render: (row) => (
                <div className="flex justify-end gap-1">
                  <Button size="sm" variant="secondary" icon={<ListChecks className="h-3.5 w-3.5" />} onClick={() => setResultsId(row.id)}>
                    Enter marks
                  </Button>
                  <Button size="sm" variant="ghost" aria-label="Edit" icon={<Pencil className="h-3.5 w-3.5" />} onClick={() => setForm({ open: true, id: row.id })} />
                  <Button size="sm" variant="ghost" aria-label="Delete" icon={<Trash2 className="h-3.5 w-3.5 text-rose-500" />} onClick={() => setDeleting(row)} />
                </div>
              ),
            },
          ]}
        />
        <Pagination page={list.page} pageSize={list.pageSize} count={assessments.data?.count ?? 0} onPageChange={list.setPage} />
      </Card>
      <AssessmentFormModal open={form.open} editId={form.id} onClose={() => setForm({ open: false, id: null })} />
      <ResultsModal id={resultsId} onClose={() => setResultsId(null)} />
      <ConfirmDialog
        open={deleting !== null}
        title="Delete assessment?"
        message={`“${deleting?.title ?? ''}” and its recorded results will be removed.`}
        confirmLabel="Delete"
        loading={remove.isPending}
        onClose={() => setDeleting(null)}
        onConfirm={() => deleting && remove.mutate(deleting.id, { onSuccess: () => setDeleting(null) })}
      />
    </>
  );
};

export default StaffAssessmentsPage;
