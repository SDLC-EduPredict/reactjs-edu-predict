import { PageHeader } from '@/components/ui';
import { useDocumentTitle } from '@/lib/hooks/useDocumentTitle';
import { AccountProfileForm } from '@/features/settings/components/AccountProfileForm';
import { ChangePasswordForm } from '@/features/settings/components/ChangePasswordForm';
import { StudentDetailsForm } from '../components/StudentDetailsForm';

export const StudentProfilePage = () => {
  useDocumentTitle('My profile');
  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Account" title="My profile" description="Keep your contact and academic details up to date." />
      <AccountProfileForm />
      <StudentDetailsForm />
      <ChangePasswordForm />
    </div>
  );
};

export default StudentProfilePage;
