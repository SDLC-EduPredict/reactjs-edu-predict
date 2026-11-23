import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Database, Download, Pencil } from 'lucide-react';
import { Button, Card, CardBody, CardHeader, DataTable, EmptyState, Input, Modal, PageHeader, Pagination, SearchInput, Select, Skeleton, Tabs } from '@/components/ui';
import { DonutChart } from '@/components/charts/Charts';
import { INDICATOR_COLORS } from '@/components/charts/chartColors';
import { IndicatorBadge } from '@/components/domain/IndicatorBadge';
import { fmtPct, fmtScore, Kpi, Meter } from '@/components/domain/Metric';
import { QueryView } from '@/components/domain/QueryView';
import { StaffCourseSelect, useStaffCourseOptions } from '@/components/domain/StaffCourseSelect';
import { useDocumentTitle } from '@/lib/hooks/useDocumentTitle';
import { useListFilter } from '@/lib/hooks/useListFilter';
import { formatDate, humanize } from '@/lib/utils/format';
import { ENROLMENT_STATUSES, INDICATORS } from '@/types';
import { useExportDataset, usePerformanceDataset, usePerformanceList, usePerformanceRecord, usePerformanceSummary, useUpdatePerformance } from '../hooks/usePerformance';
import { PARTICIPATION_LEVELS, type Participation } from '../types';

const ORDERING = [
  { value: '-overall_score', label: 'Highest score' },
  { value: 'overall_score', label: 'Lowest score' },
  { value: 'attendance_percentage', label: 'Lowest attendance' },
  { value: '-calculated_at', label: 'Recently updated' },
];

interface EditValues {
  practice_hours: string;
  previous_score: string;
  modules_completed: string;
  participation: Participation | '';
}

const num = (value: string) => (value === '' ? null : Number(value));

const EditPerformanceModal = ({ id, onClose }: { id: number | null; onClose: () => void }) => {
  const record = usePerformanceRecord(id);
  const update = useUpdatePerformance();
  const { register, handleSubmit, reset } = useForm<EditValues>();
  useEffect(() => {
    if (record.data)
      reset({
        practice_hours: record.data.practice_hours?.toString() ?? '',
        previous_score: record.data.previous_score?.toString() ?? '',
        modules_completed: record.data.modules_completed?.toString() ?? '',
        participation: (record.data.participation as Participation | '') ?? '',
      });
  }, [record.data, reset]);

  return (
    <Modal
      open={id !== null}
      onClose={onClose}
      size="lg"
      title={record.data ? `${record.data.student.full_name} · ${record.data.course.title}` : 'Performance record'}
      description="Attendance, assignments and tests are calculated automatically. Update the mentor-entered inputs below."
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="perf-form" loading={update.isPending}>
            Save & recalculate
          </Button>
        </>
      }
    >
      <QueryView query={record} loading={<Skeleton className="h-60 w-full" />}>
        {(data) => (
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-3">
              <Meter label="Attendance" value={data.attendance_percentage} suffix="%" />
              <Meter label="Assignment average" value={data.assignment_average} />
              <Meter label="Mock test average" value={data.mock_test_average} />
              <Meter label="Exam average" value={data.exam_average} />
              <div className="flex items-center justify-between rounded-2xl bg-brand-50 p-3">
                <span className="text-xs font-semibold text-brand-700">Overall score</span>
                <span className="flex items-center gap-2">
                  <span className="font-display text-xl font-bold">{fmtScore(data.overall_score)}</span>
                  <IndicatorBadge indicator={data.indicator} label={data.indicator_display} />
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Last calculated {formatDate(data.calculated_at, true)} {data.updated_by ? `· by ${data.updated_by}` : ''}
              </p>
            </div>
            <form
              id="perf-form"
              className="space-y-4"
              onSubmit={handleSubmit((values) =>
                update.mutate(
                  { id: data.id, practice_hours: num(values.practice_hours), previous_score: num(values.previous_score), modules_completed: num(values.modules_completed), participation: values.participation },
                  { onSuccess: onClose },
                ),
              )}
            >
              <Input label="Practice hours / week" type="number" step="0.5" min={0} {...register('practice_hours')} />
              <Input label="Previous score" type="number" min={0} max={100} {...register('previous_score')} />
              <Input label={`Modules completed (of ${data.total_modules})`} type="number" min={0} max={data.total_modules} {...register('modules_completed')} />
              <Select label="Class participation" placeholder="Not rated" options={PARTICIPATION_LEVELS} {...register('participation')} />
            </form>
          </div>
        )}
      </QueryView>
    </Modal>
  );
};

