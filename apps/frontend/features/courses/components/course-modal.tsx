'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { courseSchema, CourseFormValues } from '../schemas/course-schemas';
import { Course } from '../types';
import { useCourses } from '../hooks/use-courses';
import { useCategories } from '@/features/categories/hooks/use-categories';
import { toast } from 'sonner';

interface CourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseToEdit?: Course | null;
}

export default function CourseModal({
  isOpen,
  onClose,
  courseToEdit,
}: CourseModalProps) {
  const [activeTab, setActiveTab] = useState<
    'basics' | 'pricing' | 'media' | 'seo'
  >('basics');
  const { createCourse, updateCourse, isCreating, isUpdating } = useCourses();
  const { categories } = useCategories('flat');

  const isEditing = !!courseToEdit;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: '',
      slug: '',
      category_id: undefined,
      subtitle: '',
      description: '',
      status: 'draft',
      level: 'all_levels',
      language: 'en',
      price: 0,
      compare_at_price: null,
      is_free: false,
      is_featured: false,
      thumbnail: '',
      banner: '',
      meta_title: '',
      meta_description: '',
      meta_keywords: '',
    },
  });

  const watchTitle = watch('title');
  const watchIsFree = watch('is_free');

  useEffect(() => {
    if (courseToEdit) {
      reset({
        title: courseToEdit.title,
        slug: courseToEdit.slug,
        category_id: courseToEdit.category_id,
        subtitle: courseToEdit.subtitle || '',
        description: courseToEdit.description || '',
        status: courseToEdit.status,
        level: courseToEdit.level,
        language: courseToEdit.language || 'en',
        price: Number(courseToEdit.price || 0),
        compare_at_price: courseToEdit.compare_at_price
          ? Number(courseToEdit.compare_at_price)
          : null,
        is_free: Boolean(courseToEdit.is_free),
        is_featured: Boolean(courseToEdit.is_featured),
        thumbnail: courseToEdit.thumbnail || '',
        banner: courseToEdit.banner || '',
        meta_title: courseToEdit.meta_title || '',
        meta_description: courseToEdit.meta_description || '',
        meta_keywords: courseToEdit.meta_keywords || '',
      });
    } else {
      reset({
        title: '',
        slug: '',
        category_id: undefined,
        subtitle: '',
        description: '',
        status: 'draft',
        level: 'all_levels',
        language: 'en',
        price: 0,
        compare_at_price: null,
        is_free: false,
        is_featured: false,
        thumbnail: '',
        banner: '',
        meta_title: '',
        meta_description: '',
        meta_keywords: '',
      });
    }
  }, [courseToEdit, reset]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setValue('title', val);
    if (!isEditing) {
      const generatedSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setValue('slug', generatedSlug);
    }
  };

  const onSubmit = async (data: CourseFormValues) => {
    try {
      const payload: any = {
        ...data,
        price: data.is_free ? 0 : Number(data.price),
        compare_at_price: data.compare_at_price
          ? Number(data.compare_at_price)
          : null,
      };

      if (isEditing && courseToEdit) {
        await updateCourse({ id: courseToEdit.id, data: payload });
        toast.success(`Course "${data.title}" updated.`);
      } else {
        await createCourse(payload);
        toast.success(`Course "${data.title}" created.`);
      }
      onClose();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to save course.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
      <div className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-5">
          <div>
            <h2 className="text-xl font-bold text-slate-100">
              {isEditing ? 'Edit Course Details' : 'Create New Course'}
            </h2>
            <p className="text-xs text-slate-400">
              Configure basics, pricing, media assets, and SEO metadata.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-lg font-bold text-slate-400 hover:bg-slate-800 hover:text-slate-200"
          >
            ✕
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex gap-2 border-b border-slate-800 bg-slate-950/50 px-6 pt-2">
          {[
            { id: 'basics', label: 'Basic Info' },
            { id: 'pricing', label: 'Pricing & Level' },
            { id: 'media', label: 'Media & Images' },
            { id: 'seo', label: 'SEO Metadata' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`rounded-t-xl border-b-2 px-4 py-2 text-xs font-semibold transition-all ${
                activeTab === tab.id
                  ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Form Body */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex-1 space-y-5 overflow-y-auto p-6"
        >
          {activeTab === 'basics' && (
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-300">
                  Course Title *
                </label>
                <input
                  type="text"
                  {...register('title')}
                  onChange={handleTitleChange}
                  placeholder="e.g. Master Fullstack Web Development"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-xs text-slate-200 outline-none focus:border-indigo-500"
                />
                {errors.title && (
                  <p className="mt-1 text-xs text-rose-400">
                    {errors.title.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-300">
                    URL Slug *
                  </label>
                  <input
                    type="text"
                    {...register('slug')}
                    placeholder="master-fullstack-web-development"
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 font-mono text-xs text-slate-200 outline-none focus:border-indigo-500"
                  />
                  {errors.slug && (
                    <p className="mt-1 text-xs text-rose-400">
                      {errors.slug.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-300">
                    Category *
                  </label>
                  <select
                    {...register('category_id')}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-xs text-slate-200 outline-none focus:border-indigo-500"
                  >
                    <option value="">Select Category...</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  {errors.category_id && (
                    <p className="mt-1 text-xs text-rose-400">
                      {errors.category_id.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-300">
                  Subtitle / Tagline
                </label>
                <input
                  type="text"
                  {...register('subtitle')}
                  placeholder="A short punchy summary for course cards"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-xs text-slate-200 outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-300">
                  Description
                </label>
                <textarea
                  rows={4}
                  {...register('description')}
                  placeholder="Detailed course description, curriculum overview, and requirements..."
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-xs text-slate-200 outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          )}

          {activeTab === 'pricing' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-300">
                    Target Skill Level
                  </label>
                  <select
                    {...register('level')}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-xs text-slate-200 outline-none focus:border-indigo-500"
                  >
                    <option value="all_levels">All Skill Levels</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-300">
                    Language
                  </label>
                  <input
                    type="text"
                    {...register('language')}
                    placeholder="en"
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-xs text-slate-200 outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="space-y-3 rounded-xl border border-slate-800 bg-slate-950 p-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="is_free"
                    {...register('is_free')}
                    className="rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label
                    htmlFor="is_free"
                    className="cursor-pointer text-xs font-semibold text-slate-200"
                  >
                    Offer this course for free ($0.00)
                  </label>
                </div>

                {!watchIsFree && (
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-slate-300">
                        Regular Price ($)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        {...register('price')}
                        placeholder="49.99"
                        className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-2 font-mono text-xs text-slate-200 outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-slate-300">
                        Original Price ($) (Strikethrough)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        {...register('compare_at_price')}
                        placeholder="99.99"
                        className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-2 font-mono text-xs text-slate-200 outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="is_featured"
                  {...register('is_featured')}
                  className="rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500"
                />
                <label
                  htmlFor="is_featured"
                  className="cursor-pointer text-xs font-semibold text-slate-200"
                >
                  Feature this course on home discovery cards
                </label>
              </div>
            </div>
          )}

          {activeTab === 'media' && (
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-300">
                  Thumbnail Image URL
                </label>
                <input
                  type="text"
                  {...register('thumbnail')}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 font-mono text-xs text-slate-200 outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-300">
                  Banner Image URL
                </label>
                <input
                  type="text"
                  {...register('banner')}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 font-mono text-xs text-slate-200 outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          )}

          {activeTab === 'seo' && (
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-300">
                  Meta Title Tag
                </label>
                <input
                  type="text"
                  {...register('meta_title')}
                  placeholder="Custom SEO title"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-xs text-slate-200 outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-300">
                  Meta Description
                </label>
                <textarea
                  rows={3}
                  {...register('meta_description')}
                  placeholder="SEO summary snippet for search engines..."
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-xs text-slate-200 outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-300">
                  Meta Keywords
                </label>
                <input
                  type="text"
                  {...register('meta_keywords')}
                  placeholder="react, nextjs, fullstack, web dev"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 font-mono text-xs text-slate-200 outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          )}

          {/* Footer Submit Button */}
          <div className="flex justify-end space-x-3 border-t border-slate-800 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-800 px-4 py-2 text-xs font-semibold text-slate-400 hover:bg-slate-800 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreating || isUpdating}
              className="rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-2 text-xs font-semibold text-white shadow-lg shadow-indigo-600/25 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50"
            >
              {isCreating || isUpdating
                ? 'Saving...'
                : isEditing
                  ? 'Save Changes'
                  : 'Create Course'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
