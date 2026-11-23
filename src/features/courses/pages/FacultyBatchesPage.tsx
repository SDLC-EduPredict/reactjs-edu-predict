import { useState } from 'react';
import { BookOpen, CheckCircle2, Circle, RotateCcw, Users } from 'lucide-react';
import { Badge, Button, Card, CardBody, CardHeader, DataTable, EmptyState, PageHeader, ProgressBar, Skeleton } from '@/components/ui';
import { CourseArt } from '@/components/domain/CourseArt';
import { IndicatorBadge } from '@/components/domain/IndicatorBadge';
import { fmtPct, fmtScore } from '@/components/domain/Metric';
import { QueryView } from '@/components/domain/QueryView';
import { useAppDispatch } from '@/app/store/hooks';
import { toastAdded } from '@/app/store/slices/uiSlice';
import { useDocumentTitle } from '@/lib/hooks/useDocumentTitle';
import { cn } from '@/lib/utils/cn';
import { useFacultyDashboard } from '@/features/analytics/hooks/useAnalytics';
import { usePerformanceSummary, useUpdatePerformance } from '@/features/performance/hooks/usePerformance';
import { useCourse } from '../hooks/useCourses';

const BatchModules = ({ courseId }: { courseId: number }) => {
  const dispatch = useAppDispatch();
  const course = useCourse(courseId);
  const summary = usePerformanceSummary(courseId);
  const update = useUpdatePerformance(true);
  const [saving, setSaving] = useState<number | null>(null);

  const students = summary.data?.students ?? [];
  const taught = students.reduce((max, row) => Math.max(max, row.modules_completed ?? 0), 0);
  const total = course.data?.total_modules ?? students[0]?.total_modules ?? 0;
  const weeks = course.data?.duration_weeks ?? 0;

  const setTaught = async (modules: number) => {
    setSaving(modules);
    try {
      await Promise.all(students.map((row) => update.mutateAsync({ id: row.id, modules_completed: modules })));
      dispatch(toastAdded({ type: 'success', title: 'Batch progress updated', message: `${modules} of ${total} modules marked as taught for ${students.length} students.` }));
    } catch {
      dispatch(toastAdded({ type: 'error', title: 'Could not update every student', message: 'Please retry — some records may not have saved.' }));
    } finally {
      setSaving(null);
    }
  };

  if (course.isPending || summary.isPending) return <Skeleton className="h-96 w-full rounded-3xl" />;

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <div className="grid gap-0 md:grid-cols-[260px_1fr]">
          <div className="aspect-[16/10] md:aspect-auto">
            <CourseArt title={course.data?.title ?? ''} category={course.data?.category.name} thumbnail={course.data?.thumbnail} />
          </div>
          <div className="p-6">
            <p className="text-xs font-semibold text-brand-700">{course.data?.category.name}</p>
            <h2 className="mt-1 font-display text-xl font-semibold text-slate-900">{course.data?.title}</h2>
            <p className="mt-1 line-clamp-2 text-sm text-slate-500">{course.data?.short_description}</p>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { label: 'Students', value: summary.data?.summary.students ?? 0 },
                { label: 'Attendance', value: fmtPct(summary.data?.summary.attendance_percentage) },
                { label: 'Performance', value: fmtScore(summary.data?.summary.overall_score) },
                { label: 'Modules taught', value: `${taught}/${total}` },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl bg-slate-50 p-3">
                  <p className="text-[11px] text-slate-500">{item.label}</p>
                  <p className="font-display text-lg font-bold text-slate-900">{item.value}</p>
                </div>
              ))}
            </div>
            <ProgressBar className="mt-4" value={total ? (taught / total) * 100 : 0} tone="green" />
          </div>
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[1fr_1.2fr]">
        <Card>
          <CardHeader title="Syllabus modules" description="Marking a module as taught updates modules completed for every student in the batch." />
          <CardBody className="space-y-2">
            {total === 0 && <EmptyState title="No modules defined" description="Ask an administrator to set total modules for this course." />}
            {Array.from({ length: total }, (_, index) => {
              const number = index + 1;
              const isTaught = number <= taught;
              const isNext = number === taught + 1;
              const week = weeks ? Math.max(1, Math.ceil((number / total) * weeks)) : null;
              return (
                <div key={number} className={cn('flex items-center gap-3 rounded-2xl border p-3', isTaught ? 'border-lime-brand/40 bg-lime-soft/40' : 'border-slate-100')}>
                  {isTaught ? <CheckCircle2 className="h-5 w-5 text-lime-ink" /> : <Circle className="h-5 w-5 text-slate-300" />}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-900">Module {number}</p>
                    {week && <p className="text-[11px] text-slate-500">Planned for week {week}</p>}
                  </div>
                  <Badge tone={isTaught ? 'lime' : 'violet'}>{isTaught ? 'Taught' : 'Upcoming'}</Badge>
                  {isNext && (
                    <Button size="sm" loading={saving === number} disabled={!students.length || saving !== null} onClick={() => void setTaught(number)}>
                      Mark taught
                    </Button>
                  )}
                  {isTaught && number === taught && (
                    <button type="button" className="rounded-lg p-1.5 text-slate-400 hover:bg-white hover:text-slate-700" aria-label="Undo" disabled={saving !== null} onClick={() => void setTaught(number - 1)}>
                      <RotateCcw className="h-4 w-4" />
                    </button>
                  )}
                </div>
              );
            })}
          </CardBody>
        </Card>
        <Card>
          <CardHeader icon={<Users className="h-4 w-4" />} title="Batch roster" description={`${students.length} students`} />
          <DataTable
            rows={students}
            rowKey={(row) => row.id}
            emptyTitle="No students enrolled yet"
            columns={[
              {
                key: 'student',
                header: 'Student',
                render: (row) => (
                  <div>
                    <p className="font-semibold text-slate-900">{row.student.full_name}</p>
                    <p className="text-[11px] text-slate-500">{row.student.student_code}</p>
                  </div>
                ),
              },
              { key: 'att', header: 'Attendance', render: (row) => fmtPct(row.attendance_percentage) },
              { key: 'mod', header: 'Modules', render: (row) => `${row.modules_completed ?? 0}/${row.total_modules}` },
              { key: 'score', header: 'Score', render: (row) => fmtScore(row.overall_score) },
              { key: 'ind', header: 'Standing', render: (row) => <IndicatorBadge indicator={row.indicator} label={row.indicator_display} /> },
            ]}
          />
        </Card>
      </div>
    </div>
  );
};

