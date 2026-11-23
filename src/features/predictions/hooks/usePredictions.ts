import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAppDispatch } from '@/app/store/hooks';
import { queryKeys } from '@/lib/query/queryKeys';
import type { QueryParams } from '@/types';
import { mlApi } from '../api/mlApi';
import { predictionReceived } from '../store/predictionSlice';
import type { PredictionListParams } from '../types';

export const useMyPredictions = (course?: number) =>
  useQuery({
    queryKey: queryKeys.studentPortal.prediction({ course }),
    queryFn: () => mlApi.mine(course),
    select: (result) => result.data,
  });

export const usePredictionList = (params: PredictionListParams, enabled = true) =>
  useQuery({
    queryKey: queryKeys.ml.predictions(params as QueryParams),
    queryFn: () => mlApi.predictions(params),
    enabled,
    placeholderData: keepPreviousData,
    select: (result) => result.data,
  });

export const useStudentPrediction = (studentId: number | null) =>
  useQuery({
    queryKey: queryKeys.ml.studentPrediction(studentId ?? 0),
    queryFn: () => mlApi.studentPrediction(studentId ?? 0),
    enabled: studentId !== null,
    select: (result) => result.data,
  });

export const usePredict = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: mlApi.predict,
    meta: { successMessage: 'Prediction generated', errorTitle: 'Prediction failed' },
    onSuccess: (result) => {
      dispatch(predictionReceived(result.data));
      return queryClient.invalidateQueries({ queryKey: queryKeys.ml.all });
    },
  });
};

export const useModels = (enabled = true) =>
  useQuery({
    queryKey: queryKeys.ml.models,
    queryFn: mlApi.models,
    enabled,
    select: (result) => result.data,
  });

export const useTrainModel = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: mlApi.train,
    meta: { successMessage: 'Model trained successfully', errorTitle: 'Training failed' },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.ml.all }),
  });
};

export const useActivateModel = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: mlApi.activate,
    meta: { successMessage: 'Model activated', errorTitle: 'Could not activate model' },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.ml.all }),
  });
};
