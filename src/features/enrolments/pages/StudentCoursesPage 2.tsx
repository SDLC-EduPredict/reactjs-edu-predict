import { Link } from 'react-router-dom';
import { BookOpen, CalendarDays, Compass } from 'lucide-react';
import { Avatar, ButtonLink, Card, CardBody, EmptyState, ErrorState, PageHeader, ProgressBar, Skeleton, StatusBadge } from '@/components/ui';
import { PATHS } from '@/app/router/paths';
import { getErrorMessage } from '@/lib/api/apiError';
import { useDocumentTitle } from '@/lib/hooks/useDocumentTitle';
import { formatDate } from '@/lib/utils/format';
import { useMyEnrolments } from '../hooks/useEnrolments';

export const StudentCoursesPage = () => {
  useDocumentTitle('My courses');
  const enrolments = useMyEnrolments();

  return (
    <div>
      <PageHeader
        eyebrow="Learning"
        title="My courses & enrolments"
        description="Every course you are enrolled in and its current status."
        actions={
          <ButtonLink to={PATHS.courses} variant="outline" icon={<Compass className="h-4 w-4" />}>
            Browse more courses
          </ButtonLink>
        }
      />
      {enrolments.isError ? (
        <ErrorState message={getErrorMessage(enrolments.error)} onRetry={() => enrolments.refetch()} />
      ) : enrolments.isPending ? (
        <div className="grid gap-5 md:grid-cols-2">
          {Array.from({ length: 2 }, (_, index) => (
            <Skeleton key={index} className="h-48" />
          ))}
        </div>
      ) : enrolments.data.length === 0 ? (
        <Card>
          <EmptyState
            icon={<BookOpen className="h-6 w-6" />}
            title="You haven't enrolled in a course yet"
            description="Browse the catalogue and enrol to start tracking your progress."
            action={<ButtonLink to={PATHS.courses}>Explore courses</ButtonLink>}
          />
        </Card>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {enrolments.data.map((enrolment) => {
            const progress =
              enrolment.progress_percentage ??
              (enrolment.modules_completed !== undefined && enrolment.course.total_modules
                ? (enrolment.modules_completed / enrolment.course.total_modules) * 100
                : undefined);
            return (
              <Card key={enrolment.id}>
                <CardBody className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      {enrolment.course.category && <p className="text-[11px] font-bold uppercase tracking-wider text-brand-600">{enrolment.course.category.name}</p>}
                      <h2 className="mt-0.5 text-base font-bold text-slate-900">
                        <Link to={PATHS.course(enrolment.course.slug)} className="hover:text-brand-700">
                          {enrolment.course.title}
                        </Link>
                      </h2>
                    </div>
                    <StatusBadge status={enrolment.status} label={enrolment.status_display} />
                  </div>
                  <p className="flex items-center gap-1.5 text-xs text-slate-500">
                    <CalendarDays className="h-3.5 w-3.5" /> Enrolled on {formatDate(enrolment.enrolled_at)}
                  </p>
                  {progress !== undefined && (
                    <div>
                      <div className="mb-1.5 flex justify-between text-xs">
                        <span className="font-semibold text-slate-600">Course progress</span>
                        <span className="font-bold text-slate-900">{Math.round(progress)}%</span>
                      </div>
                      <ProgressBar value={progress} />
                    </div>
                  )}
                  {enrolment.course.faculty && (
                    <div className="flex items-center gap-2 border-t border-slate-100 pt-3">
                      <Avatar name={enrolment.course.faculty.full_name} src={enrolment.course.faculty.photo} size="sm" />
                      <div>
                        <p className="text-xs font-semibold text-slate-800">{enrolment.course.faculty.full_name}</p>
                        <p className="text-[10px] text-slate-400">{enrolment.course.faculty.designation}</p>
                      </div>
                    </div>
                  )}
                </CardBody>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StudentCoursesPage;