const FacultyBatchesPage = () => {
  useDocumentTitle('My Batches');
  const dashboard = useFacultyDashboard();
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <>
      <PageHeader eyebrow="Faculty Workspace" title="My Batches" description="Track syllabus coverage and batch health for every course you teach." />
      <QueryView query={dashboard}>
        {(data) => {
          if (data.courses.length === 0) return <EmptyState icon={<BookOpen className="h-6 w-6" />} title="No batches assigned" description="An administrator assigns courses to faculty members." />;
          const current = selected ?? data.courses[0].id;
          return (
            <div className="space-y-6">
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {data.courses.map((course) => (
                  <button
                    key={course.id}
                    type="button"
                    onClick={() => setSelected(course.id)}
                    className={cn(
                      'rounded-2xl p-4 text-left ring-1 transition',
                      course.id === current ? 'bg-brand-700 text-white shadow-lg ring-brand-700' : 'bg-white text-slate-700 ring-slate-200 hover:ring-brand-300',
                    )}
                  >
                    <p className="truncate text-sm font-semibold">{course.title}</p>
                    <p className={cn('mt-1 text-[11px]', course.id === current ? 'text-white/70' : 'text-slate-500')}>
                      {course.students} students · {fmtPct(course.average_attendance)} attendance
                    </p>
                  </button>
                ))}
              </div>
              <BatchModules key={current} courseId={current} />
            </div>
          );
        }}
      </QueryView>
    </>
  );
};

export default FacultyBatchesPage;
