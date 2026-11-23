import { useNavigate } from 'react-router-dom';
import { CheckCircle2, GraduationCap, Star, X } from 'lucide-react';
import { createPortal } from 'react-dom';
import { useEffect } from 'react';
import { Avatar, Button, Spinner } from '@/components/ui';
import { CourseArt } from '@/components/domain/CourseArt';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { PATHS } from '@/app/router/paths';
import { getErrorMessage } from '@/lib/api/apiError';
import { formatCurrency, formatDate } from '@/lib/utils/format';
import { useCurrentUser } from '@/features/auth/hooks/useAuth';
import { useEnrol, useMyCourses } from '@/features/enrolments/hooks/useEnrolments';
import { useCourse } from '../hooks/useCourses';
import { coursePreviewClosed, selectCoursePreview } from '../store/catalogSlice';
import type { CourseDetail } from '../types';

const WEIGHTS = [
  { label: 'Attendance', value: 'Min 75% Req.' },
  { label: 'Assignments', value: 'Weekly Labs' },
  { label: 'Mock Tests', value: 'Bi-Weekly' },
  { label: 'Practice Hrs', value: '8–12 Hrs/Wk' },
];

export const buildSyllabus = (course: Pick<CourseDetail, 'duration_weeks' | 'total_modules'>) => {
  const modules = Math.max(1, course.total_modules);
  const weeks = Math.max(1, course.duration_weeks);
  const blocks = Math.min(4, modules);
  return Array.from({ length: blocks }, (_, index) => {
    const startModule = Math.floor((index * modules) / blocks) + 1;
    const endModule = Math.floor(((index + 1) * modules) / blocks);
    const startWeek = Math.floor((index * weeks) / blocks) + 1;
    const endWeek = Math.floor(((index + 1) * weeks) / blocks);
    return {
      weeks: startWeek === endWeek ? `Wk ${startWeek}` : `Wk ${startWeek}–${endWeek}`,
      modules: startModule === endModule ? `Module ${startModule}` : `Modules ${startModule}–${endModule}`,
    };
  });
};

