import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { Button, Card, ConfirmDialog, DataTable, Input, Modal, PageHeader, Pagination, SearchInput, Select, StatusBadge, Textarea, type Column } from '@/components/ui';
import { getErrorMessage } from '@/lib/api/apiError';
import { useDocumentTitle } from '@/lib/hooks/useDocumentTitle';
import { useListFilter } from '@/lib/hooks/useListFilter';
import { formatCurrency, formatDate } from '@/lib/utils/format';
import { useAdminFaculty } from '@/features/faculty/hooks/useFaculty';
import { useAdminCategories, useAdminCourses, useCreateCourse, useDeleteCourse, useUpdateCourse } from '../hooks/useCourses';
import { catalogApi } from '../api/coursesApi';
import { COURSE_LEVELS, COURSE_MODES, COURSE_STATUSES, type Course, type CoursePayload } from '../types';

const schema = z.object({
  title: z.string().trim().min(3, 'Enter a course title.'),
  short_description: z.string().trim().min(10, 'Add a short description (10+ characters).').max(300),
  description: z.string().trim().min(20, 'Add a detailed description (20+ characters).'),
  category: z.coerce.number<string>().int().positive('Choose a category.'),
  faculty: z.string(),
  level: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']),
  mode: z.enum(['ONLINE', 'OFFLINE', 'HYBRID']),
  duration_weeks: z.coerce.number<string>().int().min(1, 'At least 1 week.'),
  total_modules: z.coerce.number<string>().int().min(1, 'At least 1 module.'),
  fee: z.coerce.number<string>().min(0, 'Fee cannot be negative.'),
  start_date: z.string().min(1, 'Choose a start date.'),
  status: z.enum(['DRAFT', 'ACTIVE', 'UPCOMING', 'ARCHIVED']),
  meta_title: z.string().trim().max(70, 'Keep SEO titles under 70 characters.'),
  meta_description: z.string().trim().max(160, 'Keep meta descriptions under 160 characters.'),
});
type FormInput = z.input<typeof schema>;
type FormOutput = z.output<typeof schema>;

const LIST_KEY = 'admin-courses';

