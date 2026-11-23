import { useState } from 'react';
import { CalendarDays, ChevronRight, Clock3, Layers } from 'lucide-react';
import { ButtonLink, Button, EmptyState, Modal, PageHeader, ProgressBar, Skeleton, StatusBadge } from '@/components/ui';
import { CourseArt } from '@/components/domain/CourseArt';
import { fmtPct, fmtScore } from '@/components/domain/Metric';
import { QueryView } from '@/components/domain/QueryView';
import { PATHS } from '@/app/router/paths';
import { useAppDispatch } from '@/app/store/hooks';
import { useDocumentTitle } from '@/lib/hooks/useDocumentTitle';
import { formatDate } from '@/lib/utils/format';
import { coursePreviewOpened } from '@/features/courses/store/catalogSlice';
import { useMyCourse, useMyCourses } from '../hooks/useEnrolments';

const EnrolmentDetailModal = ({ id, onClose }: { id: number | null; onClose: () => void }) => {
  const detail = useMyCourse(id);
  const dispatch = useAppDispatch();
  return (
    <Modal open={id !== null} onClose={onClose} title={detail.data?.course.title ?? 'Course details'} description="Your enrolment, schedule and progress" size="lg">
      <QueryView query={detail} loading={<Skeleton className="h-60 w-full" />}>
        {(enrolment) => (
          <div className="space-y-5">
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { label: 'Enrolled on', value: formatDate(enrolment.enrolled_on) },
                { label: 'Starts', value: formatDate(enrolment.start_date) },
                { label: 'Ends', value: formatDate(enrolment.end_date) },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl bg-slate-50 p-3">
                  <p className="text-[11px] text-slate-500">{item.label}</p>
                  <p className="text-sm font-semibold text-slate-900">{item.value}</p>
                </div>
              ))}
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-brand-50 p-4">
                <p className="text-xs font-semibold text-brand-700">Attendance</p>
                <p className="mt-1 font-display text-2xl font-bold text-slate-900">{fmtPct(enrolment.progress.attendance.attendance_percentage)}</p>
                <p className="text-[11px] text-slate-500">
                  {enrolment.progress.attendance.present} present · {enrolment.progress.attendance.late} late · {enrolment.progress.attendance.absent} absent
                </p>
              </div>
              <div className="rounded-2xl bg-sun-100 p-4">
                <p className="text-xs font-semibold text-amber-800">Assignments</p>
                <p className="mt-1 font-display text-2xl font-bold text-slate-900">{fmtScore(enrolment.progress.assignments.assignment_average)}</p>
                <p className="text-[11px] text-slate-500">
                  {enrolment.progress.assignments.graded} graded · {enrolment.progress.assignments.not_submitted} pending
                </p>
              </div>
              <div className="rounded-2xl bg-lime-soft p-4">
                <p className="text-xs font-semibold text-lime-ink">Assessments</p>
                <p className="mt-1 font-display text-2xl font-bold text-slate-900">{fmtScore(enrolment.progress.assessments.assessment_average)}</p>
                <p className="text-[11px] text-slate-500">
                  {enrolment.progress.assessments.passed}/{enrolment.progress.assessments.attempted} passed
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="secondary" onClick={() => dispatch(coursePreviewOpened(enrolment.course.slug))}>
                View syllabus
              </Button>
              <ButtonLink to={PATHS.student.assignments} variant="outline">
                Assignments
              </ButtonLink>
              <ButtonLink to={PATHS.student.prediction} variant="outline">
                Predicted score
              </ButtonLink>
            </div>
          </div>
        )}
      </QueryView>
    </Modal>
  );
};

const StudentCoursesPage = () => {
  useDocumentTitle('My Courses');
  const courses = useMyCourses();
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <>
      <PageHeader eyebrow="Learning" title="My Courses" description="Every course you are enrolled in, with live progress." actions={<ButtonLink to={PATHS.courses}>Enrol in a new course</ButtonLink>} />
      <QueryView query={courses} loading={<div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 3 }, (_, i) => <Skeleton key={i} className="h-80 rounded-3xl" />)}</div>}>
        {(list) =>
          list.length === 0 ? (
            <EmptyState title="No enrolments yet" description="Browse the catalogue and enrol in your first course." action={<ButtonLink to={PATHS.courses}>Browse courses</ButtonLink>} />
          ) : (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {list.map((enrolment) => {
                const att = enrolment.progress.attendance.attendance_percentage ?? 0;
                const asg = enrolment.progress.assignments;
                return (
                  <article key={enrolment.id} className="flex flex-col overflow-hidden rounded-3xl bg-white shadow-card ring-1 ring-black/5">
                    <div className="relative aspect-[16/8]">
                      <CourseArt title={enrolment.course.title} category={enrolment.course.category?.name} thumbnail={enrolment.course.thumbnail} />
                      <span className="absolute right-3 top-3">
                        <StatusBadge status={enrolment.status} label={enrolment.status_display} />
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <p className="text-[11px] font-semibold text-brand-700">{enrolment.course.category?.name}</p>
                      <h3 className="mt-1 font-display text-base font-semibold text-slate-900">{enrolment.course.title}</h3>
                      <div className="mt-3 flex flex-wrap gap-3 text-[11px] text-slate-500">
                        <span className="flex items-center gap-1">
                          <Clock3 className="h-3.5 w-3.5" /> {enrolment.course.duration_weeks} weeks
                        </span>
                        <span className="flex items-center gap-1">
                          <Layers className="h-3.5 w-3.5" /> {enrolment.course.total_modules} modules
                        </span>
                        <span className="flex items-center gap-1">
                          <CalendarDays className="h-3.5 w-3.5" /> {formatDate(enrolment.start_date)}
                        </span>
                      </div>
                      <div className="mt-4 space-y-3">
                        <div>
                          <div className="mb-1 flex justify-between text-[11px] text-slate-500">
                            <span>Attendance</span>
                            <span className="font-semibold text-slate-700">{fmtPct(att)}</span>
                          </div>
                          <ProgressBar value={att} tone={att >= 75 ? 'green' : 'amber'} />
                        </div>
                        <div>
                          <div className="mb-1 flex justify-between text-[11px] text-slate-500">
                            <span>Assignments</span>
                            <span className="font-semibold text-slate-700">
                              {asg.submitted}/{asg.total_assignments}
                            </span>
                          </div>
                          <ProgressBar value={asg.total_assignments ? (asg.submitted / asg.total_assignments) * 100 : 0} />
                        </div>
                      </div>
                      <Button className="mt-5" variant="secondary" fullWidth iconRight={<ChevronRight className="h-4 w-4" />} onClick={() => setSelected(enrolment.id)}>
                        Open course
                      </Button>
                    </div>
                  </article>
                );
              })}
            </div>
          )
        }
      </QueryView>
      <EnrolmentDetailModal id={selected} onClose={() => setSelected(null)} />
    </>
  );
};

export default StudentCoursesPage;
