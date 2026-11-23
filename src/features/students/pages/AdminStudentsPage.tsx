import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Pencil, Plus, UserX } from 'lucide-react';
import { Avatar, Button, Card, ConfirmDialog, DataTable, Input, Modal, PageHeader, Pagination, ProgressBar, SearchInput, Select, Skeleton, StatusBadge, Switch, Tabs, Textarea } from '@/components/ui';
import { useDocumentTitle } from '@/lib/hooks/useDocumentTitle';
import { useListFilter } from '@/lib/hooks/useListFilter';
import { formatDate, resolveMediaUrl } from '@/lib/utils/format';
import { useAdminStudent, useAdminStudents, useCreateStudent, useDeactivateStudent, useUpdateStudent } from '../hooks/useStudents';
import { GENDERS, type StudentProfile } from '../types';

interface Values {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone: string;
  is_active: boolean;
  date_of_birth: string;
  gender: string;
  highest_qualification: string;
  city: string;
  address: string;
}

const EMPTY: Values = { email: '', password: '', first_name: '', last_name: '', phone: '', is_active: true, date_of_birth: '', gender: '', highest_qualification: '', city: '', address: '' };

const fromProfile = (p: StudentProfile): Values => ({
  ...EMPTY,
  email: p.user.email,
  first_name: p.user.first_name,
  last_name: p.user.last_name,
  phone: p.user.phone,
  is_active: p.user.is_active,
  date_of_birth: p.date_of_birth ?? '',
  gender: p.gender ?? '',
  highest_qualification: p.highest_qualification,
  city: p.city,
  address: p.address,
});

const StudentFormModal = ({ open, id, onClose }: { open: boolean; id: number | null; onClose: () => void }) => {
  const detail = useAdminStudent(id);
  const create = useCreateStudent();
  const update = useUpdateStudent();
  const { register, handleSubmit, reset, formState } = useForm<Values>({ defaultValues: EMPTY });
  useEffect(() => {
    if (id === null) reset(EMPTY);
    else if (detail.data) reset(fromProfile(detail.data));
  }, [id, detail.data, reset]);

  const submit = handleSubmit(({ email, password, is_active, ...rest }) => {
    const profile = { ...rest, date_of_birth: rest.date_of_birth || null };
    if (id === null) create.mutate({ email, password, ...profile }, { onSuccess: onClose });
    else update.mutate({ id, is_active, ...profile }, { onSuccess: onClose });
  });

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      title={id === null ? 'Add student' : (detail.data?.user.full_name ?? 'Edit student')}
      description={id === null ? 'Creates a student login and profile.' : detail.data ? `${detail.data.student_code} · joined ${formatDate(detail.data.created_at)}` : undefined}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="student-form" loading={create.isPending || update.isPending}>
            {id === null ? 'Create student' : 'Save changes'}
          </Button>
        </>
      }
    >
      {id !== null && detail.isPending ? (
        <Skeleton className="h-72 w-full" />
      ) : (
        <form id="student-form" onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
          {id !== null && detail.data && (
            <div className="flex items-center gap-4 rounded-2xl bg-brand-50 p-4 sm:col-span-2">
              <Avatar name={detail.data.user.full_name} src={resolveMediaUrl(detail.data.photo)} size="lg" />
              <div className="flex-1">
                <p className="text-xs text-slate-500">Profile completion</p>
                <ProgressBar value={detail.data.profile_completion} className="mt-1" />
              </div>
              <span className="font-display text-xl font-bold text-brand-700">{detail.data.profile_completion}%</span>
            </div>
          )}
          <Input label="Email" type="email" required disabled={id !== null} {...register('email', { required: id === null })} />
          {id === null ? <Input label="Temporary password" type="password" required {...register('password', { required: true, minLength: 8 })} error={formState.errors.password ? 'At least 8 characters' : undefined} /> : <div className="flex items-end pb-2"><Switch label="Account active" {...register('is_active')} /></div>}
          <Input label="First name" required {...register('first_name', { required: true })} />
          <Input label="Last name" required {...register('last_name', { required: true })} />
          <Input label="Phone" required {...register('phone', { required: true })} />
          <Input label="Date of birth" type="date" {...register('date_of_birth')} />
          <Select label="Gender" placeholder="Not specified" options={GENDERS} {...register('gender')} />
          <Input label="Highest qualification" {...register('highest_qualification')} />
          <Input label="City" {...register('city')} />
          <Textarea label="Address" rows={2} containerClassName="sm:col-span-2" {...register('address')} />
        </form>
      )}
    </Modal>
  );
};

