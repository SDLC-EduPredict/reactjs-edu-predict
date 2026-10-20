import { ENDPOINTS } from '@/lib/api/endpoints';
import { http } from '@/lib/api/httpClient';
import { api } from '@/lib/api/request';
import { toApiError } from '@/lib/api/apiError';
import type {
  ChangePasswordPayload,
  ForgotPasswordPayload,
  LoginPayload,
  LoginResponse,
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
  async login(payload: LoginPayload): Promise<LoginResponse> {
    try {
      const { data } = await http.post<LoginResponse>(ENDPOINTS.auth.login, payload);
      return data;
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
