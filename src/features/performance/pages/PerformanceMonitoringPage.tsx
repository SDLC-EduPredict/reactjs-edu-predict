import { useState } from 'react';
import { Card, Modal, PageHeader, Pagination, SearchInput, Select } from '@/components/ui';
import { getErrorMessage } from '@/lib/api/apiError';
import { useDocumentTitle } from '@/lib/hooks/useDocumentTitle';
import { useListFilter } from '@/lib/hooks/useListFilter';
import { useCourseOptions } from '@/features/courses/hooks/useCourses';
import { INDICATOR_OPTIONS } from '../constants';
import { MonitoredStudentsTable } from '../components/MonitoredStudentsTable';
import { StudentReportPanel } from '../components/StudentReportPanel';
import { useMonitoredStudents } from '../hooks/usePerformance';
import type { MonitoredStudent } from '../types';

const LIST_KEY = 'performance-monitoring';

export const PerformanceMonitoringPage = () => {
  useDocumentTitle('Performance monitoring');
  const list = useListFilter(LIST_KEY);
  const students = useMonitoredStudents(list.params);
  const courseOptions = useCourseOptions();
  const [selected, setSelected] = useState<MonitoredStudent | null>(null);

  return (
    <div>
      <PageHeader eyebrow="Analytics" title="Performance monitoring" description="One row per enrolment with live performance indicators, prediction and attention flags. Click a row for the full report." />
      <Card>
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 md:flex-row md:items-center">
          <SearchInput value={list.search} onChange={list.setSearch} placeholder="Search students…" />
          <Select aria-label="Course" containerClassName="md:w-56" value={list.filters.course ?? ''} onChange={(event) => list.setFilter('course', event.target.value)} placeholder="All courses" options={courseOptions.options} />
          <Select aria-label="Indicator" containerClassName="md:w-48" value={list.filters.indicator ?? ''} onChange={(event) => list.setFilter('indicator', event.target.value)} placeholder="All indicators" options={INDICATOR_OPTIONS} />
        </div>
        <MonitoredStudentsTable
          rows={students.data?.rows}
          loading={students.isPending}
          error={students.isError ? getErrorMessage(students.error) : null}
          onRetry={() => students.refetch()}
          onSelect={setSelected}
        />
        {students.data && <Pagination page={list.page} pageSize={list.pageSize} count={students.data.count} onPageChange={list.setPage} />}
      </Card>
      <Modal open={selected !== null} onClose={() => setSelected(null)} size="lg" title="Student academic report">
        {selected && <StudentReportPanel studentId={selected.student.id} />}
      </Modal>
    </div>
  );
};

export default PerformanceMonitoringPage;
