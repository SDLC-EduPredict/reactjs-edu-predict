import type { ReactNode } from 'react';
import { CheckCircle2, GraduationCap } from 'lucide-react';
import learnersIllustration from '@/assets/figma/learners-illustration.png';
import { cn } from '@/lib/utils/cn';

interface AuthShellProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  /** Which side the artwork sits on (desktop). */
  illustration?: 'left' | 'right';
  /** Show the headline and benefit points under the artwork (registration). */
  sideText?: boolean;
  image?: string;
}

const POINTS = ['Live attendance & coursework tracking', 'AI-predicted final scores with Linear Regression', 'Mentor alerts before grades slip'];

/**
 * Auth layout from the Figma design: the artwork (and optional copy) sits freely on the page,
 * only the form itself is framed by a bordered card.
 */
export const AuthShell = ({ title, subtitle, children, footer, illustration = 'left', sideText = false, image }: AuthShellProps) => (
  <div className="relative overflow-hidden bg-gradient-to-b from-brand-50/60 via-slate-50 to-white">
    <div className="container-page grid min-h-[calc(100vh-4rem)] items-center gap-10 py-10 sm:py-14 lg:grid-cols-2 lg:gap-16">
      <div className={cn('hidden animate-fade-in lg:block', illustration === 'right' && 'lg:order-2')}>
        {sideText && (
          <div className="mb-8">
            <span className="eyebrow">
              <GraduationCap className="h-3.5 w-3.5" /> Join ABC Academy
            </span>
            <h2 className="mt-4 font-display text-3xl font-semibold leading-tight text-slate-900 xl:text-4xl">
              Start learning with <span className="highlight">Predictive AI</span> <span className="text-brand-700">Mentorship</span>
            </h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-500">
              Create your profile to enrol in career-focused courses and get a real-time AI forecast of your final score.
            </p>
          </div>
        )}
        <img src={image ?? learnersIllustration} alt="Students learning online with EDU-PREDICT" className="mx-auto w-full max-w-xl object-contain" />
        {sideText && (
          <ul className="mt-8 space-y-3">
            {POINTS.map((point) => (
              <li key={point} className="flex items-center gap-3 text-sm font-medium text-slate-700">
                <CheckCircle2 className="h-5 w-5 fill-lime-brand text-white" /> {point}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mx-auto w-full max-w-lg animate-rise rounded-3xl border border-slate-200 bg-white px-6 py-9 shadow-[0_20px_60px_-30px_rgba(26,31,113,0.35)] sm:px-10 sm:py-11">
        <div className="text-center">
          <h1 className="font-display text-3xl font-semibold text-slate-900">{title}</h1>
          {subtitle && <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500">{subtitle}</p>}
        </div>
        <div className="mt-8">{children}</div>
        {footer && <div className="mt-6 text-center text-sm text-slate-500">{footer}</div>}
      </div>
    </div>
  </div>
);
