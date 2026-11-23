import { Link, useNavigate } from 'react-router-dom';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Button, Input, Select } from '@/components/ui';
import { PATHS } from '@/app/router/paths';
import { useToast } from '@/lib/hooks/useToast';
import { useDocumentTitle } from '@/lib/hooks/useDocumentTitle';
import { AuthShell } from '../components/AuthShell';
import { PasswordInput } from '../components/PasswordInput';
import { GoogleButton, OrDivider } from '../components/SocialAuth';
import { useRegister } from '../hooks/useAuth';
import { useServerErrors } from '../hooks/useServerErrors';
import { PASSWORD_RULE_MESSAGE, registerSchema, type RegisterValues } from '../schemas/authSchemas';

const FIELDS = ['first_name', 'last_name', 'email', 'phone', 'password', 'confirm_password', 'role'] as const;

export const RegisterPage = () => {
  useDocumentTitle('Create your account');
  const navigate = useNavigate();
  const toast = useToast();
  const registerMutation = useRegister();
  const { register, handleSubmit, formState, setError, control } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: 'STUDENT' },
  });
  useServerErrors(registerMutation.error, setError, FIELDS);
  const role = useWatch({ control, name: 'role' });

  const onSubmit = (values: RegisterValues) =>
    registerMutation.mutate(values, {
      onSuccess: (result) => {
        toast.success('Registration successful', result.message);
        navigate(`${PATHS.login}?registered=1`, { replace: true });
      },
    });

  return (
    <AuthShell
      title="Registration"
      illustration="right"
      sideText
      subtitle="Register your profile at ABC Academy to access courses and real-time AI score prediction."
      footer={
        <>
          Already registered?{' '}
          <Link to={PATHS.login} className="font-semibold text-brand-700 hover:underline">
            Sign in here
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 sm:grid-cols-2" noValidate>
        {registerMutation.isError && (
          <div className="sm:col-span-2">
            <Alert tone="error">{registerMutation.error.message}</Alert>
          </div>
        )}
        <Select
          label="Type"
          containerClassName="sm:col-span-2"
          required
          options={[
            { value: 'STUDENT', label: 'Student' },
            { value: 'FACULTY', label: 'Faculty member' },
          ]}
          {...register('role')}
          error={formState.errors.role?.message}
        />
        {role === 'FACULTY' && (
          <div className="sm:col-span-2">
            <Alert tone="warning">Faculty accounts are activated after an administrator approves them.</Alert>
          </div>
        )}
        <Input label="First Name" placeholder="Rahul" autoComplete="given-name" required {...register('first_name')} error={formState.errors.first_name?.message} />
        <Input label="Last Name" placeholder="Sen" autoComplete="family-name" required {...register('last_name')} error={formState.errors.last_name?.message} />
        <Input label="Email Address" type="email" placeholder="rahul@example.com" autoComplete="email" containerClassName="sm:col-span-2" required {...register('email')} error={formState.errors.email?.message} />
        <PasswordInput label="Create Password" containerClassName="sm:col-span-2" autoComplete="new-password" required hint={PASSWORD_RULE_MESSAGE} {...register('password')} error={formState.errors.password?.message} />
        <PasswordInput label="Confirm Password" containerClassName="sm:col-span-2" autoComplete="new-password" required {...register('confirm_password')} error={formState.errors.confirm_password?.message} />
        <Input
          label="Mobile Phone Number"
          inputMode="numeric"
          maxLength={10}
          autoComplete="tel-national"
          placeholder="98301 44521"
          containerClassName="sm:col-span-2"
          required
          {...register('phone')}
          error={formState.errors.phone?.message}
        />
        <Button type="submit" size="lg" fullWidth className="sm:col-span-2" loading={registerMutation.isPending}>
          Register Now
        </Button>
        <div className="space-y-4 sm:col-span-2">
          <OrDivider />
          <GoogleButton />
        </div>
      </form>
    </AuthShell>
  );
};

export default RegisterPage;
