import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Check, X } from 'lucide-react';
import { env } from '@/config/env';
import { Avatar, Button, Spinner } from '@/components/ui';
import { useAppDispatch } from '@/app/store/hooks';
import { getErrorMessage } from '@/lib/api/apiError';
import { coursePreviewOpened } from '@/features/courses/store/catalogSlice';
import { usePublicFacultyMember } from '../hooks/useFaculty';

export const FacultyProfileModal = ({ facultyId, onClose }: { facultyId: string | null; onClose: () => void }) => {
  const dispatch = useAppDispatch();
  const detail = usePublicFacultyMember(facultyId);
  const [requested, setRequested] = useState(false);

  if (!facultyId) return null;
  const close = () => {
    setRequested(false);
    onClose();
  };

  const requestSession = () => {
    const name = detail.data?.faculty.full_name ?? 'faculty';
    window.open(`mailto:${env.contactEmail}?subject=${encodeURIComponent(`Academic guidance session with ${name}`)}`, '_self');
    setRequested(true);
  };

  return createPortal(
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 p-4 backdrop-blur-sm sm:p-8" role="dialog" aria-modal="true" onClick={close}>
      <div className="mx-auto max-w-2xl animate-modal-in overflow-hidden rounded-3xl bg-white" onClick={(event) => event.stopPropagation()}>
        {detail.isPending ? (
          <div className="p-16">
            <Spinner label="Loading profile…" />
          </div>
        ) : detail.isError ? (
          <div className="p-10 text-center text-sm text-rose-600">{getErrorMessage(detail.error)}</div>
        ) : (
          <>
            <div className="relative flex flex-col gap-5 bg-brand-50 p-6 sm:flex-row sm:items-center sm:p-8">
              <Avatar name={detail.data.faculty.full_name} src={detail.data.faculty.photo} size="xl" className="h-24 w-24 rounded-2xl text-2xl" />
              <div>
                <div className="flex flex-wrap gap-2">
                  {detail.data.faculty.expertise && (
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-brand-700">{detail.data.faculty.expertise.split(',')[0]}</span>
                  )}
                  <span className="rounded-full bg-sun-300 px-3 py-1 text-xs font-semibold text-brand-900">
                    {detail.data.faculty.course_count} course{detail.data.faculty.course_count === 1 ? '' : 's'}
                  </span>
                </div>
                <h2 className="mt-2 font-display text-2xl font-bold text-slate-900">{detail.data.faculty.full_name}</h2>
                <p className="text-sm font-semibold text-brand-700">{detail.data.faculty.designation || 'Faculty Member'}</p>
                <p className="text-xs text-slate-500">{detail.data.faculty.expertise}</p>
              </div>
              <button type="button" onClick={close} className="absolute right-5 top-5 rounded-full bg-white/70 p-2 text-slate-600 hover:bg-white" aria-label="Close">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-5 p-6 sm:p-8">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Industry Background & Biography</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{detail.data.faculty.bio || 'Biography will be published soon.'}</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Assigned Courses</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {detail.data.courses.length === 0 && <span className="text-xs text-slate-400">No courses assigned yet.</span>}
                  {detail.data.courses.map((course) => (
                    <button
                      key={course.id}
                      type="button"
                      onClick={() => {
                        close();
                        dispatch(coursePreviewOpened(course.slug));
                      }}
                      className="rounded-full bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700 hover:bg-brand-100"
                    >
                      {course.title}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold text-brand-700">Teaching Formats</p>
                  <p className="mt-2 text-sm text-slate-700">{[...new Set(detail.data.courses.map((course) => course.mode_display))].join(' • ') || '—'}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold text-brand-700">ML Advisory Focus</p>
                  <p className="mt-2 text-sm text-slate-700">{detail.data.faculty.expertise || 'Academic performance mentoring'}</p>
                </div>
              </div>
              <div className="flex gap-3">
                {requested ? (
                  <Button variant="lime" size="lg" className="flex-1" icon={<Check className="h-4 w-4" />} onClick={requestSession}>
                    Session Requested
                  </Button>
                ) : (
                  <Button size="lg" className="flex-1" onClick={requestSession}>
                    Request Academic Guidance Session
                  </Button>
                )}
                <Button size="lg" variant="outline" onClick={close}>
                  Close
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>,
    document.body,
  );
};
