import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, BarChart3, BrainCircuit, CalendarCheck2, FileText, GraduationCap, Search, ShieldCheck, Sparkles, Target, Users } from 'lucide-react';
import { env } from '@/config/env';
import { Button, ButtonLink, ErrorState } from '@/components/ui';
import { PATHS } from '@/app/router/paths';
import { useAppDispatch } from '@/app/store/hooks';
import { useDocumentTitle } from '@/lib/hooks/useDocumentTitle';
import { getErrorMessage } from '@/lib/api/apiError';
import { catalogSearchChanged } from '@/features/courses/store/catalogSlice';
import { useCategories, useCourses } from '@/features/courses/hooks/useCourses';
import { CourseCard, CourseCardSkeleton } from '@/features/courses/components/CourseCard';

const JOURNEY = [
  { icon: Search, title: 'Discover', text: 'Search courses by category, level and learning mode.' },
  { icon: GraduationCap, title: 'Enrol', text: 'Register, log in and enrol in the course that fits your goals.' },
  { icon: CalendarCheck2, title: 'Learn & track', text: 'Attendance, assignments and mock tests are recorded as you learn.' },
  { icon: BrainCircuit, title: 'Predict', text: 'Linear Regression estimates your expected final score.' },
];

const FEATURES = [
  { icon: BarChart3, title: 'Performance dashboards', text: 'Attendance, assignment averages and mock test scores in one view.' },
  { icon: BrainCircuit, title: 'ML score prediction', text: 'A supervised Linear Regression model predicts your final score out of 100.' },
  { icon: ShieldCheck, title: 'Role-based portals', text: 'Separate, secure experiences for students, faculty and administrators.' },
  { icon: Target, title: 'Early academic support', text: 'Faculty spot learners who need attention and step in early.' },
];

