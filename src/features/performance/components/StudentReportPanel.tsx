import { Spinner } from '@/components/ui';
import { getErrorMessage } from '@/lib/api/apiError';
import { formatNumber, formatPercent } from '@/lib/utils/format';
import { useStudentReport } from '../hooks/usePerformance';
import { IndicatorBadge } from './IndicatorBadge';

export const StudentReportPanel = ({ studentId }: { studentId: number }) => {
  const report = useStudentReport(studentId);
  if (report.isPending) return <Spinner className="py-10" />;
  if (report.isError) return <p className="text-sm text-rose-600">{getErrorMessage(report.error)}</p>;
  const { student, enrolments = [] } = report.data;
  return (
    <div className="space-y-5">
      <div>
        <p className="text-lg font-bold text-slate-900">{student.full_name}</p>
        <p className="text-xs text-slate-500">{[student.student_code, student.email, student.phone].filter(Boolean).join(' · ')}</p>
      </div>
      {enrolments.length === 0 && <p className="text-sm text-slate-500">No enrolments found.</p>}
      {enrolments.map((item) => (
        <div key={item.id} className="rounded-2xl border border-slate-200 p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="font-semibold text-slate-900">{item.course.title}</p>
            <IndicatorBadge indicator={item.prediction?.indicator ?? item.performance?.indicator} label={item.prediction?.indicator_display} />
          </div>
          <dl className="mt-3 grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
            {[
              ['Attendance', formatPercent(item.performance?.attendance_percentage, 0)],
              ['Assignments', formatNumber(item.performance?.assignment_average, 1)],
              ['Mock tests', formatNumber(item.performance?.mock_test_average, 1)],
              ['Predicted', formatNumber(item.prediction?.predicted_score, 1)],
            ].map(([label, value]) => (
              <div key={label} className="rounded-xl bg-slate-50 px-3 py-2">
                <dt className="text-slate-500">{label}</dt>
                <dd className="font-bold text-slate-900">{value}</dd>
              </div>
            ))}
          </dl>
          {item.reasons && item.reasons.length > 0 && (
            <ul className="mt-3 list-disc space-y-0.5 pl-4 text-xs text-amber-700">
              {item.reasons.map((reason) => (
                <li key={reason}>{reason}</li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
};
