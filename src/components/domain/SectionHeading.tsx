import type { ReactNode } from 'react';
import { GraduationCap } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface SectionHeadingProps {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: 'left' | 'center';
  action?: ReactNode;
  className?: string;
}

export const SectionHeading = ({ eyebrow, title, description, align = 'left', action, className }: SectionHeadingProps) => (
  <div className={cn('mb-10 flex flex-col gap-4', align === 'center' ? 'items-center text-center' : 'sm:flex-row sm:items-end sm:justify-between', className)}>
    <div className={cn(align === 'center' && 'flex flex-col items-center')}>
      {eyebrow && (
        <span className="eyebrow mb-4">
          <GraduationCap className="h-3.5 w-3.5" /> {eyebrow}
        </span>
      )}
      <h2 className="font-display text-3xl font-semibold leading-tight tracking-tight text-slate-900 sm:text-4xl">{title}</h2>
      {description && <p className={cn('mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base', align === 'center' && 'mx-auto')}>{description}</p>}
    </div>
    {action}
  </div>
);
