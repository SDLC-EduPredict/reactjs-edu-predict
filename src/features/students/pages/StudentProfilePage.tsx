import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Save, UserRound } from 'lucide-react';
import { Button, Card, CardBody, CardHeader, Input, PageHeader, ProgressBar, Select, Textarea } from '@/components/ui';
import { PhotoPicker } from '@/components/domain/PhotoPicker';
import { QueryView } from '@/components/domain/QueryView';
import { useDocumentTitle } from '@/lib/hooks/useDocumentTitle';
import { formatDate, humanize } from '@/lib/utils/format';
import { ChangePasswordCard, VerificationCards } from '@/features/auth/components/AccountSecurity';
import { useOwnStudentProfile, useUpdateOwnStudentProfile } from '../hooks/useStudents';
import { GENDERS, type StudentProfile } from '../types';

interface FormValues {
  first_name: string;
  last_name: string;
  phone: string;
  date_of_birth: string;
  gender: string;
  highest_qualification: string;
  city: string;
  address: string;
}

const toValues = (profile: StudentProfile): FormValues => ({
  first_name: profile.user.first_name,
  last_name: profile.user.last_name,
  phone: profile.user.phone,
  date_of_birth: profile.date_of_birth ?? '',
  gender: profile.gender ?? '',
  highest_qualification: profile.highest_qualification,
  city: profile.city,
  address: profile.address,
});

const ProfileForm = ({ profile }: { profile: StudentProfile }) => {
  const update = useUpdateOwnStudentProfile();
  const [photo, setPhoto] = useState<File | null>(null);
  const { register, handleSubmit, reset, formState } = useForm<FormValues>({ defaultValues: toValues(profile) });
  useEffect(() => reset(toValues(profile)), [profile, reset]);

  return (
    <div className="grid gap-6 xl:grid-cols-[320px_1fr]">
      <Card className="overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-brand-700 to-brand-500" />
        <CardBody className="-mt-14 text-center">
          <PhotoPicker name={profile.user.full_name} current={profile.photo} onChange={setPhoto} />
          <h2 className="mt-3 font-display text-lg font-semibold text-slate-900">{profile.user.full_name}</h2>
          <p className="text-xs text-slate-500">{profile.user.email}</p>
          <p className="mt-1 text-[11px] font-semibold text-brand-700">{profile.student_code}</p>
          <div className="mt-5 text-left">
            <div className="mb-1 flex justify-between text-xs">
              <span className="text-slate-500">Profile completion</span>
              <span className="font-bold text-slate-900">{profile.profile_completion}%</span>
            </div>
            <ProgressBar value={profile.profile_completion} />
            {profile.missing_profile_fields.length > 0 && <p className="mt-2 text-[11px] text-slate-500">Missing: {profile.missing_profile_fields.map(humanize).join(', ')}</p>}
          </div>
          <p className="mt-4 text-[11px] text-slate-400">Member since {formatDate(profile.created_at)}</p>
        </CardBody>
      </Card>
      <Card>
        <CardHeader icon={<UserRound className="h-4 w-4" />} title="Personal details" description="Keep your details current — they appear on certificates and reports." />
        <CardBody>
          <form
            onSubmit={handleSubmit((values) =>
              update.mutate({ ...values, date_of_birth: values.date_of_birth || null, photo }, { onSuccess: () => setPhoto(null) }),
            )}
            className="grid gap-4 sm:grid-cols-2"
          >
            <Input label="First name" {...register('first_name', { required: true })} />
            <Input label="Last name" {...register('last_name', { required: true })} />
            <Input label="Phone" {...register('phone')} />
            <Input label="Date of birth" type="date" {...register('date_of_birth')} />
            <Select label="Gender" placeholder="Select gender" options={GENDERS} {...register('gender')} />
            <Input label="Highest qualification" placeholder="e.g. B.Tech Computer Science" {...register('highest_qualification')} />
            <Input label="City" {...register('city')} />
            <Textarea label="Address" rows={2} containerClassName="sm:col-span-2" {...register('address')} />
            <div className="sm:col-span-2">
              <Button type="submit" icon={<Save className="h-4 w-4" />} loading={update.isPending} disabled={!formState.isDirty && !photo}>
                Save profile
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};

const StudentProfilePage = () => {
  useDocumentTitle('Student Profile');
  const profile = useOwnStudentProfile();
  return (
    <>
      <PageHeader eyebrow="Account" title="Student Profile" description="Your personal information, verification and security settings." />
      <div className="space-y-6">
        <QueryView query={profile}>{(data) => <ProfileForm profile={data} />}</QueryView>
        <VerificationCards />
        <ChangePasswordCard />
      </div>
    </>
  );
};

export default StudentProfilePage;
