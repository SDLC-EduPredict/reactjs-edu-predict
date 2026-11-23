import { Download } from 'lucide-react';
import { Button, Card, CardHeader, DataTable, PageHeader, Pagination } from '@/components/ui';
import { IndicatorBadge } from '@/components/domain/IndicatorBadge';
import { fmtPct, fmtScore, Kpi } from '@/components/domain/Metric';
import { QueryView } from '@/components/domain/QueryView';
import { useDocumentTitle } from '@/lib/hooks/useDocumentTitle';
import { useListFilter } from '@/lib/hooks/useListFilter';
import { SearchInput } from '@/components/ui';
import { CoursePerformanceChart, IndicatorDonutCard, ScoreBandsCard } from '@/features/analytics/components/AnalyticsWidgets';
import { useCoursePerformanceReport, useExportReport, usePredictionDistribution, useReportOverview, useStudentsNeedingAttention } from '@/features/analytics/hooks/useAnalytics';

const AdminReportsPage = () => {
  useDocumentTitle('Reports & Analytics');
  const overview = useReportOverview();
  const courses = useCoursePerformanceReport();
  const distribution = usePredictionDistribution();
  const list = useListFilter('report-attention');
  const attention = useStudentsNeedingAttention(list.params);
  const exportReport = useExportReport();

  return (
    <>
      <PageHeader eyebrow="Intelligence" title="Reports & Analytics" description="Institute-wide academic analytics with CSV exports." />
      <div className="space-y-6">
        <QueryView query={overview}>
          {(data) => (
            <>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <Kpi label="Students" value={data.overview.total_students} tone="navy" hint={`${data.overview.active_enrolments} active enrolments`} />
                <Kpi label="Avg attendance" value={fmtPct(data.overview.average_attendance)} tone="lime" />
                <Kpi label="Avg assessment" value={fmtScore(data.overview.average_assessment_score)} tone="sun" hint={`Assignments ${fmtScore(data.overview.average_assignment_score)}`} />
                <Kpi label="Need attention" value={data.overview.students_needing_attention} tone="rose" hint={`${data.overview.enrolments_needing_attention} enrolments`} />
              </div>
              <div className="grid gap-6 xl:grid-cols-3">
                <IndicatorDonutCard title="Performance indicators" counts={data.performance_indicators} />
                <IndicatorDonutCard title="Prediction indicators" counts={data.predictions.indicators} description={`${data.predictions.total_predictions} predictions`} />
                <Card>
                  <CardHeader title="Enrolment status" />
                  <div className="grid grid-cols-2 gap-3 p-5">
                    {Object.entries(data.enrolments).map(([key, value]) => (
                      <div key={key} className="rounded-2xl bg-slate-50 p-3">
                        <p className="text-[11px] capitalize text-slate-500">{key.replace(/_/g, ' ')}</p>
                        <p className="font-display text-xl font-bold">{value}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </>
          )}
        </QueryView>

        <QueryView query={distribution}>{(data) => <ScoreBandsCard stats={data} />}</QueryView>

        <QueryView query={courses}>
          {(data) => (
            <>
              <CoursePerformanceChart courses={data.courses} />
              <Card>
                <CardHeader
                  title="Course performance report"
                  description={`${data.count} courses`}
                  action={
                    <Button size="sm" variant="secondary" icon={<Download className="h-3.5 w-3.5" />} loading={exportReport.isPending && exportReport.variables === 'course-performance'} onClick={() => exportReport.mutate('course-performance')}>
                      Export CSV
                    </Button>
                  }
                />
                <DataTable
                  rows={data.courses}
                  rowKey={(row) => row.id}
                  columns={[
                    { key: 't', header: 'Course', render: (row) => <div><p className="font-semibold text-slate-900">{row.title}</p><p className="text-[11px] text-slate-500">{row.category} · {row.faculty || 'Unassigned'}</p></div> },
                    { key: 's', header: 'Students', render: (row) => row.students },
                    { key: 'a', header: 'Attendance', render: (row) => fmtPct(row.average_attendance) },
                    { key: 'as', header: 'Assign.', render: (row) => fmtScore(row.average_assignment_score) },
                    { key: 'ex', header: 'Assess.', render: (row) => fmtScore(row.average_assessment_score) },
                    { key: 'p', header: 'Predicted', render: (row) => fmtScore(row.average_predicted_score) },
                    { key: 'l', header: 'Low att.', render: (row) => row.low_attendance_students },
                    { key: 'n', header: 'At risk', render: (row) => <span className="font-semibold text-rose-600">{row.needs_attention}</span> },
                  ]}
                />
              </Card>
            </>
          )}
        </QueryView>

        <Card className="overflow-hidden">
          <CardHeader
            title="Students needing attention"
            description="Low attendance, missing coursework or a low predicted score"
            action={
              <div className="flex gap-2">
                <SearchInput value={list.search} onChange={list.setSearch} placeholder="Search…" className="w-48" />
                <Button size="sm" variant="secondary" icon={<Download className="h-3.5 w-3.5" />} loading={exportReport.isPending && exportReport.variables === 'students-needing-attention'} onClick={() => exportReport.mutate('students-needing-attention')}>
                  Export CSV
                </Button>
              </div>
            }
          />
          <DataTable
            rows={attention.data?.results}
            loading={attention.isPending}
            rowKey={(row) => row.id}
            emptyTitle="No students need attention"
            columns={[
              { key: 's', header: 'Student', render: (row) => <div><p className="font-semibold text-slate-900">{row.student_name}</p><p className="text-[11px] text-slate-500">{row.student_code} · {row.email}</p></div> },
              { key: 'c', header: 'Course', render: (row) => <div><p>{row.course}</p><p className="text-[11px] text-slate-500">{row.faculty}</p></div> },
              { key: 'a', header: 'Attendance', render: (row) => fmtPct(row.attendance_percentage) },
              { key: 'o', header: 'Overall', render: (row) => fmtScore(row.overall_score) },
              { key: 'p', header: 'Predicted', render: (row) => <span className="font-display font-bold text-brand-700">{fmtScore(row.predicted_final_score)}</span> },
              { key: 'i', header: 'Standing', render: (row) => <IndicatorBadge indicator={row.prediction_indicator ?? row.indicator} /> },
              { key: 'r', header: 'Reasons', render: (row) => <span className="text-[11px] text-slate-500">{row.reasons.join(', ')}</span> },
            ]}
          />
          <Pagination page={list.page} pageSize={list.pageSize} count={attention.data?.count ?? 0} onPageChange={list.setPage} />
        </Card>
      </div>
    </>
  );
};

export default AdminReportsPage;
