import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { KeyRound, MailCheck, Phone, ShieldCheck } from 'lucide-react';
import { Alert, Button, Card, CardBody, CardHeader, Input } from '@/components/ui';
import { useChangePassword, useCurrentUser, useSendEmailVerification, useVerifyEmailOtp, useVerifyPhoneOtp } from '../hooks/useAuth';
import {
  changePasswordSchema,
  emailOtpSchema,
  phoneOtpSchema,
  type ChangePasswordValues,
  type EmailOtpValues,
  type PhoneOtpValues,
} from '../schemas/authSchemas';
import { PasswordInput } from './PasswordInput';

export const ChangePasswordCard = () => {
  const change = useChangePassword();
  const form = useForm<ChangePasswordValues>({ resolver: zodResolver(changePasswordSchema), defaultValues: { old_password: '', password: '', confirm_password: '' } });
  const { errors } = form.formState;
  return (
    <Card>
      <CardHeader icon={<ShieldCheck className="h-4 w-4" />} title="Change password" description="Use at least 8 characters with letters, numbers and a symbol." />
      <CardBody>
        <form onSubmit={form.handleSubmit((values) => change.mutate(values, { onSuccess: () => form.reset() }))} className="grid gap-4 sm:grid-cols-3 sm:items-start" noValidate>
          <PasswordInput label="Current password" autoComplete="current-password" {...form.register('old_password')} error={errors.old_password?.message} />
          <PasswordInput label="New password" autoComplete="new-password" {...form.register('password')} error={errors.password?.message} />
          <PasswordInput label="Confirm password" autoComplete="new-password" {...form.register('confirm_password')} error={errors.confirm_password?.message} />
          <div className="sm:col-span-3">
            <Button type="submit" loading={change.isPending}>
              Update password
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
};

export const VerificationCards = () => {
  const { user } = useCurrentUser();
  const send = useSendEmailVerification();
  const verifyEmail = useVerifyEmailOtp();
  const verifyPhone = useVerifyPhoneOtp();
  const emailForm = useForm<EmailOtpValues>({ resolver: zodResolver(emailOtpSchema), defaultValues: { email: user?.email ?? '', otp: '' } });
  const phoneForm = useForm<PhoneOtpValues>({ resolver: zodResolver(phoneOtpSchema), defaultValues: { phone: user?.phone ? `+91${user.phone}` : '', otp: '' } });

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader icon={<MailCheck className="h-4 w-4" />} title="Email verification" description={user?.email_verified ? 'Your email is verified.' : 'We will email you a one-time code.'} />
        <CardBody>
          {user?.email_verified ? (
            <Alert tone="success">{user.email} is verified.</Alert>
          ) : (
            <form onSubmit={emailForm.handleSubmit((values) => verifyEmail.mutate(values))} className="space-y-4" noValidate>
              <div className="flex items-end gap-2">
                <Input containerClassName="flex-1" label="Email" type="email" {...emailForm.register('email')} error={emailForm.formState.errors.email?.message} />
                <Button variant="secondary" loading={send.isPending} onClick={() => send.mutate({ email: emailForm.getValues('email') })}>
                  Send code
                </Button>
              </div>
              <Input label="Email OTP" inputMode="numeric" leftIcon={<KeyRound className="h-4 w-4" />} {...emailForm.register('otp')} error={emailForm.formState.errors.otp?.message} />
              <Button type="submit" loading={verifyEmail.isPending}>
                Verify email
              </Button>
            </form>
          )}
        </CardBody>
      </Card>
      <Card>
        <CardHeader icon={<Phone className="h-4 w-4" />} title="Phone verification" description="Enter the SMS code sent to your phone (with country code)." />
        <CardBody>
          <form onSubmit={phoneForm.handleSubmit((values) => verifyPhone.mutate(values))} className="space-y-4" noValidate>
            <Input label="Phone" {...phoneForm.register('phone')} error={phoneForm.formState.errors.phone?.message} />
            <Input label="SMS OTP" inputMode="numeric" leftIcon={<KeyRound className="h-4 w-4" />} {...phoneForm.register('otp')} error={phoneForm.formState.errors.otp?.message} />
            <Button type="submit" loading={verifyPhone.isPending}>
              Verify phone
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};
