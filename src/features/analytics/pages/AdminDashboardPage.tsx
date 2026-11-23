import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, BrainCircuit, CalendarCheck2, Cpu, GraduationCap, ShieldAlert, Sparkles, UserCheck, Users } from 'lucide-react';
import { Avatar, ButtonLink, Card, CardBody, CardHeader, DataTable, StatusBadge } from '@/components/ui';
import { IndicatorBadge } from '@/components/domain/IndicatorBadge';
import { fmtPct, fmtScore, Kpi } from '@/components/domain/Metric';
import { QueryView } from '@/components/domain/QueryView';
import { PATHS } from '@/app/router/paths';
import { useDocumentTitle } from '@/lib/hooks/useDocumentTitle';
import { formatDate, formatRelative, humanize } from '@/lib/utils/format';
import { AttentionList, IndicatorDonutCard, ScoreBandsCard } from '../components/AnalyticsWidgets';
import { useAdminDashboard } from '../hooks/useAnalytics';

const CountGrid = ({ title, data, icon }: { title: string; data: Record<string, number>; icon: ReactNode }) => (
  <Card>
    <CardHeader title={title} icon={icon} />
    <CardBody className="grid grid-cols-2 gap-3">
      {Object.entries(data).map(([key, value]) => (
        <div key={key} className="rounded-2xl bg-slate-50 p-3">
          <p className="text-[11px] text-slate-500">{humanize(key)}</p>
          <p className="font-display text-xl font-bold text-slate-900">{value}</p>
        </div>
      ))}
    </CardBody>
  </Card>
);

