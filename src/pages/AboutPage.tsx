import { BrainCircuit, Building2, GraduationCap, HeartHandshake, LineChart, Users } from 'lucide-react';
import { env } from '@/config/env';
import { ButtonLink } from '@/components/ui';
import { PATHS } from '@/app/router/paths';
import { useDocumentTitle } from '@/lib/hooks/useDocumentTitle';

const VALUES = [
  { icon: GraduationCap, title: 'Industry-led curriculum', text: 'Python, Django, Full Stack, Data Science, Machine Learning and AI programs built with practising engineers.' },
  { icon: LineChart, title: 'Data-informed mentoring', text: 'Attendance, assignments and assessment scores come together in one academic record.' },
  { icon: BrainCircuit, title: 'Predictive insights', text: 'A Linear Regression model estimates each learner’s expected final score as an early-support signal.' },
  { icon: HeartHandshake, title: 'Human judgement first', text: 'Predictions support faculty decisions. They never replace them.' },
];

export const AboutPage = () => {
  useDocumentTitle(`About ${env.instituteName}`);
  return (
    <div className="pb-20">
      <section className="border-b border-slate-200/60 bg-gradient-to-b from-brand-50/70 to-page py-14">
        <div className="container-page max-w-4xl text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-brand-600">About the institute</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            {env.instituteName}: professional tech education with <span className="text-gradient">academic intelligence</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600">
            {env.appName} is our AI-enabled academic management platform. It covers course discovery, enrolment, learning activity, tests,
            performance analysis and Machine Learning based score prediction.
          </p>
        </div>
      </section>
      <div className="container-page mt-12 grid gap-6 md:grid-cols-2">
        {VALUES.map((item) => (
          <div key={item.title} className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-card">
            <item.icon className="h-7 w-7 text-brand-600" />
            <h2 className="mt-4 text-base font-bold text-slate-900">{item.title}</h2>
            <p className="mt-1 text-sm text-slate-600">{item.text}</p>
          </div>
        ))}
      </div>
      <div className="container-page mt-12 grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl bg-gradient-to-br from-brand-600 to-violet-600 p-8 text-white lg:col-span-2">
          <Building2 className="h-8 w-8" />
          <h2 className="mt-4 text-xl font-extrabold">Visit our campus</h2>
          <p className="mt-2 text-sm text-brand-100">{env.contactAddress}</p>
          <p className="mt-1 text-sm text-brand-100">
            {env.contactEmail} · {env.contactPhone}
          </p>
        </div>
        <div className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-8 shadow-card">
          <div>
            <Users className="h-8 w-8 text-brand-600" />
            <h2 className="mt-4 text-lg font-bold text-slate-900">Join the next batch</h2>
            <p className="mt-1 text-sm text-slate-600">Create a student account and enrol online.</p>
          </div>
          <ButtonLink to={PATHS.register} className="mt-6">
            Register now
          </ButtonLink>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
