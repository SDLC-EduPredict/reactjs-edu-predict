import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, ShieldCheck, UserRound } from 'lucide-react';
import { Badge, Button, Card, CardBody, CardHeader, Input } from '@/components/ui';
import { formatDate } from '@/lib/utils/format';
import { useCurrentUser, useUpdateProfile } from '@/features/auth/hooks/useAuth';
import { useServerErrors } from '@/features/auth/hooks/useServerErrors';
import { profileSchema, type ProfileValues } from '@/features/auth/schemas/authSchemas';

const FIELDS = ['first_name', 'last_name', 'phone'] as const;

export const AccountProfileForm = () => {
  const { user } = useCurrentUser();
  const update = useUpdateProfile();
  const { register, handleSubmit, formState, reset, setError } = useForm<ProfileValues>({ resolver: zodResolver(profileSchema) });
  useServerErrors(update.error, setError, FIELDS);

  useEffect(() => {
    if (user) reset({ first_name: user.first_name, last_name: user.last_name, phone: user.phone });
  }, [user, reset]);

  if (!user) return null;

  return (
    <Card>
      <CardHeader
        icon={<UserRound className="h-4 w-4" />}
        title="Account details"
        description={`Member since ${formatDate(user.date_joined)}`}
        action={
          <div className="flex flex-wrap gap-1.5">
            <Badge tone="brand">{user.role_display}</Badge>
            <Badge tone={user.email_verified ? 'green' : 'amber'} icon={<ShieldCheck className="h-3 w-3" />}>
              {user.email_verified ? 'Email verified' : 'Email not verified'}
            </Badge>
          </div>
        }
      />
      <CardBody>
        <form onSubmit={handleSubmit((values) => update.mutate(values))} className="grid gap-4 sm:grid-cols-2" noValidate>
          <Input label="First name" required {...register('first_name')} error={formState.errors.first_name?.message} />
          <Input label="Last name" required {...register('last_name')} error={formState.errors.last_name?.message} />
          <Input label="Email" value={user.email} leftIcon={<Mail className="h-4 w-4" />} disabled hint="Contact the administrator to change your email." readOnly />
          <Input label="Phone" inputMode="numeric" maxLength={10} required {...register('phone')} error={formState.errors.phone?.message} />
          <div className="flex justify-end sm:col-span-2">
            <Button type="submit" loading={update.isPending} disabled={!formState.isDirty}>
              Save changes
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
};