export const HomePage = () => {
  useDocumentTitle('Python, Django, Full Stack & Machine Learning Courses in Kolkata');
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const courses = useCourses({ page: 1, page_size: 6 });
  const categories = useCategories();

  const onSearch = (event: FormEvent) => {
    event.preventDefault();
    dispatch(catalogSearchChanged(query.trim()));
    navigate(PATHS.courses);
  };

  return (
    <div className="space-y-24 pb-24">
      <section className="relative overflow-hidden border-b border-slate-200/60 bg-gradient-to-b from-brand-50/80 via-white to-page pb-16 pt-14 sm:pt-20">
        <div className="pointer-events-none absolute left-1/2 top-6 -z-0 h-[340px] w-[820px] -translate-x-1/2 rounded-full bg-brand-200/30 blur-[120px]" />
        <div className="container-page relative">
          <div className="mx-auto max-w-3xl space-y-6 text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-100/70 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-brand-700">
              <Sparkles className="h-3.5 w-3.5" /> AI-enabled academic management
            </span>
            <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight text-slate-900 sm:text-6xl">
              Learn job-ready tech skills with <span className="text-gradient">predictive</span> academic guidance
            </h1>
            <p className="text-base leading-relaxed text-slate-600 sm:text-lg">
              {env.instituteName} pairs professional training in Python, Django, Full Stack Development, Data Science and Machine Learning with
              real-time performance prediction powered by Linear Regression.
            </p>
            <form onSubmit={onSearch} className="mx-auto max-w-xl pt-2" role="search">
              <div className="flex items-center rounded-2xl border border-slate-200 bg-white p-1.5 shadow-lg shadow-brand-500/5 focus-within:ring-2 focus-within:ring-brand-400">
                <Search className="ml-3 h-5 w-5 shrink-0 text-slate-400" />
                <label htmlFor="hero-search" className="sr-only">
                  Search courses
                </label>
                <input
                  id="hero-search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search Python, Django, Machine Learning…"
                  className="w-full bg-transparent px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
                />
                <Button type="submit">Explore courses</Button>
              </div>
            </form>
            {categories.data && categories.data.length > 0 && (
              <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
                <span className="font-medium text-slate-400">Popular:</span>
                {categories.data.slice(0, 5).map((category) => (
                  <Link
                    key={category.id}
                    to={`${PATHS.courses}?category=${category.slug}`}
                    className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-slate-600 transition-colors hover:border-brand-300 hover:text-brand-700"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="container-page">
        <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-brand-600">Professional curriculum</p>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Industry-standard career programs</h2>
            <p className="mt-1 text-sm text-slate-500">Courses taught by senior engineers, with progress forecasting built in.</p>
          </div>
          <ButtonLink to={PATHS.courses} variant="outline" iconRight={<ArrowRight className="h-4 w-4" />}>
            Browse all {courses.data?.count ?? ''} courses
          </ButtonLink>
        </div>
        {courses.isError ? (
          <ErrorState message={getErrorMessage(courses.error)} onRetry={() => courses.refetch()} />
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {courses.isPending
              ? Array.from({ length: 3 }, (_, index) => <CourseCardSkeleton key={index} />)
              : courses.data.results.slice(0, 6).map((course) => <CourseCard key={course.id} course={course} />)}
          </div>
        )}
      </section>

      <section className="container-page">
        <div className="rounded-3xl border border-slate-200/80 bg-white p-8 shadow-card sm:p-12">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-brand-600">How it works</p>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">From course discovery to predicted results</h2>
          </div>
          <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {JOURNEY.map((step, index) => (
              <li key={step.title} className="relative rounded-2xl bg-gradient-to-br from-brand-50/70 to-white p-6 ring-1 ring-brand-100">
                <span className="absolute right-4 top-4 text-3xl font-extrabold text-brand-100">{index + 1}</span>
                <step.icon className="h-8 w-8 text-brand-600" />
                <h3 className="mt-4 text-base font-bold text-slate-900">{step.title}</h3>
                <p className="mt-1 text-sm text-slate-500">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="container-page grid items-center gap-12 lg:grid-cols-2">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-brand-600">Why {env.appName}</p>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Your academic data in one place, put to work</h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            Attendance, assignments, tests and course progress are combined into one academic record. The prediction is an analytical aid that
            helps you and your mentors act early. It does not replace academic judgement.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {FEATURES.map((feature) => (
              <div key={feature.title} className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-card">
                <feature.icon className="h-6 w-6 text-brand-600" />
                <h3 className="mt-3 text-sm font-bold text-slate-900">{feature.title}</h3>
                <p className="mt-1 text-xs text-slate-500">{feature.text}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-3xl bg-gradient-to-br from-brand-600 via-violet-600 to-brand-700 p-8 text-white shadow-lift">
          <p className="text-xs font-bold uppercase tracking-wider text-brand-100">Example prediction</p>
          <p className="mt-4 text-sm text-brand-100">Predicted final score</p>
          <p className="text-6xl font-extrabold">
            83.7<span className="text-2xl text-brand-200"> / 100</span>
          </p>
          <dl className="mt-6 grid grid-cols-2 gap-3 text-sm">
            {[
              ['Attendance', '88%'],
              ['Assignment average', '84'],
              ['Mock test average', '78'],
              ['Practice', '10 hrs/week'],
              ['Previous score', '80'],
              ['Modules completed', '90%'],
            ].map(([label, value]) => (
              <div key={label} className="rounded-xl bg-white/10 px-3 py-2 backdrop-blur">
                <dt className="text-[11px] text-brand-100">{label}</dt>
                <dd className="font-bold">{value}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-6 inline-flex items-center gap-2 rounded-lg bg-white/15 px-3 py-1.5 text-xs font-semibold">
            <Users className="h-4 w-4" /> Performance indicator: Good
          </p>
        </div>
      </section>

      <section className="container-page">
        <div className="flex flex-col items-center justify-between gap-6 rounded-3xl border border-brand-100 bg-gradient-to-r from-brand-50 via-white to-violet-50 p-10 text-center md:flex-row md:text-left">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900">Ready to start learning?</h2>
            <p className="mt-1 text-sm text-slate-600">Create your student account and enrol in a course in minutes.</p>
          </div>
          <div className="flex gap-3">
            <ButtonLink to={PATHS.register} size="lg" icon={<FileText className="h-4 w-4" />}>
              Register now
            </ButtonLink>
            <ButtonLink to={PATHS.contact} size="lg" variant="outline">
              Talk to admissions
            </ButtonLink>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
