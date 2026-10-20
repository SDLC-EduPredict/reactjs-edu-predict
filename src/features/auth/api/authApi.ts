import { ENDPOINTS } from '@/lib/api/endpoints';
import { http } from '@/lib/api/httpClient';
import { api } from '@/lib/api/request';
import { toApiError } from '@/lib/api/apiError';
import { env } from '@/config/env';
import { normalizeAuthResponse, type NormalizedAuth } from './normalizeAuth';
import type {
  ChangePasswordPayload,
  ForgotPasswordPayload,
  LoginPayload,
  MeResponseData,
  RegisterPayload,
  RegisterResponseData,
  ResetPasswordPayload,
  SendEmailVerificationPayload,
  UpdateProfilePayload,
  VerifyEmailOtpPayload,
  VerifyPhoneOtpPayload,
} from '../types';

export const authApi = {
  async login(payload: LoginPayload): Promise<NormalizedAuth & { user: NonNullable<NormalizedAuth['user']> }> {
    let auth: NormalizedAuth;
    try {
      const { data } = await http.post<unknown>(ENDPOINTS.auth.login, payload);
      auth = normalizeAuthResponse(data);
    } catch (error) {
      throw toApiError(error);
    }
    if (auth.user) return { ...auth, user: auth.user };
    try {
      const { data } = await http.get<{ data?: MeResponseData }>(ENDPOINTS.auth.me, {
        headers: { Authorization: `${env.tokenType} ${auth.accessToken}` },
      });
      const user = data.data?.user;
      if (!user) throw new Error('Logged in, but the server did not return the user profile.');
      return { ...auth, user: { ...user, role: user.role.toUpperCase() as typeof user.role, permissions: user.permissions ?? [] } };
    } catch (error) {
      throw toApiError(error);
    }
  },
  register: (payload: RegisterPayload) =>
    api.post<RegisterResponseData, RegisterPayload>(ENDPOINTS.auth.register, payload),
  logout: (refreshToken: string) =>
    api.post<null>(ENDPOINTS.auth.logout, { refresh_token: refreshToken }),
  me: () => api.get<MeResponseData>(ENDPOINTS.auth.me),
  updateProfile: (payload: UpdateProfilePayload) =>
    api.patch<MeResponseData, UpdateProfilePayload>(ENDPOINTS.auth.profile, payload),
  changePassword: (payload: ChangePasswordPayload) =>
    api.post<null, ChangePasswordPayload>(ENDPOINTS.auth.changePassword, payload),
  forgotPassword: (payload: ForgotPasswordPayload) =>
    api.post<null, ForgotPasswordPayload>(ENDPOINTS.auth.forgotPassword, payload),
  verifyPhoneOtp: (payload: VerifyPhoneOtpPayload) =>
    api.post<null, VerifyPhoneOtpPayload>(ENDPOINTS.auth.verifyPhoneOtp, payload),
  verifyEmailOtp: (payload: VerifyEmailOtpPayload) =>
    api.post<null, VerifyEmailOtpPayload>(ENDPOINTS.auth.verifyEmailOtp, payload),
  resetPassword: (payload: ResetPasswordPayload) =>
    api.post<null, ResetPasswordPayload>(ENDPOINTS.auth.resetPassword, payload),
  sendEmailVerification: (payload: SendEmailVerificationPayload) =>
    api.post<null, SendEmailVerificationPayload>(ENDPOINTS.auth.sendEmailVerification, payload),
};
