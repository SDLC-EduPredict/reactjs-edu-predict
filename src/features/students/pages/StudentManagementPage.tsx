import { useState } from 'react';
import { useForm, type FieldErrors, type UseFormRegister } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, Pencil, Plus, UserX } from 'lucide-react';
import { Avatar, Badge, Button, Card, ConfirmDialog, DataTable, Input, Modal, PageHeader, Pagination, SearchInput, Select, Spinner, Switch, Tabs, Textarea, type Column } from '@/components/ui';
import { getErrorMessage } from '@/lib/api/apiError';
import { useDocumentTitle } from '@/lib/hooks/useDocumentTitle';
import { useListFilter } from '@/lib/hooks/useListFilter';
import { formatDate, humanize } from '@/lib/utils/format';
import { passwordSchema, phoneSchema, PASSWORD_RULE_MESSAGE } from '@/features/auth/schemas/authSchemas';
import { PasswordInput } from '@/features/auth/components/PasswordInput';
import { useServerErrors } from '@/features/auth/hooks/useServerErrors';
import { useCourseOptions } from '@/features/courses/hooks/useCourses';
import { useStudentPrediction } from '@/features/predictions/hooks/usePredictions';
import { IndicatorBadge } from '@/features/performance/components/IndicatorBadge';
import { useAdminStudent, useAdminStudents, useCreateStudent, useDeactivateStudent, useUpdateStudent } from '../hooks/useStudents';
import type { StudentProfile } from '../types';

const optionalPhone = z.string().trim().regex(/^(\d{10})?$/, 'Phone number must be exactly 10 digits.');

const detailsSchema = z.object({
  first_name: z.string().trim().min(1, 'First name is required.'),
  last_name: z.string().trim().min(1, 'Last name is required.'),
  phone: phoneSchema,
  date_of_birth: z.string(),
  qualification: z.string().trim(),
  institution: z.string().trim(),
  city: z.string().trim(),
  address: z.string().trim(),
  guardian_name: z.string().trim(),
  guardian_phone: optionalPhone,
});
const editSchema = detailsSchema.extend({ email: z.string(), password: z.string(), is_active: z.boolean() });
const createSchema = editSchema.extend({ email: z.string().trim().email('Enter a valid email.'), password: passwordSchema });
type StudentValues = z.infer<typeof editSchema>;

const CREATE_FIELDS = ['email', 'first_name', 'last_name', 'phone', 'password'] as const;
const LIST_KEY = 'admin-students';

const emptyDetails = { first_name: '', last_name: '', phone: '', date_of_birth: '', qualification: '', institution: '', city: '', address: '', guardian_name: '', guardian_phone: '' };

const StudentDetail = ({ id }: { id: number }) => {
  const student = useAdminStudent(id);
  const prediction = useStudentPrediction(id);
  if (student.isPending) return <Spinner className="py-10" />;
  if (student.isError) return <p className="text-sm text-rose-600">{getErrorMessage(student.error)}</p>;
  const s = student.data;
  const rows: [string, string][] = [
    ['Student code', s.student_code],
    ['Email', s.user.email],
    ['Phone', s.user.phone],
    ['Date of birth', formatDate(s.date_of_birth)],
    ['Gender', humanize(s.gender) || '—'],
    ['Qualification', s.qualification || '—'],
    ['Institution', s.institution || '—'],
    ['City', s.city || '—'],
    ['Guardian', [s.guardian_name, s.guardian_phone].filter(Boolean).join(' · ') || '—'],
    ['Registered', formatDate(s.created_at)],
  ];
  const latest = prediction.data?.latest;
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-4">
        <Avatar name={s.user.full_name} src={s.photo} size="lg" />
        <div>
          <p className="text-lg font-bold text-slate-900">{s.user.full_name}</p>
          <div className="mt-1 flex gap-1.5">
            <Badge tone={s.user.is_active ? 'green' : 'slate'}>{s.user.is_active ? 'Active' : 'Inactive'}</Badge>
            <Badge tone={s.user.email_verified ? 'brand' : 'amber'}>{s.user.email_verified ? 'Email verified' : 'Email unverified'}</Badge>
          </div>
        </div>
      </div>
      <dl className="grid gap-2 sm:grid-cols-2">
        {rows.map(([label, value]) => (
          <div key={label} className="rounded-xl bg-slate-50 px-3 py-2">
            <dt className="text-[11px] text-slate-500">{label}</dt>
            <dd className="text-sm font-semibold text-slate-800">{value}</dd>
          </div>
        ))}
      </dl>
      <div className="rounded-xl border border-brand-100 bg-brand-50/60 p-4">
        <p className="text-xs font-bold text-brand-800">Latest ML prediction</p>
        {latest ? (
          <div className="mt-1 flex items-center gap-3">
            <span className="text-2xl font-extrabold text-slate-900">{latest.predicted_score.toFixed(1)}</span>
            <IndicatorBadge indicator={latest.indicator} label={latest.indicator_display} />
          </div>
        ) : (
          <p className="mt-1 text-xs text-slate-500">{prediction.isPending ? 'Loading…' : 'No prediction generated yet.'}</p>
        )}
      </div>
    </div>
  );
};

