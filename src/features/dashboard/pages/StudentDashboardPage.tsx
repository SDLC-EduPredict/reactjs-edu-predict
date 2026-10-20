import { Link } from 'react-router-dom';
import { ArrowRight, Award, BookOpen, CalendarCheck2, FileText } from 'lucide-react';
import { Card, CardBody, CardHeader, EmptyState, StatCard, StatusBadge } from '@/components/ui';
import { PATHS } from '@/app/router/paths';
import { useDocumentTitle } from '@/lib/hooks/useDocumentTitle';
import { formatDate, formatPercent, formatRelative } from '@/lib/utils/format';
import { useCurrentUser } from '@/features/auth/hooks/useAuth';
import { useMyEnrolments } from '@/features/enrolments/hooks/useEnrolments';
import { useMyAttendance } from '@/features/attendance/hooks/useAttendance';
import { useMyAssignments } from '@/features/assignments/hooks/useAssignments';
import { useMyResults } from '@/features/assessments/hooks/useAssessments';
import { useNotifications } from '@/features/notifications/hooks/useNotifications';
import { useOwnStudentProfile } from '@/features/students/hooks/useStudents';
import { useStudentPrediction } from '@/features/predictions/hooks/usePredictions';
import { PredictionCard } from '@/features/predictions/components/PredictionCard';

export const StudentDashboardPage = () => {
  useDocumentTitle('Student dashboard');
  const { user } = useCurrentUser();
  const profile = useOwnStudentProfile();
  const enrolments = useMyEnrolments();
  const attendance = useMyAttendance();
  const assignments = useMyAssignments();
  const results = useMyResults();
  const notifications = useNotifications({ page: 1, page_size: 5 });
  const prediction = useStudentPrediction(profile.data?.id);

  const pending = (assignments.data ?? []).filter((item) => !item.my_submission || item.my_submission.status === 'PENDING');
  const resultRows = results.data ?? [];
  const avgScore = resultRows.length
    ? resultRows.reduce((sum, row) => sum + (row.percentage ?? (row.marks_obtained / (row.assessment.total_marks || 1)) * 100), 0) / resultRows.length
    : null;

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-brand-600 via-violet-600 to-brand-700 p-6 text-white shadow-lift sm:p-8">
        <p className="text-xs font-bold uppercase tracking-wider text-brand-100">Student dashboard</p>
        <h1 className="mt-1 text-2xl font-extrabold sm:text-3xl">Welcome back, {user?.first_name}</h1>
        <p className="mt-1 text-sm text-brand-100">Here is how your learning is going across your enrolled courses.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Enrolled courses" value={enrolments.data?.length ?? '—'} icon={<BookOpen className="h-5 w-5" />} />
        <StatCard label="Attendance" value={formatPercent(attendance.data?.overall ?? null, 1)} icon={<CalendarCheck2 className="h-5 w-5" />} tone="green" />
        <StatCard label="Pending assignments" value={assignments.data ? pending.length : '—'} icon={<FileText className="h-5 w-5" />} tone="amber" />
        <StatCard label="Average test score" value={formatPercent(avgScore, 1)} icon={<Award className="h-5 w-5" />} tone="violet" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <PredictionCard prediction={prediction.data?.latest ?? null} />
        <Card>
          <CardHeader
            title="Recent notifications"
            action={
              <Link to={PATHS.student.notifications} className="text-xs font-semibold text-brand-700 hover:underline">
                View all
              </Link>
            }
          />
          {notifications.data && notifications.data.results.length > 0 ? (
            <ul className="divide-y divide-slate-100">
              {notifications.data.results.map((item) => (
                <li key={item.id} className="px-5 py-3">
                  <p className="text-sm font-semibold text-slate-800">{item.title}</p>
                  <p className="line-clamp-1 text-xs text-slate-500">{item.message}</p>
                  <p className="mt-0.5 text-[10px] text-slate-400">{formatRelative(item.created_at)}</p>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState title="No notifications yet" />
          )}
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader
            title="My courses"
            action={
              <Link to={PATHS.student.courses} className="inline-flex items-center gap-1 text-xs font-semibold text-brand-700 hover:underline">
                Manage <ArrowRight className="h-3 w-3" />
              </Link>
            }
          />
          {enrolments.data && enrolments.data.length > 0 ? (
            <ul className="divide-y divide-slate-100">
              {enrolments.data.slice(0, 5).map((item) => (
                <li key={item.id} className="flex items-center justify-between gap-3 px-5 py-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{item.course.title}</p>
                    <p className="text-[11px] text-slate-400">Since {formatDate(item.enrolled_at)}</p>
                  </div>
                  <StatusBadge status={item.status} label={item.status_display} />
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState title="No enrolments yet" description="Browse the course catalogue to get started." />
          )}
        </Card>
        <Card>
          <CardHeader
            title="Upcoming deadlines"
            action={
              <Link to={PATHS.student.assignments} className="inline-flex items-center gap-1 text-xs font-semibold text-brand-700 hover:underline">
                All assignments <ArrowRight className="h-3 w-3" />
              </Link>
            }
          />
          {pending.length > 0 ? (
            <ul className="divide-y divide-slate-100">
              {pending.slice(0, 5).map((item) => (
                <li key={item.id} className="flex items-center justify-between gap-3 px-5 py-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{item.title}</p>
                    <p className="text-[11px] text-slate-400">{item.course.title}</p>
                  </div>
                  <span className="text-xs font-semibold text-amber-700">{formatDate(item.due_date)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <CardBody>
              <p className="py-8 text-center text-xs text-slate-400">No pending assignments. Nice work!</p>
            </CardBody>
          )}
        </Card>
      </div>
    </div>
  );
};

export default StudentDashboardPage;
