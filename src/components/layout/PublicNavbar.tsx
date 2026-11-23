import { useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Menu, X } from 'lucide-react';
import { ButtonLink } from '@/components/ui';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { mobileNavToggled } from '@/app/store/slices/uiSlice';
import { homePathForRole, PATHS } from '@/app/router/paths';
import { useCurrentUser } from '@/features/auth/hooks/useAuth';
import { cn } from '@/lib/utils/cn';
import { BrandLogo } from './BrandLogo';
import { UserMenu } from './UserMenu';

const LINKS = [
  { to: PATHS.home, label: 'Home', end: true },
  { to: PATHS.about, label: 'About' },
  { to: PATHS.courses, label: 'Courses' },
  { to: PATHS.categories, label: 'Categories' },
  { to: PATHS.faculty, label: 'Faculty' },
  { to: PATHS.contact, label: 'Contact' },
];

export const PublicNavbar = () => {
  const dispatch = useAppDispatch();
  const open = useAppSelector((state) => state.ui.mobileNavOpen);
  const { isAuthenticated, role } = useCurrentUser();
  const location = useLocation();

  useEffect(() => {
    dispatch(mobileNavToggled(false));
  }, [location.pathname, dispatch]);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    cn('relative px-3 py-2 text-sm font-medium transition-colors', isActive ? 'text-brand-700' : 'text-slate-700 hover:text-brand-700');

  return (
    <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/90 backdrop-blur-md">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <BrandLogo />
        <nav className="hidden items-center gap-2 lg:flex" aria-label="Main">
          {LINKS.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end} className={linkClass}>
              {({ isActive }) => (
                <>
                  {link.label}
                  {isActive && <span className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-brand-700" />}
                </>
              )}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <ButtonLink to={homePathForRole(role)} size="sm" className="hidden sm:inline-flex" icon={<LayoutDashboard className="h-4 w-4" />}>
                My Portal
              </ButtonLink>
              <UserMenu />
            </>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <ButtonLink to={PATHS.login} variant="ghost" size="sm">
                Log In
              </ButtonLink>
              <ButtonLink to={PATHS.register} size="sm">
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
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>
      {open && (
        <div className="animate-fade-in border-t border-slate-100 bg-white px-4 pb-6 pt-3 lg:hidden">
          <nav className="flex flex-col gap-1" aria-label="Mobile">
            {LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) => cn('rounded-xl px-3 py-2.5 text-sm font-medium', isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-700')}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
          {!isAuthenticated && (
            <div className="mt-4 grid grid-cols-2 gap-2 border-t border-slate-100 pt-4">
              <ButtonLink to={PATHS.login} variant="outline">
                Log In
              </ButtonLink>
              <ButtonLink to={PATHS.register}>Register Now</ButtonLink>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
