import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CheckCircle2, GraduationCap, RotateCcw, Zap } from 'lucide-react';
import { Button, ButtonLink, EmptyState, ErrorState, Pagination, SearchInput, Select } from '@/components/ui';
import { CtaBand } from '@/components/domain/CtaBand';
import { PATHS } from '@/app/router/paths';
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
  catalogFiltersReset,
  catalogLevelChanged,
  catalogPageChanged,
  catalogSearchChanged,
  finderToggled,
  selectCatalogFilters,
} from '@/features/courses/store/catalogSlice';
import { COURSE_LEVELS, type CourseLevel } from '@/features/courses/types';

const PAGE_SIZE = 8;

const TRACKING_POINTS = [
  'Weekly attendance & practice-hour tracking',
  'Graded assignments and mock tests',
  'AI-predicted final score for every learner',
  'Early alerts and 1-on-1 mentor support',
];

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
    { slug: '', name: 'All Programs' },
    ...(categories.data ?? []).filter((item) => item.is_active),
  ];

  const shown = courses.data?.results.length ?? 0;
  const total = courses.data?.count ?? 0;

  return (
    <>
      <section className="bg-gradient-to-b from-[#f0eefc] to-white pb-16 pt-14 lg:pt-20">
        <div className="container-page">
          <div className="animate-rise mx-auto max-w-4xl text-center">
            <span className="eyebrow">
              <GraduationCap className="h-3.5 w-3.5" /> Our Courses
            </span>
            <h1 className="mt-6 font-display text-4xl font-semibold leading-[1.15] text-slate-900 sm:text-5xl lg:text-[3.4rem]">
              <span className="highlight">Explore</span> Professional IT Courses to{' '}
              <span className="text-brand-700">Build Your Future</span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-slate-500 sm:text-base">
              Learn Python, Django, Full Stack, Data Science and Machine Learning with mentor-led
              tracks and AI-predicted progress at every step.
            </p>
          </div>
          <div
            data-reveal=""
            className="mx-auto mt-10 max-w-5xl rounded-3xl bg-white p-5 shadow-card ring-1 ring-black/5 sm:p-6"
          >
            <div className="flex flex-col gap-3 sm:flex-row">
              <SearchInput
                value={filters.search}
                onChange={(value) => dispatch(catalogSearchChanged(value))}
                placeholder="Search Python, Data Science, Machine Learning…"
                className="flex-1 [&_input]:border-brand-700"
              />
              <Select
                aria-label="Level"
                containerClassName="sm:w-52"
                value={filters.level}
                onChange={(event) =>
                  dispatch(catalogLevelChanged(event.target.value as CourseLevel | ''))
                }
                placeholder="All Levels"
                options={COURSE_LEVELS}
              />
            </div>
            <div className="-mx-1 mt-4 flex gap-2 overflow-x-auto px-1 pb-1 sm:flex-wrap">
              {chips.map((chip) => (
                <button
                  key={chip.slug || 'all'}
                  type="button"
                  onClick={() => dispatch(catalogCategoryChanged(chip.slug))}
                  className={cn(
                    'shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition-all duration-300 active:scale-95',
                    filters.category === chip.slug
                      ? 'bg-brand-700 text-white shadow-md shadow-brand-700/30'
                      : 'bg-[#f0eefc] text-brand-700 hover:-translate-y-0.5 hover:bg-brand-100',
                  )}
                >
                  {chip.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-sun py-20">
        <div className="container-page">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div data-reveal="left">
              <span className="eyebrow bg-white">
                <GraduationCap className="h-3.5 w-3.5" /> Our Programs
              </span>
              <h2 className="mt-5 font-display text-3xl font-semibold leading-tight text-slate-900 sm:text-[2.75rem]">
                Start Your Learning Journey <span className="text-brand-700">with Us</span>
              </h2>
            </div>
            <div data-reveal="right" className="flex items-center gap-3">
              <span className="rounded-full bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-sm">
                Showing {shown} of {total} courses
              </span>
              <Button size="sm" className="h-10 px-5" onClick={() => dispatch(catalogFiltersReset())}>
                <RotateCcw className="h-4 w-4" /> Reset
              </Button>
            </div>
          </div>

          <div className="mt-12">
            {courses.isError ? (
              <ErrorState
                message={getErrorMessage(courses.error)}
                onRetry={() => void courses.refetch()}
              />
            ) : courses.isPending ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 4 }, (_, index) => (
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
                    'reveal-stagger flex flex-wrap justify-center gap-6 transition-opacity duration-300',
                    courses.isFetching && 'opacity-60',
                  )}
                >
                  {courses.data.results.map((course) => (
                    <div
                      key={course.id}
                      className="w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(25%-1.125rem)]"
                    >
                      <CourseCard course={course} />
                    </div>
                  ))}
                </div>
                {total > PAGE_SIZE && (
                  <div className="mt-10 overflow-hidden rounded-2xl bg-white ring-1 ring-black/5">
                    <Pagination
                      page={filters.page}
                      pageSize={PAGE_SIZE}
                      count={total}
                      onPageChange={(page) => dispatch(catalogPageChanged(page))}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="container-page grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div data-reveal="left" className="mx-auto w-full max-w-xl">
            <MlPreviewCard />
          </div>
          <div data-reveal="right">
            <span className="eyebrow">
              <GraduationCap className="h-3.5 w-3.5" /> Predictive Mentorship
            </span>
            <h2 className="mt-5 font-display text-3xl font-semibold leading-tight text-slate-900 sm:text-[2.75rem]">
              How Our Courses Track
              <br />
              <span className="text-brand-700">Your Success</span>
            </h2>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-slate-500">
              Every course feeds attendance, assignments, mock tests and practice hours into our
              Linear Regression engine, so you and your mentor always know where you stand.
            </p>
            <ul className="reveal-stagger mt-6 space-y-3.5">
              {TRACKING_POINTS.map((item) => (
                <li
                  key={item}
                  data-reveal="left"
                  className="flex items-center gap-3 text-sm font-medium text-slate-800"
                >
                  <CheckCircle2 className="h-5 w-5 fill-lime-brand text-white" /> {item}
                </li>
              ))}
            </ul>
            <ButtonLink to={PATHS.contact} className="mt-8">
              Know More
            </ButtonLink>
          </div>
        </div>
      </section>

      <CtaBand
        eyebrow="Start your Journey"
        title={
          <>
            Not Sure Which Course <span className="text-brand-700">Fits Best?</span>
          </>
        }
        description="Answer 3 quick questions about your coding background and career goals to get an instant AI-matched program recommendation."
        action={
          <Button size="lg" onClick={() => dispatch(finderToggled(true))}>
            <Zap className="h-4 w-4" /> Get AI Course Recommendation
          </Button>
        }
      />
    </>
  );
};

export default CoursesPage;
