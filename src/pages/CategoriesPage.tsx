import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { ErrorState, Skeleton } from '@/components/ui';
import { CourseArt } from '@/components/domain/CourseArt';
import { PATHS } from '@/app/router/paths';
import { getErrorMessage } from '@/lib/api/apiError';
import { useDocumentTitle } from '@/lib/hooks/useDocumentTitle';
import { useCategories } from '@/features/courses/hooks/useCourses';

const CategoriesPage = () => {
  useDocumentTitle('Course Categories');
  const categories = useCategories();
  return (
    <section className="py-14 sm:py-20">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">Disciplines</span>
          <h1 className="mt-4 font-display text-4xl font-bold text-slate-900 sm:text-5xl">
            Browse by <span className="highlight">Category</span>
          </h1>
          <p className="mt-4 text-slate-600">
            Each discipline groups career-focused tracks designed with industry mentors.
          </p>
        </div>
        <div className="reveal-stagger mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.isError && (
            <ErrorState
              className="sm:col-span-2 lg:col-span-3"
              message={getErrorMessage(categories.error)}
              onRetry={() => void categories.refetch()}
            />
          )}
          {categories.isPending &&
            Array.from({ length: 6 }, (_, index) => (
              <Skeleton key={index} className="h-64 rounded-3xl" />
            ))}
          {categories.data
            ?.filter((category) => category.is_active)
            .map((category) => (
              <div key={category.id} data-reveal="">
                <Link
                  to={`${PATHS.courses}?category=${category.slug}`}
                  className="group block h-full overflow-hidden rounded-3xl bg-white shadow-card ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift"
                >
                  <div className="aspect-[16/8] overflow-hidden">
                    <div className="h-full transition-transform duration-500 group-hover:scale-105">
                      <CourseArt title={category.name} category={category.name} compact />
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-between">
                      <h2 className="font-display text-lg font-semibold text-slate-900">
                        {category.name}
                      </h2>
                      <span className="rounded-full bg-sun-100 px-2.5 py-0.5 text-[11px] font-bold text-amber-800">
                        {category.course_count} course{category.course_count === 1 ? '' : 's'}
                      </span>
                    </div>
                    <p className="mt-2 line-clamp-2 text-sm text-slate-500">
                      {category.description || 'Explore programs in this discipline.'}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-700">
                      Explore courses{' '}
                      <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesPage;
