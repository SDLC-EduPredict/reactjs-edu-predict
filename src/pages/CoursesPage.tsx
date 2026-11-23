import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { Button, EmptyState, ErrorState, Pagination, SearchInput, Select } from '@/components/ui';
import { MlPreviewCard } from '@/components/domain/MlPreviewCard';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { getErrorMessage } from '@/lib/api/apiError';
import { useDebouncedValue } from '@/lib/hooks/useDebouncedValue';
import { useDocumentTitle } from '@/lib/hooks/useDocumentTitle';
import { cn } from '@/lib/utils/cn';
import { CourseCard, CourseCardSkeleton } from '@/features/courses/components/CourseCard';
import { useCategories, useCourses } from '@/features/courses/hooks/useCourses';
import {
  catalogCategoryChanged,
  catalogLevelChanged,
  catalogPageChanged,
  catalogSearchChanged,
  finderToggled,
  selectCatalogFilters,
} from '@/features/courses/store/catalogSlice';
import { COURSE_LEVELS, type CourseLevel } from '@/features/courses/types';

const PAGE_SIZE = 9;

const CoursesPage = () => {
  useDocumentTitle('Courses');
  const dispatch = useAppDispatch();
  const filters = useAppSelector(selectCatalogFilters);
  const [params, setParams] = useSearchParams();
  const search = useDebouncedValue(filters.search);
  const categories = useCategories();
  const courses = useCourses({
    page: filters.page,
    page_size: PAGE_SIZE,
    search,
    category: filters.category || undefined,
    level: filters.level || undefined,
  });

  useEffect(() => {
    const fromUrl = params.get('category');
    const searchFromUrl = params.get('search');
    if (fromUrl) dispatch(catalogCategoryChanged(fromUrl));
    if (searchFromUrl) dispatch(catalogSearchChanged(searchFromUrl));
    if (fromUrl || searchFromUrl) setParams({}, { replace: true });
  }, [params, dispatch, setParams]);

  const chips = [
    { slug: '', name: 'All Courses' },
    ...(categories.data ?? []).filter((item) => item.is_active),
  ];

  return (
    <>
      <section className="bg-gradient-to-b from-brand-50/70 to-white pb-10 pt-14">
        <div className="container-page grid items-center gap-10 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <span className="eyebrow">Course Catalogue</span>
            <h1 className="mt-4 font-display text-4xl font-bold leading-tight text-slate-900 sm:text-5xl">
              Find the <span className="highlight">Right Track</span> for Your Career
            </h1>
            <p className="mt-4 max-w-xl text-slate-600">
              Every course comes with tracked attendance, graded assignments, weekly mock tests and
              an AI-predicted final score.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <SearchInput
                value={filters.search}
                onChange={(value) => dispatch(catalogSearchChanged(value))}
                placeholder="Search Python, Data Science, Cloud…"
                className="flex-1"
              />
              <Select
                aria-label="Level"
                containerClassName="sm:w-48"
                value={filters.level}
                onChange={(event) =>
                  dispatch(catalogLevelChanged(event.target.value as CourseLevel | ''))
                }
                placeholder="All levels"
                options={COURSE_LEVELS}
              />
            </div>
          </div>
          <MlPreviewCard />
        </div>
      </section>

      <section className="pb-20">
        <div className="container-page">
          <div className="-mx-4 mb-8 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:px-0">
            {chips.map((chip) => (
              <button
                key={chip.slug || 'all'}
                type="button"
                onClick={() => dispatch(catalogCategoryChanged(chip.slug))}
                className={cn(
                  'shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition-all duration-300 active:scale-95',
                  filters.category === chip.slug
                    ? 'bg-brand-700 text-white shadow-md shadow-brand-700/30'
                    : 'bg-brand-50 text-brand-700 hover:-translate-y-0.5 hover:bg-brand-100',
                )}
              >
                {chip.name}
              </button>
            ))}
          </div>

          {courses.isError ? (
            <ErrorState
              message={getErrorMessage(courses.error)}
              onRetry={() => void courses.refetch()}
            />
          ) : courses.isPending ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }, (_, index) => (
                <CourseCardSkeleton key={index} />
              ))}
            </div>
          ) : courses.data.results.length === 0 ? (
            <EmptyState
              title="No courses match your filters"
              description="Try a different keyword, level or category."
            />
          ) : (
            <>
              <div
                className={cn(
                  'reveal-stagger grid gap-6 transition-opacity duration-300 sm:grid-cols-2 lg:grid-cols-3',
                  courses.isFetching && 'opacity-60',
                )}
              >
                {courses.data.results.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
              <div className="mt-8 overflow-hidden rounded-2xl bg-white ring-1 ring-slate-100">
                <Pagination
                  page={filters.page}
                  pageSize={PAGE_SIZE}
                  count={courses.data.count}
                  onPageChange={(page) => dispatch(catalogPageChanged(page))}
                />
              </div>
            </>
          )}

          <div
            data-reveal="zoom"
            className="navy-panel mt-16 flex flex-col items-start justify-between gap-6 rounded-3xl p-8 text-white sm:flex-row sm:items-center"
          >
            <div>
              <p className="flex items-center gap-2 text-xs font-semibold text-sun-300">
                <Sparkles className="h-4 w-4" /> 3-Step Course Finder
              </p>
              <h2 className="mt-2 font-display text-2xl font-semibold">
                Not Sure Which Course Fits Best?
              </h2>
              <p className="mt-1 text-sm text-white/70">
                Answer three quick questions and we&apos;ll match you with the right track.
              </p>
            </div>
            <Button variant="sun" size="lg" onClick={() => dispatch(finderToggled(true))}>
              Get My Recommendation
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default CoursesPage;
