'use client';

import React, { useState } from 'react';
import { useCategories } from '../hooks/use-categories';
import { Category } from '../types';
import CategoryModal from './category-modal';
import { toast } from 'sonner';

export default function CategoryList() {
  const [search, setSearch] = useState<string>('');
  const [expandedIds, setExpandedIds] = useState<number[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [defaultParentId, setDefaultParentId] = useState<number | null>(null);

  const { categories, isLoading, deleteCategory, reorderCategories } =
    useCategories('tree', search || undefined);

  const toggleExpand = (id: number) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleOpenCreateRoot = () => {
    setEditingCategory(null);
    setDefaultParentId(null);
    setIsModalOpen(true);
  };

  const handleOpenCreateSub = (parentId: number) => {
    setEditingCategory(null);
    setDefaultParentId(parentId);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (category: Category) => {
    setEditingCategory(category);
    setDefaultParentId(category.parent_id || null);
    setIsModalOpen(true);
  };

  const handleDelete = async (category: Category) => {
    if (
      confirm(`Are you sure you want to delete category "${category.name}"?`)
    ) {
      try {
        await deleteCategory(category.id);
        toast.success(`Category "${category.name}" deleted.`);
      } catch (error: any) {
        toast.error(
          error?.response?.data?.message || 'Failed to delete category.'
        );
      }
    }
  };

  const handleAdjustSort = async (category: Category, delta: number) => {
    const newSort = Math.max(0, category.sort_order + delta);
    try {
      await reorderCategories([{ id: category.id, sort_order: newSort }]);
      toast.success(`Sort order updated.`);
    } catch (error: any) {
      toast.error('Failed to reorder category.');
    }
  };

  const renderCategoryRow = (category: Category, depth: number = 0) => {
    const hasChildren = category.children && category.children.length > 0;
    const isExpanded = expandedIds.includes(category.id);

    return (
      <React.Fragment key={category.id}>
        <tr className="group transition-colors hover:bg-slate-800/40">
          <td className="px-6 py-4">
            <div
              className="flex items-center space-x-2"
              style={{ paddingLeft: `${depth * 24}px` }}
            >
              {hasChildren ? (
                <button
                  onClick={() => toggleExpand(category.id)}
                  className="flex h-6 w-6 items-center justify-center rounded-lg bg-slate-800 text-xs font-bold text-slate-300 transition-colors hover:bg-slate-700"
                >
                  {isExpanded ? '▼' : '►'}
                </button>
              ) : (
                <span className="inline-block h-6 w-6 text-center font-mono text-xs text-slate-600">
                  •
                </span>
              )}

              <div className="flex items-center space-x-2">
                <span className="font-semibold text-slate-200 transition-colors group-hover:text-indigo-400">
                  {category.name}
                </span>
                {category.parent && (
                  <span className="rounded-md bg-slate-800 px-2 py-0.5 font-mono text-[10px] text-slate-400">
                    Sub of {category.parent.name}
                  </span>
                )}
              </div>
            </div>
          </td>

          <td className="px-6 py-4 font-mono text-xs text-slate-400">
            /{category.slug}
          </td>

          <td className="px-6 py-4">
            <div className="flex items-center space-x-1.5">
              <span className="rounded-md border border-slate-800 bg-slate-950 px-2 py-0.5 font-mono text-xs font-bold text-slate-300">
                {category.sort_order}
              </span>
              <div className="flex flex-col">
                <button
                  onClick={() => handleAdjustSort(category, -1)}
                  className="px-1 text-[9px] leading-none text-slate-400 hover:text-indigo-400"
                  title="Move Up"
                >
                  ▲
                </button>
                <button
                  onClick={() => handleAdjustSort(category, 1)}
                  className="px-1 text-[9px] leading-none text-slate-400 hover:text-indigo-400"
                  title="Move Down"
                >
                  ▼
                </button>
              </div>
            </div>
          </td>

          <td className="px-6 py-4">
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                category.status === 'active'
                  ? 'border border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
                  : 'border border-slate-700 bg-slate-800 text-slate-400'
              }`}
            >
              {category.status}
            </span>
          </td>

          <td className="space-x-2 px-6 py-4 text-right">
            <button
              onClick={() => handleOpenCreateSub(category.id)}
              className="rounded-lg bg-purple-500/10 px-2.5 py-1 text-xs font-semibold text-purple-400 transition-all hover:bg-purple-500/20 hover:text-purple-300"
            >
              + Subcategory
            </button>
            <button
              onClick={() => handleOpenEdit(category)}
              className="rounded-lg bg-indigo-500/10 px-2.5 py-1 text-xs font-semibold text-indigo-400 transition-all hover:bg-indigo-500/20 hover:text-indigo-300"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(category)}
              className="rounded-lg bg-rose-500/10 px-2.5 py-1 text-xs font-semibold text-rose-400 transition-all hover:bg-rose-500/20 hover:text-rose-300"
            >
              Delete
            </button>
          </td>
        </tr>

        {/* Render Children Recursively if Expanded or in Search Mode */}
        {(isExpanded || search) &&
          hasChildren &&
          category.children!.map((child) =>
            renderCategoryRow(child, depth + 1)
          )}
      </React.Fragment>
    );
  };

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      {/* Top Action Header */}
      <div className="flex flex-col justify-between gap-4 rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl backdrop-blur-xl md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-100">
            Category Management
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Organize courses into nested hierarchies, topics, and custom display
            ranks.
          </p>
        </div>

        <button
          onClick={handleOpenCreateRoot}
          className="flex transform items-center space-x-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-indigo-600/25 transition-all hover:from-indigo-500 hover:to-purple-500 active:scale-95"
        >
          <span>+ Add Root Category</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-slate-800/80 bg-slate-900/50 p-4 sm:flex-row">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-800 bg-slate-950/60 py-2 pr-4 pl-9 text-xs text-slate-200 placeholder-slate-500 transition-all outline-none focus:border-indigo-500"
          />
          <svg
            className="absolute top-2.5 left-3 h-4 w-4 text-slate-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Categories Tree Table */}
      <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/90 shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-800/80 bg-slate-950/60 text-[11px] tracking-wider text-slate-400 uppercase">
                <th className="px-6 py-4 font-semibold">Category Hierarchy</th>
                <th className="px-6 py-4 font-semibold">Slug</th>
                <th className="px-6 py-4 font-semibold">Sort Order</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500">
                    <div className="mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-3 border-indigo-500/20 border-t-indigo-500" />
                    Loading category hierarchy...
                  </td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500">
                    No categories found.
                  </td>
                </tr>
              ) : (
                categories.map((category) => renderCategoryRow(category, 0))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Category Create/Edit Modal */}
      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        categoryToEdit={editingCategory}
        defaultParentId={defaultParentId}
      />
    </div>
  );
}
