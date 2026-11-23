import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Eye, Pencil, Plus, Trash2 } from 'lucide-react';
import { Button, Card, ConfirmDialog, DataTable, Input, Modal, PageHeader, Pagination, SearchInput, Select, Skeleton, StatusBadge, Textarea } from '@/components/ui';
import { CourseArt } from '@/components/domain/CourseArt';
import { useAppDispatch } from '@/app/store/hooks';
import { useDocumentTitle } from '@/lib/hooks/useDocumentTitle';
import { useListFilter } from '@/lib/hooks/useListFilter';
import { formatCurrency, formatDate } from '@/lib/utils/format';
import { useAdminFaculty } from '@/features/faculty/hooks/useFaculty';
import { useAdminCategories, useAdminCourse, useAdminCourses, useCreateCourse, useDeleteCourse, useUpdateCourse } from '../hooks/useCourses';
import { coursePreviewOpened } from '../store/catalogSlice';
import { COURSE_LEVELS, COURSE_MODES, COURSE_STATUSES, type Course, type CourseLevel, type CourseMode, type CoursePayload, type CourseStatus } from '../types';

interface Values extends Omit<CoursePayload, 'category' | 'faculty'> {
  category: string;
  faculty: string;
}

const EMPTY: Values = {
  category: '',
  faculty: '',
  title: '',
  slug: '',
  short_description: '',
  description: '',
  level: 'BEGINNER',
  mode: 'ONLINE',
  duration_weeks: 12,
  total_modules: 8,
  fee: '0',
  start_date: '',
  status: 'DRAFT',
  meta_title: '',
  meta_description: '',
};

const slugify = (value: string) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const CourseFormModal = ({ open, id, onClose }: { open: boolean; id: number | null; onClose: () => void }) => {
  const detail = useAdminCourse(id);
  const categories = useAdminCategories(open);
  const faculty = useAdminFaculty({ page: 1, page_size: 100, is_active: 'true' }, open);
  const create = useCreateCourse();
  const update = useUpdateCourse();
  const { register, handleSubmit, reset, setValue, getValues } = useForm<Values>({ defaultValues: EMPTY });

  useEffect(() => {
    if (id === null) reset(EMPTY);
    else if (detail.data) {
      const c = detail.data;
      reset({
        category: String(c.category.id),
        faculty: c.faculty?.id ?? '',
        title: c.title,
        slug: c.slug,
        short_description: c.short_description,
        description: c.description,
        level: c.level as CourseLevel,
        mode: c.mode as CourseMode,
        duration_weeks: c.duration_weeks,
        total_modules: c.total_modules,
        fee: String(c.fee),
        start_date: c.start_date ?? '',
        status: c.status as CourseStatus,
        meta_title: c.meta_title,
        meta_description: c.meta_description,
      });
    }
  }, [id, detail.data, reset]);

  const submit = handleSubmit((values) => {
    const payload: CoursePayload = { ...values, category: Number(values.category), faculty: values.faculty || null, duration_weeks: Number(values.duration_weeks), total_modules: Number(values.total_modules) };
    if (id === null) create.mutate(payload, { onSuccess: onClose });
    else update.mutate({ id, ...payload }, { onSuccess: onClose });
  });

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="xl"
      title={id === null ? 'New course' : 'Edit course'}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="course-form" loading={create.isPending || update.isPending}>
            Save course
          </Button>
        </>
      }
    >
      {id !== null && detail.isPending ? (
        <Skeleton className="h-96 w-full" />
      ) : (
        <form id="course-form" onSubmit={submit} className="grid gap-4 md:grid-cols-3">
          <Input
            label="Title"
            required
            containerClassName="md:col-span-2"
            {...register('title', {
              required: true,
              onBlur: (event: { target: { value: string } }) => {
                if (!getValues('slug')) setValue('slug', slugify(event.target.value));
              },
            })}
          />
          <Input label="Slug" required {...register('slug', { required: true })} />
          <Select label="Category" required placeholder="Select category" options={(categories.data ?? []).map((c) => ({ value: c.id, label: c.name }))} {...register('category', { required: true })} />
          <Select label="Faculty mentor" placeholder="Unassigned" options={(faculty.data?.results ?? []).map((f) => ({ value: f.user.id, label: f.user.full_name }))} {...register('faculty')} />
          <Select label="Status" options={COURSE_STATUSES} {...register('status')} />
          <Select label="Level" options={COURSE_LEVELS} {...register('level')} />
          <Select label="Mode" options={COURSE_MODES} {...register('mode')} />
          <Input label="Start date" type="date" {...register('start_date')} />
          <Input label="Duration (weeks)" type="number" min={1} {...register('duration_weeks')} />
          <Input label="Total modules" type="number" min={1} {...register('total_modules')} />
          <Input label="Fee (₹)" type="number" min={0} step="0.01" {...register('fee')} />
          <Textarea label="Short description" rows={2} containerClassName="md:col-span-3" {...register('short_description', { required: true })} />
          <Textarea label="Full description" rows={4} containerClassName="md:col-span-3" {...register('description')} />
          <Input label="SEO title" containerClassName="md:col-span-3" {...register('meta_title')} />
          <Textarea label="SEO description" rows={2} containerClassName="md:col-span-3" {...register('meta_description')} />
        </form>
      )}
    </Modal>
  );
};

