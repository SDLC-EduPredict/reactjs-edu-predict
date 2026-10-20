import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { IdCard } from 'lucide-react';
import { Button, Card, CardBody, CardHeader, ErrorState, Input, Select, Skeleton, Textarea } from '@/components/ui';
import { getErrorMessage } from '@/lib/api/apiError';
import { useOwnStudentProfile, useUpdateOwnStudentProfile } from '../hooks/useStudents';

const optionalPhone = z.string().trim().regex(/^(\d{10})?$/, 'Phone number must be exactly 10 digits.');

const schema = z.object({
  date_of_birth: z.string(),
  gender: z.string(),
  qualification: z.string().trim().max(150),
  institution: z.string().trim().max(150),
  city: z.string().trim().max(100),
  address: z.string().trim().max(500),
  guardian_name: z.string().trim().max(150),
  guardian_phone: optionalPhone,
});

type Values = z.infer<typeof schema>;

export const StudentDetailsForm = () => {
  const profile = useOwnStudentProfile();
  const update = useUpdateOwnStudentProfile();
  const { register, handleSubmit, formState, reset } = useForm<Values>({ resolver: zodResolver(schema) });

  useEffect(() => {
    const data = profile.data;
    if (!data) return;
    reset({
      date_of_birth: data.date_of_birth ?? '',
      gender: data.gender ?? '',
      qualification: data.qualification ?? '',
      institution: data.institution ?? '',
      city: data.city ?? '',
      address: data.address ?? '',
      guardian_name: data.guardian_name ?? '',
      guardian_phone: data.guardian_phone ?? '',
    });
  }, [profile.data, reset]);

  if (profile.isPending) return <Skeleton className="h-72" />;
  if (profile.isError) return <ErrorState message={getErrorMessage(profile.error)} onRetry={() => profile.refetch()} />;

  return (
    <Card>
      <CardHeader icon={<IdCard className="h-4 w-4" />} title="Student details" description={`Student code ${profile.data.student_code}`} />
      <CardBody>
        <form onSubmit={handleSubmit((values) => update.mutate(values))} className="grid gap-4 sm:grid-cols-2" noValidate>
          <Input label="Date of birth" type="date" {...register('date_of_birth')} />
          <Select
            label="Gender"
            placeholder="Prefer not to say"
            options={[
              { value: 'MALE', label: 'Male' },
              { value: 'FEMALE', label: 'Female' },
              { value: 'OTHER', label: 'Other' },
            ]}
            {...register('gender')}
          />
          <Input label="Highest qualification" {...register('qualification')} error={formState.errors.qualification?.message} />
          <Input label="College / institution" {...register('institution')} error={formState.errors.institution?.message} />
          <Input label="City" {...register('city')} error={formState.errors.city?.message} />
          <Input label="Guardian name" {...register('guardian_name')} error={formState.errors.guardian_name?.message} />
          <Input label="Guardian phone" inputMode="numeric" maxLength={10} {...register('guardian_phone')} error={formState.errors.guardian_phone?.message} />
          <div className="sm:col-span-2">
            <Textarea label="Address" rows={3} {...register('address')} error={formState.errors.address?.message} />
          </div>
          <div className="flex justify-end sm:col-span-2">
            <Button type="submit" loading={update.isPending} disabled={!formState.isDirty}>
              Save details
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
};
