import { ENDPOINTS } from '@/lib/api/endpoints';
import { api } from '@/lib/api/request';
import type { DashboardData } from '../types';

export const dashboardApi = {
  admin: () => api.get<DashboardData>(ENDPOINTS.admin.dashboard),
  faculty: () => api.get<DashboardData>(ENDPOINTS.faculty.dashboard),
};
