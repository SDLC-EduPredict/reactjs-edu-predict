import type { FocusEvent } from 'react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FolderTree, Pencil, Plus, Trash2 } from 'lucide-react';
import { Button, ConfirmDialog, EmptyState, Input, Modal, PageHeader, Skeleton, StatusBadge, Switch, Textarea } from '@/components/ui';
import { CourseArt } from '@/components/domain/CourseArt';
import { QueryView } from '@/components/domain/QueryView';
import { useDocumentTitle } from '@/lib/hooks/useDocumentTitle';
import { formatDate } from '@/lib/utils/format';
import { useAdminCategories, useAdminCategory, useCreateCategory, useDeleteCategory, useUpdateCategory } from '../hooks/useCourses';
import type { Category, CategoryPayload } from '../types';

const slugify = (value: string) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const EMPTY: CategoryPayload = { name: '', slug: '', description: '', is_active: true };

const CategoryModal = ({ open, id, onClose }: { open: boolean; id: number | null; onClose: () => void }) => {
  const detail = useAdminCategory(id);
  const create = useCreateCategory();
  const update = useUpdateCategory();
  const { register, handleSubmit, reset, setValue, getValues } = useForm<CategoryPayload>({ defaultValues: EMPTY });
  useEffect(() => {
    if (id === null) reset(EMPTY);
    else if (detail.data) reset({ name: detail.data.name, slug: detail.data.slug, description: detail.data.description, is_active: detail.data.is_active });
  }, [id, detail.data, reset]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={id === null ? 'New category' : 'Edit category'}
      description={detail.data ? `${detail.data.course_count} courses · updated ${formatDate(detail.data.updated_at)}` : undefined}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="category-form" loading={create.isPending || update.isPending}>
            Save
          </Button>
        </>
      }
    >
      {id !== null && detail.isPending ? (
        <Skeleton className="h-48 w-full" />
      ) : (
        <form
          id="category-form"
          className="space-y-4"
          onSubmit={handleSubmit((values) => (id === null ? create.mutate(values, { onSuccess: onClose }) : update.mutate({ id, ...values }, { onSuccess: onClose })))}
        >
          <Input
            label="Name"
            required
            {...register('name', {
              required: true,
              onBlur: (event: FocusEvent<HTMLInputElement>) => {
                if (!getValues('slug')) setValue('slug', slugify(event.target.value));
              },
            })}
          />
          <Input label="Slug" required hint="Used in URLs, e.g. data-science" {...register('slug', { required: true })} />
          <Textarea label="Description" rows={3} {...register('description')} />
          <Switch label="Active" description="Inactive categories are hidden from the public catalogue." {...register('is_active')} />
        </form>
      )}
    </Modal>
  );
};

const AdminCategoriesPage = () => {
  useDocumentTitle('Categories');
  const categories = useAdminCategories();
  const remove = useDeleteCategory();
  const [form, setForm] = useState<{ open: boolean; id: number | null }>({ open: false, id: null });
  const [target, setTarget] = useState<Category | null>(null);

  return (
    <>
      <PageHeader eyebrow="Catalogue" title="Categories" description="Disciplines that group courses in the public catalogue." actions={<Button icon={<Plus className="h-4 w-4" />} onClick={() => setForm({ open: true, id: null })}>New category</Button>} />
      <QueryView query={categories} loading={<div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 6 }, (_, i) => <Skeleton key={i} className="h-56 rounded-3xl" />)}</div>}>
        {(list) =>
          list.length === 0 ? (
            <EmptyState icon={<FolderTree className="h-6 w-6" />} title="No categories" action={<Button size="sm" onClick={() => setForm({ open: true, id: null })}>Create one</Button>} />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {list.map((category) => (
                <article key={category.id} className="overflow-hidden rounded-3xl bg-white shadow-card ring-1 ring-black/5">
                  <div className="relative aspect-[16/7]">
                    <CourseArt title={category.name} category={category.name} compact />
                    <span className="absolute right-3 top-3">
                      <StatusBadge status={category.is_active ? 'ACTIVE' : 'INACTIVE'} />
                    </span>
                  </div>
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-display text-base font-semibold text-slate-900">{category.name}</h3>
                        <p className="font-mono text-[11px] text-slate-400">/{category.slug}</p>
                      </div>
                      <span className="rounded-full bg-sun-100 px-2.5 py-0.5 text-[11px] font-bold text-amber-800">{category.course_count} courses</span>
                    </div>
                    <p className="mt-2 line-clamp-2 min-h-8 text-xs text-slate-500">{category.description || 'No description'}</p>
                    <div className="mt-4 flex gap-2">
                      <Button size="sm" variant="secondary" icon={<Pencil className="h-3.5 w-3.5" />} onClick={() => setForm({ open: true, id: category.id })}>
                        Edit
                      </Button>
                      <Button size="sm" variant="ghost" icon={<Trash2 className="h-3.5 w-3.5 text-rose-500" />} onClick={() => setTarget(category)}>
                        Delete
                      </Button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )
        }
      </QueryView>
      <CategoryModal open={form.open} id={form.id} onClose={() => setForm({ open: false, id: null })} />
      <ConfirmDialog
        open={target !== null}
        title="Delete category?"
        message={target?.course_count ? `“${target.name}” still has ${target.course_count} courses. The server may refuse the deletion until they are moved.` : `“${target?.name ?? ''}” will be deleted.`}
        confirmLabel="Delete"
        loading={remove.isPending}
        onClose={() => setTarget(null)}
        onConfirm={() => target && remove.mutate(target.id, { onSuccess: () => setTarget(null) })}
      />
    </>
  );
};

export default AdminCategoriesPage;
