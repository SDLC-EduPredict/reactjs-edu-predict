import type { ReactNode } from 'react';
import { BrainCircuit, CheckCircle2, GraduationCap } from 'lucide-react';
import { env } from '@/config/env';

interface AuthShellProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}

const POINTS = [
  'Track attendance, assignments and test results',
  'See your predicted final score',
  'Get alerts and academic support early',
];

export const AuthShell = ({ title, subtitle, children, footer }: AuthShellProps) => (
  <div className="container-page py-12 sm:py-16">
    <div className="mx-auto grid max-w-5xl overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-xl shadow-brand-500/5 lg:grid-cols-[1fr_1.1fr]">
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-brand-600 via-violet-600 to-brand-800 p-10 text-white lg:flex">
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="relative">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
            <GraduationCap className="h-7 w-7" />
          </span>
          <h2 className="mt-6 text-2xl font-extrabold leading-tight">{env.appName}</h2>
          <p className="mt-1 text-sm text-brand-100">{env.appTagline}</p>
        </div>
        <ul className="relative space-y-3 text-sm">
          {POINTS.map((point) => (
            <li key={point} className="flex items-center gap-2.5">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-300" /> {point}
            </li>
          ))}
        </ul>
        <div className="relative flex items-center gap-3 rounded-2xl bg-white/10 p-4 text-xs backdrop-blur">
          <BrainCircuit className="h-8 w-8 shrink-0" />
          <p>Powered by a supervised Linear Regression model trained on historical academic data.</p>
        </div>
      </aside>
      <div className="p-8 sm:p-10">
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
        <div className="mt-8">{children}</div>
        {footer && <div className="mt-6 border-t border-slate-100 pt-6 text-center text-sm text-slate-500">{footer}</div>}
      </div>
    </div>
  </div>
);
