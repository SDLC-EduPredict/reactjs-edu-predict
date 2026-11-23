import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BadgeCheck, KeyRound, MailCheck, Phone } from 'lucide-react';
import { Alert, Button, Card, CardBody, CardHeader, Input } from '@/components/ui';
import { homePathForRole } from '@/app/router/paths';
import { ButtonLink } from '@/components/ui';
import { useDocumentTitle } from '@/lib/hooks/useDocumentTitle';
import { useCurrentUser, useSendEmailVerification, useVerifyEmailOtp, useVerifyPhoneOtp } from '../hooks/useAuth';
import { emailOtpSchema, phoneOtpSchema, type EmailOtpValues, type PhoneOtpValues } from '../schemas/authSchemas';

export const VerifyEmailPage = () => {
  useDocumentTitle('Verify your account');
  const { user, role } = useCurrentUser();
  const send = useSendEmailVerification();
  const verifyEmail = useVerifyEmailOtp();
  const verifyPhone = useVerifyPhoneOtp();
  const emailForm = useForm<EmailOtpValues>({ resolver: zodResolver(emailOtpSchema), defaultValues: { email: user?.email ?? '' } });
  const phoneForm = useForm<PhoneOtpValues>({ resolver: zodResolver(phoneOtpSchema), defaultValues: { phone: user?.phone ? `+91${user.phone}` : '' } });

  return (
    <div className="container-page max-w-3xl py-12">
      <div className="mb-8 text-center">
        <span className="inline-flex rounded-2xl bg-brand-50 p-3 text-brand-600">
          <BadgeCheck className="h-7 w-7" />
        </span>
        <h1 className="mt-4 text-2xl font-extrabold text-slate-900">Verify your account</h1>
        <p className="mt-1 text-sm text-slate-500">Confirm your email address and phone number to secure your account.</p>
      </div>
      <div className="space-y-6">
        <Card>
          <CardHeader icon={<MailCheck className="h-4 w-4" />} title="Email verification" description={user?.email_verified ? 'Your email is verified.' : 'We will email you a one-time code.'} />
          <CardBody>
            {user?.email_verified ? (
              <Alert tone="success">{user.email} is verified.</Alert>
            ) : (
              <form onSubmit={emailForm.handleSubmit((values) => verifyEmail.mutate(values))} className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end" noValidate>
                <Input label="Email" type="email" {...emailForm.register('email')} error={emailForm.formState.errors.email?.message} />
                <Button variant="secondary" loading={send.isPending} onClick={() => send.mutate({ email: emailForm.getValues('email') })}>
                  Send code
                </Button>
                <Input label="Email OTP" inputMode="numeric" leftIcon={<KeyRound className="h-4 w-4" />} {...emailForm.register('otp')} error={emailForm.formState.errors.otp?.message} />
                <Button type="submit" loading={verifyEmail.isPending}>
                  Verify email
                </Button>
              </form>
            )}
          </CardBody>
        </Card>
        <Card>
          <CardHeader icon={<Phone className="h-4 w-4" />} title="Phone verification" description="Enter the SMS code sent to your phone, including the country code (e.g. +919876543210)." />
          <CardBody>
            <form onSubmit={phoneForm.handleSubmit((values) => verifyPhone.mutate(values))} className="grid gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end" noValidate>
              <Input label="Phone" {...phoneForm.register('phone')} error={phoneForm.formState.errors.phone?.message} />
              <Input label="SMS OTP" inputMode="numeric" {...phoneForm.register('otp')} error={phoneForm.formState.errors.otp?.message} />
              <Button type="submit" loading={verifyPhone.isPending}>
                Verify phone
              </Button>
            </form>
          </CardBody>
        </Card>
        <div className="text-center">
          <ButtonLink to={homePathForRole(role)} variant="outline">
            Continue to my portal
          </ButtonLink>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
