import { Download } from 'lucide-react';
import { Button, Card, CardHeader, DataTable, ErrorState, PageHeader, Skeleton, StatCard, type Column } from '@/components/ui';
import { DonutChart, SimpleBarChart } from '@/components/charts/Charts';
import { getErrorMessage } from '@/lib/api/apiError';
import { useDocumentTitle } from '@/lib/hooks/useDocumentTitle';
import { formatNumber, humanize } from '@/lib/utils/format';
import { useCurrentUser } from '@/features/auth/hooks/useAuth';
import type { CourseSummaryRow } from '@/features/dashboard/types';
import { describeStat, isPercentStat } from '@/features/dashboard/components/statLabels';
import { INDICATOR_COLORS } from '@/features/performance/constants';
import { MonitoredStudentsTable } from '@/features/performance/components/MonitoredStudentsTable';
import { useCoursePerformanceReport, useExportReport, usePredictionDistribution, useReportOverview, useStudentsNeedingAttention } from '../hooks/useReports';

const courseTitle = (row: CourseSummaryRow) => row.course?.title ?? row.course_title ?? row.title ?? 'Course';

const courseColumns: Column<CourseSummaryRow>[] = [
  { key: 'course', header: 'Course', render: (row) => <span className="font-semibold text-slate-900">{courseTitle(row)}</span> },
  { key: 'enrolments', header: 'Enrolments', render: (row) => row.active_enrolments ?? row.enrolments ?? '—' },
  { key: 'attendance', header: 'Avg attendance', render: (row) => (row.average_attendance === undefined ? '—' : `${formatNumber(row.average_attendance, 1)}%`) },
  { key: 'score', header: 'Avg score', render: (row) => formatNumber(row.average_score, 1) },
  { key: 'predicted', header: 'Avg predicted', render: (row) => formatNumber(row.average_predicted_score, 1) },
  { key: 'attention', header: 'Needs attention', render: (row) => row.needs_attention ?? '—' },
];

export const ReportsPage = () => {
  useDocumentTitle('Reports & analytics');
  const { isAdmin, hasPermission } = useCurrentUser();
  const canExport = isAdmin || hasPermission('EXPORT_REPORTS');
  const overview = useReportOverview();
  const coursePerformance = useCoursePerformanceReport();
  const attention = useStudentsNeedingAttention();
  const distribution = usePredictionDistribution();
  const exporter = useExportReport();

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Analytics" title="Reports & analytics" description="Course, student, attendance, performance and prediction summaries." />

      {overview.isError ? (
        <ErrorState message={getErrorMessage(overview.error)} onRetry={() => overview.refetch()} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {overview.isPending
            ? Array.from({ length: 4 }, (_, index) => <Skeleton key={index} className="h-28" />)
            : overview.data.slice(0, 8).map(([key, value]) => {
                const meta = describeStat(key);
                const Icon = meta.icon;
                return <StatCard key={key} label={meta.label} value={isPercentStat(key) ? `${formatNumber(value, 1)}%` : formatNumber(value, Number.isInteger(value) ? 0 : 1)} icon={<Icon className="h-5 w-5" />} tone={meta.tone} />;
              })}
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <Card>
          <CardHeader
            title="Course performance"
            action={
              canExport && (
                <Button size="sm" variant="outline" icon={<Download className="h-3.5 w-3.5" />} loading={exporter.isPending && exporter.variables === 'course-performance'} onClick={() => exporter.mutate('course-performance')}>
                  Export CSV
                </Button>
              )
            }
          />
          {coursePerformance.data && coursePerformance.data.length > 0 && (
            <div className="border-b border-slate-100 p-4">
              <SimpleBarChart
                data={coursePerformance.data.slice(0, 8).map((row) => ({ course: courseTitle(row).slice(0, 14), predicted: row.average_predicted_score ?? 0, score: row.average_score ?? 0 }))}
                xKey="course"
                series={[
                  { key: 'score', label: 'Avg score' },
                  { key: 'predicted', label: 'Avg predicted' },
                ]}
                domain={[0, 100]}
              />
            </div>
          )}
          <DataTable
            columns={courseColumns}
            rows={coursePerformance.data}
            rowKey={(row) => row.course?.id ?? courseTitle(row)}
            loading={coursePerformance.isPending}
            error={coursePerformance.isError ? getErrorMessage(coursePerformance.error) : null}
            onRetry={() => coursePerformance.refetch()}
          />
        </Card>
        <Card>
          <CardHeader title="Prediction distribution" />
          <div className="p-4">
            {distribution.isError ? (
              <ErrorState message={getErrorMessage(distribution.error)} />
            ) : distribution.data && distribution.data.length > 0 ? (
              <DonutChart data={distribution.data.map((item) => ({ name: item.indicator_display ?? humanize(item.indicator), value: item.count, color: INDICATOR_COLORS[item.indicator] }))} />
            ) : (
              <p className="py-16 text-center text-xs text-slate-400">{distribution.isPending ? 'Loading…' : 'No predictions yet.'}</p>
            )}
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader
          title="Students needing attention"
          description="Active enrolments flagged by performance or prediction"
          action={
            canExport && (
              <Button size="sm" variant="outline" icon={<Download className="h-3.5 w-3.5" />} loading={exporter.isPending && exporter.variables === 'students-needing-attention'} onClick={() => exporter.mutate('students-needing-attention')}>
                Export CSV
              </Button>
            )
          }
        />
        <MonitoredStudentsTable
          rows={attention.data}
          loading={attention.isPending}
          error={attention.isError ? getErrorMessage(attention.error) : null}
          onRetry={() => attention.refetch()}
          emptyTitle="No students need attention"
        />
      </Card>
    </div>
  );
};

export default ReportsPage;
