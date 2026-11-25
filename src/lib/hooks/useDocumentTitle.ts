import { useEffect } from 'react';
import { env } from '@/config/env';

export const useDocumentTitle = (title: string, description?: string): void => {
  useEffect(() => {
    document.title = title ? `${title} | ${env.appName}` : env.appName;
    if (description) {
      document.querySelector('meta[name="description"]')?.setAttribute('content', description);
    }

    // Canonical URL for the current page (query strings and #fragments removed)
    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = `${env.siteUrl}${window.location.pathname}`;
  }, [title, description]);
};