export const CourseDetailBody = ({ course, onClose }: { course: CourseDetail; onClose?: () => void }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isAuthenticated, role } = useCurrentUser();
  const isStudent = role === 'STUDENT';
  const myCourses = useMyCourses(isAuthenticated && isStudent);
  const enrol = useEnrol();
  const existing = myCourses.data?.find((item) => item.course.id === course.id);
  const mentorInitials = course.faculty?.full_name ?? 'Faculty mentor';

  const onEnrol = () => {
    if (!isAuthenticated) {
      dispatch(coursePreviewClosed());
      navigate(`${PATHS.login}?next=${encodeURIComponent(PATHS.course(course.slug))}`);
      return;
    }
    enrol.mutate(course.id);
  };

  return (
    <div className="overflow-hidden rounded-3xl bg-white">
      <div className="relative h-56 sm:h-64">
        <CourseArt title={course.title} category={course.category.name} thumbnail={course.thumbnail} />
        <span className="absolute left-5 top-5 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-brand-700 shadow">
          <GraduationCap className="h-4 w-4" /> {course.category.name}
        </span>
        <span className="absolute right-5 top-5 inline-flex items-center gap-1 rounded-full bg-lime-brand px-3 py-1 text-[11px] font-bold text-brand-950">
          <Star className="h-3 w-3 fill-current" /> {course.status_display}
        </span>
        {onClose && (
          <button type="button" onClick={onClose} className="absolute bottom-4 right-5 rounded-full bg-white/90 p-2 text-slate-600 shadow hover:bg-white" aria-label="Close">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      <div className="space-y-5 p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-brand-700">/Courses/{course.slug}</span>
          <span className="rounded-full bg-lime-soft px-3 py-1 text-[11px] font-bold text-lime-ink">Starts {formatDate(course.start_date)}</span>
        </div>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-bold text-slate-900">{course.title}</h2>
            <p className="mt-1 text-xs text-slate-500">
              {course.duration_weeks} weeks • {course.level_display} • {course.mode_display} • {course.total_modules} modules
            </p>
          </div>
          <p className="font-display text-2xl font-bold text-slate-900">{formatCurrency(course.fee)}</p>
        </div>
        <p className="text-sm leading-relaxed text-slate-600">{course.description || course.short_description}</p>

        <div className="flex items-center justify-between gap-3 rounded-2xl bg-brand-50 p-4">
          <div className="flex items-center gap-3">
            <Avatar name={mentorInitials} src={course.faculty?.photo} size="lg" />
            <div>
              <p className="text-[11px] font-semibold text-brand-700">Assigned Faculty Mentor</p>
              <p className="font-semibold text-slate-900">{course.faculty?.full_name ?? 'To be announced'}</p>
              <p className="text-[11px] text-slate-500">{course.faculty?.designation || course.faculty?.expertise || 'ABC Academy Faculty'}</p>
            </div>
          </div>
          <span className="hidden items-center gap-1.5 rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-brand-700 sm:inline-flex">
            <span className="h-2 w-2 rounded-full bg-emerald-500" /> {course.mode === 'OFFLINE' ? 'Classroom Mentorship' : 'Live Mentorship'}
          </span>
        </div>

        <div>
          <h3 className="mb-3 font-display text-base font-semibold text-slate-900">Week-By-Week Syllabus Modules</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {buildSyllabus(course).map((block, index) => (
              <div key={block.weeks} className="flex items-start gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-700 text-xs font-bold text-white">{index + 1}</span>
                <p className="text-sm text-slate-700">
                  <span className="font-semibold">{block.weeks}:</span> {block.modules}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="navy-panel rounded-2xl p-5 text-white">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs font-semibold text-sun-300">Linear Regression Evaluation Weights</p>
            <span className="rounded-full bg-white/10 px-3 py-1 text-[11px]">Target: Final_Score (/100)</span>
          </div>
          <p className="mt-2 text-sm text-white/85">Your weekly engagement feeds directly into EDU-PREDICT's supervised Linear Regression model to forecast your final score:</p>
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {WEIGHTS.map((item) => (
              <div key={item.label} className="rounded-xl border border-white/15 bg-white/5 px-2 py-2 text-center">
                <p className="text-[11px] text-white/70">{item.label}</p>
                <p className="text-xs font-semibold text-lime-brand">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        {existing ? (
          <div className="flex items-center gap-2 rounded-2xl bg-lime-soft px-4 py-3 text-sm font-semibold text-lime-ink">
            <CheckCircle2 className="h-5 w-5" /> You are enrolled · {existing.status_display}
          </div>
        ) : enrol.isSuccess ? (
          <div className="flex items-center gap-2 rounded-2xl bg-lime-soft px-4 py-3 text-sm font-semibold text-lime-ink">
            <CheckCircle2 className="h-5 w-5" /> {enrol.data.message}
          </div>
        ) : null}
        {enrol.isError && <p className="text-xs font-semibold text-rose-600">{getErrorMessage(enrol.error)}</p>}

        <div className="flex gap-3">
          <Button size="lg" className="flex-1" onClick={onEnrol} loading={enrol.isPending} disabled={Boolean(existing) || enrol.isSuccess || (isAuthenticated && !isStudent)}>
            {isAuthenticated && !isStudent ? 'Only students can enrol' : existing || enrol.isSuccess ? 'Enrolled' : 'Enrol in Course'}
          </Button>
          {onClose && (
            <Button size="lg" variant="outline" onClick={onClose}>
              Close
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export const CoursePreviewModal = () => {
  const dispatch = useAppDispatch();
  const slug = useAppSelector(selectCoursePreview);
  const course = useCourse(slug);
  const close = () => dispatch(coursePreviewClosed());

  useEffect(() => {
    if (!slug) return;
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && dispatch(coursePreviewClosed());
    document.addEventListener('keydown', onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previous;
    };
  }, [slug, dispatch]);

  if (!slug) return null;
  return createPortal(
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 p-4 backdrop-blur-sm sm:p-8" role="dialog" aria-modal="true" onClick={close}>
      <div className="mx-auto max-w-2xl animate-toast-in" onClick={(event) => event.stopPropagation()}>
        {course.isPending ? (
          <div className="rounded-3xl bg-white p-16">
            <Spinner label="Loading course…" />
          </div>
        ) : course.isError ? (
          <div className="rounded-3xl bg-white p-10 text-center text-sm text-rose-600">{getErrorMessage(course.error)}</div>
        ) : (
          <CourseDetailBody course={course.data} onClose={close} />
        )}
      </div>
    </div>,
    document.body,
  );
};
