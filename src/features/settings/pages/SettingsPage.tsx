import { Link } from 'react-router-dom';
import { Server } from 'lucide-react';
import { API_BASE_URL, env } from '@/config/env';
import { Alert, Card, CardBody, CardHeader, PageHeader } from '@/components/ui';
import { PATHS } from '@/app/router/paths';
import { useDocumentTitle } from '@/lib/hooks/useDocumentTitle';
import { useCurrentUser } from '@/features/auth/hooks/useAuth';
import { AccountProfileForm } from '../components/AccountProfileForm';
import { ChangePasswordForm } from '../components/ChangePasswordForm';
import { FacultyProfileForm } from '../components/FacultyProfileForm';

export const SettingsPage = () => {
  useDocumentTitle('Settings');
  const { user, role, isAdmin } = useCurrentUser();
  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Account" title="Profile & settings" description="Manage your account, security and portal configuration." />
      {user && !user.email_verified && (
        <Alert tone="warning" title="Email not verified">
          <Link to={PATHS.verifyEmail} className="font-semibold underline">
            Verify your email
          </Link>{' '}
          to receive academic notifications.
        </Alert>
      )}
      <AccountProfileForm />
      {role === 'FACULTY' && <FacultyProfileForm />}
      <ChangePasswordForm />
      {isAdmin && (
        <Card>
          <CardHeader icon={<Server className="h-4 w-4" />} title="System configuration" description="Values loaded from the frontend .env file." />
          <CardBody>
            <dl className="grid gap-3 text-sm sm:grid-cols-2">
              {[
                ['API base URL', API_BASE_URL],
                ['Media base URL', env.mediaBaseUrl],
                ['Environment', env.appEnv],
                ['Request timeout', `${env.apiTimeoutMs} ms`],
                ['Default page size', String(env.defaultPageSize)],
                ['Notification refresh', `${Math.round(env.notificationPollIntervalMs / 1000)} s`],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl bg-slate-50 px-4 py-3">
                  <dt className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{label}</dt>
                  <dd className="mt-0.5 break-all font-mono text-xs text-slate-800">{value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 text-xs text-slate-500">
              Roles, permissions and model training are managed on the Django server (Django Admin / Super Admin).
            </p>
          </CardBody>
        </Card>
      )}
    </div>
  );
};

export default SettingsPage;
