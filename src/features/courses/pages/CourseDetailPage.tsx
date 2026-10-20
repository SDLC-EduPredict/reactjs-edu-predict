import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, BookOpen, CalendarDays, CheckCircle2, Clock, GraduationCap, IndianRupee, MonitorPlay } from 'lucide-react';
import { Avatar, Badge, Button, Card, CardBody, ErrorState, PageLoader, StatusBadge } from '@/components/ui';
import { PATHS } from '@/app/router/paths';
import { getErrorMessage } from '@/lib/api/apiError';
import { useDocumentTitle } from '@/lib/hooks/useDocumentTitle';
import { formatCurrency, formatDate, resolveMediaUrl } from '@/lib/utils/format';
import { useCurrentUser } from '@/features/auth/hooks/useAuth';
import { useEnrol, useMyEnrolments } from '@/features/enrolments/hooks/useEnrolments';
import { useCourse } from '../hooks/useCourses';

export const CourseDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const course = useCourse(slug);
  const { isAuthenticated, role } = useCurrentUser();
  const isStudent = role === 'STUDENT';
  const myEnrolments = useMyEnrolments(isAuthenticated && isStudent);
  const enrol = useEnrol();
  useDocumentTitle(course.data?.meta_title || course.data?.title || 'Course details', course.data?.meta_description);

  if (course.isPending) return <PageLoader />;
  if (course.isError) {
    return (
      <div className="container-page py-16">
        <ErrorState message={getErrorMessage(course.error)} onRetry={() => course.refetch()} />
      </div>
    );
  }

  const data = course.data;
  const existing = myEnrolments.data?.find((item) => item.course.id === data.id);
  const thumbnail = resolveMediaUrl(data.thumbnail);

  const onEnrol = () => {
    if (!isAuthenticated) {
      navigate(`${PATHS.login}?next=${encodeURIComponent(PATHS.course(data.slug))}`);
      return;
    }
    enrol.mutate({ course: data.id });
  };

  const facts = [
    { icon: Clock, label: 'Duration', value: `${data.duration_weeks} weeks` },
    { icon: BookOpen, label: 'Modules', value: `${data.total_modules} modules` },
    { icon: MonitorPlay, label: 'Mode', value: data.mode_display },
    { icon: GraduationCap, label: 'Level', value: data.level_display },
    { icon: CalendarDays, label: 'Starts on', value: formatDate(data.start_date) },
    { icon: IndianRupee, label: 'Course fee', value: formatCurrency(data.fee) },
  ];

  return (
    <div className="pb-20">
      <section className="border-b border-slate-200/60 bg-gradient-to-b from-brand-50/70 to-page py-10">
        <div className="container-page">
          <Link to={PATHS.courses} className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-700 hover:underline">
            <ArrowLeft className="h-3.5 w-3.5" /> All courses
          </Link>
          <div className="mt-4 grid gap-8 lg:grid-cols-[1fr_380px]">
            <div>
              <div className="flex flex-wrap gap-2">
                <Badge tone="brand">{data.category.name}</Badge>
                <StatusBadge status={data.status} label={data.status_display} />
              </div>
              <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">{data.title}</h1>
              <p className="mt-3 max-w-2xl text-base text-slate-600">{data.short_description}</p>
              {data.faculty && (
                <Link to={PATHS.facultyMember(data.faculty.id)} className="mt-6 inline-flex items-center gap-3 rounded-2xl bg-white p-3 pr-5 shadow-card ring-1 ring-slate-200/80 hover:ring-brand-200">
                  <Avatar name={data.faculty.full_name} src={data.faculty.photo} />
                  <span>
                    <span className="block text-sm font-bold text-slate-900">{data.faculty.full_name}</span>
                    <span className="block text-xs text-slate-500">{data.faculty.designation}</span>
                  </span>
                </Link>
              )}
            </div>
            <Card className="overflow-hidden">
              {thumbnail && <img src={thumbnail} alt={data.title} className="aspect-video w-full object-cover" />}
              <CardBody className="space-y-4">
                <p className="text-3xl font-extrabold text-slate-900">{formatCurrency(data.fee)}</p>
                {existing ? (
                  <div className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800">
                    <p className="flex items-center gap-2 font-semibold">
                      <CheckCircle2 className="h-4 w-4" /> You are enrolled
                    </p>
                    <p className="mt-0.5 text-xs">Status: {existing.status_display ?? existing.status}</p>
                  </div>
                ) : (
                  <Button size="lg" fullWidth onClick={onEnrol} loading={enrol.isPending} disabled={isAuthenticated && !isStudent}>
                    {isAuthenticated ? (isStudent ? 'Enrol in this course' : 'Only students can enrol') : 'Log in to enrol'}
                  </Button>
                )}
                {enrol.isSuccess && <p className="text-xs text-emerald-700">{enrol.data.message}</p>}
                <ul className="space-y-2 text-sm text-slate-600">
                  {facts.map((fact) => (
                    <li key={fact.label} className="flex items-center justify-between gap-3 border-b border-slate-100 pb-2 last:border-0">
                      <span className="flex items-center gap-2 text-slate-500">
                        <fact.icon className="h-4 w-4 text-brand-500" /> {fact.label}
                      </span>
                      <span className="font-semibold text-slate-800">{fact.value}</span>
                    </li>
                  ))}
                </ul>
              </CardBody>
            </Card>
          </div>
        </div>
      </section>
      <div className="container-page mt-10 grid gap-8 lg:grid-cols-[1fr_380px]">
        <Card>
          <CardBody>
            <h2 className="text-lg font-bold text-slate-900">About this course</h2>
            <div className="mt-3 whitespace-pre-line text-sm leading-relaxed text-slate-600">{data.description}</div>
          </CardBody>
        </Card>
        {data.faculty && (
          <Card>
            <CardBody>
              <h2 className="text-sm font-bold text-slate-900">Your trainer</h2>
              <div className="mt-4 flex items-center gap-3">
                <Avatar name={data.faculty.full_name} src={data.faculty.photo} size="lg" />
                <div>
                  <p className="font-bold text-slate-900">{data.faculty.full_name}</p>
                  <p className="text-xs text-slate-500">{data.faculty.designation}</p>
                </div>
              </div>
              <p className="mt-3 text-xs font-semibold text-brand-700">{data.faculty.expertise}</p>
              <p className="mt-2 text-sm text-slate-600">{data.faculty.bio}</p>
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CourseDetailPage;
