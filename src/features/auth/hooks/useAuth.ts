import { useCallback, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { homePathForRole, PATHS } from '@/app/router/paths';
import { queryKeys } from '@/lib/query/queryKeys';
import { authApi } from '../api/authApi';
import { credentialsReceived, loggedOut, userUpdated } from '../store/authSlice';
import {
  selectAccessToken,
  selectCurrentUser,
  selectIsAdmin,
  selectIsAuthenticated,
  selectIsStaff,
  selectPermissions,
} from '../store/selectors';

export const useCurrentUser = () => {
  const user = useAppSelector(selectCurrentUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isStaff = useAppSelector(selectIsStaff);
  const isAdmin = useAppSelector(selectIsAdmin);
  const permissions = useAppSelector(selectPermissions);
  const hasPermission = useCallback(
    (code: string) => user?.role === 'SUPER_ADMIN' || permissions.has(code),
    [permissions, user?.role],
  );
  return { user, isAuthenticated, isStaff, isAdmin, role: user?.role ?? null, hasPermission };
};

export const useSessionSync = () => {
  const dispatch = useAppDispatch();
  const token = useAppSelector(selectAccessToken);
  const query = useQuery({
    queryKey: queryKeys.auth.me,
    queryFn: authApi.me,
    enabled: Boolean(token),
    staleTime: 5 * 60 * 1000,
  });
  useEffect(() => {
    if (query.data?.data.user) dispatch(userUpdated(query.data.data.user));
  }, [query.data, dispatch]);
  return query;
};

export const useLogin = (redirectTo?: string | null) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authApi.login,
    meta: { errorTitle: 'Login failed' },
    onSuccess: (response) => {
      queryClient.clear();
      dispatch(
        credentialsReceived({
          accessToken: response.access_token,
          refreshToken: response.refresh_token,
          user: response.user,
        }),
      );
      navigate(redirectTo || homePathForRole(response.user.role), { replace: true });
    },
  });
};

export const useRegister = () =>
  useMutation({
    mutationFn: authApi.register,
    meta: { errorTitle: 'Registration failed' },
  });

export const useLogout = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const refreshToken = useAppSelector((state) => state.auth.refreshToken);
  const mutation = useMutation({
    mutationFn: async () => {
      if (refreshToken) await authApi.logout(refreshToken);
    },
    meta: { silent: true },
    onSettled: () => {
      dispatch(loggedOut());
      queryClient.clear();
      navigate(PATHS.login, { replace: true });
    },
  });
  return mutation;
};

export const useUpdateProfile = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authApi.updateProfile,
    meta: { successMessage: 'Profile updated', errorTitle: 'Could not update profile' },
    onSuccess: (result) => {
      dispatch(userUpdated(result.data.user));
      queryClient.setQueryData(queryKeys.auth.me, result);
    },
  });
};

export const useChangePassword = () =>
  useMutation({
    mutationFn: authApi.changePassword,
    meta: { successMessage: 'Password changed successfully', errorTitle: 'Could not change password' },
  });

export const useForgotPassword = () =>
  useMutation({ mutationFn: authApi.forgotPassword, meta: { errorTitle: 'Could not send OTP' } });

export const useResetPassword = () =>
  useMutation({ mutationFn: authApi.resetPassword, meta: { errorTitle: 'Password reset failed' } });

export const useVerifyEmailOtp = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authApi.verifyEmailOtp,
    meta: { successMessage: 'Email verified', errorTitle: 'Verification failed' },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.auth.me }),
  });
};

export const useVerifyPhoneOtp = () =>
  useMutation({
    mutationFn: authApi.verifyPhoneOtp,
    meta: { successMessage: 'Phone number verified', errorTitle: 'Verification failed' },
  });

export const useSendEmailVerification = () =>
  useMutation({
    mutationFn: authApi.sendEmailVerification,
    meta: { successMessage: 'Verification code sent to your email', errorTitle: 'Could not send code' },
  });
