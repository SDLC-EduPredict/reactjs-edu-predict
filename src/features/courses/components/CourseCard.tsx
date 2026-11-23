import { Clock3, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui';
import { CourseArt } from '@/components/domain/CourseArt';
import { useAppDispatch } from '@/app/store/hooks';
import { formatCurrency } from '@/lib/utils/format';
import { coursePreviewOpened } from '../store/catalogSlice';
import type { Course } from '../types';

export const CourseCard = ({ course }: { course: Course }) => {
  const dispatch = useAppDispatch();
  return (
    <div data-reveal="" className="h-full">
      <article className="group flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-card ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift">
        <button
          type="button"
          onClick={() => dispatch(coursePreviewOpened(course.slug))}
          className="relative block aspect-[16/10] overflow-hidden"
          aria-label={`Preview ${course.title}`}
        >
          <div className="h-full w-full transition-transform duration-500 group-hover:scale-105">
            <CourseArt
              title={course.title}
              category={course.category?.name}
              thumbnail={course.thumbnail}
            />
          </div>
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold text-brand-700 backdrop-blur">
            {course.category?.name}
          </span>
        </button>
        <div className="flex flex-1 flex-col p-5">
          <h3 className="font-display text-base font-semibold leading-snug text-slate-900">
            {course.title}
          </h3>
          <p className="mt-2 line-clamp-2 flex-1 text-xs leading-relaxed text-slate-500">
            {course.short_description}
          </p>
          <div className="mt-4 flex items-center gap-3 border-t border-slate-100 pt-3 text-[11px] text-slate-500">
            <span className="flex items-center gap-1">
              <Clock3 className="h-3.5 w-3.5" /> {course.duration_weeks} weeks
            </span>
            <span className="h-3 w-px bg-slate-200" />
            <span className="flex items-center gap-1">
              <GraduationCap className="h-3.5 w-3.5" /> {course.level_display}
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="font-display text-xl font-bold text-slate-900">
              {formatCurrency(course.fee)}
            </span>
            <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-bold text-brand-700">
              {course.mode_display}
            </span>
          </div>
          <Button
            fullWidth
            size="sm"
            className="mt-4 h-9"
            onClick={() => dispatch(coursePreviewOpened(course.slug))}
          >
            View Details
          </Button>
        </div>
      </article>
    </div>
  );
};

export const CourseCardSkeleton = () => (
  <div className="overflow-hidden rounded-3xl bg-white ring-1 ring-black/5">
    <div className="aspect-[16/10] skeleton-shimmer animate-shimmer" />
    <div className="space-y-3 p-5">
      <div className="h-4 w-3/4 skeleton-shimmer animate-shimmer rounded" />
      <div className="h-3 w-full skeleton-shimmer animate-shimmer rounded" />
      <div className="h-3 w-2/3 skeleton-shimmer animate-shimmer rounded" />
      <div className="h-9 w-full skeleton-shimmer animate-shimmer rounded-full" />
    </div>
  </div>
);