export const StudentManagementPage = () => {
  useDocumentTitle('Student management');
  const list = useListFilter(LIST_KEY);
  const students = useAdminStudents(list.params);
  const courseOptions = useCourseOptions();
  const create = useCreateStudent();
  const update = useUpdateStudent();
  const deactivate = useDeactivateStudent();
  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<StudentProfile | null>(null);
  const [viewing, setViewing] = useState<StudentProfile | null>(null);
  const [removing, setRemoving] = useState<StudentProfile | null>(null);
  const createForm = useForm<StudentValues>({ resolver: zodResolver(createSchema) });
  const editForm = useForm<StudentValues>({ resolver: zodResolver(editSchema) });
  useServerErrors(create.error, createForm.setError, CREATE_FIELDS);

  const openEdit = (row: StudentProfile) => {
    setEditing(row);
    editForm.reset({
      first_name: row.user.first_name,
      last_name: row.user.last_name,
      phone: row.user.phone,
      date_of_birth: row.date_of_birth ?? '',
      qualification: row.qualification ?? '',
      institution: row.institution ?? '',
      city: row.city ?? '',
      address: row.address ?? '',
      guardian_name: row.guardian_name ?? '',
      guardian_phone: row.guardian_phone ?? '',
      is_active: row.user.is_active,
      email: row.user.email,
      password: '',
    });
  };

  const tab = list.filters.is_active ?? 'all';

  const columns: Column<StudentProfile>[] = [
    {
      key: 'student',
      header: 'Student',
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
    { key: 'code', header: 'Code', render: (row) => <span className="font-mono text-xs">{row.student_code}</span> },
    { key: 'phone', header: 'Phone', render: (row) => row.user.phone },
    { key: 'enrolments', header: 'Enrolments', render: (row) => row.enrolment_count ?? '—' },
    { key: 'joined', header: 'Registered', render: (row) => formatDate(row.created_at) },
    { key: 'status', header: 'Status', render: (row) => <Badge tone={row.user.is_active ? 'green' : 'slate'}>{row.user.is_active ? 'Active' : 'Inactive'}</Badge> },
    {
      key: 'actions',
      header: '',
      render: (row) => (
        <div className="flex justify-end gap-1">
          <Button size="sm" variant="ghost" icon={<Eye className="h-3.5 w-3.5" />} onClick={() => setViewing(row)}>
            View
          </Button>
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

  const detailFields = (register: UseFormRegister<StudentValues>, errors: FieldErrors<StudentValues>) => (
    <>
      <Input label="First name" required {...register('first_name')} error={errors.first_name?.message} />
      <Input label="Last name" required {...register('last_name')} error={errors.last_name?.message} />
      <Input label="Phone" maxLength={10} inputMode="numeric" required {...register('phone')} error={errors.phone?.message} />
      <Input label="Date of birth" type="date" {...register('date_of_birth')} />
      <Input label="Qualification" {...register('qualification')} />
      <Input label="Institution" {...register('institution')} />
      <Input label="City" {...register('city')} />
      <Input label="Guardian name" {...register('guardian_name')} />
      <Input label="Guardian phone" maxLength={10} {...register('guardian_phone')} error={errors.guardian_phone?.message} />
      <div className="sm:col-span-2">
        <Textarea label="Address" rows={2} {...register('address')} />
      </div>
    </>
  );

  return (
    <div>
      <PageHeader
        eyebrow="People"
        title="Student management"
        description="Create student accounts, update profiles and deactivate accounts while keeping academic records."
        actions={
          <Button
            icon={<Plus className="h-4 w-4" />}
            onClick={() => {
              createForm.reset({ ...emptyDetails, email: '', password: '', is_active: true });
              setCreateOpen(true);
            }}
          >
            Add student
          </Button>
        }
      />
      <Card>
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 lg:flex-row lg:items-center lg:justify-between">
          <Tabs
            value={tab}
            onChange={(value) => list.setFilter('is_active', value === 'all' ? '' : value)}
            tabs={[
              { value: 'all', label: 'All students' },
              { value: 'true', label: 'Active' },
              { value: 'false', label: 'Inactive' },
            ]}
          />
          <div className="flex flex-col gap-3 sm:flex-row">
            <Select
              aria-label="Course"
              containerClassName="sm:w-56"
              value={list.filters.course ?? ''}
              onChange={(event) => list.setFilter('course', event.target.value)}
              placeholder="All courses"
              options={courseOptions.options}
            />
            <SearchInput value={list.search} onChange={list.setSearch} placeholder="Search name, email, code…" />
          </div>
        </div>
        <DataTable
          columns={columns}
          rows={students.data?.results}
          rowKey={(row) => row.id}
          loading={students.isPending}
          error={students.isError ? getErrorMessage(students.error) : null}
          onRetry={() => students.refetch()}
          emptyTitle="No students found"
        />
        {students.data && <Pagination page={list.page} pageSize={list.pageSize} count={students.data.count} onPageChange={list.setPage} />}
      </Card>

      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        size="lg"
        title="Add student"
        footer={
          <>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button loading={create.isPending} onClick={createForm.handleSubmit(({ is_active: _ignored, ...values }) => create.mutate(values, { onSuccess: () => setCreateOpen(false) }))}>
              Create student
            </Button>
          </>
        }
      >
        <form className="grid gap-4 sm:grid-cols-2" noValidate>
          <Input label="Email" type="email" required {...createForm.register('email')} error={ce.email?.message} />
          <PasswordInput label="Temporary password" required hint={PASSWORD_RULE_MESSAGE} {...createForm.register('password')} error={ce.password?.message} />
          {detailFields(createForm.register, ce)}
        </form>
      </Modal>

      <Modal
        open={editing !== null}
        onClose={() => setEditing(null)}
        size="lg"
        title={editing ? `Edit ${editing.user.full_name}` : 'Edit student'}
        footer={
          <>
            <Button variant="outline" onClick={() => setEditing(null)}>
              Cancel
            </Button>
            <Button loading={update.isPending} onClick={editForm.handleSubmit(({ email: _email, password: _password, ...values }) => editing && update.mutate({ id: editing.id, ...values }, { onSuccess: () => setEditing(null) }))}>
              Save changes
            </Button>
          </>
        }
      >
        <form className="grid gap-4 sm:grid-cols-2" noValidate>
          {detailFields(editForm.register, ee)}
          <Switch label="Account active" description="Inactive students cannot log in; records are kept." className="sm:col-span-2" {...editForm.register('is_active')} />
        </form>
      </Modal>

      <Modal open={viewing !== null} onClose={() => setViewing(null)} size="lg" title="Student profile">
        {viewing && <StudentDetail id={viewing.id} />}
      </Modal>

      <ConfirmDialog
        open={removing !== null}
        title="Deactivate student?"
        message={`${removing?.user.full_name} will no longer be able to log in. Attendance, marks and predictions are kept.`}
        confirmLabel="Deactivate"
        loading={deactivate.isPending}
        onClose={() => setRemoving(null)}
        onConfirm={() => removing && deactivate.mutate(removing.id, { onSuccess: () => setRemoving(null) })}
      />
    </div>
  );
};

export default StudentManagementPage;
