import {
  BrainCircuit,
  CheckCircle2,
  ClipboardList,
  GraduationCap,
  Search,
  UserCheck,
} from 'lucide-react';
import { ButtonLink } from '@/components/ui';
import { CtaBand } from '@/components/domain/CtaBand';
import { StudentShowcase } from '@/components/domain/StudentShowcase';
import { CountUp } from '@/components/motion/CountUp';
import { PATHS } from '@/app/router/paths';
import { useDocumentTitle } from '@/lib/hooks/useDocumentTitle';
import classroomImage from '@/assets/figma/about-classroom.png';

const STEPS = [
  {
    icon: Search,
    title: 'Course Discovery & Enrolment',
    text: 'Learners browse courses in Python, Django, Full Stack, Data Science and ML, then complete role-based registration and cohort enrolment.',
  },
  {
    icon: ClipboardList,
    title: 'Continuous Academic Tracking',
    text: 'Faculty and platform APIs continuously log attendance, assignment averages, mock test scores, module completion and weekly practice hours.',
  },
  {
    icon: BrainCircuit,
    title: 'Supervised Linear Regression Engine',
    text: 'A Python, Pandas & Scikit-Learn pipeline predicts continuous final_score values, validated via MAE, MSE, RMSE and R² metrics.',
  },
  {
    icon: UserCheck,
    title: 'Proactive Faculty & Student Action',
    text: 'Personalized dashboards guide students and flag learners needing support so mentors can schedule early 1:1 doubt clinics.',
  },
];

const BENEFITS = [
  'AI-Driven Personalized Learning Path',
  'Industry-Expert Mentorship',
  'Predictive Performance Analytics',
  'Career & Placement Assistance',
];

const AboutPage = () => {
  useDocumentTitle('About EDU-PREDICT');
  return (
    <>
      {/* Hero — Who We Are */}
      <section className="overflow-hidden bg-white py-14 lg:py-20">
        <div className="container-page grid items-center gap-14 lg:grid-cols-[1.15fr_1fr]">
          <div className="animate-rise">
            <span className="eyebrow">
              <GraduationCap className="h-3.5 w-3.5" /> Who We Are
            </span>
            <h1 className="mt-6 font-display text-4xl font-semibold leading-[1.15] text-slate-900 sm:text-5xl lg:text-[3.6rem]">
              <span className="highlight">Transforming</span> Tech Education with{' '}
              <span className="text-brand-700">AI-Driven Mentorship</span>
            </h1>
            <p className="mt-6 max-w-xl text-sm leading-relaxed text-slate-500 sm:text-base">
              Bridging the gap between aspiration and industry-ready skills with predictive
              analytics and dedicated 1-on-1 mentorship.
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

      {/* How it works */}
      <section className="section-sun py-20">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <span className="eyebrow bg-white/80">
              <GraduationCap className="h-3.5 w-3.5" /> End-To-End Platform Lifecycle
            </span>
            <h2 className="mt-5 font-display text-3xl font-semibold text-slate-900 sm:text-4xl">
              How <span className="text-brand-700">EDU-PREDICT</span> Works
            </h2>
            <p className="mt-3 text-sm text-slate-700">
              A seamless 4-step workflow connecting public course discovery, structured academic
              tracking, and supervised Machine Learning insights.
            </p>
          </div>
          <ol className="reveal-stagger mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, index) => (
              <li key={step.title} data-reveal="">
                <div className="group flex h-full flex-col rounded-3xl bg-white p-5 text-center shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift">
                  <div className="flex items-start justify-between">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-700 text-white transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110">
                      <step.icon className="h-5 w-5" />
                    </span>
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-medium text-slate-600">
                      Step {index + 1}
                    </span>
                  </div>
                  <h3 className="mt-4 font-display text-base font-semibold text-slate-900">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-xs leading-relaxed text-slate-600">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* About us */}
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
              className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
          <div data-reveal="right">
            <span className="eyebrow">
              <GraduationCap className="h-3.5 w-3.5" /> About Us
            </span>
            <h2 className="mt-5 font-display text-3xl font-semibold leading-tight text-slate-900 sm:text-4xl">
              We Don&apos;t Just Teach,
              <br />
              We <span className="text-brand-700">Build Future</span>
            </h2>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-slate-500">
              At Edu-Predict, we empower students with AI-driven learning and predictive mentorship
              to build successful careers.
            </p>
            <ul className="reveal-stagger mt-6 space-y-3.5">
              {BENEFITS.map((item) => (
                <li
                  key={item}
                  data-reveal="left"
                  className="flex items-center gap-3 text-sm font-medium text-slate-800"
                >
                  <CheckCircle2 className="h-5 w-5 fill-lime-brand text-white" /> {item}
                </li>
              ))}
            </ul>
            <ButtonLink to={PATHS.faculty} className="mt-8">
              Know More
            </ButtonLink>
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
    </>
  );
};

export default AboutPage;
