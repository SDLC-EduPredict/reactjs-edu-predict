import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAppDispatch } from '@/app/store/hooks';
import { asList, isRecord } from '@/lib/api/normalize';
import { queryKeys } from '@/lib/query/queryKeys';
import { predictionsApi } from '../api/predictionsApi';
import { predictionReceived } from '../store/predictionSlice';
import type { Prediction } from '../types';

export interface StudentPredictionView {
  latest: Prediction | null;
  history: Prediction[];
}

const toPredictionView = (data: unknown): StudentPredictionView => {
  const history = asList<Prediction>(data, ['predictions', 'history']);
  const candidate = isRecord(data) ? (data.latest ?? data.prediction) : null;
  const latest = isRecord(candidate) ? (candidate as unknown as Prediction) : (history[0] ?? null);
  return { latest, history };
};

export const useStudentPrediction = (studentId: number | string | null | undefined) =>
  useQuery({
    queryKey: queryKeys.ml.prediction(studentId ?? ''),
    queryFn: () => predictionsApi.forStudent(studentId ?? ''),
    enabled: studentId !== null && studentId !== undefined && studentId !== '',
    select: (result) => toPredictionView(result.data),
  });

export const usePredict = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: predictionsApi.predict,
    meta: { successMessage: 'Prediction generated', errorTitle: 'Prediction failed' },
    onSuccess: (result, variables) => {
      dispatch(predictionReceived(result.data.prediction));
      if (variables.student_id) {
        return queryClient.invalidateQueries({ queryKey: queryKeys.ml.prediction(variables.student_id) });
      }
      return undefined;
    },
  });
};