const RecordsTab = () => {
  const list = useListFilter('staff-performance');
  const f = list.filters;
  const records = usePerformanceList({
    ...list.params,
    course: f.course || undefined,
    indicator: f.indicator || undefined,
    status: f.status || undefined,
    participation: f.participation || undefined,
    ordering: f.ordering || undefined,
  });
  const [editId, setEditId] = useState<number | null>(null);
  return (
    <Card className="overflow-hidden">
      <div className="grid gap-3 border-b border-slate-100 p-4 md:grid-cols-3 xl:grid-cols-6">
        <SearchInput value={list.search} onChange={list.setSearch} placeholder="Search…" className="xl:col-span-2" />
        <StaffCourseSelect value={f.course ?? ''} onChange={(value) => list.setFilter('course', value)} />
        <Select aria-label="Indicator" placeholder="All standings" value={f.indicator ?? ''} onChange={(e) => list.setFilter('indicator', e.target.value)} options={INDICATORS.map((value) => ({ value, label: humanize(value) }))} />
        <Select aria-label="Status" placeholder="All enrolments" value={f.status ?? ''} onChange={(e) => list.setFilter('status', e.target.value)} options={ENROLMENT_STATUSES} />
        <Select aria-label="Sort" placeholder="Default order" value={f.ordering ?? ''} onChange={(e) => list.setFilter('ordering', e.target.value)} options={ORDERING} />
      </div>
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 px-4 py-2 text-xs">
        <span className="font-semibold text-slate-500">Participation:</span>
        {[{ value: '', label: 'Any' }, ...PARTICIPATION_LEVELS].map((level) => (
          <button key={level.value || 'any'} type="button" onClick={() => list.setFilter('participation', level.value)} className={`rounded-full px-3 py-1 font-semibold ${(f.participation ?? '') === level.value ? 'bg-brand-700 text-white' : 'bg-slate-100 text-slate-600'}`}>
            {level.label}
          </button>
        ))}
      </div>
      <DataTable
        rows={records.data?.results}
        loading={records.isPending}
        rowKey={(row) => row.id}
        emptyTitle="No performance records"
        columns={[
          {
            key: 'student',
            header: 'Student',
            render: (row) => (
              <div>
                <p className="font-semibold text-slate-900">{row.student.full_name}</p>
                <p className="text-[11px] text-slate-500">{row.course.title}</p>
              </div>
            ),
          },
          { key: 'att', header: 'Attend.', render: (row) => fmtPct(row.attendance_percentage) },
          { key: 'asg', header: 'Assign.', render: (row) => fmtScore(row.assignment_average) },
          { key: 'mock', header: 'Mock', render: (row) => fmtScore(row.mock_test_average) },
          { key: 'exam', header: 'Exam', render: (row) => fmtScore(row.exam_average) },
          { key: 'prac', header: 'Practice', render: (row) => (row.practice_hours === null ? '—' : `${row.practice_hours} h`) },
          { key: 'mod', header: 'Modules', render: (row) => `${row.modules_completed ?? 0}/${row.total_modules}` },
          { key: 'overall', header: 'Overall', render: (row) => <span className="font-display font-bold text-brand-700">{fmtScore(row.overall_score)}</span> },
          { key: 'ind', header: 'Standing', render: (row) => <IndicatorBadge indicator={row.indicator} label={row.indicator_display} /> },
          { key: 'edit', header: '', render: (row) => <Button size="sm" variant="ghost" aria-label="Edit" icon={<Pencil className="h-3.5 w-3.5" />} onClick={() => setEditId(row.id)} /> },
        ]}
      />
      <Pagination page={list.page} pageSize={list.pageSize} count={records.data?.count ?? 0} onPageChange={list.setPage} />
      <EditPerformanceModal id={editId} onClose={() => setEditId(null)} />
    </Card>
  );
};

