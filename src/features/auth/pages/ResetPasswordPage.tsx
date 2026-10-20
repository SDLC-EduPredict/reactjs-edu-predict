import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { KeyRound, Mail } from 'lucide-react';
import { Alert, Button, Input } from '@/components/ui';
import { PATHS } from '@/app/router/paths';
import { useDocumentTitle } from '@/lib/hooks/useDocumentTitle';
import { AuthShell } from '../components/AuthShell';
import { PasswordInput } from '../components/PasswordInput';
import { useResetPassword } from '../hooks/useAuth';
import { useServerErrors } from '../hooks/useServerErrors';
import { PASSWORD_RULE_MESSAGE, resetPasswordSchema, type ResetPasswordValues } from '../schemas/authSchemas';

const FIELDS = ['username', 'otp', 'password', 'confirm_password'] as const;

export const ResetPasswordPage = () => {
  useDocumentTitle('Set a new password');
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const reset = useResetPassword();
  const { register, handleSubmit, formState, setError } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { username: params.get('username') ?? '' },
  });
  useServerErrors(reset.error, setError, FIELDS);

  return (
    <AuthShell
      title="Set a new password"
      subtitle="Enter the OTP you received and choose a new password."
      footer={
        <Link to={PATHS.forgotPassword} className="font-semibold text-brand-700 hover:underline">
          Didn't get a code? Send again
        </Link>
      }
    >
      <form
        onSubmit={handleSubmit((values) => reset.mutate(values, { onSuccess: () => navigate(`${PATHS.login}?reset=1`, { replace: true }) }))}
        className="space-y-4"
        noValidate
      >
        {reset.isError && <Alert tone="error">{reset.error.message}</Alert>}
        <Input label="Email or phone" leftIcon={<Mail className="h-4 w-4" />} required {...register('username')} error={formState.errors.username?.message} />
        <Input label="OTP" inputMode="numeric" leftIcon={<KeyRound className="h-4 w-4" />} maxLength={8} required {...register('otp')} error={formState.errors.otp?.message} />
        <PasswordInput label="New password" autoComplete="new-password" hint={PASSWORD_RULE_MESSAGE} required {...register('password')} error={formState.errors.password?.message} />
        <PasswordInput label="Confirm new password" autoComplete="new-password" required {...register('confirm_password')} error={formState.errors.confirm_password?.message} />
        <Button type="submit" size="lg" fullWidth loading={reset.isPending}>
          Update password
        </Button>
      </form>
    </AuthShell>
  );
};

export default ResetPasswordPage;
