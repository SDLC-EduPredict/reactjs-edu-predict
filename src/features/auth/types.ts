import type { AuthUser, User, UserRole } from '@/types';

export type RegisterRole = Extract<UserRole, 'STUDENT' | 'FACULTY'>;

export interface RegisterPayload {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  password: string;
  confirm_password: string;
  role: RegisterRole;
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface TokenPair {
  access_token: string;
  refresh_token: string;
  token_type: string;
  access_token_expires_in: number;
  refresh_token_expires_in: number;
}

export interface LoginResponse extends TokenPair {
  message: string;
  user: AuthUser;
}

export interface RefreshResponse extends TokenPair {
  message: string;
}

export interface ForgotPasswordPayload {
  username: string;
}

export interface VerifyPhoneOtpPayload {
  phone: string;
  otp: string;
}

export interface VerifyEmailOtpPayload {
  email: string;
  otp: string;
}

export interface ResetPasswordPayload {
  username: string;
  otp: string;
  password: string;
  confirm_password: string;
}

export interface ChangePasswordPayload {
  old_password: string;
  password: string;
  confirm_password: string;
}

export interface UpdateProfilePayload {
  first_name: string;
  last_name: string;
  phone: string;
}

export interface SendEmailVerificationPayload {
  email: string;
}

export interface RegisterResponseData {
  user: User;
}

export interface MeResponseData {
  user: AuthUser;
}
