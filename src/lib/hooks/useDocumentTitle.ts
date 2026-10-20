import { useEffect } from 'react';
import { env } from '@/config/env';

export const useDocumentTitle = (title: string, description?: string): void => {
  useEffect(() => {
    document.title = title ? `${title} | ${env.appName}` : env.appName;
    if (description) {
      document.querySelector('meta[name="description"]')?.setAttribute('content', description);
    }
  }, [title, description]);
};
