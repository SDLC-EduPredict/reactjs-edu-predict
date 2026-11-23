import { useMemo } from 'react';
import { Zap } from 'lucide-react';
import { Button, Modal, Select } from '@/components/ui';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { formatCurrency } from '@/lib/utils/format';
import { useCategories, useCourses } from '../hooks/useCourses';
import { coursePreviewOpened, finderAnswerChanged, finderSubmitted, finderToggled, selectFinder } from '../store/catalogSlice';
import { COURSE_LEVELS, type Course } from '../types';

const HOURS = [
  { value: '2-4', label: '2–4 hours / week' },
  { value: '6-8', label: '6–8 hours / week' },
  { value: '10-12', label: '10–12 hours / week' },
  { value: '15+', label: '15+ hours / week' },
];

const LEVEL_RANK: Record<string, number> = { BEGINNER: 0, INTERMEDIATE: 1, ADVANCED: 2 };

const scoreCourse = (course: Course, goal: string, experience: string, hours: string) => {
  let score = 40;
  if (goal && course.category.slug === goal) score += 35;
  const gap = Math.abs((LEVEL_RANK[course.level] ?? 1) - (LEVEL_RANK[experience] ?? 0));
  score += gap === 0 ? 18 : gap === 1 ? 8 : 0;
  const intensive = hours === '10-12' || hours === '15+';
  if (intensive ? course.duration_weeks <= 12 : course.duration_weeks >= 8) score += 5;
  return Math.min(99, score);
};

export const CourseFinderModal = () => {
  const dispatch = useAppDispatch();
  const { finderOpen, finder, finderSubmitted: submitted } = useAppSelector(selectFinder);
  const categories = useCategories();
  const courses = useCourses({ page: 1, page_size: 100 });

  const match = useMemo(() => {
    const list = courses.data?.results ?? [];
    return list
      .map((course) => ({ course, fit: scoreCourse(course, finder.goal, finder.experience, finder.hours) }))
      .sort((a, b) => b.fit - a.fit)[0];
  }, [courses.data, finder]);

  const close = () => dispatch(finderToggled(false));

  return (
    <Modal open={finderOpen} onClose={close} title="Find Your Ideal Engineering Course" description="Tell us your goal, experience, and weekly study hours for a tailored ABC Academy recommendation.">
      <span className="mb-5 inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
        <Zap className="h-3.5 w-3.5 fill-sun-400 text-sun-400" /> 3-Step Course Finder
      </span>
      {submitted && match ? (
        <div className="rounded-2xl bg-brand-50 p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-brand-700">Recommended Match</p>
            <span className="rounded-full bg-lime-brand px-2.5 py-0.5 text-[11px] font-bold text-brand-950">{match.fit}% Fit</span>
          </div>
          <p className="mt-3 font-display text-lg font-bold text-slate-900">
            {match.course.title} ({formatCurrency(match.course.fee)})
          </p>
          <p className="mt-1 text-sm text-slate-600">{match.course.short_description}</p>
          <div className="mt-5 flex gap-3">
            <Button
              className="flex-1"
              onClick={() => {
                dispatch(finderToggled(false));
                dispatch(coursePreviewOpened(match.course.slug));
              }}
            >
              View Syllabus & Enrol
            </Button>
            <Button variant="outline" onClick={() => dispatch(finderSubmitted(false))}>
              Retake
            </Button>
          </div>
        </div>
      ) : submitted ? (
        <p className="rounded-2xl bg-slate-50 p-5 text-sm text-slate-600">No published courses are available yet. Please check back soon.</p>
      ) : (
        <div className="space-y-4">
          <Select
            label="Step 1: What is your primary career goal?"
            value={finder.goal}
            onChange={(event) => dispatch(finderAnswerChanged({ key: 'goal', value: event.target.value }))}
            placeholder="Any discipline"
            options={(categories.data ?? []).filter((item) => item.is_active).map((item) => ({ value: item.slug, label: item.name }))}
          />
          <Select
            label="Step 2: Your current programming experience?"
            value={finder.experience}
            onChange={(event) => dispatch(finderAnswerChanged({ key: 'experience', value: event.target.value }))}
            options={COURSE_LEVELS.map((level) => ({ value: level.value, label: `${level.label} learner` }))}
          />
          <Select
            label="Step 3: Weekly practice hours commitment?"
            value={finder.hours}
            onChange={(event) => dispatch(finderAnswerChanged({ key: 'hours', value: event.target.value }))}
            options={HOURS}
          />
          <Button fullWidth size="lg" loading={courses.isPending} onClick={() => dispatch(finderSubmitted(true))}>
            Get My Course Recommendation
          </Button>
        </div>
      )}
    </Modal>
  );
};
