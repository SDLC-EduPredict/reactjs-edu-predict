import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query/queryKeys';
import { dashboardApi } from '../api/dashboardApi';

export const useStaffDashboard = (isFaculty: boolean) =>
  useQuery({
    queryKey: isFaculty ? queryKeys.facultyPortal.dashboard : queryKeys.admin.dashboard,
    queryFn: isFaculty ? dashboardApi.faculty : dashboardApi.admin,
    select: (result) => result.data,
  });
