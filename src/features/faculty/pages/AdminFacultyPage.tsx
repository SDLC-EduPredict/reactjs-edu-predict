import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import { CheckCircle2, Pencil, Plus, UserX } from 'lucide-react';
import { Avatar, Button, Card, ConfirmDialog, DataTable, Input, Modal, PageHeader, Pagination, SearchInput, Skeleton, StatusBadge, Switch, Tabs, Textarea } from '@/components/ui';
import { PhotoPicker } from '@/components/domain/PhotoPicker';
import { useDocumentTitle } from '@/lib/hooks/useDocumentTitle';
import { useListFilter } from '@/lib/hooks/useListFilter';
import { formatDate, resolveMediaUrl } from '@/lib/utils/format';
import { useAdminFaculty, useAdminFacultyMember, useCreateFaculty, useDeactivateFaculty, useUpdateFaculty } from '../hooks/useFaculty';
import type { AdminFaculty, FacultyProfile } from '../types';

interface Values {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone: string;
  is_active: boolean;
  designation: string;
  expertise: string;
  bio: string;
}

const EMPTY: Values = { email: '', password: '', first_name: '', last_name: '', phone: '', is_active: true, designation: '', expertise: '', bio: '' };
const fromProfile = (p: FacultyProfile): Values => ({ ...EMPTY, email: p.user.email, first_name: p.user.first_name, last_name: p.user.last_name, phone: p.user.phone, is_active: p.user.is_active, designation: p.designation, expertise: p.expertise, bio: p.bio });

const FacultyFormModal = ({ open, id, onClose }: { open: boolean; id: number | null; onClose: () => void }) => {
  const detail = useAdminFacultyMember(id);
  const create = useCreateFaculty();
  const update = useUpdateFaculty();
  const [photo, setPhoto] = useState<File | null>(null);
  const { register, handleSubmit, reset, control } = useForm<Values>({ defaultValues: EMPTY });
  const [firstName, lastName] = useWatch({ control, name: ['first_name', 'last_name'] });
  const newName = `${firstName} ${lastName}`.trim() || 'New faculty';
  useEffect(() => {
    if (id === null) reset(EMPTY);
    else if (detail.data) reset(fromProfile(detail.data));
  }, [id, detail.data, reset]);

  const submit = handleSubmit(({ email, password, is_active, ...rest }) => {
    if (id === null) create.mutate({ email, password, ...rest, photo }, { onSuccess: onClose });
    else update.mutate({ id, is_active, ...rest, ...(photo ? { photo } : {}) }, { onSuccess: onClose });
  });

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      title={id === null ? 'Add faculty member' : (detail.data?.user.full_name ?? 'Edit faculty')}
      description={detail.data ? `${detail.data.employee_code} · ${detail.data.course_count} courses · ${detail.data.student_count} students` : 'Creates a faculty login and mentor profile.'}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="faculty-form" loading={create.isPending || update.isPending}>
            {id === null ? 'Create faculty' : 'Save changes'}
          </Button>
        </>
      }
    >
      {id !== null && detail.isPending ? (
        <Skeleton className="h-72 w-full" />
      ) : (
        <form id="faculty-form" onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
          {id === null && (
            <div className="flex items-center gap-4 rounded-2xl bg-brand-50 p-4 sm:col-span-2">
              <PhotoPicker name={newName} current={null} onChange={setPhoto} />
              <p className="text-xs text-slate-500">Optional profile photo. JPG, PNG, WEBP or GIF up to 2 MB.</p>
            </div>
          )}
          {id !== null && detail.data && (
            <div className="flex items-center gap-4 rounded-2xl bg-brand-50 p-4 sm:col-span-2">
              <PhotoPicker key={`${id}-${detail.data.updated_at}`} name={detail.data.user.full_name} current={detail.data.photo} onChange={setPhoto} />
              <div className="text-xs text-slate-500">
                <p>Joined {formatDate(detail.data.created_at)}</p>
                <p>Last login {formatDate(detail.data.user.last_login, true)}</p>
              </div>
            </div>
          )}
          <Input label="Email" type="email" required disabled={id !== null} {...register('email', { required: id === null })} />
          {id === null ? <Input label="Temporary password" type="password" required {...register('password', { required: true })} /> : <div className="flex items-end pb-2"><Switch label="Approved & active" {...register('is_active')} /></div>}
          <Input label="First name" required {...register('first_name', { required: true })} />
          <Input label="Last name" required {...register('last_name', { required: true })} />
          <Input label="Phone" {...register('phone')} />
          <Input label="Designation" {...register('designation')} />
          <Input label="Expertise" containerClassName="sm:col-span-2" placeholder="Comma separated" {...register('expertise')} />
          <Textarea label="Biography" rows={3} containerClassName="sm:col-span-2" {...register('bio')} />
        </form>
      )}
    </Modal>
  );
};

