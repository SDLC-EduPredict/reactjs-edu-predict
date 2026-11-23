import { Compass } from 'lucide-react';
import { ButtonLink } from '@/components/ui';
import { PATHS } from '@/app/router/paths';
import { useDocumentTitle } from '@/lib/hooks/useDocumentTitle';

const NotFoundPage = () => {
  useDocumentTitle('Page not found');
  return (
    <section className="flex min-h-[60vh] items-center py-20">
      <div className="container-page text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-sun-300 text-brand-900">
          <Compass className="h-8 w-8" />
        </span>
        <p className="mt-6 font-display text-6xl font-bold text-brand-700">404</p>
        <h1 className="mt-2 font-display text-2xl font-semibold text-slate-900">This page wandered off the syllabus</h1>
        <p className="mt-2 text-slate-500">The page you are looking for does not exist or has moved.</p>
        <div className="mt-8 flex justify-center gap-3">
          <ButtonLink to={PATHS.home}>Back to Home</ButtonLink>
          <ButtonLink to={PATHS.courses} variant="outline">
            Browse Courses
          </ButtonLink>
        </div>
      </div>
    </section>
  );
};

export default NotFoundPage;
