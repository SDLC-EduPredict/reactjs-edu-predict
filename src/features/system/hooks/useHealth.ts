import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query/queryKeys';
import { systemApi } from '../api/systemApi';

export const useHealth = () =>
  useQuery({ queryKey: queryKeys.health, queryFn: systemApi.health, refetchInterval: 30000 });
