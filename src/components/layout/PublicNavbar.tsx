import { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Menu, X } from 'lucide-react';
import { ButtonLink } from '@/components/ui';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { mobileNavToggled } from '@/app/store/slices/uiSlice';
import { homePathForRole, PATHS } from '@/app/router/paths';
import { useCurrentUser } from '@/features/auth/hooks/useAuth';
import { cn } from '@/lib/utils/cn';
import { BrandLogo } from './BrandLogo';
import { ThemeToggle } from './ThemeToggle';
import { UserMenu } from './UserMenu';

const LINKS = [
  { to: PATHS.home, label: 'Home', end: true },
  { to: PATHS.about, label: 'About' },
  { to: PATHS.courses, label: 'Courses' },
  { to: PATHS.categories, label: 'Categories' },
  { to: PATHS.faculty, label: 'Faculty' },
  { to: PATHS.contact, label: 'Contact' },
];

interface Indicator {
  left: number;
  width: number;
  visible: boolean;
}

/** Tracks whether the page has scrolled, for the compact/elevated navbar state. */
const useScrolled = (offset = 8) => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > offset);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [offset]);
  return scrolled;
};

/** Thin progress bar showing how far the visitor has scrolled through the page. */
const ScrollProgress = () => {
  const bar = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        if (bar.current) bar.current.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
      });
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);
  return <div ref={bar} className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-gradient-to-r from-brand-700 via-brand-500 to-sun-400" aria-hidden="true" />;
};

export const PublicNavbar = () => {
  const dispatch = useAppDispatch();
  const open = useAppSelector((state) => state.ui.mobileNavOpen);
  const { isAuthenticated, role } = useCurrentUser();
  const location = useLocation();
  const scrolled = useScrolled();
  const [indicator, setIndicator] = useState<Indicator>({ left: 0, width: 0, visible: false });

  const moveIndicator = (target: HTMLElement) =>
    setIndicator({ left: target.offsetLeft + 12, width: target.offsetWidth - 24, visible: true });

  useEffect(() => {
    dispatch(mobileNavToggled(false));
  }, [location.pathname, dispatch]);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    cn('relative z-10 px-3 py-2 text-sm transition-colors duration-200', isActive ? 'font-semibold text-brand-700' : 'font-medium text-slate-700 hover:text-brand-700');

  return (
    <header
      className={cn(
        'sticky top-0 z-40 border-b backdrop-blur-md transition-all duration-300',
        scrolled ? 'border-slate-200/80 bg-white/85 shadow-[0_8px_30px_-18px_rgba(26,31,113,0.35)]' : 'border-transparent bg-white/95',
      )}
    >
      <ScrollProgress />
      <div className={cn('container-page flex items-center justify-between gap-4 transition-[height] duration-300', scrolled ? 'h-14' : 'h-16')}>
        <BrandLogo />
        <nav
          className="relative hidden items-center gap-2 lg:flex"
          aria-label="Main"
          onMouseLeave={() => setIndicator((current) => ({ ...current, visible: false }))}
        >
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              viewTransition
              className={linkClass}
              onMouseEnter={(event) => moveIndicator(event.currentTarget)}
              onFocus={(event) => moveIndicator(event.currentTarget)}
              onBlur={() => setIndicator((current) => ({ ...current, visible: false }))}
            >
              {link.label}
            </NavLink>
          ))}
          {/* Sliding underline: glides between links on hover and fades out when the cursor leaves the menu. */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-0.5 h-[3px] rounded-full bg-gradient-to-r from-brand-700 to-brand-500 transition-[left,width,opacity,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{
              left: indicator.left,
              width: indicator.width,
              opacity: indicator.visible ? 1 : 0,
              transform: `scaleX(${indicator.visible ? 1 : 0.4})`,
            }}
          />
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle className="hidden md:grid" />
          {isAuthenticated ? (
            <>
              <ButtonLink to={homePathForRole(role)} size="sm" className="hidden sm:inline-flex" icon={<LayoutDashboard className="h-4 w-4" />}>
                My Portal
              </ButtonLink>
              <UserMenu />
            </>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <ButtonLink to={PATHS.login} variant="ghost" size="sm" viewTransition>
                Log In
              </ButtonLink>
              <ButtonLink to={PATHS.register} size="sm" viewTransition>
                Register Now
              </ButtonLink>
            </div>
          )}
          <button
            type="button"
            onClick={() => dispatch(mobileNavToggled())}
            className="rounded-xl p-2 text-slate-700 hover:bg-slate-100 lg:hidden"
            aria-label="Toggle navigation"
            aria-expanded={open}
          >
            <span className="relative block h-6 w-6">
              <Menu className={cn('absolute inset-0 h-6 w-6 transition-all duration-300', open ? 'rotate-90 scale-50 opacity-0' : 'rotate-0 opacity-100')} />
              <X className={cn('absolute inset-0 h-6 w-6 transition-all duration-300', open ? 'rotate-0 opacity-100' : '-rotate-90 scale-50 opacity-0')} />
            </span>
          </button>
        </div>
      </div>
      {open && (
        <div className="animate-page-in border-t border-slate-100 bg-white px-4 pb-6 pt-3 lg:hidden">
          <nav className="flex flex-col gap-1" aria-label="Mobile">
            {LINKS.map((link, index) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                style={{ animationDelay: `${index * 40}ms` }}
                className={({ isActive }) =>
                  cn('animate-page-in rounded-xl px-3 py-2.5 text-sm font-medium transition-colors', isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-700 hover:bg-slate-50')
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
          <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 pt-4 md:hidden">
            <span className="text-xs font-semibold text-slate-500">Theme</span>
            <ThemeToggle showLabels />
          </div>
          {!isAuthenticated && (
            <div className="mt-4 grid grid-cols-2 gap-2 border-t border-slate-100 pt-4">
              <ButtonLink to={PATHS.login} variant="outline" viewTransition>
                Log In
              </ButtonLink>
              <ButtonLink to={PATHS.register} viewTransition>
                Register Now
              </ButtonLink>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
