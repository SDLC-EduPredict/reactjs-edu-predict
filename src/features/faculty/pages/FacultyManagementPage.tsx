import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CheckCircle2, Pencil, Plus, UserX } from 'lucide-react';
import { Avatar, Badge, Button, Card, ConfirmDialog, DataTable, Input, Modal, PageHeader, Pagination, SearchInput, Switch, Tabs, Textarea, type Column } from '@/components/ui';
import { getErrorMessage } from '@/lib/api/apiError';
import { useDocumentTitle } from '@/lib/hooks/useDocumentTitle';
import { useListFilter } from '@/lib/hooks/useListFilter';
import { formatDate } from '@/lib/utils/format';
import { passwordSchema, phoneSchema, PASSWORD_RULE_MESSAGE } from '@/features/auth/schemas/authSchemas';
import { PasswordInput } from '@/features/auth/components/PasswordInput';
import { useServerErrors } from '@/features/auth/hooks/useServerErrors';
import { useAdminFaculty, useCreateFaculty, useDeactivateFaculty, useUpdateFaculty } from '../hooks/useFaculty';
import type { AdminFaculty } from '../types';

const baseSchema = z.object({
  first_name: z.string().trim().min(1, 'First name is required.'),
  last_name: z.string().trim().min(1, 'Last name is required.'),
  phone: phoneSchema,
  designation: z.string().trim().min(2, 'Enter a designation.'),
  expertise: z.string().trim().min(2, 'Enter areas of expertise.'),
  bio: z.string().trim().max(2000),
});
const createSchema = baseSchema.extend({ email: z.string().trim().email('Enter a valid email.'), password: passwordSchema });
const editSchema = baseSchema.extend({ is_active: z.boolean() });
type CreateValues = z.infer<typeof createSchema>;
type EditValues = z.infer<typeof editSchema>;

const CREATE_FIELDS = ['email', 'first_name', 'last_name', 'phone', 'password', 'designation', 'expertise', 'bio'] as const;
const LIST_KEY = 'admin-faculty';

type StatusTab = 'all' | 'true' | 'false';

