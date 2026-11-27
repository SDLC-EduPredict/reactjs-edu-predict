import { Suspense, useEffect, useRef, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { Bell, LogOut, Menu, X } from 'lucide-react';
import { env } from '@/config/env';
import { Avatar, PageLoader } from '@/components/ui';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { sidebarToggled } from '@/app/store/slices/uiSlice';
import { portalLinks, type PortalKind } from '@/app/router/paths';
import { useCurrentUser, useLogout } from '@/features/auth/hooks/useAuth';
import { useUnreadCount } from '@/features/notifications/hooks/useNotifications';
import { useScrollReveal } from '@/lib/hooks/useScrollReveal';
import { useSpotlight } from '@/lib/hooks/useSpotlight';
import { cn } from '@/lib/utils/cn';
import { BrandLogo } from './BrandLogo';
import { ThemeToggle } from './ThemeToggle';
import { NAV_BY_PORTAL } from './navigation';
import { usePortalBadges, type BadgeTone } from './usePortalBadges';

const badgeTone: Record<BadgeTone, string> = {
  navy: 'bg-brand-100 text-brand-700',
  lime: 'bg-lime-soft text-lime-ink',
  sun: 'bg-sun-100 text-amber-700',
  rose: 'bg-rose-100 text-rose-600',
};

const SUBTITLE: Record<PortalKind, string> = {
  student: 'Student',
  faculty: 'Faculty Lead',
  admin: 'Administrator',
};

export const PortalLayout = ({ portal }: { portal: PortalKind }) => {
  const dispatch = useAppDispatch();
  const sidebarOpen = useAppSelector((state) => state.ui.sidebarOpen);
  const { user } = useCurrentUser();
  const logout = useLogout();
  const { data: unread = 0 } = useUnreadCount();
  const badges = usePortalBadges(portal);
  const location = useLocation();
  const base = portalLinks(portal);
  const sections = NAV_BY_PORTAL[portal];

  const navRef = useRef<HTMLElement>(null);
  const mainRef = useRef<HTMLElement>(null);
  const [pill, setPill] = useState<{ top: number; height: number } | null>(null);
  useScrollReveal(mainRef, location.pathname);
  useSpotlight();

  useEffect(() => {
    dispatch(sidebarToggled(false));
  }, [location.pathname, dispatch]);

  // Sliding active pill: measures the active sidebar link and glides the navy highlight to it.
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    let frame = 0;
    const measure = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const active = nav.querySelector<HTMLElement>('a[aria-current="page"]');
        setPill(active ? { top: active.offsetTop, height: active.offsetHeight } : null);
      });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(nav);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [location.pathname]);

  const activeItem = sections.flatMap((section) => section.items).find((item) => location.pathname.startsWith(item.to));
  const notificationsPath = base.notifications;

  return (
    <div className="min-h-screen bg-canvas">
      <header className="fixed inset-x-0 top-0 z-40 flex h-16 items-center border-b border-slate-200/70 bg-white">
        <div className="flex h-full w-64 shrink-0 items-center gap-2 px-4 lg:px-6">
          <button type="button" className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 lg:hidden" onClick={() => dispatch(sidebarToggled())} aria-label="Toggle sidebar">
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <BrandLogo to={base.dashboard} />
        </div>
        <div className="flex min-w-0 flex-1 items-center justify-between gap-3 pr-4 lg:pr-6">
          <h1 className="hidden truncate text-sm font-bold text-slate-900 md:block">{activeItem?.label ?? 'Dashboard'}</h1>
          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <ThemeToggle className="hidden sm:grid" />
            <Link to={notificationsPath} className="relative flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700 hover:bg-brand-50 hover:text-brand-700" aria-label={`Notifications, ${unread} unread`}>
              <Bell key={unread} className={cn('h-4 w-4 origin-top', unread > 0 && 'animate-bell')} />
              {unread > 0 && (
                <>
                  <span className="absolute -right-0.5 -top-0.5 h-4 w-4 animate-ping rounded-full bg-rose-400 opacity-60" aria-hidden="true" />
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white ring-2 ring-white">{unread > 99 ? '99+' : unread}</span>
                </>
              )}
            </Link>
            {user && (
              <Link to={base.profile} className="hidden items-center gap-2 rounded-full bg-brand-50 py-1 pl-1 pr-3 sm:flex">
                <Avatar name={user.full_name} size="sm" />
                <span className="leading-tight">
                  <span className="block max-w-[160px] truncate text-xs font-bold text-slate-900">{user.full_name}</span>
                  <span className="block text-[10px] text-slate-500">{SUBTITLE[portal]}</span>
                </span>
              </Link>
            )}
            <button
              type="button"
              onClick={() => logout.mutate()}
              disabled={logout.isPending}
              className="inline-flex items-center gap-1.5 rounded-full border border-rose-300 px-3 py-1.5 text-xs font-semibold text-rose-600 transition hover:bg-rose-50"
            >
              <LogOut className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {sidebarOpen && <div className="fixed inset-0 z-30 bg-slate-900/30 lg:hidden" onClick={() => dispatch(sidebarToggled(false))} />}
      <aside
        className={cn(
          'fixed bottom-0 left-0 top-16 z-30 w-64 overflow-y-auto border-r border-slate-200/70 bg-white px-3 pb-6 pt-4 transition-transform lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        {user && (
          <Link to={base.profile} className="mb-5 flex items-center gap-3 rounded-2xl bg-brand-50 p-3 transition hover:bg-brand-100">
            <Avatar name={user.full_name} />
            <span className="min-w-0">
              <span className="block truncate text-sm font-bold text-slate-900">{user.full_name}</span>
              <span className="block truncate text-[11px] text-slate-500">{user.role_display}</span>
            </span>
          </Link>
        )}
        <nav ref={navRef} className="relative space-y-5" aria-label="Portal">
          {pill && (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 rounded-xl bg-brand-700 shadow-md shadow-brand-700/30 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={pill}
            />
          )}
          {sections.map((section) => (
            <div key={section.title}>
              <p className="mb-1.5 px-3 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">{section.title}</p>
              <ul className="space-y-0.5">
                {section.items.map((item) => {
                  const badge = item.badge ? badges[item.badge] : undefined;
                  return (
                    <li key={item.to}>
                      <NavLink
                        to={item.to}
                        className={({ isActive }) =>
                          cn(
                            'group relative z-10 flex items-center gap-3 rounded-xl px-3 py-2 text-[13px] font-semibold transition-colors duration-200',
                            isActive
                              ? cn('text-white', !pill && 'bg-brand-700 shadow-sm shadow-brand-700/30')
                              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
                          )
                        }
                      >
                        {({ isActive }) => (
                          <>
                            <item.icon className={cn('h-4 w-4 shrink-0 transition-transform duration-300', !isActive && 'group-hover:translate-x-0.5 group-hover:scale-110')} />
                            <span className="flex-1 truncate">{item.label}</span>
                            {badge && (
                              <span className={cn('rounded-full px-1.5 py-0.5 text-[10px] font-bold', isActive ? 'bg-white/20 text-white' : badgeTone[badge.tone])}>{badge.text}</span>
                            )}
                          </>
                        )}
                      </NavLink>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </aside>

      <div className="flex min-h-screen flex-col pt-16 lg:pl-64">
        <main ref={mainRef} className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <Suspense fallback={<PageLoader />}>
            <div key={location.pathname} className="animate-page-in">
              <Outlet />
            </div>
          </Suspense>
        </main>
        <footer className="border-t border-slate-200/70 bg-white px-6 py-4 text-center text-[11px] text-slate-400">
          © {new Date().getFullYear()} {env.instituteName} · {env.appName} · Linear Regression powered academic intelligence
        </footer>
      </div>
    </div>
  );
};
