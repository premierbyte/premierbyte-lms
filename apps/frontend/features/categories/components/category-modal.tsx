'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { categorySchema } from '../schemas/category-schemas';
import { Category, CreateCategoryData } from '../types';
import { useCategories } from '../hooks/use-categories';
import { toast } from 'sonner';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoryToEdit?: Category | null;
  defaultParentId?: number | null;
}

export default function CategoryModal({
  isOpen,
  onClose,
  categoryToEdit,
  defaultParentId,
}: CategoryModalProps) {
  const {
    createCategory,
    updateCategory,
    isCreating,
    isUpdating,
    categories: flatCategories,
  } = useCategories('flat');
  const isEditing = !!categoryToEdit;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateCategoryData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      slug: '',
      parent_id: null,
      description: '',
      image: '',
      status: 'active',
      sort_order: 0,
    },
  });

  const categoryName = watch('name');

  useEffect(() => {
    if (categoryToEdit) {
      reset({
        name: categoryToEdit.name || '',
        slug: categoryToEdit.slug || '',
        parent_id: categoryToEdit.parent_id || null,
        description: categoryToEdit.description || '',
        image: categoryToEdit.image || '',
        status: categoryToEdit.status || 'active',
        sort_order: categoryToEdit.sort_order || 0,
      });
    } else {
      reset({
        name: '',
        slug: '',
        parent_id: defaultParentId || null,
        description: '',
        image: '',
        status: 'active',
        sort_order: 0,
      });
    }
  }, [categoryToEdit, defaultParentId, reset, isOpen]);

  // Auto slug generation on name change when creating new
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setValue('name', val);
    if (!isEditing) {
      const generatedSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setValue('slug', generatedSlug);
    }
  };

  const onSubmit = async (data: CreateCategoryData) => {
    try {
      const payload = {
        ...data,
        parent_id: data.parent_id ? Number(data.parent_id) : null,
        sort_order: Number(data.sort_order || 0),
      };

      if (isEditing && categoryToEdit) {
        await updateCategory({ id: categoryToEdit.id, data: payload });
        toast.success('Category updated successfully!');
      } else {
        await createCategory(payload);
        toast.success('Category created successfully!');
      }
      onClose();
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || 'Failed to save category.';
      toast.error(errorMessage);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="animate-fadeIn fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl md:p-8">
        <div className="mb-6 flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-2xl font-bold text-slate-100">
              {isEditing ? 'Edit Category' : 'Create Category'}
            </h3>
            <p className="mt-1 text-xs text-slate-400">
              Configure category properties, parent hierarchy, and sorting.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="mb-2 block text-xs font-semibold tracking-wider text-slate-400 uppercase">
              Category Name
            </label>
            <input
              type="text"
              placeholder="Web Development"
              {...register('name')}
              onChange={handleNameChange}
              className="w-full rounded-xl border border-slate-800 bg-slate-950/50 px-4 py-2.5 text-slate-200 transition-all outline-none focus:border-indigo-500"
            />
            {errors.name && (
              <p className="mt-1 text-xs text-rose-500">
                {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold tracking-wider text-slate-400 uppercase">
              Slug
            </label>
            <input
              type="text"
              placeholder="web-development"
              {...register('slug')}
              className="w-full rounded-xl border border-slate-800 bg-slate-950/50 px-4 py-2.5 font-mono text-xs text-slate-200 transition-all outline-none focus:border-indigo-500"
            />
            {errors.slug && (
              <p className="mt-1 text-xs text-rose-500">
                {errors.slug.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold tracking-wider text-slate-400 uppercase">
              Parent Category
            </label>
            <select
              {...register('parent_id', {
                setValueAs: (v) => (v === '' ? null : Number(v)),
              })}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-slate-200 transition-all outline-none focus:border-indigo-500"
            >
              <option value="">None (Top-Level Root Category)</option>
              {flatCategories
                .filter((c) => !isEditing || c.id !== categoryToEdit?.id)
                .map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.parent ? `${cat.parent.name} → ${cat.name}` : cat.name}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold tracking-wider text-slate-400 uppercase">
              Description
            </label>
            <textarea
              rows={3}
              placeholder="Brief summary of topics covered in this category..."
              {...register('description')}
              className="w-full rounded-xl border border-slate-800 bg-slate-950/50 px-4 py-2.5 text-slate-200 transition-all outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs font-semibold tracking-wider text-slate-400 uppercase">
                Status
              </label>
              <select
                {...register('status')}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-slate-200 transition-all outline-none focus:border-indigo-500"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold tracking-wider text-slate-400 uppercase">
                Sort Order
              </label>
              <input
                type="number"
                min={0}
                {...register('sort_order', { valueAsNumber: true })}
                className="w-full rounded-xl border border-slate-800 bg-slate-950/50 px-4 py-2.5 text-slate-200 transition-all outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 border-t border-slate-800 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl bg-slate-800 px-5 py-2.5 text-sm font-semibold text-slate-300 transition-all hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreating || isUpdating}
              className="flex transform items-center space-x-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:from-indigo-500 hover:to-purple-500 active:scale-95 disabled:opacity-50"
            >
              {isCreating || isUpdating ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                <span>{isEditing ? 'Save Changes' : 'Create Category'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
