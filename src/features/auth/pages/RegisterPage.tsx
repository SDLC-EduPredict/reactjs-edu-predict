import { Link, useNavigate } from 'react-router-dom';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Button, Input, Select } from '@/components/ui';
import { PATHS } from '@/app/router/paths';
import { useToast } from '@/lib/hooks/useToast';
import { useDocumentTitle } from '@/lib/hooks/useDocumentTitle';
import { AuthShell } from '../components/AuthShell';
import { PasswordInput } from '../components/PasswordInput';
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
      subtitle="Register to enrol in courses and track your academic performance."
      footer={
        <>
          Already registered?{' '}
          <Link to={PATHS.login} className="font-semibold text-brand-700 hover:underline">
            Log in
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
        <Input label="First name" autoComplete="given-name" required {...register('first_name')} error={formState.errors.first_name?.message} />
        <Input label="Last name" autoComplete="family-name" required {...register('last_name')} error={formState.errors.last_name?.message} />
        <Input label="Email" type="email" autoComplete="email" required {...register('email')} error={formState.errors.email?.message} />
        <Input label="Phone" inputMode="numeric" maxLength={10} autoComplete="tel-national" placeholder="10 digit number" required {...register('phone')} error={formState.errors.phone?.message} />
        <Select
          label="I am registering as"
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
        <PasswordInput label="Password" autoComplete="new-password" required hint={PASSWORD_RULE_MESSAGE} {...register('password')} error={formState.errors.password?.message} />
        <PasswordInput label="Confirm password" autoComplete="new-password" required {...register('confirm_password')} error={formState.errors.confirm_password?.message} />
        <Button type="submit" size="lg" fullWidth className="sm:col-span-2" loading={registerMutation.isPending}>
          Create account
        </Button>
      </form>
    </AuthShell>
  );
};

export default RegisterPage;