const AdminCoursesPage = () => {
  useDocumentTitle('Courses');
  const dispatch = useAppDispatch();
  const list = useListFilter('admin-courses');
  const f = list.filters;
  const categories = useAdminCategories();
  const courses = useAdminCourses({ ...list.params, category: f.category || undefined, level: f.level || undefined, mode: f.mode || undefined, status: f.status || undefined });
  const remove = useDeleteCourse();
  const [form, setForm] = useState<{ open: boolean; id: number | null }>({ open: false, id: null });
  const [target, setTarget] = useState<Course | null>(null);

  return (
    <>
      <PageHeader eyebrow="Catalogue" title="Courses" description="Create and publish courses, assign mentors and manage SEO details." actions={<Button icon={<Plus className="h-4 w-4" />} onClick={() => setForm({ open: true, id: null })}>New course</Button>} />
      <Card className="overflow-hidden">
        <div className="grid gap-3 border-b border-slate-100 p-4 md:grid-cols-3 xl:grid-cols-6">
          <SearchInput value={list.search} onChange={list.setSearch} placeholder="Search courses…" className="md:col-span-3 xl:col-span-2" />
          <Select aria-label="Category" placeholder="All categories" value={f.category ?? ''} onChange={(e) => list.setFilter('category', e.target.value)} options={(categories.data ?? []).map((c) => ({ value: c.slug, label: c.name }))} />
          <Select aria-label="Level" placeholder="All levels" value={f.level ?? ''} onChange={(e) => list.setFilter('level', e.target.value)} options={COURSE_LEVELS} />
          <Select aria-label="Mode" placeholder="All modes" value={f.mode ?? ''} onChange={(e) => list.setFilter('mode', e.target.value)} options={COURSE_MODES} />
          <Select aria-label="Status" placeholder="All statuses" value={f.status ?? ''} onChange={(e) => list.setFilter('status', e.target.value)} options={COURSE_STATUSES} />
        </div>
        <DataTable
          rows={courses.data?.results}
          loading={courses.isPending}
          rowKey={(row) => row.id}
          emptyTitle="No courses found"
          columns={[
            {
              key: 'course',
              header: 'Course',
              render: (row) => (
                <div className="flex items-center gap-3">
                  <div className="h-11 w-16 shrink-0 overflow-hidden rounded-xl">
                    <CourseArt title={row.title} category={row.category.name} thumbnail={row.thumbnail} compact />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{row.title}</p>
                    <p className="text-[11px] text-slate-500">{row.category.name}</p>
                  </div>
                </div>
              ),
            },
            { key: 'faculty', header: 'Mentor', render: (row) => row.faculty?.full_name ?? <span className="text-slate-400">Unassigned</span> },
            { key: 'meta', header: 'Level · Mode', render: (row) => <span className="text-xs">{row.level_display} · {row.mode_display}</span> },
            { key: 'dur', header: 'Duration', render: (row) => `${row.duration_weeks} wks · ${row.total_modules} mods` },
            { key: 'fee', header: 'Fee', render: (row) => formatCurrency(row.fee) },
            { key: 'start', header: 'Starts', render: (row) => formatDate(row.start_date) },
            { key: 'status', header: 'Status', render: (row) => <StatusBadge status={row.status} label={row.status_display} /> },
            {
              key: 'actions',
              header: '',
              className: 'text-right',
              render: (row) => (
                <div className="flex justify-end gap-1">
                  {row.status === 'PUBLISHED' && <Button size="sm" variant="ghost" aria-label="Preview" icon={<Eye className="h-3.5 w-3.5" />} onClick={() => dispatch(coursePreviewOpened(row.slug))} />}
                  <Button size="sm" variant="ghost" aria-label="Edit" icon={<Pencil className="h-3.5 w-3.5" />} onClick={() => setForm({ open: true, id: row.id })} />
                  <Button size="sm" variant="ghost" aria-label="Delete" icon={<Trash2 className="h-3.5 w-3.5 text-rose-500" />} onClick={() => setTarget(row)} />
                </div>
              ),
            },
          ]}
        />
        <Pagination page={list.page} pageSize={list.pageSize} count={courses.data?.count ?? 0} onPageChange={list.setPage} />
      </Card>
      <CourseFormModal open={form.open} id={form.id} onClose={() => setForm({ open: false, id: null })} />
      <ConfirmDialog
        open={target !== null}
        title="Delete course?"
        message={`“${target?.title ?? ''}” will be permanently deleted along with its schedule. Consider archiving instead.`}
        confirmLabel="Delete"
        loading={remove.isPending}
        onClose={() => setTarget(null)}
        onConfirm={() => target && remove.mutate(target.id, { onSuccess: () => setTarget(null) })}
      />
    </>
  );
};

export default AdminCoursesPage;
