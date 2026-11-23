import type { ReactNode } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Lock, Mail } from 'lucide-react';
import { Alert, Button, Input } from '@/components/ui';
import { PATHS } from '@/app/router/paths';
import { useDocumentTitle } from '@/lib/hooks/useDocumentTitle';
import { AuthShell } from '../components/AuthShell';
import { PasswordInput } from '../components/PasswordInput';
import { GoogleButton, OrDivider } from '../components/SocialAuth';
import { useLogin } from '../hooks/useAuth';
import { useServerErrors } from '../hooks/useServerErrors';
import { loginSchema, type LoginValues } from '../schemas/authSchemas';

const FIELDS = ['username', 'password'] as const;

const IconTile = ({ children }: { children: ReactNode }) => (
  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-700 text-white">{children}</span>
);

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
          Don&apos;t have an account?{' '}
          <Link to={PATHS.register} className="font-semibold text-brand-700 hover:underline">
            Sign up
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit((values) => login.mutate(values))} className="space-y-4" noValidate>
        {params.get('registered') && <Alert tone="success" title="Account created">Log in with your new credentials.</Alert>}
        {params.get('reset') && <Alert tone="success" title="Password updated">Log in with your new password.</Alert>}
        {login.isError && <Alert tone="error">{login.error.message}</Alert>}
        <Input
          aria-label="Email or phone"
          autoComplete="username"
          leftIcon={<IconTile><Mail className="h-4 w-4" /></IconTile>}
          className="h-14 pl-16! text-base!"
          placeholder="Email"
          required
          {...register('username')}
          error={formState.errors.username?.message}
        />
        <PasswordInput
          aria-label="Password"
          placeholder="Password"
          autoComplete="current-password"
          leftIcon={<IconTile><Lock className="h-4 w-4" /></IconTile>}
          className="h-14 pl-16! text-base!"
          required
          {...register('password')}
          error={formState.errors.password?.message}
        />
        <div className="flex items-center justify-between text-sm">
          <label className="flex cursor-pointer items-center gap-2 text-slate-600">
            <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-slate-300 accent-brand-700" /> Remember Me
          </label>
          <Link to={PATHS.forgotPassword} className="text-slate-500 hover:text-brand-700 hover:underline">
            Forgot Password ?
          </Link>
        </div>
        <Button type="submit" size="lg" fullWidth loading={login.isPending}>
          Log In
        </Button>
        <OrDivider />
        <GoogleButton />
      </form>
    </AuthShell>
  );
};

export default LoginPage;
