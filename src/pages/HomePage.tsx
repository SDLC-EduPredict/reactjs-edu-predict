import {
  ArrowRight,
  BrainCircuit,
  CalendarCheck2,
  CheckCircle2,
  LineChart,
  Sparkles,
  Users,
} from 'lucide-react';
import { ButtonLink, Button, Skeleton } from '@/components/ui';
import { LearnersIllustration } from '@/components/domain/LearnersIllustration';
import { CtaBand } from '@/components/domain/CtaBand';
import { MlPreviewCard } from '@/components/domain/MlPreviewCard';
import { SectionHeading } from '@/components/domain/SectionHeading';
import { CountUp } from '@/components/motion/CountUp';
import { PATHS } from '@/app/router/paths';
import { useAppDispatch } from '@/app/store/hooks';
import { env } from '@/config/env';
import { useDocumentTitle } from '@/lib/hooks/useDocumentTitle';
import { CourseCard, CourseCardSkeleton } from '@/features/courses/components/CourseCard';
import { useCategories, useCourses } from '@/features/courses/hooks/useCourses';
import { finderToggled } from '@/features/courses/store/catalogSlice';
import { FacultyCard } from '@/features/faculty/components/FacultyCard';
import { FacultyProfileModal } from '@/features/faculty/components/FacultyProfileModal';
import { usePublicFaculty } from '@/features/faculty/hooks/useFaculty';
import { useState } from 'react';

const PILLARS = [
  {
    icon: CalendarCheck2,
    title: 'Attendance Intelligence',
    text: 'Every session logged and converted into a live attendance percentage.',
  },
  {
    icon: LineChart,
    title: 'Continuous Assessment',
    text: 'Assignments, mock tests and exams roll up into one performance index.',
  },
  {
    icon: BrainCircuit,
    title: 'Predictive Mentorship',
    text: 'Linear Regression forecasts your final score before the exam does.',
  },
];