const AdminStudentsPage = () => {
  useDocumentTitle('Students');
  const list = useListFilter('admin-students');
  const students = useAdminStudents({ ...list.params, is_active: list.filters.is_active || undefined });
  const deactivate = useDeactivateStudent();
  const [form, setForm] = useState<{ open: boolean; id: number | null }>({ open: false, id: null });
  const [target, setTarget] = useState<StudentProfile | null>(null);

  return (
    <>
      <PageHeader eyebrow="Administration" title="Students" description="Create, update and deactivate student accounts." actions={<Button icon={<Plus className="h-4 w-4" />} onClick={() => setForm({ open: true, id: null })}>Add student</Button>} />
      <Card className="overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center">
          <SearchInput value={list.search} onChange={list.setSearch} placeholder="Search name, email or code…" className="flex-1" />
          <Tabs tabs={[{ value: '', label: 'All' }, { value: 'true', label: 'Active' }, { value: 'false', label: 'Inactive' }]} value={list.filters.is_active ?? ''} onChange={(value) => list.setFilter('is_active', value)} />
        </div>
        <DataTable
          rows={students.data?.results}
          loading={students.isPending}
          rowKey={(row) => row.id}
          onRowClick={(row) => setForm({ open: true, id: row.id })}
          emptyTitle="No students found"
          columns={[
            {
              key: 'name',
              header: 'Student',
              render: (row) => (
                <div className="flex items-center gap-3">
                  <Avatar name={row.user.full_name} src={resolveMediaUrl(row.photo)} size="sm" />
                  <div>
                    <p className="font-semibold text-slate-900">{row.user.full_name}</p>
                    <p className="text-[11px] text-slate-500">{row.user.email}</p>
                  </div>
                </div>
              ),
            },
            { key: 'code', header: 'Code', render: (row) => <span className="font-mono text-xs">{row.student_code}</span> },
            { key: 'phone', header: 'Phone', render: (row) => row.user.phone || '—' },
            { key: 'city', header: 'City', render: (row) => row.city || '—' },
            { key: 'profile', header: 'Profile', render: (row) => <div className="w-24"><ProgressBar value={row.profile_completion} /></div> },
            { key: 'status', header: 'Status', render: (row) => <StatusBadge status={row.user.is_active ? 'ACTIVE' : 'INACTIVE'} /> },
            {
              key: 'actions',
              header: '',
              className: 'text-right',
              render: (row) => (
                <div className="flex justify-end gap-1" onClick={(event) => event.stopPropagation()}>
                  <Button size="sm" variant="ghost" aria-label="Edit" icon={<Pencil className="h-3.5 w-3.5" />} onClick={() => setForm({ open: true, id: row.id })} />
                  {row.user.is_active && <Button size="sm" variant="ghost" aria-label="Deactivate" icon={<UserX className="h-3.5 w-3.5 text-rose-500" />} onClick={() => setTarget(row)} />}
                </div>
              ),
            },
          ]}
        />
        <Pagination page={list.page} pageSize={list.pageSize} count={students.data?.count ?? 0} onPageChange={list.setPage} />
      </Card>
      <StudentFormModal open={form.open} id={form.id} onClose={() => setForm({ open: false, id: null })} />
      <ConfirmDialog
        open={target !== null}
        title="Deactivate student?"
        message={`${target?.user.full_name ?? ''} will no longer be able to sign in. Academic records are kept.`}
        confirmLabel="Deactivate"
        loading={deactivate.isPending}
        onClose={() => setTarget(null)}
        onConfirm={() => target && deactivate.mutate(target.id, { onSuccess: () => setTarget(null) })}
      />
    </>
  );
};

export default AdminStudentsPage;
