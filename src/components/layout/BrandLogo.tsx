import { Link } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';
import { env } from '@/config/env';
import { cn } from '@/lib/utils/cn';

export const BrandLogo = ({ to = '/', subtitle = true, className }: { to?: string; subtitle?: boolean; className?: string }) => (
  <Link to={to} className={cn('group flex items-center gap-2.5', className)} aria-label={`${env.appName} home`}>
    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-600 to-violet-600 text-white shadow-md shadow-brand-500/25 transition-transform group-hover:scale-105">
      <GraduationCap className="h-6 w-6" />
    </span>
    <span className="leading-tight">
      <span className="flex items-center gap-1.5">
        <span className="text-lg font-extrabold tracking-tight text-slate-900">{env.appName}</span>
        <span className="rounded bg-brand-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-brand-700">AI</span>
      </span>
      {subtitle && <span className="hidden text-[10px] font-medium text-slate-400 sm:block">{env.instituteName} Academic Platform</span>}
    </span>
  </Link>
);
