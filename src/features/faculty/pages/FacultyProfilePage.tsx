import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { BadgeCheck, Save, UserRound } from 'lucide-react';
import { Button, Card, CardBody, CardHeader, Input, PageHeader, Textarea } from '@/components/ui';
import { PhotoPicker } from '@/components/domain/PhotoPicker';
import { QueryView } from '@/components/domain/QueryView';
import { useDocumentTitle } from '@/lib/hooks/useDocumentTitle';
import { formatDate } from '@/lib/utils/format';
import { ChangePasswordCard, VerificationCards } from '@/features/auth/components/AccountSecurity';
import { useFacultyProfile, useUpdateFacultyProfile } from '../hooks/useFaculty';
import type { FacultyProfile } from '../types';

interface Values {
  first_name: string;
  last_name: string;
  phone: string;
  designation: string;
  expertise: string;
  bio: string;
}

const toValues = (p: FacultyProfile): Values => ({
  first_name: p.user.first_name,
  last_name: p.user.last_name,
  phone: p.user.phone,
  designation: p.designation,
  expertise: p.expertise,
  bio: p.bio,
});

const ProfileForm = ({ profile }: { profile: FacultyProfile }) => {
  const update = useUpdateFacultyProfile();
  const [photo, setPhoto] = useState<File | null>(null);
  const { register, handleSubmit, reset, formState } = useForm<Values>({ defaultValues: toValues(profile) });
  useEffect(() => reset(toValues(profile)), [profile, reset]);

  return (
    <div className="grid gap-6 xl:grid-cols-[320px_1fr]">
      <Card className="overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-brand-700 via-brand-600 to-lime-brand" />
        <CardBody className="-mt-14 text-center">
          <PhotoPicker key={profile.updated_at} name={profile.user.full_name} current={profile.photo} onChange={setPhoto} />
          <h2 className="mt-3 font-display text-lg font-semibold text-slate-900">{profile.user.full_name}</h2>
          <p className="text-xs font-semibold text-brand-700">{profile.designation || 'Faculty Member'}</p>
          <p className="mt-1 text-[11px] text-slate-500">{profile.employee_code}</p>
          <div className="mt-4 flex flex-wrap justify-center gap-1.5">
            {profile.expertise
              .split(',')
              .map((item) => item.trim())
              .filter(Boolean)
              .map((item) => (
                <span key={item} className="rounded-full bg-brand-50 px-2.5 py-0.5 text-[11px] font-semibold text-brand-700">
                  {item}
                </span>
              ))}
          </div>
          <p className="mt-4 flex items-center justify-center gap-1 text-[11px] text-slate-400">
            <BadgeCheck className="h-3.5 w-3.5" /> Joined {formatDate(profile.created_at)}
          </p>
        </CardBody>
      </Card>
      <Card>
        <CardHeader icon={<UserRound className="h-4 w-4" />} title="Public mentor profile" description="Shown on the public faculty page and course detail pages." />
        <CardBody>
          <form onSubmit={handleSubmit((values) => update.mutate({ ...values, photo }, { onSuccess: () => setPhoto(null) }))} className="grid gap-4 sm:grid-cols-2">
            <Input label="First name" {...register('first_name', { required: true })} />
            <Input label="Last name" {...register('last_name', { required: true })} />
            <Input label="Phone" {...register('phone')} />
            <Input label="Designation" placeholder="e.g. Senior Data Science Mentor" {...register('designation')} />
            <Input label="Expertise (comma separated)" containerClassName="sm:col-span-2" placeholder="Python, Django, Machine Learning" {...register('expertise')} />
            <Textarea label="Biography" rows={5} containerClassName="sm:col-span-2" {...register('bio')} />
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

const FacultyProfilePage = () => {
  useDocumentTitle('Faculty Profile');
  const profile = useFacultyProfile();
  return (
    <>
      <PageHeader eyebrow="Account" title="Faculty Profile" description="Manage your mentor profile, verification and password." />
      <div className="space-y-6">
        <QueryView query={profile}>{(data) => <ProfileForm profile={data} />}</QueryView>
        <VerificationCards />
        <ChangePasswordCard />
      </div>
    </>
  );
};

export default FacultyProfilePage;
