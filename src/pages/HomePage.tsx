import { useState } from 'react';
import classroomImage from '@/assets/figma/about-classroom.png';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, GraduationCap } from 'lucide-react';
import { ButtonLink, Skeleton } from '@/components/ui';
import { CtaBand } from '@/components/domain/CtaBand';
import { StudentShowcase } from '@/components/domain/StudentShowcase';
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
    'Explore AI, Machine Learning, Python and Data Science',
    'Explore Edu-Predict for AI learning and professional IT courses. Learn Python, Django, Data Science, and Machine Learning from professionals.',
  );
  const courses = useCourses({ page: 1, page_size: 4 });
  const faculty = usePublicFaculty({ page: 1, page_size: 5 });
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
                { value: '600+', label: 'Students Placed' },
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
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div data-reveal="left">
              <span className="eyebrow bg-white">
                <GraduationCap className="h-3.5 w-3.5" /> Our Programs
              </span>
              <h2 className="mt-5 font-display text-3xl font-semibold leading-tight text-slate-900 sm:text-[2.75rem]">
                Build Your Future with
                <br />
                <span className="text-brand-700">Emerging Technologies</span>
              </h2>
            </div>
            <Link
              to={PATHS.courses}
              data-reveal="right"
              className="link-underline group inline-flex items-center gap-2 text-sm font-bold text-brand-700"
            >
              View all courses
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          <div className="reveal-stagger mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {courses.isPending
              ? Array.from({ length: 4 }, (_, index) => <CourseCardSkeleton key={index} />)
              : (courses.data?.results ?? []).map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
          </div>
          {courses.data && courses.data.results.length === 0 && (
            <p className="mt-8 text-center text-sm text-slate-700">
              New courses are being published. Check back soon.
            </p>
          )}
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
            <ButtonLink to={PATHS.contact} className="mt-8">
              Know More
            </ButtonLink>
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="container-page">
          <div data-reveal="" className="mx-auto max-w-4xl text-center">
            <span className="eyebrow">
              <GraduationCap className="h-3.5 w-3.5" /> Our Faculty
            </span>
            <h2 className="mt-5 font-display text-3xl font-semibold leading-tight text-slate-900 sm:text-[2.75rem]">
              Learn From Industry Experts Who Guide
              <br />
              <span className="text-brand-700">Your Path</span>
            </h2>
          </div>
          <div className="reveal-stagger mt-12 grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {faculty.isPending
              ? Array.from({ length: 5 }, (_, index) => (
                  <Skeleton key={index} className="h-[22rem] rounded-3xl" />
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

      <CtaBand
        title={
          <>
            Ready to Start <span className="text-brand-700">Learning?</span>
          </>
        }
        description="At Edu-Predict, we empower students with AI-driven learning and predictive mentorship to build successful careers."
        action={<ButtonLink to={PATHS.courses}>Browse all Courses</ButtonLink>}
      />
      <FacultyProfileModal facultyId={facultyId} onClose={() => setFacultyId(null)} />
    </>
  );
};

export default HomePage;
