import { useState } from 'react';
import { Award, CheckCircle2, ClipboardList } from 'lucide-react';
import { Card, CardHeader, DataTable, EmptyState, PageHeader, StatusBadge, Tabs } from '@/components/ui';
import { SimpleBarChart } from '@/components/charts/Charts';
import { fmtScore, Kpi } from '@/components/domain/Metric';
import { QueryView } from '@/components/domain/QueryView';
import { useDocumentTitle } from '@/lib/hooks/useDocumentTitle';
import { formatDate } from '@/lib/utils/format';
import { useMyResults } from '../hooks/useAssessments';
import type { StudentAssessmentItem } from '../types';

const resultLabel = (item: StudentAssessmentItem) => {
  if (!item.result) return null;
  return typeof item.result === 'string' ? item.result : item.result.result;
};
const marksOf = (item: StudentAssessmentItem) => item.marks_obtained ?? (typeof item.result === 'object' && item.result ? item.result.marks_obtained : null);
const pctOf = (item: StudentAssessmentItem) => item.percentage ?? (typeof item.result === 'object' && item.result ? item.result.percentage : null);

const StudentResultsPage = () => {
  useDocumentTitle('Tests & Results');
  const results = useMyResults();
  const [active, setActive] = useState('');

  return (
    <>
      <PageHeader eyebrow="Learning" title="Tests & Results" description="Mock tests and exams with marks, pass status and trends." />
      <QueryView query={results}>
        {(courses) => {
          if (courses.length === 0) return <EmptyState title="No results yet" description="Results appear after your first assessment is graded." />;
          const current = courses.find((item) => String(item.enrolment_id) === active) ?? courses[0];
          const s = current.summary;
          const chart = current.assessments.filter((item) => pctOf(item) !== null).map((item) => ({ name: item.title, score: pctOf(item) }));
          return (
            <div className="space-y-6">
              <Tabs tabs={courses.map((item) => ({ value: String(item.enrolment_id), label: item.course.title }))} value={String(current.enrolment_id)} onChange={setActive} />
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <Kpi label="Assessments" value={`${s.attempted}/${s.total_assessments}`} tone="navy" icon={<ClipboardList className="h-4 w-4" />} hint="Attempted" />
                <Kpi label="Passed" value={s.passed} tone="lime" icon={<CheckCircle2 className="h-4 w-4" />} />
                <Kpi label="Mock test avg" value={fmtScore(s.mock_test_average)} tone="sun" />
                <Kpi label="Exam avg" value={fmtScore(s.exam_average)} icon={<Award className="h-4 w-4" />} hint={`Overall ${fmtScore(s.assessment_average)}`} />
              </div>
              {chart.length > 0 && (
                <Card>
                  <CardHeader title="Score trend" description="Percentage per assessment" />
                  <div className="p-4">
                    <SimpleBarChart data={chart} xKey="name" series={[{ key: 'score', label: 'Score %' }]} domain={[0, 100]} />
                  </div>
                </Card>
              )}
              <Card>
                <CardHeader title="All assessments" description={current.course.title} />
                <DataTable
                  rows={current.assessments}
                  rowKey={(row) => row.id}
                  columns={[
                    {
                      key: 'title',
                      header: 'Assessment',
                      render: (row) => (
                        <div>
                          <p className="font-semibold text-slate-900">{row.title}</p>
                          <p className="text-[11px] text-slate-500">{row.assessment_type_display ?? row.assessment_type}</p>
                        </div>
                      ),
                    },
                    { key: 'date', header: 'Date', render: (row) => formatDate(row.assessment_date) },
                    { key: 'marks', header: 'Marks', render: (row) => (marksOf(row) === null ? '—' : `${marksOf(row)}/${row.max_marks ?? '—'}`) },
                    { key: 'pct', header: '%', render: (row) => fmtScore(pctOf(row)) },
                    { key: 'result', header: 'Result', render: (row) => (resultLabel(row) ? <StatusBadge status={resultLabel(row)} /> : <span className="text-slate-400">Pending</span>) },
                    { key: 'remarks', header: 'Remarks', render: (row) => row.remarks || '—' },
                  ]}
                />
              </Card>
            </div>
          );
        }}
      </QueryView>
    </>
  );
};

export default StudentResultsPage;
