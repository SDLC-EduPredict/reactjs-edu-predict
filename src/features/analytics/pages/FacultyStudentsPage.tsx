import { useState } from 'react';
import { Mail } from 'lucide-react';
import { Avatar, Card, CardBody, CardHeader, DataTable, Modal, PageHeader, Pagination, SearchInput, Select, Skeleton, StatusBadge } from '@/components/ui';
import { IndicatorBadge } from '@/components/domain/IndicatorBadge';
import { fmtPct, fmtScore, Meter } from '@/components/domain/Metric';
import { QueryView } from '@/components/domain/QueryView';
import { StaffCourseSelect } from '@/components/domain/StaffCourseSelect';
import { useDocumentTitle } from '@/lib/hooks/useDocumentTitle';
import { useListFilter } from '@/lib/hooks/useListFilter';
import { humanize, resolveMediaUrl } from '@/lib/utils/format';
import { INDICATORS } from '@/types';
import { useFacultyStudent, useFacultyStudents } from '../hooks/useAnalytics';

export const StudentInsightModal = ({ studentId, onClose }: { studentId: number | null; onClose: () => void }) => {
  const detail = useFacultyStudent(studentId);
  return (
    <Modal open={studentId !== null} onClose={onClose} title={detail.data?.profile.user.full_name ?? 'Student'} description={detail.data?.profile.student_code} size="xl">
      <QueryView query={detail} loading={<Skeleton className="h-72 w-full" />}>
        {({ profile, overall, courses }) => (
          <div className="space-y-5">
            <div className="flex flex-col gap-4 rounded-3xl bg-brand-50 p-5 sm:flex-row sm:items-center">
              <Avatar name={profile.user.full_name} src={resolveMediaUrl(profile.photo)} size="xl" />
              <div className="flex-1">
                <p className="font-display text-lg font-semibold text-slate-900">{profile.user.full_name}</p>
                <p className="flex items-center gap-1 text-xs text-slate-500">
                  <Mail className="h-3.5 w-3.5" /> {profile.user.email} · {profile.user.phone || 'No phone'}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {profile.highest_qualification || 'Qualification not set'} · {profile.city || 'City not set'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[11px] text-slate-500">Overall score</p>
                <p className="font-display text-3xl font-bold text-brand-700">{fmtScore(overall.overall_score)}</p>
                <IndicatorBadge indicator={overall.indicator} label={overall.indicator_display} />
              </div>
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              {courses.map((enrolment) => (
                <Card key={enrolment.id}>
                  <CardHeader title={enrolment.course.title} description={`Enrolled ${enrolment.enrolled_on}`} action={<StatusBadge status={enrolment.status} label={enrolment.status_display} />} />
                  <CardBody className="space-y-3">
                    <Meter label="Attendance" value={enrolment.performance?.attendance_percentage} suffix="%" />
                    <Meter label="Assignments" value={enrolment.performance?.assignment_average} />
                    <Meter label="Mock tests" value={enrolment.performance?.mock_test_average} />
                    <Meter label="Modules completed" value={enrolment.performance?.modules_completed_percentage} suffix="%" />
                    <div className="flex items-center justify-between rounded-2xl bg-slate-900 p-3 text-white">
                      <span className="text-xs text-white/70">ML predicted final</span>
                      <span className="flex items-center gap-2">
                        <span className="font-display text-xl font-bold text-sun-300">{fmtScore(enrolment.prediction?.predicted_final_score)}</span>
                        {enrolment.prediction && <IndicatorBadge indicator={enrolment.prediction.indicator} label={enrolment.prediction.indicator_display} />}
                      </span>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          </div>
        )}
      </QueryView>
    </Modal>
  );
};

const FacultyStudentsPage = () => {
  useDocumentTitle('My Students');
  const list = useListFilter('faculty-students');
  const students = useFacultyStudents({ ...list.params, course: list.filters.course || undefined, indicator: list.filters.indicator || undefined });
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <>
      <PageHeader eyebrow="Faculty Workspace" title="My Students" description="Every learner across your batches, ranked by academic risk." />
      <Card className="overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 md:flex-row">
          <SearchInput value={list.search} onChange={list.setSearch} placeholder="Search students…" className="flex-1" />
          <StaffCourseSelect value={list.filters.course ?? ''} onChange={(value) => list.setFilter('course', value)} className="md:w-56" />
          <Select aria-label="Indicator" containerClassName="md:w-48" placeholder="All standings" value={list.filters.indicator ?? ''} onChange={(event) => list.setFilter('indicator', event.target.value)} options={INDICATORS.map((value) => ({ value, label: humanize(value) }))} />
        </div>
        <DataTable
          rows={students.data?.results}
          loading={students.isPending}
          rowKey={(row) => row.id}
          onRowClick={(row) => setSelected(row.student_id)}
          emptyTitle="No students match"
          columns={[
            {
              key: 'student',
              header: 'Student',
              render: (row) => (
                <div className="flex items-center gap-3">
                  <Avatar name={row.student_name} size="sm" />
                  <div>
                    <p className="font-semibold text-slate-900">{row.student_name}</p>
                    <p className="text-[11px] text-slate-500">{row.student_code}</p>
                  </div>
                </div>
              ),
            },
            { key: 'course', header: 'Course', render: (row) => row.course },
            { key: 'att', header: 'Attendance', render: (row) => <span className={(row.attendance_percentage ?? 100) < 75 ? 'font-semibold text-rose-600' : ''}>{fmtPct(row.attendance_percentage)}</span> },
            { key: 'asg', header: 'Assignments', render: (row) => fmtScore(row.assignment_average) },
            { key: 'mock', header: 'Mock tests', render: (row) => fmtScore(row.mock_test_average) },
            { key: 'pred', header: 'Predicted', render: (row) => <span className="font-display font-bold text-brand-700">{fmtScore(row.predicted_final_score)}</span> },
            { key: 'ind', header: 'Standing', render: (row) => <IndicatorBadge indicator={row.prediction_indicator ?? row.indicator} /> },
            { key: 'why', header: 'Signals', render: (row) => <span className="line-clamp-1 max-w-48 text-[11px] text-slate-500">{row.reasons.join(', ') || '—'}</span> },
          ]}
        />
        <Pagination page={list.page} pageSize={list.pageSize} count={students.data?.count ?? 0} onPageChange={list.setPage} />
      </Card>
      <StudentInsightModal studentId={selected} onClose={() => setSelected(null)} />
    </>
  );
};

export default FacultyStudentsPage;
