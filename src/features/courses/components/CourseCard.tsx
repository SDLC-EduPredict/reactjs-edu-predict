import { Clock3, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui';
import { CourseArt } from '@/components/domain/CourseArt';
import { useAppDispatch } from '@/app/store/hooks';
import { formatCurrency } from '@/lib/utils/format';
import { coursePreviewOpened } from '../store/catalogSlice';
import type { Course } from '../types';

export const CourseCard = ({ course }: { course: Course }) => {
  const dispatch = useAppDispatch();
  const open = () => dispatch(coursePreviewOpened(course.slug));
  return (
    <div data-reveal="" className="h-full">
      <article className="group flex h-full flex-col overflow-hidden rounded-3xl bg-white p-3 shadow-card ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift">
        <button
          type="button"
          onClick={open}
          className="relative block aspect-[422/300] overflow-hidden rounded-2xl"
          aria-label={`Preview ${course.title}`}
        >
          <div className="h-full w-full transition-transform duration-500 group-hover:scale-105">
            <CourseArt title={course.title} category={course.category?.name} thumbnail={course.thumbnail} />
          </div>
        </button>
        <div className="flex flex-1 flex-col px-3 pb-3 pt-5">
          <h3 className="font-display text-xl font-semibold leading-snug text-slate-900">{course.title}</h3>
          <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-slate-500">
            {course.short_description}
          </p>
          <div className="mt-4 flex items-center gap-3 border-y border-slate-100 py-3 text-xs text-slate-600">
            <span className="flex items-center gap-1.5">
              <Clock3 className="h-4 w-4 text-brand-700" /> {course.duration_weeks} weeks
            </span>
            <span className="h-4 w-px bg-slate-200" />
            <span className="flex items-center gap-1.5">
              <GraduationCap className="h-4 w-4 text-brand-700" /> {course.level_display}
            </span>
          </div>
          <p className="mt-4 font-display text-2xl font-bold text-slate-900">{formatCurrency(course.fee)}</p>
          <Button fullWidth className="mt-4" onClick={open}>
            View Details
          </Button>
        </div>
      </article>
    </div>
  );
};

export const CourseCardSkeleton = () => (
  <div className="overflow-hidden rounded-3xl bg-white p-3 ring-1 ring-black/5">
    <div className="aspect-[422/300] skeleton-shimmer animate-shimmer rounded-2xl" />
    <div className="space-y-3 p-3 pt-5">
      <div className="h-5 w-3/4 skeleton-shimmer animate-shimmer rounded" />
      <div className="h-3 w-full skeleton-shimmer animate-shimmer rounded" />
      <div className="h-3 w-2/3 skeleton-shimmer animate-shimmer rounded" />
      <div className="h-11 w-full skeleton-shimmer animate-shimmer rounded-full" />
    </div>
  </div>
);
