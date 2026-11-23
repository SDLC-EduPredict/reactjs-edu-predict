import { useState, type FormEvent } from 'react';
import { ExternalLink, FileText, Paperclip, Send } from 'lucide-react';
import { Button, Card, EmptyState, Input, Modal, PageHeader, StatusBadge, Tabs, Textarea } from '@/components/ui';
import { fmtScore, Kpi } from '@/components/domain/Metric';
import { QueryView } from '@/components/domain/QueryView';
import { useDocumentTitle } from '@/lib/hooks/useDocumentTitle';
import { formatDate, resolveMediaUrl } from '@/lib/utils/format';
import { useMyAssignments, useSubmitAssignment } from '../hooks/useAssignments';
import type { StudentAssignmentItem } from '../types';

const SubmitModal = ({ assignment, onClose }: { assignment: StudentAssignmentItem | null; onClose: () => void }) => {
  const submit = useSubmitAssignment();
  const [text, setText] = useState('');
  const [link, setLink] = useState('');
  const [file, setFile] = useState<File | null>(null);
  if (!assignment) return null;

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    submit.mutate({ assignmentId: assignment.id, submission_text: text, submission_link: link, submission_file: file }, { onSuccess: onClose });
  };

  return (
    <Modal
      open
      onClose={onClose}
      title={`Submit: ${assignment.title}`}
      description={`Due ${formatDate(assignment.due_date, true)} · ${assignment.max_marks} marks`}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="submit-assignment" loading={submit.isPending} icon={<Send className="h-4 w-4" />} disabled={!text && !link && !file}>
            Submit
          </Button>
        </>
      }
    >
      <form id="submit-assignment" onSubmit={onSubmit} className="space-y-4">
        <p className="text-sm text-slate-600">{assignment.description}</p>
        <Textarea label="Answer / notes" rows={5} value={text} onChange={(event) => setText(event.target.value)} />
        <Input label="Repository or document link" type="url" placeholder="https://github.com/…" value={link} onChange={(event) => setLink(event.target.value)} />
        <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-dashed border-slate-300 p-4 text-sm text-slate-600 hover:border-brand-400">
          <Paperclip className="h-4 w-4 text-brand-700" />
          <span className="flex-1 truncate">{file ? file.name : 'Attach a file (PDF, ZIP, DOCX…)'}</span>
          <input type="file" className="hidden" onChange={(event) => setFile(event.target.files?.[0] ?? null)} />
        </label>
        <p className="text-[11px] text-slate-400">Provide at least one of: text, link or file. Resubmitting replaces your previous submission until it is graded.</p>
      </form>
    </Modal>
  );
};

const StudentAssignmentsPage = () => {
  useDocumentTitle('My Assignments');
  const assignments = useMyAssignments();
  const [active, setActive] = useState('');
  const [submitting, setSubmitting] = useState<StudentAssignmentItem | null>(null);

  return (
    <>
      <PageHeader eyebrow="Learning" title="Assignments" description="Submit work, track grading and read mentor feedback." />
      <QueryView query={assignments}>
        {(courses) => {
          if (courses.length === 0) return <EmptyState title="No assignments yet" description="Assignments from your courses will appear here." />;
          const current = courses.find((item) => String(item.enrolment_id) === active) ?? courses[0];
          const s = current.summary;
          return (
            <div className="space-y-6">
              <Tabs tabs={courses.map((item) => ({ value: String(item.enrolment_id), label: item.course.title, count: item.summary.not_submitted }))} value={String(current.enrolment_id)} onChange={setActive} />
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <Kpi label="Total" value={s.total_assignments} tone="navy" icon={<FileText className="h-4 w-4" />} />
                <Kpi label="Submitted" value={s.submitted} tone="lavender" />
                <Kpi label="Graded" value={s.graded} tone="lime" />
                <Kpi label="Average" value={fmtScore(s.assignment_average)} tone="sun" hint={`${s.not_submitted} not submitted`} />
              </div>
              <div className="grid gap-4 lg:grid-cols-2">
                {current.assignments.length === 0 && <EmptyState className="lg:col-span-2" title="No assignments in this course" />}
                {current.assignments.map((item) => {
                  const sub = item.my_submission;
                  const overdue = !sub?.submitted_at && new Date(item.due_date) < new Date();
                  return (
                    <Card key={item.id} className="flex flex-col p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-semibold text-slate-900">{item.title}</h3>
                          <p className="mt-0.5 text-[11px] text-slate-500">
                            Due {formatDate(item.due_date, true)} · {item.max_marks} marks
                          </p>
                        </div>
                        <StatusBadge status={overdue && item.my_status === 'PENDING' ? 'OVERDUE' : item.my_status} />
                      </div>
                      <p className="mt-3 line-clamp-3 flex-1 text-sm text-slate-600">{item.description}</p>
                      {sub && (sub.submitted_at || sub.marks !== null) && (
                        <div className="mt-4 space-y-2 rounded-2xl bg-slate-50 p-3 text-xs">
                          {sub.submitted_at && (
                            <p className="text-slate-500">
                              Submitted {formatDate(sub.submitted_at, true)} {sub.is_late && <span className="font-semibold text-rose-600">(late)</span>}
                            </p>
                          )}
                          <div className="flex flex-wrap gap-3">
                            {sub.submission_link && (
                              <a href={sub.submission_link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-semibold text-brand-700">
                                <ExternalLink className="h-3.5 w-3.5" /> Link
                              </a>
                            )}
                            {sub.submission_file && (
                              <a href={resolveMediaUrl(sub.submission_file) ?? '#'} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-semibold text-brand-700">
                                <Paperclip className="h-3.5 w-3.5" /> File
                              </a>
                            )}
                          </div>
                          {sub.marks !== null && (
                            <p className="font-semibold text-slate-900">
                              Grade: {sub.marks}/{item.max_marks} <span className="text-lime-ink">({fmtScore(sub.percentage)}%)</span>
                            </p>
                          )}
                          {sub.feedback && <p className="text-slate-600">“{sub.feedback}”</p>}
                        </div>
                      )}
                      {item.my_status !== 'GRADED' && (
                        <Button className="mt-4" size="sm" variant={sub?.submitted_at ? 'outline' : 'primary'} onClick={() => setSubmitting(item)}>
                          {sub?.submitted_at ? 'Resubmit' : 'Submit assignment'}
                        </Button>
                      )}
                    </Card>
                  );
                })}
              </div>
            </div>
          );
        }}
      </QueryView>
      <SubmitModal key={submitting?.id ?? 'none'} assignment={submitting} onClose={() => setSubmitting(null)} />
    </>
  );
};

export default StudentAssignmentsPage;
