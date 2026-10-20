import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { RotateCcw, SlidersHorizontal } from 'lucide-react';
import { Button, EmptyState, ErrorState, Pagination, SearchInput, Select } from '@/components/ui';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { env } from '@/config/env';
import { getErrorMessage } from '@/lib/api/apiError';
import { useDebouncedValue } from '@/lib/hooks/useDebouncedValue';
import { useDocumentTitle } from '@/lib/hooks/useDocumentTitle';
import { CourseCard, CourseCardSkeleton } from '../components/CourseCard';
import { useCategories, useCourses } from '../hooks/useCourses';
import {
  catalogCategoryChanged,
  catalogFiltersReset,
  catalogLevelChanged,
  catalogModeChanged,
  catalogPageChanged,
  catalogSearchChanged,
  selectCatalogFilters,
} from '../store/catalogSlice';
import { COURSE_LEVELS, COURSE_MODES, type CourseLevel, type CourseMode } from '../types';

export const CourseListingPage = () => {
  useDocumentTitle('All Courses', 'Browse Python, Django, Full Stack, Data Science and Machine Learning courses.');
  const dispatch = useAppDispatch();
  const filters = useAppSelector(selectCatalogFilters);
  const [searchParams, setSearchParams] = useSearchParams();
  const search = useDebouncedValue(filters.search);
  const categories = useCategories();

  useEffect(() => {
    const urlSearch = searchParams.get('search');
    const urlCategory = searchParams.get('category');
    if (urlSearch !== null) dispatch(catalogSearchChanged(urlSearch));
    if (urlCategory !== null) dispatch(catalogCategoryChanged(urlCategory));
    if (urlSearch !== null || urlCategory !== null) setSearchParams({}, { replace: true });
  }, [searchParams, setSearchParams, dispatch]);

  const courses = useCourses({
    search,
    category: filters.category,
    level: filters.level,
    mode: filters.mode,
    page: filters.page,
    page_size: 9,
  });

  return (
    <div className="pb-20">
      <section className="border-b border-slate-200/60 bg-gradient-to-b from-brand-50/70 to-page py-12">
        <div className="container-page">
          <p className="text-xs font-bold uppercase tracking-wider text-brand-600">Course catalogue</p>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">Find the right program for your career</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600">
            Search and filter every course offered by {env.instituteName}. All data is loaded live from the academic server.
          </p>
        </div>
      </section>

      <div className="container-page mt-8">
        <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-card lg:flex-row lg:items-center">
          <SearchInput value={filters.search} onChange={(value) => dispatch(catalogSearchChanged(value))} placeholder="Search courses…" className="lg:w-80" />
          <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-3">
            <Select
              aria-label="Category"
              value={filters.category}
              onChange={(event) => dispatch(catalogCategoryChanged(event.target.value))}
              placeholder="All categories"
              options={(categories.data ?? []).filter((item) => item.is_active).map((item) => ({ value: item.slug, label: item.name }))}
            />
            <Select
              aria-label="Level"
              value={filters.level}
              onChange={(event) => dispatch(catalogLevelChanged(event.target.value as CourseLevel | ''))}
              placeholder="All levels"
              options={COURSE_LEVELS}
            />
            <Select
              aria-label="Mode"
              value={filters.mode}
              onChange={(event) => dispatch(catalogModeChanged(event.target.value as CourseMode | ''))}
              placeholder="All modes"
              options={COURSE_MODES}
            />
          </div>
          <Button variant="ghost" icon={<RotateCcw className="h-4 w-4" />} onClick={() => dispatch(catalogFiltersReset())}>
            Reset
          </Button>
        </div>

        <div className="mb-4 flex items-center gap-2 text-xs text-slate-500">
          <SlidersHorizontal className="h-4 w-4" />
          {courses.data ? `${courses.data.count} course${courses.data.count === 1 ? '' : 's'} found` : 'Loading courses…'}
        </div>

        {courses.isError ? (
          <ErrorState message={getErrorMessage(courses.error)} onRetry={() => courses.refetch()} />
        ) : courses.isPending ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }, (_, index) => (
              <CourseCardSkeleton key={index} />
            ))}
          </div>
        ) : courses.data.results.length === 0 ? (
          <EmptyState title="No courses match your filters" description="Try a different keyword or reset the filters." />
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {courses.data.results.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
            <div className="mt-8 rounded-2xl border border-slate-200/80 bg-white">
              <Pagination page={filters.page} pageSize={9} count={courses.data.count} onPageChange={(page) => dispatch(catalogPageChanged(page))} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CourseListingPage;
