import { Compass } from 'lucide-react';
import { ButtonLink } from '@/components/ui';
import { PATHS } from '@/app/router/paths';
import { useDocumentTitle } from '@/lib/hooks/useDocumentTitle';

export const NotFoundPage = () => {
  useDocumentTitle('Page not found');
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <span className="rounded-2xl bg-brand-50 p-4 text-brand-600">
        <Compass className="h-8 w-8" />
      </span>
      <p className="mt-6 text-sm font-bold text-brand-600">404</p>
      <h1 className="mt-1 text-3xl font-extrabold text-slate-900">We couldn't find that page</h1>
      <p className="mt-2 max-w-md text-sm text-slate-500">The link may be broken or the page may have moved.</p>
      <div className="mt-6 flex gap-3">
        <ButtonLink to={PATHS.home}>Back to home</ButtonLink>
        <ButtonLink to={PATHS.courses} variant="outline">
          Browse courses
        </ButtonLink>
      </div>
    </div>
  );
};

export default NotFoundPage;
