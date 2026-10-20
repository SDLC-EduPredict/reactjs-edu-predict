import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail } from 'lucide-react';
import { Alert, Button, Input } from '@/components/ui';
import { PATHS } from '@/app/router/paths';
import { useToast } from '@/lib/hooks/useToast';
import { useDocumentTitle } from '@/lib/hooks/useDocumentTitle';
import { AuthShell } from '../components/AuthShell';
import { useForgotPassword } from '../hooks/useAuth';
import { forgotPasswordSchema, type ForgotPasswordValues } from '../schemas/authSchemas';

export const ForgotPasswordPage = () => {
  useDocumentTitle('Forgot password');
  const navigate = useNavigate();
  const toast = useToast();
  const forgot = useForgotPassword();
  const { register, handleSubmit, formState } = useForm<ForgotPasswordValues>({ resolver: zodResolver(forgotPasswordSchema) });

  const onSubmit = (values: ForgotPasswordValues) =>
    forgot.mutate(values, {
      onSuccess: (result) => {
        toast.success('OTP sent', result.message);
        navigate(`${PATHS.resetPassword}?username=${encodeURIComponent(values.username)}`);
      },
    });

  return (
    <AuthShell
      title="Reset your password"
      subtitle="Enter your registered email or phone number. We will send you a one-time password."
      footer={
        <Link to={PATHS.login} className="font-semibold text-brand-700 hover:underline">
          Back to log in
        </Link>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {forgot.isError && <Alert tone="error">{forgot.error.message}</Alert>}
        <Input label="Email or phone" leftIcon={<Mail className="h-4 w-4" />} required {...register('username')} error={formState.errors.username?.message} />
        <Button type="submit" size="lg" fullWidth loading={forgot.isPending}>
          Send OTP
        </Button>
      </form>
    </AuthShell>
  );
};

export default ForgotPasswordPage;
