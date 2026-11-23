import type { ReactNode } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { LearnersIllustration } from '@/components/domain/LearnersIllustration';
import { BrandLogo } from '@/components/layout/BrandLogo';
import { cn } from '@/lib/utils/cn';

interface AuthShellProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  illustration?: 'left' | 'right';
  /** Optional artwork for the side panel (e.g. an image exported from the Figma design). */
  image?: string;
}

const POINTS = ['Live attendance & coursework tracking', 'AI-predicted final scores', 'Mentor alerts before grades slip'];

/** Framed auth card: one rounded container holding the illustration panel and the form. */
export const AuthShell = ({ title, subtitle, children, footer, illustration = 'left', image }: AuthShellProps) => (
  <div className="relative overflow-hidden bg-gradient-to-b from-brand-50/80 via-slate-50 to-white">
    <div className="pointer-events-none absolute -left-32 top-10 h-80 w-80 rounded-full bg-sun-200/40 blur-3xl" />
    <div className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-brand-200/40 blur-3xl" />
    <div className="container-page relative flex min-h-[calc(100vh-4rem)] items-center py-10 sm:py-14">
      <div className="mx-auto grid w-full max-w-6xl animate-rise overflow-hidden rounded-[2rem] bg-white shadow-[0_30px_80px_-30px_rgba(26,31,113,0.35)] ring-1 ring-brand-100 lg:grid-cols-[1.05fr_1fr]">
        <aside
          className={cn(
            'relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-brand-50 via-white to-sun-50 p-10 lg:flex',
            illustration === 'right' ? 'lg:order-2 border-l border-brand-100' : 'border-r border-brand-100',
          )}
        >
          <div className="pointer-events-none absolute inset-4 rounded-[1.5rem] border border-dashed border-brand-200/70" />
          <div className="relative">
            <span className="eyebrow bg-white/80">AI-Driven Academic Intelligence</span>
            <p className="mt-4 font-display text-2xl font-semibold leading-snug text-slate-900">
              Learn smarter with <span className="highlight">predictive</span> mentorship
            </p>
          </div>
          <div className="relative my-6 flex flex-1 items-center justify-center">
            {image ? <img src={image} alt="" className="max-h-[420px] w-full object-contain" /> : <LearnersIllustration className="max-w-md" />}
          </div>
          <ul className="relative space-y-2">
            {POINTS.map((point) => (
              <li key={point} className="flex items-center gap-2 text-sm text-slate-700">
                <CheckCircle2 className="h-4 w-4 text-lime-ink" /> {point}
              </li>
            ))}
          </ul>
        </aside>
        <section className="flex flex-col justify-center px-6 py-10 sm:px-12 sm:py-14">
          <div className="mx-auto w-full max-w-md">
            <div className="mb-8 flex justify-center">
              <BrandLogo />
            </div>
            <div className="text-center">
              <h1 className="font-display text-3xl font-bold text-slate-900">{title}</h1>
              {subtitle && <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500">{subtitle}</p>}
            </div>
            <div className="mt-8">{children}</div>
            {footer && <div className="mt-6 border-t border-slate-100 pt-6 text-center text-sm text-slate-500">{footer}</div>}
          </div>
        </section>
      </div>
    </div>
  </div>
);
