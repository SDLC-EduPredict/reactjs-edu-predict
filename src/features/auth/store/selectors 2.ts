import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '@/app/store/store';
import { ADMIN_ROLES, STAFF_ROLES } from '@/types';

export const selectAuth = (state: RootState) => state.auth;
export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectAccessToken = (state: RootState) => state.auth.accessToken;
export const selectIsAuthenticated = (state: RootState) =>
  Boolean(state.auth.accessToken && state.auth.user);
export const selectRole = (state: RootState) => state.auth.user?.role ?? null;
export const selectIsStaff = createSelector(selectRole, (role) =>
  role ? STAFF_ROLES.includes(role) : false,
);
export const selectIsAdmin = createSelector(selectRole, (role) =>
  role ? ADMIN_ROLES.includes(role) : false,
);
export const selectPermissions = createSelector(
  selectCurrentUser,
  (user) => new Set(user?.permissions ?? []),
);