const AdminFacultyPage = () => {
  useDocumentTitle('Faculty');
  const [params] = useSearchParams();
  const list = useListFilter('admin-faculty');
  const { setFilter } = list;
  useEffect(() => {
    if (params.get('status') === 'pending') setFilter('is_active', 'false');
  }, [params, setFilter]);
  const faculty = useAdminFaculty({ ...list.params, is_active: list.filters.is_active || undefined });
  const update = useUpdateFaculty();
  const deactivate = useDeactivateFaculty();
  const [form, setForm] = useState<{ open: boolean; id: number | null }>({ open: false, id: null });
  const [target, setTarget] = useState<AdminFaculty | null>(null);

  return (
    <>
      <PageHeader eyebrow="Administration" title="Faculty" description="Approve, update and manage faculty accounts and mentor profiles." actions={<Button icon={<Plus className="h-4 w-4" />} onClick={() => setForm({ open: true, id: null })}>Add faculty</Button>} />
      <Card className="overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center">
          <SearchInput value={list.search} onChange={list.setSearch} placeholder="Search faculty…" className="flex-1" />
          <Tabs tabs={[{ value: '', label: 'All' }, { value: 'true', label: 'Active' }, { value: 'false', label: 'Pending / inactive' }]} value={list.filters.is_active ?? ''} onChange={(value) => list.setFilter('is_active', value)} />
        </div>
        <DataTable
          rows={faculty.data?.results}
          loading={faculty.isPending}
          rowKey={(row) => row.id}
          onRowClick={(row) => setForm({ open: true, id: row.id })}
          emptyTitle="No faculty found"
          columns={[
            {
              key: 'name',
              header: 'Faculty',
              render: (row) => (
                <div className="flex items-center gap-3">
                  <Avatar name={row.user.full_name} src={resolveMediaUrl(row.photo)} size="sm" />
                  <div>
                    <p className="font-semibold text-slate-900">{row.user.full_name}</p>
                    <p className="text-[11px] text-slate-500">{row.designation || row.user.email}</p>
                  </div>
                </div>
              ),
            },
            { key: 'code', header: 'Code', render: (row) => <span className="font-mono text-xs">{row.employee_code}</span> },
            { key: 'exp', header: 'Expertise', render: (row) => <span className="line-clamp-1 max-w-52 text-xs">{row.expertise || '—'}</span> },
            { key: 'courses', header: 'Courses', render: (row) => row.course_count },
            { key: 'students', header: 'Students', render: (row) => row.student_count },
            { key: 'status', header: 'Status', render: (row) => <StatusBadge status={row.user.is_active ? 'ACTIVE' : 'PENDING'} label={row.user.is_active ? 'Active' : 'Pending'} /> },
            {
              key: 'actions',
              header: '',
              className: 'text-right',
              render: (row) => (
                <div className="flex justify-end gap-1" onClick={(event) => event.stopPropagation()}>
                  {!row.user.is_active && (
                    <Button size="sm" variant="lime" icon={<CheckCircle2 className="h-3.5 w-3.5" />} loading={update.isPending && update.variables?.id === row.id} onClick={() => update.mutate({ id: row.id, is_active: true })}>
                      Approve
                    </Button>
                  )}
                  <Button size="sm" variant="ghost" aria-label="Edit" icon={<Pencil className="h-3.5 w-3.5" />} onClick={() => setForm({ open: true, id: row.id })} />
                  {row.user.is_active && <Button size="sm" variant="ghost" aria-label="Deactivate" icon={<UserX className="h-3.5 w-3.5 text-rose-500" />} onClick={() => setTarget(row)} />}
                </div>
              ),
            },
          ]}
        />
        <Pagination page={list.page} pageSize={list.pageSize} count={faculty.data?.count ?? 0} onPageChange={list.setPage} />
      </Card>
      <FacultyFormModal key={`${form.open}-${form.id ?? 'new'}`} open={form.open} id={form.id} onClose={() => setForm({ open: false, id: null })} />
      <ConfirmDialog
        open={target !== null}
        title="Deactivate faculty member?"
        message={`${target?.user.full_name ?? ''} will lose portal access. Courses remain assigned until changed.`}
        confirmLabel="Deactivate"
        loading={deactivate.isPending}
        onClose={() => setTarget(null)}
        onConfirm={() => target && deactivate.mutate(target.id, { onSuccess: () => setTarget(null) })}
      />
    </>
  );
};

export default AdminFacultyPage;
