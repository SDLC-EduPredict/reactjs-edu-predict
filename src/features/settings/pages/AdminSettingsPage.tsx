import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Activity, RefreshCw, Save, Server, UserRound } from 'lucide-react';
import { Badge, Button, Card, CardBody, CardHeader, Input, PageHeader } from '@/components/ui';
import { env } from '@/config/env';
import { useDocumentTitle } from '@/lib/hooks/useDocumentTitle';
import { formatDate } from '@/lib/utils/format';
import { ChangePasswordCard, VerificationCards } from '@/features/auth/components/AccountSecurity';
import { useCurrentUser, useUpdateProfile } from '@/features/auth/hooks/useAuth';
import { profileSchema, type ProfileValues } from '@/features/auth/schemas/authSchemas';
import { useHealth } from '@/features/system/hooks/useHealth';

const HealthCard = () => {
  const health = useHealth();
  const ok = health.data?.ok ?? false;
  const failed = health.isError || (health.data !== undefined && !health.data.ok);
  const body = health.data?.body;
  const message = typeof body === 'string' ? body : body && typeof body === 'object' && 'message' in body ? String((body as { message: unknown }).message) : '';
  return (
    <Card>
      <CardHeader
        icon={<Server className="h-4 w-4" />}
        title="API health"
        description={env.apiBaseUrl}
        action={
          <Button size="sm" variant="ghost" icon={<RefreshCw className={`h-3.5 w-3.5 ${health.isFetching ? 'animate-spin' : ''}`} />} onClick={() => void health.refetch()}>
            Check
          </Button>
        }
      />
      <CardBody className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-[11px] text-slate-500">Status</p>
          <Badge tone={ok ? 'lime' : failed ? 'rose' : 'slate'} icon={<Activity className="h-3 w-3" />}>
            {ok ? 'Operational' : failed ? `Unreachable (${health.data?.statusCode ?? '—'})` : 'Checking…'}
          </Badge>
        </div>
        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-[11px] text-slate-500">Latency</p>
          <p className="font-display text-xl font-bold">{health.data ? `${health.data.latencyMs} ms` : '—'}</p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-[11px] text-slate-500">Message</p>
          <p className="truncate text-sm font-semibold">{message || (ok ? 'OK' : '—')}</p>
        </div>
      </CardBody>
    </Card>
  );
};

const AccountCard = () => {
  const { user } = useCurrentUser();
  const update = useUpdateProfile();
  const form = useForm<ProfileValues>({ resolver: zodResolver(profileSchema), defaultValues: { first_name: user?.first_name ?? '', last_name: user?.last_name ?? '', phone: user?.phone ?? '' } });
  useEffect(() => {
    if (user) form.reset({ first_name: user.first_name, last_name: user.last_name, phone: user.phone });
  }, [user, form]);
  const { errors } = form.formState;
  return (
    <Card>
      <CardHeader icon={<UserRound className="h-4 w-4" />} title="My account" description={user ? `${user.email} · ${user.role_display} · last login ${formatDate(user.last_login, true)}` : undefined} />
      <CardBody>
        <form onSubmit={form.handleSubmit((values) => update.mutate(values))} className="grid gap-4 sm:grid-cols-3" noValidate>
          <Input label="First name" {...form.register('first_name')} error={errors.first_name?.message} />
          <Input label="Last name" {...form.register('last_name')} error={errors.last_name?.message} />
          <Input label="Phone" {...form.register('phone')} error={errors.phone?.message} />
          <div className="sm:col-span-3">
            <Button type="submit" icon={<Save className="h-4 w-4" />} loading={update.isPending}>
              Save account
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
};

const AdminSettingsPage = () => {
  useDocumentTitle('Settings');
  return (
    <>
      <PageHeader eyebrow="System" title="Settings" description="System health, your administrator account and security." />
      <div className="space-y-6">
        <HealthCard />
        <AccountCard />
        <VerificationCards />
        <ChangePasswordCard />
      </div>
    </>
  );
};

export default AdminSettingsPage;
