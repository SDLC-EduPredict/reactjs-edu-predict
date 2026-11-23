import { ENDPOINTS } from '@/lib/api/endpoints';
import { http } from '@/lib/api/httpClient';
import { toApiError } from '@/lib/api/apiError';

export interface HealthResult {
  ok: boolean;
  statusCode: number;
  latencyMs: number;
  body: unknown;
}

export const systemApi = {
  async health(): Promise<HealthResult> {
    const started = performance.now();
    try {
      const response = await http.get<unknown>(ENDPOINTS.health);
      return { ok: true, statusCode: response.status, latencyMs: Math.round(performance.now() - started), body: response.data };
    } catch (error) {
      const apiError = toApiError(error);
      return { ok: false, statusCode: apiError.statusCode, latencyMs: Math.round(performance.now() - started), body: apiError.message };
    }
  },
};
