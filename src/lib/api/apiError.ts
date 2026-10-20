import { isAxiosError } from 'axios';
import type { ApiFieldErrors } from '@/types';

export class ApiError extends Error {
  readonly statusCode: number;
  readonly fieldErrors: ApiFieldErrors;

  constructor(message: string, statusCode = 0, fieldErrors: ApiFieldErrors = {}) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.fieldErrors = fieldErrors;
  }

  fieldMessage(field: string): string | undefined {
    const value = this.fieldErrors[field];
    if (!value) return undefined;
    return Array.isArray(value) ? value.join(' ') : value;
  }

  get firstFieldMessage(): string | undefined {
    const [first] = Object.keys(this.fieldErrors);
    return first ? this.fieldMessage(first) : undefined;
  }
}

interface ErrorBody {
  message?: unknown;
  detail?: unknown;
  errors?: unknown;
  status_code?: unknown;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const normaliseFieldErrors = (raw: unknown): ApiFieldErrors => {
  if (!isRecord(raw)) return {};
  return Object.entries(raw).reduce<ApiFieldErrors>((acc, [key, value]) => {
    if (Array.isArray(value)) acc[key] = value.map(String);
    else if (typeof value === 'string') acc[key] = value;
    else if (isRecord(value)) acc[key] = JSON.stringify(value);
    return acc;
  }, {});
};

export const toApiError = (error: unknown): ApiError => {
  if (error instanceof ApiError) return error;
  if (isAxiosError(error)) {
    if (!error.response) {
      return new ApiError(
        error.code === 'ECONNABORTED'
          ? 'The server took too long to respond. Please try again.'
          : 'Unable to reach the EDU-PREDICT server. Make sure the Django server is running.',
      );
    }
    const body: ErrorBody = isRecord(error.response.data) ? error.response.data : {};
    const fieldErrors = normaliseFieldErrors(body.errors);
    const message =
      (typeof body.message === 'string' && body.message) ||
      (typeof body.detail === 'string' && body.detail) ||
      error.message ||
      'Something went wrong.';
    return new ApiError(message, error.response.status, fieldErrors);
  }
  if (error instanceof Error) return new ApiError(error.message);
  return new ApiError('Something went wrong.');
};

export const getErrorMessage = (error: unknown): string => {
  const apiError = toApiError(error);
  return apiError.firstFieldMessage && apiError.statusCode === 400
    ? `${apiError.message} ${apiError.firstFieldMessage}`.trim()
    : apiError.message;
};
