import { Award } from 'lucide-react';
import { Card, CardHeader, DataTable, ErrorState, PageHeader, StatCard, Badge, type Column } from '@/components/ui';
import { SimpleBarChart } from '@/components/charts/Charts';
import { getErrorMessage } from '@/lib/api/apiError';
import { useDocumentTitle } from '@/lib/hooks/useDocumentTitle';
import { formatDate, formatNumber, formatPercent, humanize } from '@/lib/utils/format';
import { useMyResults } from '../hooks/useAssessments';
import type { AssessmentResult } from '../types';

const percentOf = (row: AssessmentResult) =>
  row.percentage ?? (row.assessment.total_marks ? (row.marks_obtained / row.assessment.total_marks) * 100 : 0);

const columns: Column<AssessmentResult>[] = [
  { key: 'title', header: 'Assessment', render: (row) => <span className="font-semibold text-slate-900">{row.assessment.title}</span> },
  { key: 'course', header: 'Course', render: (row) => row.assessment.course?.title ?? '—' },
  { key: 'type', header: 'Type', render: (row) => <Badge tone="violet">{row.assessment.assessment_type_display ?? humanize(row.assessment.assessment_type)}</Badge> },
  { key: 'date', header: 'Date', render: (row) => formatDate(row.assessment.scheduled_date) },
  { key: 'marks', header: 'Marks', render: (row) => `${formatNumber(row.marks_obtained, 1)} / ${row.assessment.total_marks}` },
  { key: 'percent', header: 'Score', render: (row) => <span className="font-bold text-slate-900">{formatPercent(percentOf(row), 1)}</span> },
  {
    key: 'result',
    header: 'Result',
    render: (row) =>
      row.is_passed === undefined ? '—' : <Badge tone={row.is_passed ? 'green' : 'rose'}>{row.is_passed ? 'Passed' : 'Not passed'}</Badge>,
  },
];

export const StudentResultsPage = () => {
  useDocumentTitle('Tests & results');
  const results = useMyResults();
  if (results.isError) return <ErrorState message={getErrorMessage(results.error)} onRetry={() => results.refetch()} />;
  const rows = results.data ?? [];
  const mock = rows.filter((row) => row.assessment.assessment_type === 'MOCK_TEST');
  const avg = (list: AssessmentResult[]) => (list.length ? list.reduce((sum, row) => sum + percentOf(row), 0) / list.length : null);

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Academics" title="Mock tests & results" description="Published marks for your quizzes, mock tests and exams." />
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Assessments taken" value={rows.length} icon={<Award className="h-5 w-5" />} />
        <StatCard label="Mock test average" value={formatPercent(avg(mock), 1)} tone="violet" />
        <StatCard label="Overall average" value={formatPercent(avg(rows), 1)} tone="green" />
      </div>
      {rows.length > 0 && (
        <Card>
          <CardHeader title="Score trend" description="Percentage scored in each assessment" />
          <div className="p-4">
            <SimpleBarChart
              data={rows.slice(-10).map((row) => ({ name: row.assessment.title.slice(0, 12), score: Number(percentOf(row).toFixed(1)) }))}
              xKey="name"
              series={[{ key: 'score', label: 'Score %' }]}
              domain={[0, 100]}
            />
          </div>
        </Card>
      )}
      <Card>
        <CardHeader title="All results" />
        <DataTable columns={columns} rows={rows} rowKey={(row) => row.id} loading={results.isPending} emptyTitle="No results published yet" />
      </Card>
    </div>
  );
};

export default StudentResultsPage;
