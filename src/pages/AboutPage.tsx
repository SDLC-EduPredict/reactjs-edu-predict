import { BrainCircuit, CheckCircle2, ClipboardList, Globe2, GraduationCap, Search, UserCheck, Video } from 'lucide-react';
import { ButtonLink } from '@/components/ui';
import { CtaBand } from '@/components/domain/CtaBand';
import { PATHS } from '@/app/router/paths';
import { useDocumentTitle } from '@/lib/hooks/useDocumentTitle';
import studentImage from '@/assets/figma/about-student.webp';
import classroomImage from '@/assets/figma/about-classroom.webp';

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

const BENEFITS = ['AI-Driven Personalized Learning Path', 'Industry-Expert Mentorship', 'Predictive Performance Analytics', 'Career & Placement Assistance'];

const AVATARS = [
  { initials: 'AS', className: 'bg-sun-300 text-brand-900' },
  { initials: 'PR', className: 'bg-brand-200 text-brand-800' },
  { initials: 'NK', className: 'bg-rose-200 text-rose-800' },
];

/** 90% semicircle gauge used on the floating “Satisfaction Rate” card. */
const SatisfactionGauge = () => (
  <svg viewBox="0 0 100 56" className="h-12 w-24" aria-hidden="true">
    <path d="M8 50 A42 42 0 0 1 92 50" fill="none" stroke="#eef0f6" strokeWidth="9" strokeLinecap="round" />
    <path d="M8 50 A42 42 0 0 1 92 50" fill="none" stroke="#c6e86b" strokeWidth="9" strokeLinecap="round" strokeDasharray="132 200" pathLength={147} />
  </svg>
);

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
              <span className="highlight">Transforming</span> Tech Education with <span className="text-brand-700">AI-Driven Mentorship</span>
            </h1>
            <p className="mt-6 max-w-xl text-sm leading-relaxed text-slate-500 sm:text-base">
              Bridging the gap between aspiration and industry-ready skills with predictive analytics and dedicated 1-on-1 mentorship.
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
                  <dd className="font-display text-3xl font-semibold text-slate-900">{stat.value}</dd>
                  <p className="mt-1 text-xs text-slate-500">{stat.label}</p>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative mx-auto w-full max-w-md animate-fade-in pt-10 lg:max-w-none">
            <div className="relative ml-auto w-[82%] overflow-hidden rounded-[1.75rem] bg-[#f0eefc]">
              <img src={studentImage} alt="Smiling EDU-PREDICT student holding a laptop" className="relative z-0 mx-auto w-full object-contain" />
            </div>
            <div className="absolute left-0 top-0 z-10 flex flex-col items-center rounded-2xl bg-white px-4 py-3 shadow-lift ring-1 ring-black/5 sm:left-2">
              <SatisfactionGauge />
              <p className="-mt-6 font-display text-lg font-bold text-slate-900">90%</p>
              <p className="text-[11px] text-slate-500">Satisfaction Rate</p>
            </div>
            <span className="absolute -right-2 top-6 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-pink-200 text-slate-900 shadow-md">
              <Video className="h-5 w-5" />
            </span>
            <div className="absolute -bottom-6 right-0 z-10 w-56 rounded-2xl bg-white p-4 shadow-lift ring-1 ring-black/5 sm:-right-4">
              <div className="flex -space-x-2">
                {AVATARS.map((avatar) => (
                  <span key={avatar.initials} className={`flex h-9 w-9 items-center justify-center rounded-full text-[11px] font-bold ring-2 ring-white ${avatar.className}`}>
                    {avatar.initials}
                  </span>
                ))}
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-lime-brand text-brand-950 ring-2 ring-white">
                  <Globe2 className="h-4 w-4" />
                </span>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-slate-500">More than 50,000+ students enrolled around the world.</p>
            </div>
          </div>
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
              A seamless 4-step workflow connecting public course discovery, structured academic tracking, and supervised Machine Learning insights.
            </p>
          </div>
          <ol className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, index) => (
              <li key={step.title} className="flex flex-col rounded-3xl bg-white p-5 text-center shadow-card transition hover:-translate-y-1 hover:shadow-lift">
                <div className="flex items-start justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-700 text-white">
                    <step.icon className="h-5 w-5" />
                  </span>
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-medium text-slate-600">Step {index + 1}</span>
                </div>
                <h3 className="mt-4 font-display text-base font-semibold text-slate-900">{step.title}</h3>
                <p className="mt-3 text-xs leading-relaxed text-slate-600">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* About us */}
      <section className="bg-white py-20">
        <div className="container-page grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <img src={classroomImage} alt="Students learning AI tools on laptops in a classroom" loading="lazy" className="mx-auto w-full max-w-xl rounded-[1.75rem] object-cover shadow-card" />
          <div>
            <span className="eyebrow">
              <GraduationCap className="h-3.5 w-3.5" /> About Us
            </span>
            <h2 className="mt-5 font-display text-3xl font-semibold leading-tight text-slate-900 sm:text-4xl">
              We Don&apos;t Just Teach,
              <br />
              We <span className="text-brand-700">Build Future</span>
            </h2>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-slate-500">
              At Edu-Predict, we empower students with AI-driven learning and predictive mentorship to build successful careers.
            </p>
            <ul className="mt-6 space-y-3.5">
              {BENEFITS.map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm font-medium text-slate-800">
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
