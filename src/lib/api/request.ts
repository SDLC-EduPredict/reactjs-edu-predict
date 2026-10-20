import type { AxiosRequestConfig } from 'axios';
import type { ApiEnvelope, QueryParams } from '@/types';
import { toApiError } from './apiError';
import { http } from './httpClient';

export const cleanParams = (params?: QueryParams): Record<string, string | number | boolean> =>
  Object.entries(params ?? {}).reduce<Record<string, string | number | boolean>>(
    (acc, [key, value]) => {
      if (value !== undefined && value !== null && value !== '') acc[key] = value;
      return acc;
    },
    {},
  );

export interface ApiResult<T> {
  data: T;
  message: string;
}

const run = async <T>(promise: Promise<{ data: ApiEnvelope<T> }>): Promise<ApiResult<T>> => {
  try {
    const { data: envelope } = await promise;
    return { data: envelope.data, message: envelope.message };
  } catch (error) {
    throw toApiError(error);
  }
};

export const api = {
  get: <T>(url: string, params?: QueryParams, config?: AxiosRequestConfig) =>
    run<T>(http.get<ApiEnvelope<T>>(url, { ...config, params: cleanParams(params) })),
  post: <T, B = unknown>(url: string, body?: B, config?: AxiosRequestConfig) =>
    run<T>(http.post<ApiEnvelope<T>>(url, body, config)),
  put: <T, B = unknown>(url: string, body?: B, config?: AxiosRequestConfig) =>
    run<T>(http.put<ApiEnvelope<T>>(url, body, config)),
  patch: <T, B = unknown>(url: string, body?: B, config?: AxiosRequestConfig) =>
    run<T>(http.patch<ApiEnvelope<T>>(url, body, config)),
  delete: <T = null>(url: string, config?: AxiosRequestConfig) =>
    run<T>(http.delete<ApiEnvelope<T>>(url, config)),
};

export const toFormData = (values: Record<string, unknown>): FormData =>
  Object.entries(values).reduce((form, [key, value]) => {
    if (value === undefined || value === null) return form;
    if (value instanceof Blob) form.append(key, value);
    else if (typeof value === 'boolean') form.append(key, value ? 'true' : 'false');
    else form.append(key, String(value));
    return form;
  }, new FormData());

export const downloadFile = async (
  url: string,
  params: QueryParams,
  fileName: string,
): Promise<void> => {
  try {
    const response = await http.get<Blob>(url, {
      params: cleanParams(params),
      responseType: 'blob',
    });
    const href = URL.createObjectURL(response.data);
    const link = document.createElement('a');
    link.href = href;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(href);
  } catch (error) {
    throw toApiError(error);
  }
};
