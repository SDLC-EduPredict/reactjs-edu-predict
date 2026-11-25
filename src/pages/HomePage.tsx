import { useState } from 'react';
import classroomImage from '@/assets/figma/about-classroom.png';
import { ArrowRight, CheckCircle2, GraduationCap, Users } from 'lucide-react';
import { ButtonLink, Skeleton } from '@/components/ui';
import { CtaBand } from '@/components/domain/CtaBand';
import { StudentShowcase } from '@/components/domain/StudentShowcase';
import { SectionHeading } from '@/components/domain/SectionHeading';
import { CountUp } from '@/components/motion/CountUp';
import { PATHS } from '@/app/router/paths';
import { useDocumentTitle } from '@/lib/hooks/useDocumentTitle';
import { CourseCard, CourseCardSkeleton } from '@/features/courses/components/CourseCard';
import { useCourses } from '@/features/courses/hooks/useCourses';
import { FacultyCard } from '@/features/faculty/components/FacultyCard';
import { FacultyProfileModal } from '@/features/faculty/components/FacultyProfileModal';
import { usePublicFaculty } from '@/features/faculty/hooks/useFaculty';

const REASONS = [
  'AI Based Support',
  'Professional IT Courses',
  'Student Oriented',
  'Technical Knowledge',
];

const HomePage = () => {
  useDocumentTitle(
    'Master Engineering with Predictive AI Mentorship',
    'Explore Edu-Predict for AI learning and professional IT courses. Learn Python, Django, Data Science, and Machine Learning from professionals.',
  );
  const courses = useCourses({ page: 1, page_size: 6 });
  const faculty = usePublicFaculty({ page: 1, page_size: 4 });
  const [facultyId, setFacultyId] = useState<string | null>(null);

  return (
    <>
      <section className="overflow-hidden bg-white py-14 lg:py-20">
        <div className="container-page grid items-center gap-14 lg:grid-cols-[1.15fr_1fr]">
          <div className="animate-rise">
            <span className="eyebrow">
              <GraduationCap className="h-3.5 w-3.5" /> AI-Powered Academic Management System
            </span>
            <h1 className="mt-6 font-display text-4xl font-semibold leading-[1.15] text-slate-900 sm:text-5xl lg:text-[3.6rem]">
              <span className="highlight">Master</span> Engineering with{' '}
              <span className="text-brand-700">Predictive AI Mentorship</span>
            </h1>
            <p className="mt-6 max-w-xl text-sm leading-relaxed text-slate-500 sm:text-base">
              Master in-demand tech skills with intelligent learning and predictive academic
              analytics.
            </p>
            <ButtonLink to={PATHS.courses} className="mt-7">
              Explore Courses
            </ButtonLink>
            <dl className="mt-10 flex gap-12">
              {[
                { value: '120+', label: 'Countries Reached' },
                { value: '600+', label: 'Courses Available' },
              ].map((stat) => (
                <div key={stat.label}>
                  <dt className="sr-only">{stat.label}</dt>
                  <dd className="font-display text-3xl font-semibold text-slate-900">
                    <CountUp value={stat.value} />
                  </dd>
                  <p className="mt-1 text-xs text-slate-500">{stat.label}</p>
                </div>
              ))}
            </dl>
          </div>
          <StudentShowcase />
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

      <section className="bg-white py-20">
        <div className="container-page grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div
            data-reveal="left"
            className="group mx-auto w-full max-w-xl overflow-hidden rounded-[1.75rem] shadow-card"
          >
            <img
              src={classroomImage}
              alt="Students learning AI tools on laptops in a classroom"
              loading="lazy"
              width={1393}
              height={1264}
              className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
          <div data-reveal="right">
            <span className="eyebrow">
              <GraduationCap className="h-3.5 w-3.5" /> About Us
            </span>
            <h2 className="mt-5 font-display text-3xl font-semibold leading-tight text-slate-900 sm:text-4xl">
              Why Should Students Choose
              <br />
              <span className="text-brand-700">Edu Predict?</span>
            </h2>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-slate-500">
              Edu-Predict is a unique platform that provides AI-based academic assistance,
              student-oriented learning and professional IT education.
            </p>
            <ul className="reveal-stagger mt-6 space-y-3.5">
              {REASONS.map((item) => (
                <li
                  key={item}
                  data-reveal="left"
                  className="flex items-center gap-3 text-sm font-medium text-slate-800"
                >
                  <CheckCircle2 className="h-5 w-5 fill-lime-brand text-white" /> {item}
                </li>
              ))}
            </ul>
            <ButtonLink to={PATHS.about} className="mt-8">
              Know More
            </ButtonLink>
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
