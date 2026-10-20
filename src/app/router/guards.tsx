import { useEffect, type ReactNode } from 'react';
import { Navigate, Outlet, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { toastAdded } from '@/app/store/slices/uiSlice';
import { loggedOut } from '@/features/auth/store/authSlice';
import { selectIsAuthenticated, selectRole } from '@/features/auth/store/selectors';
import { useSessionSync } from '@/features/auth/hooks/useAuth';
import type { UserRole } from '@/types';
import { homePathForRole, PATHS } from './paths';

export const RequireAuth = ({ children }: { children?: ReactNode }) => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const location = useLocation();
  useSessionSync();
  if (!isAuthenticated) {
    const next = encodeURIComponent(`${location.pathname}${location.search}`);
    return <Navigate to={`${PATHS.login}?next=${next}`} replace />;
  }
  return children ?? <Outlet />;
};

export const RequireRole = ({ roles, children }: { roles: readonly UserRole[]; children?: ReactNode }) => {
  const role = useAppSelector(selectRole);
  if (!role || !roles.includes(role)) return <Navigate to={homePathForRole(role)} replace />;
  return children ?? <Outlet />;
};

export const GuestOnly = ({ children }: { children?: ReactNode }) => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const role = useAppSelector(selectRole);
  const [params] = useSearchParams();
  if (isAuthenticated) {
    const next = params.get('next');
    const target = next && next.startsWith('/') && !next.startsWith('//') ? next : homePathForRole(role);
    return <Navigate to={target} replace />;
  }
  return children ?? <Outlet />;
};

export const SessionWatcher = () => {
  const expired = useAppSelector((state) => state.auth.sessionExpired);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    if (!expired) return;
    dispatch(toastAdded({ type: 'warning', title: 'Session expired', message: 'Please sign in again to continue.' }));
    dispatch(loggedOut());
    navigate(PATHS.login, { replace: true });
  }, [expired, dispatch, navigate]);
  return null;
};