const SummaryTab = () => {
  const { courses } = useStaffCourseOptions();
  const [course, setCourse] = useState('');
  const active = course || (courses[0] ? String(courses[0].id) : '');
  const summary = usePerformanceSummary(active ? Number(active) : null);
  return (
    <div className="space-y-6">
      <StaffCourseSelect value={active} onChange={setCourse} placeholder="Select course" className="max-w-xs" />
      {!active ? (
        <EmptyState title="Select a course" />
      ) : (
        <QueryView query={summary}>
          {(data) => (
            <>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <Kpi label="Students" value={data.summary.students} tone="navy" />
                <Kpi label="Attendance" value={fmtPct(data.summary.attendance_percentage)} tone="lime" />
                <Kpi label="Assessments" value={fmtScore(data.summary.assessment_average)} tone="sun" />
                <Kpi label="Overall" value={fmtScore(data.summary.overall_score)} hint={<IndicatorBadge indicator={data.summary.indicator} label={data.summary.indicator_display} />} />
              </div>
              <div className="grid gap-6 xl:grid-cols-[1fr_2fr]">
                <Card>
                  <CardHeader title="Standing mix" description={data.course.title} />
                  <CardBody>
                    <DonutChart data={INDICATORS.map((key) => ({ name: humanize(key), value: data.summary.indicators[key] ?? 0, color: INDICATOR_COLORS[key] }))} />
                  </CardBody>
                </Card>
                <Card>
                  <CardHeader title="Student breakdown" />
                  <DataTable
                    rows={data.students}
                    rowKey={(row) => row.id}
                    columns={[
                      { key: 's', header: 'Student', render: (row) => <span className="font-semibold text-slate-900">{row.student.full_name}</span> },
                      { key: 'a', header: 'Attendance', render: (row) => fmtPct(row.attendance_percentage) },
                      { key: 'o', header: 'Overall', render: (row) => fmtScore(row.overall_score) },
                      { key: 'p', header: 'Participation', render: (row) => row.participation_display || '—' },
                      { key: 'i', header: 'Standing', render: (row) => <IndicatorBadge indicator={row.indicator} label={row.indicator_display} /> },
                    ]}
                  />
                </Card>
              </div>
            </>
          )}
        </QueryView>
      )}
    </div>
  );
};

const DatasetTab = () => {
  const [course, setCourse] = useState('');
  const dataset = usePerformanceDataset(course ? Number(course) : null);
  const exportCsv = useExportDataset();
  return (
    <Card className="overflow-hidden">
      <CardHeader
        icon={<Database className="h-4 w-4" />}
        title="ML training dataset"
        description="Feature rows the Linear Regression model trains on."
        action={
          <div className="flex flex-wrap gap-2">
            <StaffCourseSelect value={course} onChange={setCourse} className="w-52" />
            <Button variant="secondary" icon={<Download className="h-4 w-4" />} loading={exportCsv.isPending} onClick={() => exportCsv.mutate()}>
              Export CSV
            </Button>
          </div>
        }
      />
      <QueryView query={dataset} loading={<Skeleton className="m-5 h-48" />}>
        {(data) => (
          <>
            <div className="flex flex-wrap gap-2 px-5 py-3 text-[11px]">
              <span className="font-semibold text-slate-500">{data.count} rows · target:</span>
              <span className="rounded-full bg-sun-100 px-2 py-0.5 font-semibold text-amber-800">{data.target}</span>
              {data.features.map((feature) => (
                <span key={feature} className="rounded-full bg-brand-50 px-2 py-0.5 font-semibold text-brand-700">
                  {feature}
                </span>
              ))}
            </div>
            <DataTable
              rows={data.rows.slice(0, 50)}
              rowKey={(row) => JSON.stringify(row)}
              emptyTitle="No dataset rows yet"
              columns={Object.keys(data.rows[0] ?? {}).map((key) => ({ key, header: humanize(key), render: (row: Record<string, string | number | null>) => (row[key] === null ? '—' : String(row[key])) }))}
            />
            {data.rows.length > 50 && <p className="px-5 py-3 text-xs text-slate-500">Showing first 50 rows — export CSV for the full dataset.</p>}
          </>
        )}
      </QueryView>
    </Card>
  );
};

const StaffPerformancePage = () => {
  useDocumentTitle('Performance Tracking');
  const [tab, setTab] = useState<'records' | 'summary' | 'dataset'>('records');
  return (
    <>
      <PageHeader
        eyebrow="Intelligence"
        title="Performance Tracking"
        description="Consolidated academic indices per enrolment, course summaries and the ML dataset."
        actions={
          <Tabs
            tabs={[
              { value: 'records', label: 'Records' },
              { value: 'summary', label: 'Course summary' },
              { value: 'dataset', label: 'ML dataset' },
            ]}
            value={tab}
            onChange={setTab}
          />
        }
      />
      {tab === 'records' && <RecordsTab />}
      {tab === 'summary' && <SummaryTab />}
      {tab === 'dataset' && <DatasetTab />}
    </>
  );
};

export default StaffPerformancePage;
