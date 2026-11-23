import { BrainCircuit, CalendarCheck2, CheckCircle2, ClipboardCheck, GraduationCap, LineChart, ShieldCheck, Target } from 'lucide-react';
import { ButtonLink } from '@/components/ui';
import { CtaBand } from '@/components/domain/CtaBand';
import { MlPreviewCard } from '@/components/domain/MlPreviewCard';
import { SectionHeading } from '@/components/domain/SectionHeading';
import { PATHS } from '@/app/router/paths';
import { env } from '@/config/env';
import { useDocumentTitle } from '@/lib/hooks/useDocumentTitle';

const STEPS = [
  { icon: GraduationCap, title: 'Enrol in a Track', text: 'Pick a career-focused course and get a mentor-led batch with a clear syllabus.' },
  { icon: CalendarCheck2, title: 'Learn & Get Tracked', text: 'Attendance, assignments, mock tests and practice hours are captured automatically.' },
  { icon: BrainCircuit, title: 'AI Predicts Your Score', text: 'A Linear Regression model forecasts your final score from your live academic data.' },
  { icon: Target, title: 'Mentors Step In Early', text: 'Faculty get alerts for learners who need attention and guide them back on track.' },
];

const VALUES = [
  { icon: ClipboardCheck, title: 'Transparent records', text: 'Students see exactly what goes into their score — no black boxes.' },
  { icon: LineChart, title: 'Measurable growth', text: 'Week-over-week trends for every learner, course and batch.' },
  { icon: ShieldCheck, title: 'Role-based access', text: 'Students, faculty and administrators each get a dedicated, secure workspace.' },
];

const AboutPage = () => {
  useDocumentTitle('About EDU-PREDICT');
  return (
    <>
      <section className="bg-gradient-to-b from-brand-50/70 to-white py-16 lg:py-24">
        <div className="container-page grid items-center gap-12 lg:grid-cols-2">
          <div>
            <span className="eyebrow">About {env.instituteName}</span>
            <h1 className="mt-5 font-display text-4xl font-bold leading-tight text-slate-900 sm:text-5xl">
              Where Teaching Meets <span className="highlight">Data Science</span>
            </h1>
            <p className="mt-5 text-base leading-relaxed text-slate-600">
              {env.appName} is {env.instituteName}&apos;s {env.appTagline.toLowerCase()}. It replaces scattered spreadsheets with one academic system of
              record and adds a predictive layer that helps every learner finish strong.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-slate-700">
              {['Course & batch management', 'Attendance, assignments and assessments', 'Performance analytics and ML predictions'].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-lime-ink" /> {item}
                </li>
              ))}
            </ul>
          </div>
          <MlPreviewCard />
        </div>
      </section>

      <section className="py-20">
        <div className="container-page">
          <SectionHeading
            align="center"
            eyebrow="The Process"
            title={
              <>
                How <span className="highlight">EDU-PREDICT</span> Works
              </>
            }
            description="Four steps from enrolment to an accurate, explainable score forecast."
          />
          <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, index) => (
              <li key={step.title} className="relative rounded-3xl bg-white p-6 shadow-card ring-1 ring-black/5">
                <span className="absolute right-5 top-5 font-display text-4xl font-bold text-brand-50">0{index + 1}</span>
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sun-300 text-brand-900">
                  <step.icon className="h-6 w-6" />
                </span>
                <h3 className="mt-5 font-display text-lg font-semibold text-slate-900">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-canvas py-20">
        <div className="container-page grid gap-10 lg:grid-cols-[1fr_1.3fr] lg:items-center">
          <SectionHeading
            eyebrow="Our Principles"
            title={
              <>
                Data-Driven Guidance, <span className="highlight">Human Empathy</span>
              </>
            }
            description="The model surfaces signals; mentors make the call. Every prediction is paired with the features that drove it."
            action={<ButtonLink to={PATHS.faculty}>Meet the Mentors</ButtonLink>}
          />
          <div className="grid gap-4 sm:grid-cols-3">
            {VALUES.map((value) => (
              <div key={value.title} className="rounded-3xl bg-white p-5 ring-1 ring-black/5">
                <value.icon className="h-6 w-6 text-brand-700" />
                <p className="mt-4 font-semibold text-slate-900">{value.title}</p>
                <p className="mt-1 text-sm text-slate-500">{value.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        title={
          <>
            Ready to Start <span className="highlight-white">Learning?</span>
          </>
        }
        description="Join a batch today and get your first predicted score after a week of classes."
        action={
          <ButtonLink to={PATHS.register} size="lg">
            Register Now
          </ButtonLink>
        }
      />
    </>
  );
};

export default AboutPage;
