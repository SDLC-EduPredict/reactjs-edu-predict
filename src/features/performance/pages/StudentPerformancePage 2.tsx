import { TrendingUp } from 'lucide-react';
import { Card, CardBody, CardHeader, EmptyState, ErrorState, PageHeader, ProgressBar, Skeleton } from '@/components/ui';
import { FeatureRadar, SimpleBarChart } from '@/components/charts/Charts';
import { getErrorMessage } from '@/lib/api/apiError';
import { useDocumentTitle } from '@/lib/hooks/useDocumentTitle';
import { formatDate, formatNumber, humanize } from '@/lib/utils/format';
import { IndicatorBadge } from '../components/IndicatorBadge';
import { useMyPerformance } from '../hooks/usePerformance';
import type { PerformanceSnapshot } from '../types';

const METRICS: { key: keyof PerformanceSnapshot; label: string }[] = [
  { key: 'attendance_percentage', label: 'Attendance' },
  { key: 'assignment_average', label: 'Assignments' },
  { key: 'mock_test_average', label: 'Mock tests' },
  { key: 'previous_score', label: 'Previous score' },
  { key: 'modules_completed', label: 'Modules' },
];

const valueOf = (row: PerformanceSnapshot, key: keyof PerformanceSnapshot): number => {
  const value = row[key];
  return typeof value === 'number' ? value : 0;
};

export const StudentPerformancePage = () => {
  useDocumentTitle('Academic performance');
  const performance = useMyPerformance();

  if (performance.isError) return <ErrorState message={getErrorMessage(performance.error)} onRetry={() => performance.refetch()} />;

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Insights" title="Academic performance" description="Your attendance, assignment and assessment indicators combined per course." />
      {performance.isPending ? (
        <Skeleton className="h-80" />
      ) : performance.data.length === 0 ? (
        <Card>
          <EmptyState icon={<TrendingUp className="h-6 w-6" />} title="No performance data yet" description="Indicators appear once attendance and marks are recorded." />
        </Card>
      ) : (
        <>
          {performance.data.length > 1 && (
            <Card>
              <CardHeader title="Course comparison" />
              <div className="p-4">
                <SimpleBarChart
                  data={performance.data.map((row) => ({
                    course: (row.course?.title ?? 'Course').slice(0, 14),
                    attendance: valueOf(row, 'attendance_percentage'),
                    assignments: valueOf(row, 'assignment_average'),
                    tests: valueOf(row, 'mock_test_average'),
                  }))}
                  xKey="course"
                  series={[
                    { key: 'attendance', label: 'Attendance %' },
                    { key: 'assignments', label: 'Assignment avg' },
                    { key: 'tests', label: 'Mock test avg' },
                  ]}
                  domain={[0, 100]}
                />
              </div>
            </Card>
          )}
          {performance.data.map((row, index) => (
            <Card key={row.id ?? row.course?.id ?? index}>
              <CardHeader
                title={row.course?.title ?? 'Overall performance'}
                description={row.updated_at ? `Updated ${formatDate(row.updated_at, true)}` : undefined}
                action={<IndicatorBadge indicator={row.indicator} label={row.indicator_display} />}
              />
              <CardBody className="grid gap-6 lg:grid-cols-2">
                <div className="space-y-4">
                  {METRICS.map((metric) => (
                    <div key={metric.key}>
                      <div className="mb-1.5 flex justify-between text-xs">
                        <span className="font-semibold text-slate-600">{metric.label}</span>
                        <span className="font-bold text-slate-900">{formatNumber(valueOf(row, metric.key), 1)}</span>
                      </div>
                      <ProgressBar value={valueOf(row, metric.key)} />
                    </div>
                  ))}
                  <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                    <div className="rounded-xl bg-slate-50 px-3 py-2">
                      <p className="text-slate-500">Practice hours / week</p>
                      <p className="font-bold text-slate-900">{formatNumber(row.practice_hours_per_week, 0)} h</p>
                    </div>
                    <div className="rounded-xl bg-slate-50 px-3 py-2">
                      <p className="text-slate-500">Class participation</p>
                      <p className="font-bold text-slate-900">{humanize(row.class_participation) || '—'}</p>
                    </div>
                  </div>
                </div>
                <FeatureRadar data={METRICS.map((metric) => ({ feature: metric.label, value: valueOf(row, metric.key) }))} />
              </CardBody>
            </Card>
          ))}
        </>
      )}
    </div>
  );
};

export default StudentPerformancePage;
