import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, CalendarDays, Clock, MonitorPlay } from 'lucide-react';
import { Avatar, Badge } from '@/components/ui';
import { PATHS } from '@/app/router/paths';
import { formatCurrency, formatDate, resolveMediaUrl } from '@/lib/utils/format';
import type { Course } from '../types';

export const CourseCard = ({ course }: { course: Course }) => {
  const thumbnail = resolveMediaUrl(course.thumbnail);
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
      <Link to={PATHS.course(course.slug)} className="relative block aspect-[16/8] overflow-hidden bg-gradient-to-br from-brand-50 via-violet-50 to-white">
        {thumbnail ? (
          <img src={thumbnail} alt={course.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
        ) : (
          <div className="flex h-full items-center justify-center">
            <BookOpen className="h-10 w-10 text-brand-300" />
          </div>
        )}
        <div className="absolute left-3 top-3 flex gap-1.5">
          <Badge tone="brand" className="bg-white/90">{course.category?.name}</Badge>
        </div>
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex flex-wrap items-center gap-1.5">
          <Badge tone="violet">{course.level_display}</Badge>
          <Badge tone="sky" icon={<MonitorPlay className="h-3 w-3" />}>
            {course.mode_display}
          </Badge>
        </div>
        <h3 className="text-base font-bold leading-snug text-slate-900 transition-colors group-hover:text-brand-700">
          <Link to={PATHS.course(course.slug)}>{course.title}</Link>
        </h3>
        <p className="mt-1.5 line-clamp-2 text-sm text-slate-500">{course.short_description}</p>
        <dl className="mt-4 grid grid-cols-3 gap-2 text-[11px] text-slate-500">
          <div className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5 text-brand-500" />
            <dd>{course.duration_weeks} weeks</dd>
          </div>
          <div className="flex items-center gap-1">
            <BookOpen className="h-3.5 w-3.5 text-brand-500" />
            <dd>{course.total_modules} modules</dd>
          </div>
          <div className="flex items-center gap-1">
            <CalendarDays className="h-3.5 w-3.5 text-brand-500" />
            <dd>{formatDate(course.start_date)}</dd>
          </div>
        </dl>
        <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
          {course.faculty ? (
            <div className="flex min-w-0 items-center gap-2">
              <Avatar name={course.faculty.full_name} src={course.faculty.photo} size="sm" />
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-slate-800">{course.faculty.full_name}</p>
                <p className="truncate text-[10px] text-slate-400">{course.faculty.designation}</p>
              </div>
            </div>
          ) : (
            <span className="text-xs text-slate-400">Faculty to be announced</span>
          )}
          <div className="text-right">
            <p className="text-sm font-extrabold text-slate-900">{formatCurrency(course.fee)}</p>
            <Link to={PATHS.course(course.slug)} className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-600 hover:text-brand-800">
              Details <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
};

export const CourseCardSkeleton = () => (
  <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white">
    <div className="aspect-[16/8] animate-pulse bg-slate-100" />
    <div className="space-y-3 p-5">
      <div className="h-3 w-24 animate-pulse rounded bg-slate-100" />
      <div className="h-5 w-3/4 animate-pulse rounded bg-slate-100" />
      <div className="h-3 w-full animate-pulse rounded bg-slate-100" />
      <div className="h-3 w-2/3 animate-pulse rounded bg-slate-100" />
    </div>
  </div>
);
