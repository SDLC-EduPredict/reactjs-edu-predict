import { Link, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail } from 'lucide-react';
import { Alert, Button, Input } from '@/components/ui';
import { PATHS } from '@/app/router/paths';
import { useDocumentTitle } from '@/lib/hooks/useDocumentTitle';
import { AuthShell } from '../components/AuthShell';
import { PasswordInput } from '../components/PasswordInput';
import { useLogin } from '../hooks/useAuth';
import { useServerErrors } from '../hooks/useServerErrors';
import { loginSchema, type LoginValues } from '../schemas/authSchemas';

const FIELDS = ['username', 'password'] as const;

const safeNext = (value: string | null) => (value && value.startsWith('/') && !value.startsWith('//') ? value : null);

export const LoginPage = () => {
  useDocumentTitle('Log in');
  const [params] = useSearchParams();
  const login = useLogin(safeNext(params.get('next')));
  const { register, handleSubmit, formState, setError } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });
  useServerErrors(login.error, setError, FIELDS);

  return (
    <AuthShell
      title="Welcome Back !"
      subtitle="Please enter your details."
      footer={
        <>
          New to the institute?{' '}
          <Link to={PATHS.register} className="font-semibold text-brand-700 hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit((values) => login.mutate(values))} className="space-y-4" noValidate>
        {params.get('registered') && <Alert tone="success" title="Account created">Log in with your new credentials.</Alert>}
        {params.get('reset') && <Alert tone="success" title="Password updated">Log in with your new password.</Alert>}
        {login.isError && <Alert tone="error">{login.error.message}</Alert>}
        <Input
          label="Email or phone"
          autoComplete="username"
          leftIcon={<Mail className="h-4 w-4" />}
          placeholder="you@example.com"
          required
          {...register('username')}
          error={formState.errors.username?.message}
        />
        <PasswordInput label="Password" autoComplete="current-password" required {...register('password')} error={formState.errors.password?.message} />
        <div className="flex justify-end">
          <Link to={PATHS.forgotPassword} className="text-xs font-semibold text-brand-700 hover:underline">
            Forgot password?
          </Link>
        </div>
        <Button type="submit" size="lg" fullWidth loading={login.isPending}>
          Log in
        </Button>
      </form>
    </AuthShell>
  );
};

export default LoginPage;
