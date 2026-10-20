import { Link } from 'react-router-dom';
import { ArrowRight, FolderTree } from 'lucide-react';
import { EmptyState, ErrorState, Skeleton } from '@/components/ui';
import { PATHS } from '@/app/router/paths';
import { getErrorMessage } from '@/lib/api/apiError';
import { useDocumentTitle } from '@/lib/hooks/useDocumentTitle';
import { useCategories } from '../hooks/useCourses';

export const CategoriesPage = () => {
  useDocumentTitle('Course Categories');
  const categories = useCategories();
  const active = categories.data?.filter((category) => category.is_active) ?? [];

  return (
    <div className="pb-20">
      <section className="border-b border-slate-200/60 bg-gradient-to-b from-brand-50/70 to-page py-12">
        <div className="container-page">
          <p className="text-xs font-bold uppercase tracking-wider text-brand-600">Learning tracks</p>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">Course categories</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600">Explore our programs grouped by discipline.</p>
        </div>
      </section>
      <div className="container-page mt-10">
        {categories.isError ? (
          <ErrorState message={getErrorMessage(categories.error)} onRetry={() => categories.refetch()} />
        ) : categories.isPending ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }, (_, index) => (
              <Skeleton key={index} className="h-40" />
            ))}
          </div>
        ) : active.length === 0 ? (
          <EmptyState title="No categories yet" />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {active.map((category) => (
              <Link
                key={category.id}
                to={`${PATHS.courses}?category=${category.slug}`}
                className="group flex flex-col rounded-2xl border border-slate-200/80 bg-white p-6 shadow-card transition-all hover:-translate-y-1 hover:border-brand-200 hover:shadow-lift"
              >
                <div className="flex items-center justify-between">
                  <span className="rounded-xl bg-gradient-to-br from-brand-50 to-violet-50 p-2.5 text-brand-600 ring-1 ring-brand-100">
                    <FolderTree className="h-5 w-5" />
                  </span>
                  <span className="text-xs font-semibold text-slate-400">
                    {category.course_count} course{category.course_count === 1 ? '' : 's'}
                  </span>
                </div>
                <h2 className="mt-4 text-base font-bold text-slate-900 group-hover:text-brand-700">{category.name}</h2>
                <p className="mt-1 line-clamp-3 flex-1 text-sm text-slate-500">{category.description}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-brand-600">
                  View courses <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoriesPage;
