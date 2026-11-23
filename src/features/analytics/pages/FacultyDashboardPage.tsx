import { Link } from 'react-router-dom';
import { Bell, BookOpen, CalendarCheck2, ClipboardCheck, FileClock, GraduationCap, Sparkles, Users } from 'lucide-react';
import { ButtonLink, Card, CardHeader, DataTable } from '@/components/ui';
import { IndicatorBadge } from '@/components/domain/IndicatorBadge';
import { fmtPct, fmtScore, Kpi } from '@/components/domain/Metric';
import { QueryView } from '@/components/domain/QueryView';
import { PATHS } from '@/app/router/paths';
import { useDocumentTitle } from '@/lib/hooks/useDocumentTitle';
import { useCurrentUser } from '@/features/auth/hooks/useAuth';
import { AttentionList, CoursePerformanceChart, IndicatorDonutCard, ScoreBandsCard, WorkList } from '../components/AnalyticsWidgets';
import { useFacultyDashboard } from '../hooks/useAnalytics';

const FacultyDashboardPage = () => {
  useDocumentTitle('Faculty Dashboard');
  const { user } = useCurrentUser();
  const dashboard = useFacultyDashboard();

  return (
    <QueryView query={dashboard}>
      {(data) => (
        <div className="space-y-6">
          <section className="navy-panel relative overflow-hidden rounded-3xl p-6 text-white sm:p-8">
            <div className="pointer-events-none absolute -right-10 -top-20 h-60 w-60 rounded-full bg-lime-brand/20 blur-3xl" />
            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="flex items-center gap-1.5 text-xs font-semibold text-sun-300">
                  <Sparkles className="h-3.5 w-3.5" /> Faculty Workspace
                </p>
                <h2 className="mt-2 font-display text-2xl font-bold sm:text-3xl">Good to see you, {user?.first_name ?? 'Professor'}!</h2>
                <p className="mt-2 max-w-xl text-sm text-white/70">
                  {data.work.submissions_to_grade} submissions waiting for grades, {data.work.upcoming_assessments} upcoming assessments and{' '}
                  {data.summary.students_needing_attention} learners flagged by the ML engine.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <ButtonLink to={PATHS.faculty_portal.attendance} variant="sun" icon={<CalendarCheck2 className="h-4 w-4" />}>
                  Mark attendance
                </ButtonLink>
                <ButtonLink to={PATHS.faculty_portal.assignments} variant="outline" className="border-white/30 bg-white/10 text-white hover:text-white">
                  Grade submissions
                </ButtonLink>
              </div>
            </div>
            <div className="relative mt-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
              {[
                { label: 'To grade', value: data.work.submissions_to_grade, icon: ClipboardCheck },
                { label: 'Due soon', value: data.work.assignments_due_soon, icon: FileClock },
                { label: 'Assessments', value: data.work.upcoming_assessments, icon: GraduationCap },
                { label: 'Marked today', value: data.work.attendance_marked_today, icon: CalendarCheck2 },
                { label: 'Unread', value: data.work.unread_notifications, icon: Bell },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl bg-white/5 p-3 ring-1 ring-white/10">
                  <item.icon className="h-4 w-4 text-lime-brand" />
                  <p className="mt-2 font-display text-2xl font-bold">{item.value}</p>
                  <p className="text-[11px] text-white/60">{item.label}</p>
                </div>
              ))}
            </div>
          </section>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Kpi label="My students" value={data.summary.total_students} tone="navy" icon={<Users className="h-4 w-4" />} hint={`${data.summary.active_enrolments} active enrolments`} />
            <Kpi label="My batches" value={data.summary.total_courses} tone="lavender" icon={<BookOpen className="h-4 w-4" />} />
            <Kpi label="Avg attendance" value={fmtPct(data.summary.average_attendance)} tone="lime" icon={<CalendarCheck2 className="h-4 w-4" />} />
            <Kpi label="Avg predicted" value={fmtScore(data.summary.average_predicted_score)} tone="sun" icon={<Sparkles className="h-4 w-4" />} hint={`Performance ${fmtScore(data.summary.average_performance)}`} />
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
            <CoursePerformanceChart courses={data.courses} />
            <IndicatorDonutCard title="Performance indicators" counts={data.performance_indicators} />
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <AttentionList rows={data.students_needing_attention} linkTo={PATHS.faculty_portal.students} />
            <ScoreBandsCard stats={data.predictions} />
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <WorkList title="Submissions to grade" rows={data.submissions_to_grade} dateKeys={['submitted_at']} emptyText="No pending submissions." />
            <WorkList title="Assignments due soon" rows={data.assignments_due_soon} dateKeys={['due_date']} emptyText="Nothing due this week." />
            <WorkList title="Upcoming assessments" rows={data.upcoming_assessments} dateKeys={['assessment_date']} emptyText="No upcoming assessments." />
          </div>

          <Card>
            <CardHeader title="My batches at a glance" action={<Link to={PATHS.faculty_portal.batches} className="text-xs font-semibold text-brand-700">Open batches</Link>} />
            <DataTable
              rows={data.courses}
              rowKey={(row) => row.id}
              emptyTitle="No courses assigned yet"
              columns={[
                { key: 'title', header: 'Course', render: (row) => <span className="font-semibold text-slate-900">{row.title}</span> },
                { key: 'students', header: 'Students', render: (row) => row.students },
                { key: 'att', header: 'Attendance', render: (row) => fmtPct(row.average_attendance) },
                { key: 'perf', header: 'Performance', render: (row) => fmtScore(row.average_performance) },
                { key: 'pred', header: 'Predicted', render: (row) => fmtScore(row.average_predicted_score) },
                {
                  key: 'ind',
                  header: 'Standing',
                  render: (row) => (
                    <span className="flex flex-wrap gap-1">
                      <IndicatorBadge indicator="GOOD" label={`${row.good}`} />
                      <IndicatorBadge indicator="AVERAGE" label={`${row.average}`} />
                      <IndicatorBadge indicator="NEEDS_ATTENTION" label={`${row.needs_attention}`} />
                    </span>
                  ),
                },
              ]}
            />
          </Card>
        </div>
      )}
    </QueryView>
  );
};

export default FacultyDashboardPage;
