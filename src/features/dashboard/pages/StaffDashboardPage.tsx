import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Card, CardHeader, DataTable, EmptyState, ErrorState, Skeleton, StatCard, StatusBadge, type Column } from '@/components/ui';
import { DonutChart, SimpleBarChart } from '@/components/charts/Charts';
import { PATHS } from '@/app/router/paths';
import { getErrorMessage } from '@/lib/api/apiError';
import { isRecord, numericEntries } from '@/lib/api/normalize';
import { useDocumentTitle } from '@/lib/hooks/useDocumentTitle';
import { formatDate, formatNumber, humanize } from '@/lib/utils/format';
import { useCurrentUser } from '@/features/auth/hooks/useAuth';
import type { Enrolment } from '@/features/enrolments/types';
import { INDICATOR_COLORS } from '@/features/performance/constants';
import { MonitoredStudentsTable } from '@/features/performance/components/MonitoredStudentsTable';
import { describeStat, isPercentStat } from '../components/statLabels';
import { useStaffDashboard } from '../hooks/useDashboard';
import type { CourseSummaryRow } from '../types';

const enrolmentColumns: Column<Enrolment>[] = [
  { key: 'student', header: 'Student', render: (row) => row.student?.full_name ?? '—' },
  { key: 'course', header: 'Course', render: (row) => row.course.title },
  { key: 'date', header: 'Date', render: (row) => formatDate(row.enrolled_at) },
  { key: 'status', header: 'Status', render: (row) => <StatusBadge status={row.status} label={row.status_display} /> },
];

const courseTitle = (row: CourseSummaryRow) => row.course?.title ?? row.course_title ?? row.title ?? 'Course';

export const StaffDashboardPage = () => {
  const { user, role } = useCurrentUser();
  const isFaculty = role === 'FACULTY';
  useDocumentTitle(isFaculty ? 'Faculty dashboard' : 'Admin dashboard');
  const dashboard = useStaffDashboard(isFaculty);

  if (dashboard.isError) return <ErrorState message={getErrorMessage(dashboard.error)} onRetry={() => dashboard.refetch()} />;

  const data = dashboard.data;
  const statsSource = data?.stats ?? data?.totals ?? (isRecord(data?.summary) ? data.summary : data);
  const stats = numericEntries(statsSource).slice(0, 8);
  const distribution = (data?.indicator_distribution ?? []).map((item) => ({
    name: item.indicator_display ?? humanize(item.indicator),
    value: item.count,
    color: INDICATOR_COLORS[item.indicator],
  }));
  const courses = data?.courses ?? data?.top_courses ?? [];

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-brand-600 via-violet-600 to-brand-700 p-6 text-white shadow-lift sm:p-8">
        <p className="text-xs font-bold uppercase tracking-wider text-brand-100">{isFaculty ? 'Faculty dashboard' : 'Administration dashboard'}</p>
        <h1 className="mt-1 text-2xl font-extrabold sm:text-3xl">Hello, {user?.first_name}</h1>
        <p className="mt-1 text-sm text-brand-100">
          {isFaculty ? 'An overview of your courses and students.' : 'Institute-wide overview of students, courses, enrolments and predictions.'}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {dashboard.isPending
          ? Array.from({ length: 4 }, (_, index) => <Skeleton key={index} className="h-28" />)
          : stats.map(([key, value]) => {
              const meta = describeStat(key);
              const Icon = meta.icon;
              return (
                <StatCard
                  key={key}
                  label={meta.label}
                  value={isPercentStat(key) ? `${formatNumber(value, 1)}%` : Number.isInteger(value) ? value.toLocaleString('en-IN') : formatNumber(value, 1)}
                  icon={<Icon className="h-5 w-5" />}
                  tone={meta.tone}
                />
              );
            })}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <Card>
          <CardHeader title="Course performance" description="Average attendance and predicted score per course" />
          <div className="p-4">
            {courses.length > 0 ? (
              <SimpleBarChart
                data={courses.slice(0, 8).map((row) => ({
                  course: courseTitle(row).slice(0, 14),
                  attendance: row.average_attendance ?? 0,
                  predicted: row.average_predicted_score ?? row.average_score ?? 0,
                }))}
                xKey="course"
                series={[
                  { key: 'attendance', label: 'Avg attendance %' },
                  { key: 'predicted', label: 'Avg predicted score' },
                ]}
                domain={[0, 100]}
              />
            ) : (
              <EmptyState title="No course data yet" />
            )}
          </div>
        </Card>
        <Card>
          <CardHeader title="Performance indicators" />
          <div className="p-4">{distribution.length > 0 ? <DonutChart data={distribution} /> : <EmptyState title="No predictions yet" />}</div>
        </Card>
      </div>

      <Card>
        <CardHeader
          title="Students needing attention"
          description="Attendance below 75% or averages / predicted score below 60"
          action={
            <Link to={PATHS.admin.performance} className="inline-flex items-center gap-1 text-xs font-semibold text-brand-700 hover:underline">
              Performance monitoring <ArrowRight className="h-3 w-3" />
            </Link>
          }
        />
        <MonitoredStudentsTable rows={data?.students_needing_attention ?? []} loading={dashboard.isPending} emptyTitle="Nobody needs attention right now" />
      </Card>

      {!isFaculty && (
        <Card>
          <CardHeader
            title="Recent enrolments"
            action={
              <Link to={PATHS.admin.enrolments} className="inline-flex items-center gap-1 text-xs font-semibold text-brand-700 hover:underline">
                Manage enrolments <ArrowRight className="h-3 w-3" />
              </Link>
            }
          />
          <DataTable columns={enrolmentColumns} rows={data?.recent_enrolments ?? []} rowKey={(row) => row.id} loading={dashboard.isPending} emptyTitle="No recent enrolments" />
        </Card>
      )}
    </div>
  );
};

export default StaffDashboardPage;
