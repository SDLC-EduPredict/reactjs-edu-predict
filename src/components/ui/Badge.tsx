import type { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

export type BadgeTone = 'brand' | 'slate' | 'green' | 'amber' | 'rose' | 'sky' | 'violet' | 'lime' | 'sun';

const tones: Record<BadgeTone, string> = {
  brand: 'bg-brand-50 text-brand-700 ring-brand-200/70',
  slate: 'bg-slate-100 text-slate-700 ring-slate-200',
  green: 'bg-emerald-50 text-emerald-700 ring-emerald-200/70',
  amber: 'bg-amber-50 text-amber-700 ring-amber-200/70',
  rose: 'bg-rose-50 text-rose-700 ring-rose-200/70',
  sky: 'bg-sky-50 text-sky-700 ring-sky-200/70',
  violet: 'bg-violet-50 text-violet-700 ring-violet-200/70',
  lime: 'bg-lime-soft text-lime-ink ring-lime-brand/40',
  sun: 'bg-sun-100 text-amber-800 ring-sun-300/70',
};

interface BadgeProps {
  tone?: BadgeTone;
  children: ReactNode;
  icon?: ReactNode;
  className?: string;
}

export const Badge = ({ tone = 'slate', children, icon, className }: BadgeProps) => (
  <span className={cn('inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1 ring-inset', tones[tone], className)}>
    {icon}
    {children}
  </span>
);

const STATUS_TONES: Record<string, BadgeTone> = {
  ACTIVE: 'green',
  PUBLISHED: 'green',
  PASS: 'green',
  FAIL: 'rose',
  GOOD: 'lime',
  AVERAGE: 'sun',
  NEEDS_ATTENTION: 'rose',
  NO_DATA: 'slate',
  TAUGHT: 'lime',
  APPROVED: 'green',
  CONFIRMED: 'green',
  COMPLETED: 'sky',
  PRESENT: 'green',
  GRADED: 'green',
  SUBMITTED: 'sky',
  UPCOMING: 'violet',
  PENDING: 'amber',
  LATE: 'amber',
  EXCUSED: 'sky',
  DRAFT: 'slate',
  ARCHIVED: 'slate',
  INACTIVE: 'slate',
  ABSENT: 'rose',
  CANCELLED: 'rose',
  REJECTED: 'rose',
  DROPPED: 'rose',
  OVERDUE: 'rose',
};

export const StatusBadge = ({ status, label }: { status: string | null | undefined; label?: string }) => {
  const key = (status ?? '').toUpperCase();
  return <Badge tone={STATUS_TONES[key] ?? 'slate'}>{label || key.replace(/_/g, ' ') || '—'}</Badge>;
};