const AdminDashboardPage = () => {
  useDocumentTitle('Admin Dashboard');
  const dashboard = useAdminDashboard();
  return (
    <QueryView query={dashboard}>
      {(data) => (
        <div className="space-y-6">
          <section className="navy-panel relative overflow-hidden rounded-3xl p-6 text-white sm:p-8">
            <div className="pointer-events-none absolute -right-10 -top-20 h-60 w-60 rounded-full bg-sun-300/20 blur-3xl" />
            <div className="relative grid gap-6 lg:grid-cols-[1.5fr_1fr] lg:items-center">
              <div>
                <p className="flex items-center gap-1.5 text-xs font-semibold text-sun-300">
                  <Sparkles className="h-3.5 w-3.5" /> Institute Command Centre
                </p>
                <h2 className="mt-2 font-display text-2xl font-bold sm:text-3xl">Academic health at a glance</h2>
                <p className="mt-2 max-w-xl text-sm text-white/70">
                  {data.summary.total_students} students across {data.summary.total_courses} courses. {data.summary.enrolments_needing_attention} enrolments currently need attention.
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  <ButtonLink to={PATHS.admin.reports} variant="sun" size="sm">
                    Open reports
                  </ButtonLink>
                  <ButtonLink to={PATHS.admin.models} variant="outline" size="sm" className="border-white/30 bg-white/10 text-white hover:text-white">
                    Manage ML models
                  </ButtonLink>
                </div>
              </div>
              <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
                <p className="flex items-center gap-1.5 text-xs text-white/60">
                  <Cpu className="h-3.5 w-3.5" /> Active model
                </p>
                {data.active_model ? (
                  <>
                    <p className="mt-1 font-display text-lg font-semibold">{data.active_model.name}</p>
                    <p className="text-[11px] text-white/60">{data.active_model.algorithm}</p>
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <div className="rounded-xl bg-white/5 p-2">
                        <p className="text-[10px] text-white/50">R² score</p>
                        <p className="font-display text-lg font-bold text-lime-brand">{data.active_model.r2_score.toFixed(3)}</p>
                      </div>
                      <div className="rounded-xl bg-white/5 p-2">
                        <p className="text-[10px] text-white/50">RMSE</p>
                        <p className="font-display text-lg font-bold text-sun-300">{data.active_model.rmse.toFixed(2)}</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <p className="mt-2 text-sm text-white/70">No model trained yet — train one to enable predictions.</p>
                )}
              </div>
            </div>
          </section>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Kpi label="Active students" value={data.people.active_students} tone="navy" icon={<Users className="h-4 w-4" />} hint={`${data.people.inactive_students} inactive`} />
            <Kpi label="Active faculty" value={data.people.active_faculty} tone="lavender" icon={<UserCheck className="h-4 w-4" />} hint={`${data.people.pending_faculty_approvals} awaiting approval`} />
            <Kpi label="Avg attendance" value={fmtPct(data.summary.average_attendance)} tone="lime" icon={<CalendarCheck2 className="h-4 w-4" />} hint={`${data.summary.active_enrolments} active enrolments`} />
            <Kpi label="Avg predicted" value={fmtScore(data.summary.average_predicted_score)} tone="sun" icon={<BrainCircuit className="h-4 w-4" />} hint={`Performance ${fmtScore(data.summary.average_performance)}`} />
          </div>

          <div className="grid gap-6 xl:grid-cols-3">
            <IndicatorDonutCard title="Performance indicators" counts={data.performance_indicators} />
            <div className="xl:col-span-2">
              <ScoreBandsCard stats={data.predictions} />
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <CountGrid title="Courses" data={data.courses} icon={<GraduationCap className="h-4 w-4" />} />
            <CountGrid title="Enrolments" data={data.enrolments} icon={<BookOpen className="h-4 w-4" />} />
            <CountGrid title="Academic records" data={data.academic_records} icon={<CalendarCheck2 className="h-4 w-4" />} />
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.3fr_1fr]">
            <AttentionList rows={data.students_needing_attention} linkTo={PATHS.admin.reports} />
            <Card>
              <CardHeader icon={<ShieldAlert className="h-4 w-4" />} title="Pending faculty approvals" description={`${data.pending_faculty.length} accounts`} action={<Link to={`${PATHS.admin.faculty}?status=pending`} className="text-xs font-semibold text-brand-700">Review</Link>} />
              <CardBody className="space-y-2">
                {data.pending_faculty.length === 0 && <p className="py-6 text-center text-sm text-slate-400">No pending approvals.</p>}
                {data.pending_faculty.slice(0, 5).map((user) => (
                  <div key={user.id} className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3">
                    <Avatar name={user.full_name} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-slate-900">{user.full_name}</p>
                      <p className="truncate text-[11px] text-slate-500">{user.email}</p>
                    </div>
                    <span className="text-[11px] text-slate-400">{formatRelative(user.date_joined)}</span>
                  </div>
                ))}
              </CardBody>
            </Card>
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <Card>
              <CardHeader title="Latest predictions" action={<Link to={PATHS.admin.predictions} className="text-xs font-semibold text-brand-700">View all</Link>} />
              <DataTable
                rows={data.latest_predictions}
                rowKey={(row) => row.id}
                emptyTitle="No predictions yet"
                columns={[
                  { key: 's', header: 'Student', render: (row) => <div><p className="font-semibold text-slate-900">{row.student.full_name}</p><p className="text-[11px] text-slate-500">{row.course.title}</p></div> },
                  { key: 'p', header: 'Predicted', render: (row) => <span className="font-display font-bold text-brand-700">{fmtScore(row.predicted_final_score)}</span> },
                  { key: 'i', header: 'Standing', render: (row) => <IndicatorBadge indicator={row.indicator} label={row.indicator_display} /> },
                ]}
              />
            </Card>
            <Card>
              <CardHeader title="Recent enrolments" action={<Link to={PATHS.admin.enrolments} className="text-xs font-semibold text-brand-700">Manage</Link>} />
              <DataTable
                rows={data.recent_enrolments}
                rowKey={(row) => row.id}
                emptyTitle="No enrolments yet"
                columns={[
                  { key: 's', header: 'Student', render: (row) => <div><p className="font-semibold text-slate-900">{row.student.full_name}</p><p className="text-[11px] text-slate-500">{row.course.title}</p></div> },
                  { key: 'd', header: 'Enrolled', render: (row) => formatDate(row.enrolled_on) },
                  { key: 'st', header: 'Status', render: (row) => <StatusBadge status={row.status} label={row.status_display} /> },
                ]}
              />
            </Card>
          </div>
        </div>
      )}
    </QueryView>
  );
};

export default AdminDashboardPage;
