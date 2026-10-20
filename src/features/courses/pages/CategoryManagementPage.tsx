import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { Badge, Button, Card, ConfirmDialog, DataTable, Input, Modal, PageHeader, SearchInput, Switch, Textarea, type Column } from '@/components/ui';
import { getErrorMessage } from '@/lib/api/apiError';
import { useDocumentTitle } from '@/lib/hooks/useDocumentTitle';
import { formatDate } from '@/lib/utils/format';
import { useAdminCategories, useCreateCategory, useDeleteCategory, useUpdateCategory } from '../hooks/useCourses';
import type { Category } from '../types';

const schema = z.object({
  name: z.string().trim().min(2, 'Enter a category name.').max(120),
  description: z.string().trim().max(1000),
  is_active: z.boolean(),
});
type Values = z.infer<typeof schema>;

export const CategoryManagementPage = () => {
  useDocumentTitle('Category management');
  const categories = useAdminCategories();
  const create = useCreateCategory();
  const update = useUpdateCategory();
  const remove = useDeleteCategory();
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<Category | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [deleting, setDeleting] = useState<Category | null>(null);
  const { register, handleSubmit, reset, formState } = useForm<Values>({ resolver: zodResolver(schema) });

  const open = (category: Category | null) => {
    setEditing(category);
    reset({ name: category?.name ?? '', description: category?.description ?? '', is_active: category?.is_active ?? true });
    setFormOpen(true);
  };

  const onSubmit = (values: Values) => {
    const options = { onSuccess: () => setFormOpen(false) };
    if (editing) update.mutate({ id: editing.id, ...values }, options);
    else create.mutate(values, options);
  };

  const rows = (categories.data ?? []).filter((item) => item.name.toLowerCase().includes(search.toLowerCase()));

  const columns: Column<Category>[] = [
    {
      key: 'name',
      header: 'Category',
      render: (row) => (
        <div>
          <p className="font-semibold text-slate-900">{row.name}</p>
          <p className="text-[11px] text-slate-400">/{row.slug}</p>
        </div>
      ),
    },
    { key: 'description', header: 'Description', render: (row) => <span className="line-clamp-2 max-w-md text-xs text-slate-500">{row.description || '—'}</span> },
    { key: 'courses', header: 'Courses', render: (row) => row.course_count },
    { key: 'status', header: 'Status', render: (row) => <Badge tone={row.is_active ? 'green' : 'slate'}>{row.is_active ? 'Active' : 'Hidden'}</Badge> },
    { key: 'updated', header: 'Updated', render: (row) => formatDate(row.updated_at) },
    {
      key: 'actions',
      header: '',
      className: 'text-right',
      render: (row) => (
        <div className="flex justify-end gap-1">
          <Button size="sm" variant="ghost" icon={<Pencil className="h-3.5 w-3.5" />} onClick={() => open(row)}>
            Edit
          </Button>
          <Button size="sm" variant="ghost" className="text-rose-600 hover:bg-rose-50" icon={<Trash2 className="h-3.5 w-3.5" />} onClick={() => setDeleting(row)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        eyebrow="Catalogue"
        title="Category management"
        description="Group courses into categories shown on the public website."
        actions={
          <Button icon={<Plus className="h-4 w-4" />} onClick={() => open(null)}>
            New category
          </Button>
        }
      />
      <Card>
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 p-4">
          <SearchInput value={search} onChange={setSearch} placeholder="Filter categories…" />
          <span className="text-xs text-slate-500">{rows.length} categories</span>
        </div>
        <DataTable
          columns={columns}
          rows={rows}
          rowKey={(row) => row.id}
          loading={categories.isPending}
          error={categories.isError ? getErrorMessage(categories.error) : null}
          onRetry={() => categories.refetch()}
        />
      </Card>

      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editing ? 'Edit category' : 'New category'}
        footer={
          <>
            <Button variant="outline" onClick={() => setFormOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit(onSubmit)} loading={create.isPending || update.isPending}>
              {editing ? 'Save changes' : 'Create category'}
            </Button>
          </>
        }
      >
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Input label="Name" required {...register('name')} error={formState.errors.name?.message} />
          <Textarea label="Description" rows={4} {...register('description')} error={formState.errors.description?.message} />
          <Switch label="Visible on website" description="Inactive categories are hidden from the public catalogue." {...register('is_active')} />
        </form>
      </Modal>

      <ConfirmDialog
        open={deleting !== null}
        title="Delete category?"
        message={`“${deleting?.name}” will be removed. Courses must be moved to another category first.`}
        confirmLabel="Delete"
        loading={remove.isPending}
        onClose={() => setDeleting(null)}
        onConfirm={() => deleting && remove.mutate(deleting.id, { onSuccess: () => setDeleting(null) })}
      />
    </div>
  );
};

export default CategoryManagementPage;
