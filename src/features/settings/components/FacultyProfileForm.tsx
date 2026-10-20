import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Briefcase, Upload } from 'lucide-react';
import { Avatar, Button, Card, CardBody, CardHeader, ErrorState, Input, Skeleton, Textarea } from '@/components/ui';
import { getErrorMessage } from '@/lib/api/apiError';
import { useFacultyProfile, useUpdateFacultyProfile } from '@/features/faculty/hooks/useFaculty';

const schema = z.object({
  designation: z.string().trim().min(2, 'Enter your designation.'),
  expertise: z.string().trim().min(2, 'Enter your areas of expertise.'),
  bio: z.string().trim().max(2000),
});

type Values = z.infer<typeof schema>;

export const FacultyProfileForm = () => {
  const profile = useFacultyProfile();
  const update = useUpdateFacultyProfile();
  const [photo, setPhoto] = useState<File | null>(null);
  const { register, handleSubmit, formState, reset } = useForm<Values>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (profile.data) reset({ designation: profile.data.designation, expertise: profile.data.expertise, bio: profile.data.bio });
  }, [profile.data, reset]);

  const preview = useMemo(() => (photo ? URL.createObjectURL(photo) : null), [photo]);

  useEffect(
    () => () => {
      if (preview) URL.revokeObjectURL(preview);
    },
    [preview],
  );

  if (profile.isPending) return <Skeleton className="h-72" />;
  if (profile.isError) return <ErrorState message={getErrorMessage(profile.error)} onRetry={() => profile.refetch()} />;

  return (
    <Card>
      <CardHeader icon={<Briefcase className="h-4 w-4" />} title="Faculty profile" description={`Employee code ${profile.data.employee_code}`} />
      <CardBody>
        <form
          onSubmit={handleSubmit((values) => update.mutate({ ...values, photo }, { onSuccess: () => setPhoto(null) }))}
          className="grid gap-4 sm:grid-cols-2"
          noValidate
        >
          <div className="flex items-center gap-4 sm:col-span-2">
            <Avatar name={profile.data.user.full_name} src={preview ?? profile.data.photo} size="xl" />
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:border-brand-300">
              <Upload className="h-4 w-4" /> Upload photo
              <input type="file" accept="image/*" className="sr-only" onChange={(event) => setPhoto(event.target.files?.[0] ?? null)} />
            </label>
          </div>
          <Input label="Designation" {...register('designation')} error={formState.errors.designation?.message} />
          <Input label="Expertise" {...register('expertise')} error={formState.errors.expertise?.message} />
          <div className="sm:col-span-2">
            <Textarea label="Bio" rows={4} {...register('bio')} error={formState.errors.bio?.message} />
          </div>
          <div className="flex justify-end sm:col-span-2">
            <Button type="submit" loading={update.isPending} disabled={!formState.isDirty && !photo}>
              Save faculty profile
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
};
