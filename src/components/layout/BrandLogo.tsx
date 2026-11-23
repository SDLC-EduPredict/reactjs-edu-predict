import { Link } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';
import { env } from '@/config/env';
import { cn } from '@/lib/utils/cn';

export const BrandLogo = ({ to = '/', light = false, className }: { to?: string; light?: boolean; className?: string }) => (
  <Link to={to} className={cn('group flex items-center gap-2', className)} aria-label={`${env.appName} home`}>
    <span className={cn('flex h-8 w-8 items-center justify-center rounded-lg transition-transform group-hover:scale-105', light ? 'bg-white text-brand-700' : 'bg-brand-700 text-white')}>
      <GraduationCap className="h-5 w-5" />
    </span>
    <span className={cn('font-display text-[15px] font-bold tracking-tight', light ? 'text-white' : 'text-slate-900')}>{env.appName}</span>
  </Link>
);
