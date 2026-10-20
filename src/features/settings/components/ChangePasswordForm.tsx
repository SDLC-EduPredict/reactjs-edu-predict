import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { KeyRound } from 'lucide-react';
import { Button, Card, CardBody, CardHeader } from '@/components/ui';
import { PasswordInput } from '@/features/auth/components/PasswordInput';
import { useChangePassword } from '@/features/auth/hooks/useAuth';
import { useServerErrors } from '@/features/auth/hooks/useServerErrors';
import { changePasswordSchema, PASSWORD_RULE_MESSAGE, type ChangePasswordValues } from '@/features/auth/schemas/authSchemas';

const FIELDS = ['old_password', 'password', 'confirm_password'] as const;

export const ChangePasswordForm = () => {
  const change = useChangePassword();
  const { register, handleSubmit, formState, reset, setError } = useForm<ChangePasswordValues>({ resolver: zodResolver(changePasswordSchema) });
  useServerErrors(change.error, setError, FIELDS);

  return (
    <Card>
      <CardHeader icon={<KeyRound className="h-4 w-4" />} title="Change password" description={PASSWORD_RULE_MESSAGE} />
      <CardBody>
        <form onSubmit={handleSubmit((values) => change.mutate(values, { onSuccess: () => reset() }))} className="grid gap-4 sm:grid-cols-3" noValidate>
          <PasswordInput label="Current password" autoComplete="current-password" {...register('old_password')} error={formState.errors.old_password?.message} />
          <PasswordInput label="New password" autoComplete="new-password" {...register('password')} error={formState.errors.password?.message} />
          <PasswordInput label="Confirm new password" autoComplete="new-password" {...register('confirm_password')} error={formState.errors.confirm_password?.message} />
          <div className="flex justify-end sm:col-span-3">
            <Button type="submit" loading={change.isPending}>
              Update password
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
};
