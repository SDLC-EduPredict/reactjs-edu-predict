import { Link, useParams } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { ErrorState, Spinner } from '@/components/ui';
import { PATHS } from '@/app/router/paths';
import { getErrorMessage } from '@/lib/api/apiError';
import { useDocumentTitle } from '@/lib/hooks/useDocumentTitle';
import { CourseDetailBody } from '@/features/courses/components/CoursePreviewModal';
import { useCourse } from '@/features/courses/hooks/useCourses';

const CourseDetailPage = () => {
  const { slug } = useParams();
  const course = useCourse(slug);
  useDocumentTitle(course.data?.meta_title || course.data?.title || 'Course', course.data?.meta_description);

  return (
    <section className="bg-canvas py-10 sm:py-14">
      <div className="container-page max-w-4xl">
        <Link to={PATHS.courses} className="mb-5 inline-flex items-center gap-1 text-sm font-semibold text-brand-700 hover:underline">
          <ChevronLeft className="h-4 w-4" /> All courses
        </Link>
        <div className="overflow-hidden rounded-3xl bg-white shadow-card ring-1 ring-black/5">
          {course.isPending ? (
            <div className="p-16">
              <Spinner label="Loading course…" />
            </div>
          ) : course.isError ? (
            <ErrorState message={getErrorMessage(course.error)} onRetry={() => void course.refetch()} />
          ) : (
            <CourseDetailBody course={course.data} />
          )}
        </div>
      </div>
    </section>
  );
};

export default CourseDetailPage;
