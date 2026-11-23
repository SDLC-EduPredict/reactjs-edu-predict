import { Suspense, useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { PageLoader } from '@/components/ui';
import { PATHS } from '@/app/router/paths';
import { useScrollReveal } from '@/lib/hooks/useScrollReveal';
import { useSpotlight } from '@/lib/hooks/useSpotlight';
import { BackToTop } from './BackToTop';
import { PublicNavbar } from './PublicNavbar';
import { SiteFooter } from './SiteFooter';

// Auth pages animate themselves (login <-> register slide), so they skip the generic page entrance.
const AUTH_PATHS: string[] = [PATHS.login, PATHS.register, PATHS.forgotPassword, PATHS.resetPassword];

export const PublicLayout = () => {
  const { pathname } = useLocation();
  const mainRef = useRef<HTMLElement>(null);
  useScrollReveal(mainRef, pathname);
  useSpotlight();

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [pathname]);

  const isAuth = AUTH_PATHS.includes(pathname);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <PublicNavbar />
      <main ref={mainRef} className="flex-1">
        <Suspense fallback={<PageLoader />}>
          <div key={isAuth ? 'auth' : pathname} className={isAuth ? undefined : 'animate-page-in'}>
            <Outlet />
          </div>
        </Suspense>
      </main>
      <SiteFooter />
      <BackToTop />
    </div>
  );
};