const HomePage = () => {
  useDocumentTitle('Master Engineering with Predictive AI Mentorship', 'Explore Edu-Predict for AI learning and professional IT courses. Learn Python, Django, Data Science, and Machine Learning from professionals.');
  const dispatch = useAppDispatch();
  const courses = useCourses({ page: 1, page_size: 6 });
  const categories = useCategories();
  const faculty = usePublicFaculty({ page: 1, page_size: 4 });
  const [facultyId, setFacultyId] = useState<string | null>(null);

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50/70 via-white to-white">
        <div className="pointer-events-none absolute -right-40 -top-40 h-[480px] w-[480px] rounded-full bg-sun-200/40 blur-3xl" />
        <div className="container-page relative grid items-center gap-12 py-16 lg:grid-cols-[1.1fr_1fr] lg:py-24">
          <div className="animate-rise">
            <span className="eyebrow">
              <Sparkles className="h-3.5 w-3.5" /> AI-Driven Academic Intelligence
            </span>
            <h1 className="mt-5 font-display text-4xl font-bold leading-[1.15] text-slate-900 sm:text-5xl lg:text-[3.4rem]">
              Master Engineering with <span className="highlight">Predictive AI</span> Mentorship
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-600">
              {env.instituteName} pairs industry-grade courses with a Linear Regression engine that
              tracks attendance, assignments and tests to forecast every learner&apos;s final score
              — so mentors can step in early.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink
                to={PATHS.courses}
                size="lg"
                iconRight={<ArrowRight className="h-4 w-4" />}
              >
                Explore Courses
              </ButtonLink>
              <Button size="lg" variant="outline" onClick={() => dispatch(finderToggled(true))}>
                Find My Course
              </Button>
            </div>
            <dl className="mt-10 grid max-w-md grid-cols-3 gap-4">
              {[
                { label: 'Courses', value: courses.data?.count ?? '—' },
                { label: 'Disciplines', value: categories.data?.length ?? '—' },
                { label: 'Mentors', value: faculty.data?.count ?? '—' },
              ].map((stat) => (
                <div key={stat.label}>
                  <dt className="text-xs text-slate-500">{stat.label}</dt>
                  <dd className="font-display text-2xl font-bold text-brand-700">
                    <CountUp value={stat.value} />
                  </dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="relative animate-fade-in">
            <LearnersIllustration className="mx-auto max-w-md animate-float" />
            <div className="absolute -bottom-6 left-0 hidden w-60 animate-float rounded-2xl bg-white p-4 shadow-lift ring-1 ring-black/5 [animation-delay:-3s] sm:block">
              <p className="text-[11px] font-semibold text-slate-500">Predicted final score</p>
              <p className="font-display text-2xl font-bold text-brand-700">
                <CountUp value="83.7" />
              </p>
              <span className="mt-1 inline-block rounded-full bg-lime-soft px-2 py-0.5 text-[10px] font-bold text-lime-ink">
                ● Good standing
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="section-sun py-20">
        <div className="container-page">
          <SectionHeading
            align="center"
            eyebrow="Career-Focused Programs"
            title={
              <>
                Explore Our <span className="highlight-white">Career-Focused</span> Courses
              </>
            }
            description="Structured, mentor-led tracks with measurable progress at every step."
          />
          <div className="reveal-stagger mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.isPending
              ? Array.from({ length: 3 }, (_, index) => <CourseCardSkeleton key={index} />)
              : (courses.data?.results ?? []).map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
          </div>
          {courses.data && courses.data.results.length === 0 && (
            <p className="mt-8 text-center text-sm text-slate-700">
              New courses are being published. Check back soon.
            </p>
          )}
          <div className="mt-10 text-center">
            <ButtonLink to={PATHS.courses} iconRight={<ArrowRight className="h-4 w-4" />}>
              View All Courses
            </ButtonLink>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container-page grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="Why EDU-PREDICT"
              title={
                <>
                  We Don&apos;t Just Teach, <span className="highlight">We Build Future</span>
                </>
              }
              description="Academic records stop being static reports. Every mark, attendance entry and practice hour feeds a model that tells mentors who needs help — before it is too late."
            />
            <div className="reveal-stagger mt-8 space-y-4">
              {PILLARS.map((pillar) => (
                <div
                  key={pillar.title}
                  data-reveal="left"
                  className="group flex gap-4 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100 hover:bg-white hover:shadow-card hover:ring-brand-100"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-700 text-white transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110">
                    <pillar.icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-semibold text-slate-900">{pillar.title}</p>
                    <p className="text-sm text-slate-500">{pillar.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div data-reveal="right">
            <MlPreviewCard />
          </div>
        </div>
      </section>

      <section className="bg-canvas py-20">
        <div className="container-page">
          <SectionHeading
            eyebrow="Mentors"
            title={
              <>
                Learn From <span className="highlight">Industry Mentors</span>
              </>
            }
            description="Faculty who combine engineering experience with data-driven academic guidance."
            action={
              <ButtonLink
                to={PATHS.faculty}
                variant="outline"
                iconRight={<Users className="h-4 w-4" />}
              >
                Meet All Faculty
              </ButtonLink>
            }
          />
          <div className="reveal-stagger mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {faculty.isPending
              ? Array.from({ length: 4 }, (_, index) => (
                  <Skeleton key={index} className="h-72 rounded-3xl" />
                ))
              : (faculty.data?.results ?? []).map((member) => (
                  <FacultyCard
                    key={member.id}
                    member={member}
                    onView={() => setFacultyId(member.id)}
                  />
                ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="reveal-stagger container-page grid gap-4 sm:grid-cols-3">
          {[
            'Mentor-reviewed assignments',
            'Weekly mock tests',
            'Early-warning academic alerts',
          ].map((item) => (
            <div
              key={item}
              data-reveal=""
              className="flex items-center gap-3 rounded-2xl border border-slate-200 p-4 text-sm font-semibold text-slate-700"
            >
              <CheckCircle2 className="h-5 w-5 text-lime-ink" /> {item}
            </div>
          ))}
        </div>
      </section>

      <CtaBand
        title={
          <>
            Ready to Start <span className="highlight-white">Learning?</span>
          </>
        }
        description="Create your free student account, enrol in a course and watch your predicted score grow week by week."
        action={
          <div className="flex flex-wrap justify-center gap-3">
            <ButtonLink to={PATHS.register} size="lg">
              Register Now
            </ButtonLink>
            <ButtonLink to={PATHS.contact} size="lg" variant="outline">
              Talk to Admissions
            </ButtonLink>
          </div>
        }
      />
      <FacultyProfileModal facultyId={facultyId} onClose={() => setFacultyId(null)} />
    </>
  );
};

export default HomePage;
