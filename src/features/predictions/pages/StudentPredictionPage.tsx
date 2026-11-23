import { useState } from 'react';
import { Info } from 'lucide-react';
import { Alert, EmptyState, PageHeader, Select } from '@/components/ui';
import { QueryView } from '@/components/domain/QueryView';
import { useDocumentTitle } from '@/lib/hooks/useDocumentTitle';
import { useMyCourses } from '@/features/enrolments/hooks/useEnrolments';
import { PredictionCard } from '../components/PredictionCard';
import { useMyPredictions } from '../hooks/usePredictions';

const StudentPredictionPage = () => {
  useDocumentTitle('ML Score Predictor');
  const [course, setCourse] = useState('');
  const courses = useMyCourses();
  const predictions = useMyPredictions(course ? Number(course) : undefined);

  return (
    <>
      <PageHeader
        eyebrow="Intelligence"
        title="ML Score Predictor"
        description="Your predicted final score per course, calculated by the active Linear Regression model."
        actions={
          <Select
            aria-label="Course"
            containerClassName="w-60"
            value={course}
            onChange={(event) => setCourse(event.target.value)}
            placeholder="All my courses"
            options={(courses.data ?? []).map((item) => ({ value: item.course.id, label: item.course.title }))}
          />
        }
      />
      <QueryView query={predictions}>
        {(data) => (
          <div className="space-y-6">
            {data.note && (
              <Alert tone="info" title="How this works">
                <span className="flex gap-2">
                  <Info className="mt-0.5 h-4 w-4 shrink-0" /> {data.note}
                </span>
              </Alert>
            )}
            {data.courses.length === 0 ? (
              <EmptyState title="No predictions yet" description="Predictions appear once you are enrolled and some academic data is recorded." />
            ) : (
              <div className="grid gap-6 xl:grid-cols-2">
                {data.courses.map((item) => (
                  <PredictionCard key={item.enrolment_id} item={item} />
                ))}
              </div>
            )}
          </div>
        )}
      </QueryView>
    </>
  );
};

export default StudentPredictionPage;
