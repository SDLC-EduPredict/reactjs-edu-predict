import { useEffect } from 'react';
import type { FieldValues, Path, UseFormSetError } from 'react-hook-form';
import { ApiError } from '@/lib/api/apiError';

export const useServerErrors = <T extends FieldValues>(error: unknown, setError: UseFormSetError<T>, fields: readonly Path<T>[]) => {
  useEffect(() => {
    if (!(error instanceof ApiError)) return;
    fields.forEach((field) => {
      const message = error.fieldMessage(field);
      if (message) setError(field, { type: 'server', message });
    });
  }, [error, setError, fields]);
};
