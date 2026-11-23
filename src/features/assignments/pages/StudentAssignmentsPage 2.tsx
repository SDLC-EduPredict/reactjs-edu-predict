import { useMemo, useState } from 'react';
import { CalendarClock, FileText, Send, Upload } from 'lucide-react';
import { Badge, Button, Card, CardBody, EmptyState, ErrorState, Modal, PageHeader, Skeleton, StatusBadge, Tabs, Textarea } from '@/components/ui';
import { getErrorMessage } from '@/lib/api/apiError';
import { useDocumentTitle } from '@/lib/hooks/useDocumentTitle';
import { formatDate, formatNumber } from '@/lib/utils/format';
import { useMyAssignments, useSubmitAssignment } from '../hooks/useAssignments';
import type { Assignment } from '../types';

type Filter = 'all' | 'pending' | 'submitted' | 'graded';

const statusOf = (assignment: Assignment): string => {
  const submission = assignment.my_submission;
  if (submission?.status) return submission.status;
  return new Date(assignment.due_date).getTime() < Date.now() ? 'OVERDUE' : 'PENDING';
};

export const StudentAssignmentsPage = () => {
  useDocumentTitle('Assignments');
  const assignments = useMyAssignments();
  const submit = useSubmitAssignment();
  const [filter, setFilter] = useState<Filter>('all');
  const [active, setActive] = useState<Assignment | null>(null);
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const grouped = useMemo(() => {
    const list = assignments.data ?? [];
    return {
      all: list,
      pending: list.filter((item) => ['PENDING', 'OVERDUE'].includes(statusOf(item))),
      submitted: list.filter((item) => ['SUBMITTED', 'LATE'].includes(statusOf(item))),
      graded: list.filter((item) => statusOf(item) === 'GRADED'),
    };
  }, [assignments.data]);

  const close = () => {
    setActive(null);
    setText('');
    setFile(null);
  };

  const onSubmit = () => {
    if (!active) return;
    submit.mutate({ assignmentId: active.id, submission_text: text, file }, { onSuccess: close });
  };

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Academics" title="Assignments" description="Submit your work before the due date and review faculty feedback." />
      <Tabs
        value={filter}
        onChange={setFilter}
        tabs={[
          { value: 'all', label: 'All', count: grouped.all.length },
          { value: 'pending', label: 'To do', count: grouped.pending.length },
          { value: 'submitted', label: 'Submitted', count: grouped.submitted.length },
          { value: 'graded', label: 'Graded', count: grouped.graded.length },
        ]}
      />
      {assignments.isError ? (
        <ErrorState message={getErrorMessage(assignments.error)} onRetry={() => assignments.refetch()} />
      ) : assignments.isPending ? (
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton key={index} className="h-40" />
          ))}
        </div>
      ) : grouped[filter].length === 0 ? (
        <Card>
          <EmptyState icon={<FileText className="h-6 w-6" />} title="Nothing here" description="Assignments from your enrolled courses appear here." />
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {grouped[filter].map((assignment) => {
            const status = statusOf(assignment);
            const submission = assignment.my_submission;
            return (
              <Card key={assignment.id}>
                <CardBody className="flex h-full flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-brand-600">{assignment.course.title}</p>
                      <h2 className="mt-0.5 text-sm font-bold text-slate-900">{assignment.title}</h2>
                    </div>
                    <StatusBadge status={status} label={submission?.status_display} />
                  </div>
                  <p className="mt-2 line-clamp-3 flex-1 text-xs text-slate-500">{assignment.description}</p>
                  <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <Badge tone="slate" icon={<CalendarClock className="h-3 w-3" />}>
                      Due {formatDate(assignment.due_date, true)}
                    </Badge>
                    <Badge tone="violet">Max {assignment.max_marks} marks</Badge>
                    {submission?.marks_obtained !== undefined && submission.marks_obtained !== null && (
                      <Badge tone="green">
                        Scored {formatNumber(submission.marks_obtained, 1)} / {assignment.max_marks}
                      </Badge>
                    )}
                  </div>
                  {submission?.feedback && <p className="mt-3 rounded-xl bg-brand-50/70 p-3 text-xs text-brand-900">“{submission.feedback}”</p>}
                  {['PENDING', 'OVERDUE'].includes(status) && (
                    <Button className="mt-4 self-start" size="sm" icon={<Send className="h-3.5 w-3.5" />} onClick={() => setActive(assignment)}>
                      Submit work
                    </Button>
                  )}
                </CardBody>
              </Card>
            );
          })}
        </div>
      )}

      <Modal
        open={active !== null}
        onClose={close}
        title={active ? `Submit: ${active.title}` : 'Submit assignment'}
        description={active ? `Due ${formatDate(active.due_date, true)}` : undefined}
        footer={
          <>
            <Button variant="outline" onClick={close}>
              Cancel
            </Button>
            <Button onClick={onSubmit} loading={submit.isPending} disabled={!text.trim() && !file}>
              Submit
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Textarea label="Your answer / notes" rows={6} value={text} onChange={(event) => setText(event.target.value)} />
          <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-slate-300 px-4 py-3 text-xs font-semibold text-slate-600 hover:border-brand-300">
            <Upload className="h-4 w-4" /> {file ? file.name : 'Attach a file (optional)'}
            <input type="file" className="sr-only" onChange={(event) => setFile(event.target.files?.[0] ?? null)} />
          </label>
        </div>
      </Modal>
    </div>
  );
};

export default StudentAssignmentsPage;
