import { z } from 'zod';

export const PASSWORD_RULE_MESSAGE =
  'Password must be at least 6 characters and include an uppercase letter, a lowercase letter and a special character.';

export const passwordSchema = z
  .string()
  .min(6, PASSWORD_RULE_MESSAGE)
  .regex(/[A-Z]/, PASSWORD_RULE_MESSAGE)
  .regex(/[a-z]/, PASSWORD_RULE_MESSAGE)
  .regex(/[^A-Za-z0-9]/, PASSWORD_RULE_MESSAGE);

export const phoneSchema = z.string().trim().regex(/^\d{10}$/, 'Phone number must be exactly 10 digits.');

export const otpSchema = z.string().trim().regex(/^\d{4,8}$/, 'Enter the OTP you received.');

export const nameSchema = (label: string) => z.string().trim().min(1, `${label} is required.`).max(150);

export const loginSchema = z.object({
  username: z.string().trim().min(1, 'Enter your email or phone number.'),
  password: z.string().min(1, 'Enter your password.'),
});

export const registerSchema = z
  .object({
    first_name: nameSchema('First name'),
    last_name: nameSchema('Last name'),
    email: z.string().trim().min(1, 'Email is required.').email('Enter a valid email address.'),
    phone: phoneSchema,
    role: z.enum(['STUDENT', 'FACULTY']),
    password: passwordSchema,
    confirm_password: z.string().min(1, 'Confirm your password.'),
  })
  .refine((values) => values.password === values.confirm_password, {
    path: ['confirm_password'],
    message: 'Passwords do not match.',
  });

export const forgotPasswordSchema = z.object({
  username: z.string().trim().min(1, 'Enter your registered email or phone number.'),
});

export const resetPasswordSchema = z
  .object({
    username: z.string().trim().min(1, 'Enter your registered email or phone number.'),
    otp: otpSchema,
    password: passwordSchema,
    confirm_password: z.string().min(1, 'Confirm your password.'),
  })
  .refine((values) => values.password === values.confirm_password, {
    path: ['confirm_password'],
    message: 'Passwords do not match.',
  });

export const changePasswordSchema = z
  .object({
    old_password: z.string().min(1, 'Enter your current password.'),
    password: passwordSchema,
    confirm_password: z.string().min(1, 'Confirm your new password.'),
  })
  .refine((values) => values.password === values.confirm_password, {
    path: ['confirm_password'],
    message: 'Passwords do not match.',
  });

export const profileSchema = z.object({
  first_name: nameSchema('First name'),
  last_name: nameSchema('Last name'),
  phone: phoneSchema,
});

export const emailOtpSchema = z.object({
  email: z.string().trim().email('Enter a valid email address.'),
  otp: otpSchema,
});

export const phoneOtpSchema = z.object({
  phone: z.string().trim().min(10, 'Enter your phone number with country code.'),
  otp: otpSchema,
});

export type LoginValues = z.infer<typeof loginSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;
export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;
export type ChangePasswordValues = z.infer<typeof changePasswordSchema>;
export type ProfileValues = z.infer<typeof profileSchema>;
export type EmailOtpValues = z.infer<typeof emailOtpSchema>;
export type PhoneOtpValues = z.infer<typeof phoneOtpSchema>;
