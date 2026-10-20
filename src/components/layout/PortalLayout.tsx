import { Suspense, useEffect } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { Bell, Menu, Sparkles, X } from 'lucide-react';
import { env } from '@/config/env';
import { PageLoader } from '@/components/ui';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { sidebarToggled } from '@/app/store/slices/uiSlice';
import { PATHS } from '@/app/router/paths';
import { useCurrentUser } from '@/features/auth/hooks/useAuth';
import { useUnreadCount } from '@/features/notifications/hooks/useNotifications';
import { cn } from '@/lib/utils/cn';
import { BrandLogo } from './BrandLogo';
import { UserMenu } from './UserMenu';
import { filterNav, STAFF_NAV, STUDENT_NAV } from './navigation';

export const PortalLayout = ({ portal }: { portal: 'student' | 'staff' }) => {
  const dispatch = useAppDispatch();
  const sidebarOpen = useAppSelector((state) => state.ui.sidebarOpen);
  const { role, hasPermission, user } = useCurrentUser();
  const { data: unread = 0 } = useUnreadCount();
  const location = useLocation();

  useEffect(() => {
    dispatch(sidebarToggled(false));
  }, [location.pathname, dispatch]);

  const sections = filterNav(portal === 'student' ? STUDENT_NAV : STAFF_NAV, role, hasPermission);
  const notificationsPath = portal === 'student' ? PATHS.student.notifications : PATHS.admin.notifications;
  const homePath = portal === 'student' ? PATHS.student.dashboard : PATHS.admin.dashboard;
  const workspaceLabel =
    portal === 'student' ? 'Student Workspace' : role === 'FACULTY' ? 'Faculty Portal' : 'Administration Portal';

  return (
    <div className="flex min-h-screen flex-col bg-page">
      <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/90 backdrop-blur-md">
        <div className="flex h-16 items-center justify-between gap-3 px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
              onClick={() => dispatch(sidebarToggled())}
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <BrandLogo to={homePath} />
            <span className="ml-2 hidden items-center gap-1.5 rounded-lg border border-brand-100 bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700 md:inline-flex">
              <Sparkles className="h-3.5 w-3.5" /> {workspaceLabel}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Link to={notificationsPath} className="relative rounded-xl p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700" aria-label={`Notifications (${unread} unread)`}>
              <Bell className="h-5 w-5" />
              {unread > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white ring-2 ring-white">
                  {unread > 99 ? '99+' : unread}
                </span>
              )}
            </Link>
            <UserMenu />
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {sidebarOpen && <div className="fixed inset-0 z-30 bg-slate-900/30 lg:hidden" onClick={() => dispatch(sidebarToggled(false))} />}
        <aside
          className={cn(
            'fixed inset-y-0 left-0 z-30 w-64 shrink-0 transform overflow-y-auto border-r border-slate-200/70 bg-white pt-16 transition-transform lg:sticky lg:top-16 lg:z-0 lg:h-[calc(100vh-4rem)] lg:translate-x-0 lg:pt-0',
            sidebarOpen ? 'translate-x-0' : '-translate-x-full',
          )}
        >
          <nav className="space-y-6 px-3 py-6" aria-label="Portal">
            {sections.map((section) => (
              <div key={section.title}>
                <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">{section.title}</p>
                <ul className="space-y-0.5">
                  {section.items.map((item) => (
                    <li key={item.to}>
                      <NavLink
                        to={item.to}
                        className={({ isActive }) =>
                          cn(
                            'flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors',
                            isActive
                              ? 'bg-gradient-to-r from-brand-50 to-violet-50 font-semibold text-brand-700'
                              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
                          )
                        }
                      >
                        <item.icon className="h-4 w-4 shrink-0" />
                        {item.label}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
          {user && (
            <div className="mx-3 mb-6 rounded-2xl bg-gradient-to-br from-brand-50 via-violet-50 to-white p-4 text-xs text-slate-600 ring-1 ring-brand-100">
              <p className="font-bold text-slate-800">{user.full_name}</p>
              <p className="mt-0.5">{user.role_display}</p>
              {!user.email_verified && (
                <Link to={PATHS.verifyEmail} className="mt-2 inline-block font-semibold text-brand-700 hover:underline">
                  Verify your email →
                </Link>
              )}
            </div>
          )}
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            <Suspense fallback={<PageLoader />}>
              <Outlet />
            </Suspense>
          </main>
          <footer className="portal-footer-gradient border-t border-brand-100/70 px-6 py-4 text-center text-xs text-slate-500">
            © {new Date().getFullYear()} {env.appName} · {env.instituteName} · Linear Regression based academic performance prediction
          </footer>
        </div>
      </div>
    </div>
  );
};