export const CourseManagementPage = () => {
  useDocumentTitle('Course management');
  const list = useListFilter(LIST_KEY);
  const courses = useAdminCourses(list.params);
  const categories = useAdminCategories();
  const faculty = useAdminFaculty({ page: 1, page_size: 100, is_active: 'true' });
  const create = useCreateCourse();
  const update = useUpdateCourse();
  const remove = useDeleteCourse();
  const [editing, setEditing] = useState<Course | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [deleting, setDeleting] = useState<Course | null>(null);
  const { register, handleSubmit, reset, formState } = useForm<FormInput, unknown, FormOutput>({ resolver: zodResolver(schema) });

  const open = async (course: Course | null) => {
    setEditing(course);
    const detail = course ? (await catalogApi.course(course.id).catch(() => null))?.data.course : null;
    reset({
      title: course?.title ?? '',
      short_description: course?.short_description ?? '',
      description: detail?.description ?? '',
      category: course ? String(course.category.id) : '',
      faculty: course?.faculty?.id ?? '',
      level: (course?.level as FormInput['level']) ?? 'BEGINNER',
      mode: (course?.mode as FormInput['mode']) ?? 'ONLINE',
      duration_weeks: String(course?.duration_weeks ?? 12),
      total_modules: String(course?.total_modules ?? 10),
      fee: String(course?.fee ?? 0),
      start_date: course?.start_date ?? '',
      status: (course?.status as FormInput['status']) ?? 'DRAFT',
      meta_title: detail?.meta_title ?? '',
      meta_description: detail?.meta_description ?? '',
    });
    setFormOpen(true);
  };

  const onSubmit = (values: FormOutput) => {
    const payload: CoursePayload = { ...values, faculty: values.faculty || null };
    const options = { onSuccess: () => setFormOpen(false) };
    if (editing) update.mutate({ id: editing.id, ...payload }, options);
    else create.mutate(payload, options);
  };

  const columns: Column<Course>[] = [
    {
      key: 'title',
      header: 'Course',
      render: (row) => (
        <div>
          <p className="font-semibold text-slate-900">{row.title}</p>
          <p className="text-[11px] text-slate-400">{row.category.name}</p>
        </div>
      ),
    },
    { key: 'faculty', header: 'Faculty', render: (row) => row.faculty?.full_name ?? <span className="text-slate-400">Unassigned</span> },
    { key: 'level', header: 'Level / mode', render: (row) => <span className="text-xs">{row.level_display} · {row.mode_display}</span> },
    { key: 'duration', header: 'Duration', render: (row) => `${row.duration_weeks} wks · ${row.total_modules} modules` },
    { key: 'fee', header: 'Fee', render: (row) => formatCurrency(row.fee) },
    { key: 'start', header: 'Starts', render: (row) => formatDate(row.start_date) },
    { key: 'status', header: 'Status', render: (row) => <StatusBadge status={row.status} label={row.status_display} /> },
    {
      key: 'actions',
      header: '',
      render: (row) => (
        <div className="flex justify-end gap-1">
          <Button size="sm" variant="ghost" icon={<Pencil className="h-3.5 w-3.5" />} onClick={() => void open(row)}>
            Edit
          </Button>
          <Button size="sm" variant="ghost" className="text-rose-600 hover:bg-rose-50" icon={<Trash2 className="h-3.5 w-3.5" />} onClick={() => setDeleting(row)}>
            Remove
          </Button>
        </div>
      ),
    },
  ];

  const e = formState.errors;

  return (
    <div>
      <PageHeader
        eyebrow="Catalogue"
        title="Course management"
        description="Create and maintain the courses offered by the institute."
        actions={
          <Button icon={<Plus className="h-4 w-4" />} onClick={() => void open(null)}>
            New course
          </Button>
        }
      />
      <Card>
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 md:flex-row md:items-center">
          <SearchInput value={list.search} onChange={list.setSearch} placeholder="Search courses…" />
          <Select
            aria-label="Category"
            containerClassName="md:w-52"
            value={list.filters.category ?? ''}
            onChange={(event) => list.setFilter('category', event.target.value)}
            placeholder="All categories"
            options={(categories.data ?? []).map((item) => ({ value: item.slug, label: item.name }))}
          />
          <Select
            aria-label="Status"
            containerClassName="md:w-44"
            value={list.filters.status ?? ''}
            onChange={(event) => list.setFilter('status', event.target.value)}
            placeholder="All statuses"
            options={COURSE_STATUSES}
          />
        </div>
        <DataTable
          columns={columns}
          rows={courses.data?.results}
          rowKey={(row) => row.id}
          loading={courses.isPending}
          error={courses.isError ? getErrorMessage(courses.error) : null}
          onRetry={() => courses.refetch()}
        />
        {courses.data && <Pagination page={list.page} pageSize={list.pageSize} count={courses.data.count} onPageChange={list.setPage} />}
      </Card>

      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        size="xl"
        title={editing ? `Edit ${editing.title}` : 'New course'}
        footer={
          <>
            <Button variant="outline" onClick={() => setFormOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit(onSubmit)} loading={create.isPending || update.isPending}>
              {editing ? 'Save changes' : 'Create course'}
            </Button>
          </>
        }
      >
        <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Input label="Title" required containerClassName="md:col-span-2" {...register('title')} error={e.title?.message} />
          <Select
            label="Category"
            required
            placeholder="Select category"
            options={(categories.data ?? []).map((item) => ({ value: item.id, label: item.name }))}
            {...register('category')}
            error={e.category?.message}
          />
          <Select
            label="Faculty"
            placeholder="Unassigned"
            options={(faculty.data?.results ?? []).map((item) => ({ value: item.user.id, label: `${item.user.full_name} · ${item.designation}` }))}
            {...register('faculty')}
          />
          <Select label="Level" options={COURSE_LEVELS} {...register('level')} />
          <Select label="Mode" options={COURSE_MODES} {...register('mode')} />
          <Input label="Duration (weeks)" type="number" min={1} {...register('duration_weeks')} error={e.duration_weeks?.message} />
          <Input label="Total modules" type="number" min={1} {...register('total_modules')} error={e.total_modules?.message} />
          <Input label="Fee (₹)" type="number" min={0} {...register('fee')} error={e.fee?.message} />
          <Input label="Start date" type="date" {...register('start_date')} error={e.start_date?.message} />
          <Select label="Status" options={COURSE_STATUSES} {...register('status')} />
          <div className="md:col-span-2">
            <Textarea label="Short description" rows={2} {...register('short_description')} error={e.short_description?.message} />
          </div>
          <div className="md:col-span-2">
            <Textarea label="Full description" rows={6} {...register('description')} error={e.description?.message} />
          </div>
          <Input label="SEO title" hint="Shown in search results (max 70)" {...register('meta_title')} error={e.meta_title?.message} />
          <Input label="Meta description" hint="Max 160 characters" {...register('meta_description')} error={e.meta_description?.message} />
        </form>
      </Modal>

      <ConfirmDialog
        open={deleting !== null}
        title="Remove course?"
        message={`“${deleting?.title}” will be removed from the catalogue.`}
        confirmLabel="Remove"
        loading={remove.isPending}
        onClose={() => setDeleting(null)}
        onConfirm={() => deleting && remove.mutate(deleting.id, { onSuccess: () => setDeleting(null) })}
      />
    </div>
  );
};

export default CourseManagementPage;
