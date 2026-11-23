import { Link } from 'react-router-dom';
import { ArrowRight, Award, Bell, BookOpen, BrainCircuit, CalendarCheck2, CheckCircle2, FileText, Sparkles } from 'lucide-react';
import { ButtonLink, Card, CardBody, CardHeader, EmptyState, ProgressBar, Skeleton } from '@/components/ui';
import { ScoreGauge } from '@/components/charts/ScoreGauge';
import { IndicatorBadge } from '@/components/domain/IndicatorBadge';
import { fmtPct, fmtScore, Kpi } from '@/components/domain/Metric';
import { QueryView } from '@/components/domain/QueryView';
import { PATHS } from '@/app/router/paths';
import { useDocumentTitle } from '@/lib/hooks/useDocumentTitle';
import { formatRelative, humanize } from '@/lib/utils/format';
import { CourseCard } from '@/features/courses/components/CourseCard';
import { useMyCourses } from '@/features/enrolments/hooks/useEnrolments';
import { useNotifications } from '@/features/notifications/hooks/useNotifications';
import { useMyPerformance } from '@/features/performance/hooks/usePerformance';
import { useMyPredictions } from '@/features/predictions/hooks/usePredictions';
import { useStudentDashboard } from '../hooks/useStudents';

const StudentDashboardPage = () => {
  useDocumentTitle('Student Dashboard');
  const dashboard = useStudentDashboard();
  const courses = useMyCourses();
  const performance = useMyPerformance();
  const predictions = useMyPredictions();
  const notifications = useNotifications({ page: 1, page_size: 4 });

  const scored = (predictions.data?.courses ?? []).filter((item) => item.prediction);
  const best = scored.reduce<number | null>((sum, item) => (item.prediction ? (sum ?? 0) + item.prediction.predicted_final_score : sum), null);
  const avgPredicted = best !== null && scored.length ? best / scored.length : null;
  const headline = scored[0]?.prediction;

  return (
    <QueryView query={dashboard}>
      {(data) => (
        <div className="space-y-6">
          <section className="navy-panel relative overflow-hidden rounded-3xl p-6 text-white sm:p-8">
            <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-sun-300/20 blur-2xl" />
            <div className="relative grid items-center gap-6 lg:grid-cols-[1.4fr_1fr]">
              <div>
                <p className="flex items-center gap-1.5 text-xs font-semibold text-sun-300">
                  <Sparkles className="h-3.5 w-3.5" /> {data.profile.student_code}
                </p>
                <h2 className="mt-2 font-display text-2xl font-bold sm:text-3xl">Welcome back, {data.profile.user.first_name || data.profile.user.full_name}!</h2>
                <p className="mt-2 max-w-lg text-sm text-white/70">
                  Your academic intelligence hub — track attendance, submit assignments and watch your AI-predicted final score evolve.
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  <ButtonLink to={PATHS.student.prediction} variant="sun" size="sm" icon={<BrainCircuit className="h-4 w-4" />}>
                    View my prediction
                  </ButtonLink>
                  <ButtonLink to={PATHS.courses} variant="outline" size="sm" className="border-white/30 bg-white/10 text-white hover:text-white">
                    Explore courses
                  </ButtonLink>
                </div>
              </div>
              <div className="flex items-center justify-center gap-6 rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
                <ScoreGauge dark score={avgPredicted} label="Avg predicted score" size={170} />
                <div className="space-y-2 text-xs">
                  <p className="text-white/60">Standing</p>
                  {headline ? <IndicatorBadge indicator={headline.indicator} label={headline.indicator_display} /> : <span className="text-white/60">Awaiting data</span>}
                  <p className="pt-2 text-white/60">Model</p>
                  <p className="font-semibold">{headline?.model_version?.name ?? 'Linear Regression'}</p>
                </div>
              </div>
            </div>
          </section>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Kpi label="Enrolled courses" value={courses.data?.length ?? '—'} icon={<BookOpen className="h-4 w-4" />} tone="navy" hint={`${data.summary.available_courses} courses available`} />
            <Kpi label="Attendance" value={fmtPct(performance.data?.overall.attendance_percentage)} icon={<CalendarCheck2 className="h-4 w-4" />} tone="lime" hint="Across all active courses" />
            <Kpi label="Assignment avg" value={fmtScore(performance.data?.overall.assignment_average)} icon={<FileText className="h-4 w-4" />} tone="sun" hint="Graded submissions" />
            <Kpi label="Overall score" value={fmtScore(performance.data?.overall.overall_score)} icon={<Award className="h-4 w-4" />} hint={performance.data ? <IndicatorBadge indicator={performance.data.overall.indicator} label={performance.data.overall.indicator_display} /> : null} />
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
            <Card>
              <CardHeader title="My learning progress" description="Attendance and coursework per enrolled course" action={<ButtonLink to={PATHS.student.courses} variant="ghost" size="sm" iconRight={<ArrowRight className="h-3.5 w-3.5" />}>All courses</ButtonLink>} />
              <CardBody className="space-y-4">
                {courses.isPending && <Skeleton className="h-24 w-full" />}
                {courses.data?.length === 0 && (
                  <EmptyState title="You are not enrolled yet" description="Pick a course from the catalogue to get started." action={<ButtonLink to={PATHS.courses} size="sm">Browse courses</ButtonLink>} />
                )}
                {courses.data?.map((enrolment) => {
                  const att = enrolment.progress.attendance;
                  const asg = enrolment.progress.assignments;
                  return (
                    <div key={enrolment.id} className="rounded-2xl bg-slate-50 p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="font-semibold text-slate-900">{enrolment.course.title}</p>
                        <span className="rounded-full bg-white px-2.5 py-0.5 text-[11px] font-semibold text-slate-600 ring-1 ring-slate-200">{enrolment.status_display}</span>
                      </div>
                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        <div>
                          <div className="mb-1 flex justify-between text-[11px] text-slate-500">
                            <span>Attendance</span>
                            <span className="font-semibold text-slate-700">{fmtPct(att.attendance_percentage)}</span>
                          </div>
                          <ProgressBar value={att.attendance_percentage ?? 0} tone={(att.attendance_percentage ?? 0) >= 75 ? 'green' : 'amber'} />
                        </div>
                        <div>
                          <div className="mb-1 flex justify-between text-[11px] text-slate-500">
                            <span>Assignments submitted</span>
                            <span className="font-semibold text-slate-700">
                              {asg.submitted}/{asg.total_assignments}
                            </span>
                          </div>
                          <ProgressBar value={asg.total_assignments ? (asg.submitted / asg.total_assignments) * 100 : 0} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardBody>
            </Card>

            <div className="space-y-6">
              <Card>
                <CardHeader title="Profile completion" description={data.summary.email_verified ? 'Email verified' : 'Email not verified yet'} />
                <CardBody>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-display text-3xl font-bold text-brand-700">{data.summary.profile_completion}%</span>
                    <ButtonLink to={PATHS.student.profile} size="sm" variant="secondary">
                      Complete profile
                    </ButtonLink>
                  </div>
                  <ProgressBar className="mt-3" value={data.summary.profile_completion} />
                  {data.profile.missing_profile_fields.length > 0 ? (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {data.profile.missing_profile_fields.map((field) => (
                        <span key={field} className="rounded-full bg-sun-100 px-2.5 py-0.5 text-[11px] font-semibold text-amber-800">
                          {humanize(field)}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-4 flex items-center gap-1.5 text-xs text-lime-ink">
                      <CheckCircle2 className="h-4 w-4" /> All profile details completed
                    </p>
                  )}
                </CardBody>
              </Card>
              <Card>
                <CardHeader title="Latest notifications" icon={<Bell className="h-4 w-4" />} action={<Link to={PATHS.student.notifications} className="text-xs font-semibold text-brand-700">View all</Link>} />
                <CardBody className="space-y-3">
                  {notifications.data?.results.length === 0 && <p className="text-sm text-slate-400">You are all caught up.</p>}
                  {notifications.data?.results.map((item) => (
                    <Link key={item.id} to={PATHS.student.notifications} className="flex gap-3 rounded-xl p-2 hover:bg-slate-50">
                      <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${item.is_read ? 'bg-slate-300' : 'bg-brand-700'}`} />
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-semibold text-slate-800">{item.title}</span>
                        <span className="block text-[11px] text-slate-400">
                          {item.notification_type_display} · {formatRelative(item.created_at)}
                        </span>
                      </span>
                    </Link>
                  ))}
                </CardBody>
              </Card>
            </div>
          </div>

          {data.latest_courses.length > 0 && (
            <section>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-display text-lg font-semibold text-slate-900">
                  Recommended for <span className="highlight">you</span>
                </h2>
                <span className="text-xs text-slate-500">{data.summary.course_categories} disciplines</span>
              </div>
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {data.latest_courses.slice(0, 3).map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </QueryView>
  );
};

export default StudentDashboardPage;