export const FacultyManagementPage = () => {
  useDocumentTitle('Faculty management');
  const list = useListFilter(LIST_KEY);
  const faculty = useAdminFaculty(list.params);
  const create = useCreateFaculty();
  const update = useUpdateFaculty();
  const deactivate = useDeactivateFaculty();
  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<AdminFaculty | null>(null);
  const [removing, setRemoving] = useState<AdminFaculty | null>(null);
  const [photo, setPhoto] = useState<File | null>(null);
  const createForm = useForm<CreateValues>({ resolver: zodResolver(createSchema) });
  const editForm = useForm<EditValues>({ resolver: zodResolver(editSchema) });
  useServerErrors(create.error, createForm.setError, CREATE_FIELDS);

  const tab = (list.filters.is_active ?? 'all') as StatusTab;

  const openEdit = (row: AdminFaculty) => {
    setEditing(row);
    setPhoto(null);
    editForm.reset({
      first_name: row.user.first_name,
      last_name: row.user.last_name,
      phone: row.user.phone,
      designation: row.designation,
      expertise: row.expertise,
      bio: row.bio,
      is_active: row.user.is_active,
    });
  };

  const columns: Column<AdminFaculty>[] = [
    {
      key: 'name',
      header: 'Faculty member',
      render: (row) => (
        <div className="flex items-center gap-3">
          <Avatar name={row.user.full_name} src={row.photo} size="sm" />
          <div>
            <p className="font-semibold text-slate-900">{row.user.full_name}</p>
            <p className="text-[11px] text-slate-400">{row.user.email}</p>
          </div>
        </div>
      ),
    },
    { key: 'code', header: 'Code', render: (row) => <span className="font-mono text-xs">{row.employee_code}</span> },
    { key: 'designation', header: 'Designation', render: (row) => row.designation },
    { key: 'expertise', header: 'Expertise', render: (row) => <span className="line-clamp-1 max-w-[220px] text-xs text-slate-500">{row.expertise}</span> },
    { key: 'load', header: 'Courses / students', render: (row) => `${row.course_count} / ${row.student_count}` },
    { key: 'joined', header: 'Joined', render: (row) => formatDate(row.created_at) },
    { key: 'status', header: 'Status', render: (row) => <Badge tone={row.user.is_active ? 'green' : 'amber'}>{row.user.is_active ? 'Active' : 'Pending / inactive'}</Badge> },
    {
      key: 'actions',
      header: '',
      render: (row) => (
        <div className="flex justify-end gap-1">
          {!row.user.is_active && (
            <Button size="sm" variant="success" icon={<CheckCircle2 className="h-3.5 w-3.5" />} loading={update.isPending && update.variables?.id === row.id} onClick={() => update.mutate({ id: row.id, is_active: true })}>
              Approve
            </Button>
          )}
          <Button size="sm" variant="ghost" icon={<Pencil className="h-3.5 w-3.5" />} onClick={() => openEdit(row)}>
            Edit
          </Button>
          {row.user.is_active && (
            <Button size="sm" variant="ghost" className="text-rose-600 hover:bg-rose-50" icon={<UserX className="h-3.5 w-3.5" />} onClick={() => setRemoving(row)}>
              Deactivate
            </Button>
          )}
        </div>
      ),
    },
  ];

  const ce = createForm.formState.errors;
  const ee = editForm.formState.errors;

  return (
    <div>
      <PageHeader
        eyebrow="People"
        title="Faculty management"
        description="Create faculty accounts, approve self-registered faculty and manage profiles."
        actions={
          <Button
            icon={<Plus className="h-4 w-4" />}
            onClick={() => {
              createForm.reset({ email: '', first_name: '', last_name: '', phone: '', password: '', designation: '', expertise: '', bio: '' });
              setCreateOpen(true);
            }}
          >
            Add faculty
          </Button>
        }
      />
      <Card>
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 md:flex-row md:items-center md:justify-between">
          <Tabs
            value={tab}
            onChange={(value) => list.setFilter('is_active', value === 'all' ? '' : value)}
            tabs={[
              { value: 'all', label: 'All' },
              { value: 'true', label: 'Active' },
              { value: 'false', label: 'Pending approval' },
            ]}
          />
          <SearchInput value={list.search} onChange={list.setSearch} placeholder="Search name, email, expertise…" />
        </div>
        <DataTable
          columns={columns}
          rows={faculty.data?.results}
          rowKey={(row) => row.id}
          loading={faculty.isPending}
          error={faculty.isError ? getErrorMessage(faculty.error) : null}
          onRetry={() => faculty.refetch()}
        />
        {faculty.data && <Pagination page={list.page} pageSize={list.pageSize} count={faculty.data.count} onPageChange={list.setPage} />}
      </Card>

      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        size="lg"
        title="Add faculty member"
        description="The account is created as active and can log in immediately."
        footer={
          <>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button loading={create.isPending} onClick={createForm.handleSubmit((values) => create.mutate(values, { onSuccess: () => setCreateOpen(false) }))}>
              Create faculty
            </Button>
          </>
        }
      >
        <form className="grid gap-4 sm:grid-cols-2" noValidate>
          <Input label="First name" required {...createForm.register('first_name')} error={ce.first_name?.message} />
          <Input label="Last name" required {...createForm.register('last_name')} error={ce.last_name?.message} />
          <Input label="Email" type="email" required {...createForm.register('email')} error={ce.email?.message} />
          <Input label="Phone" maxLength={10} inputMode="numeric" required {...createForm.register('phone')} error={ce.phone?.message} />
          <PasswordInput label="Temporary password" containerClassName="sm:col-span-2" hint={PASSWORD_RULE_MESSAGE} required {...createForm.register('password')} error={ce.password?.message} />
          <Input label="Designation" required {...createForm.register('designation')} error={ce.designation?.message} />
          <Input label="Expertise" required {...createForm.register('expertise')} error={ce.expertise?.message} />
          <div className="sm:col-span-2">
            <Textarea label="Bio" rows={3} {...createForm.register('bio')} error={ce.bio?.message} />
          </div>
        </form>
      </Modal>

      <Modal
        open={editing !== null}
        onClose={() => setEditing(null)}
        size="lg"
        title={editing ? `Edit ${editing.user.full_name}` : 'Edit faculty'}
        footer={
          <>
            <Button variant="outline" onClick={() => setEditing(null)}>
              Cancel
            </Button>
            <Button
              loading={update.isPending}
              onClick={editForm.handleSubmit((values) => editing && update.mutate({ id: editing.id, ...values, photo }, { onSuccess: () => setEditing(null) }))}
            >
              Save changes
            </Button>
          </>
        }
      >
        <form className="grid gap-4 sm:grid-cols-2" noValidate>
          <Input label="First name" {...editForm.register('first_name')} error={ee.first_name?.message} />
          <Input label="Last name" {...editForm.register('last_name')} error={ee.last_name?.message} />
          <Input label="Phone" maxLength={10} {...editForm.register('phone')} error={ee.phone?.message} />
          <Input label="Designation" {...editForm.register('designation')} error={ee.designation?.message} />
          <Input label="Expertise" containerClassName="sm:col-span-2" {...editForm.register('expertise')} error={ee.expertise?.message} />
          <div className="sm:col-span-2">
            <Textarea label="Bio" rows={3} {...editForm.register('bio')} error={ee.bio?.message} />
          </div>
          <Input label="Photo" type="file" accept="image/*" onChange={(event) => setPhoto(event.target.files?.[0] ?? null)} />
          <Switch label="Account active" description="Inactive faculty cannot log in." className="self-end" {...editForm.register('is_active')} />
        </form>
      </Modal>

      <ConfirmDialog
        open={removing !== null}
        title="Deactivate faculty member?"
        message={`${removing?.user.full_name} will no longer be able to log in. Their courses and records are kept.`}
        confirmLabel="Deactivate"
        loading={deactivate.isPending}
        onClose={() => setRemoving(null)}
        onConfirm={() => removing && deactivate.mutate(removing.id, { onSuccess: () => setRemoving(null) })}
      />
    </div>
  );
};

export default FacultyManagementPage;
