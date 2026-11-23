import type { ReactNode } from 'react';
import { LearnersIllustration } from '@/components/domain/LearnersIllustration';
import { cn } from '@/lib/utils/cn';

interface AuthShellProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  illustration?: 'left' | 'right';
}

export const AuthShell = ({ title, subtitle, children, footer, illustration = 'left' }: AuthShellProps) => (
  <div className="bg-slate-50/70">
    <div className="container-page grid min-h-[calc(100vh-4rem)] items-center gap-10 py-12 lg:grid-cols-2 lg:gap-16">
      <div className={cn('hidden lg:block', illustration === 'right' && 'lg:order-2')}>
        <LearnersIllustration className="animate-rise" />
      </div>
      <div className="mx-auto w-full max-w-md animate-rise">
        <div className="text-center">
          <h1 className="font-display text-3xl font-bold text-slate-900">{title}</h1>
          {subtitle && <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500">{subtitle}</p>}
        </div>
        <div className="mt-8">{children}</div>
        {footer && <div className="mt-6 text-center text-sm text-slate-500">{footer}</div>}
      </div>
    </div>
  </div>
);
