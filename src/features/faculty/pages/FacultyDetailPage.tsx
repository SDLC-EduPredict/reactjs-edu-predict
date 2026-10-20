import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Avatar, Card, CardBody, EmptyState, ErrorState, PageLoader } from '@/components/ui';
import { PATHS } from '@/app/router/paths';
import { getErrorMessage } from '@/lib/api/apiError';
import { useDocumentTitle } from '@/lib/hooks/useDocumentTitle';
import { CourseCard } from '@/features/courses/components/CourseCard';
import { usePublicFacultyMember } from '../hooks/useFaculty';

export const FacultyDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const query = usePublicFacultyMember(id);
  useDocumentTitle(query.data?.faculty.full_name ?? 'Faculty');

  if (query.isPending) return <PageLoader />;
  if (query.isError) {
    return (
      <div className="container-page py-16">
        <ErrorState message={getErrorMessage(query.error)} onRetry={() => query.refetch()} />
      </div>
    );
  }
  const { faculty, courses } = query.data;

  return (
    <div className="pb-20">
      <section className="border-b border-slate-200/60 bg-gradient-to-b from-brand-50/70 to-page py-10">
        <div className="container-page">
          <Link to={PATHS.faculty} className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-700 hover:underline">
            <ArrowLeft className="h-3.5 w-3.5" /> All faculty
          </Link>
          <Card className="mt-5">
            <CardBody className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
              <Avatar name={faculty.full_name} src={faculty.photo} size="xl" className="h-24 w-24 rounded-2xl" />
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900">{faculty.full_name}</h1>
                <p className="text-sm font-semibold text-brand-600">{faculty.designation}</p>
                <p className="mt-1 text-xs font-medium text-slate-500">{faculty.expertise}</p>
                <p className="mt-3 max-w-3xl text-sm text-slate-600">{faculty.bio}</p>
              </div>
            </CardBody>
          </Card>
        </div>
      </section>
      <div className="container-page mt-10">
        <h2 className="mb-5 text-lg font-bold text-slate-900">Courses by {faculty.full_name}</h2>
        {courses.length === 0 ? (
          <EmptyState title="No courses assigned yet" />
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FacultyDetailPage;
