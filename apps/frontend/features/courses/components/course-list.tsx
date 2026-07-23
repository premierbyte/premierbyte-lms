'use client';

import React, { useState } from 'react';
import { useCourses } from '../hooks/use-courses';
import { Course } from '../types';
import CourseModal from './course-modal';
import { useCategories } from '@/features/categories/hooks/use-categories';
import { PermissionGate } from '@/components/rbac/permission-gate';
import { toast } from 'sonner';

export default function CourseList() {
  const [search, setSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [levelFilter, setLevelFilter] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<number | undefined>(
    undefined
  );
  const [page, setPage] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  const { courses, meta, isLoading, deleteCourse, publishCourse } = useCourses({
    search: search || undefined,
    status: statusFilter || undefined,
    level: levelFilter || undefined,
    category_id: categoryFilter,
    page,
    per_page: 9,
  });

  const { categories } = useCategories('flat');

  const handleOpenCreate = () => {
    setEditingCourse(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (course: Course) => {
    setEditingCourse(course);
    setIsModalOpen(true);
  };

  const handlePublishToggle = async (course: Course) => {
    const nextStatus = course.status === 'published' ? 'draft' : 'published';
    try {
      await publishCourse({ id: course.id, status: nextStatus });
      toast.success(
        `Course "${course.title}" status changed to ${nextStatus}.`
      );
    } catch (error: any) {
      toast.error('Failed to change publish status.');
    }
  };

  const handleDelete = async (course: Course) => {
    if (confirm(`Are you sure you want to delete course "${course.title}"?`)) {
      try {
        await deleteCourse(course.id);
        toast.success(`Course "${course.title}" deleted.`);
      } catch (error: any) {
        toast.error(
          error?.response?.data?.message || 'Failed to delete course.'
        );
      }
    }
  };

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      {/* Top Action Header */}
      <div className="flex flex-col justify-between gap-4 rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl backdrop-blur-xl md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-100">
            Course Directory
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Manage course catalog, draft creation, pricing rules, publishing
            status, and SEO metadata.
          </p>
        </div>

        <PermissionGate permission="courses.create">
          <button
            onClick={handleOpenCreate}
            className="flex transform items-center space-x-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-indigo-600/25 transition-all hover:from-indigo-500 hover:to-purple-500 active:scale-95"
          >
            <span>+ Create New Course</span>
          </button>
        </PermissionGate>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 gap-4 rounded-2xl border border-slate-800/80 bg-slate-900/50 p-4 md:grid-cols-4">
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search courses..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2 pl-9 text-xs text-slate-200 placeholder-slate-500 transition-all outline-none focus:border-indigo-500"
          />
          <svg
            className="absolute top-2.5 left-3 h-4 w-4 text-slate-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-2 text-xs text-slate-200 outline-none focus:border-indigo-500"
        >
          <option value="">All Statuses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
        </select>

        {/* Category Filter */}
        <select
          value={categoryFilter || ''}
          onChange={(e) => {
            setCategoryFilter(
              e.target.value ? Number(e.target.value) : undefined
            );
            setPage(1);
          }}
          className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-2 text-xs text-slate-200 outline-none focus:border-indigo-500"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        {/* Level Filter */}
        <select
          value={levelFilter}
          onChange={(e) => {
            setLevelFilter(e.target.value);
            setPage(1);
          }}
          className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-2 text-xs text-slate-200 outline-none focus:border-indigo-500"
        >
          <option value="">All Skill Levels</option>
          <option value="all_levels">All Levels</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
      </div>

      {/* Courses Cards Grid */}
      {isLoading ? (
        <div className="p-12 text-center text-slate-500">
          Loading course directory...
        </div>
      ) : courses.length === 0 ? (
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-12 text-center text-slate-500">
          No courses found matching criteria. Create a course to populate your
          directory.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <div
              key={course.id}
              className="flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-xl transition-all hover:border-slate-700"
            >
              {/* Card Image Banner */}
              <div className="relative flex h-40 items-center justify-center overflow-hidden bg-slate-950">
                {course.thumbnail ? (
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-900/40 via-purple-900/30 to-slate-900 text-lg font-bold text-indigo-400">
                    {course.title.slice(0, 2).toUpperCase()}
                  </div>
                )}

                {/* Status Badge */}
                <div className="absolute top-3 left-3 flex gap-2">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wider uppercase ${
                      course.status === 'published'
                        ? 'border border-emerald-500/30 bg-emerald-500/20 text-emerald-400'
                        : 'border border-amber-500/30 bg-amber-500/20 text-amber-400'
                    }`}
                  >
                    {course.status}
                  </span>
                  {course.is_featured && (
                    <span className="rounded-full border border-purple-500/30 bg-purple-500/20 px-2.5 py-0.5 text-xs font-semibold tracking-wider text-purple-300 uppercase">
                      ★ Featured
                    </span>
                  )}
                </div>

                {/* Price Tag */}
                <div className="absolute right-3 bottom-3 rounded-xl border border-slate-800 bg-slate-950/90 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm">
                  {course.is_free ? (
                    <span className="text-emerald-400">FREE</span>
                  ) : (
                    <span>${Number(course.price).toFixed(2)}</span>
                  )}
                </div>
              </div>

              {/* Card Details */}
              <div className="flex flex-1 flex-col justify-between space-y-4 p-6">
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <span className="rounded bg-indigo-500/10 px-2 py-0.5 text-[11px] font-semibold text-indigo-400">
                      {course.category?.name || 'General'}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-400 uppercase">
                      • {course.level.replace('_', ' ')}
                    </span>
                  </div>

                  <h3 className="line-clamp-2 text-base leading-snug font-bold text-slate-100">
                    {course.title}
                  </h3>
                  {course.subtitle && (
                    <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-400">
                      {course.subtitle}
                    </p>
                  )}
                </div>

                {/* Card Action Footer */}
                <div className="flex items-center justify-between border-t border-slate-800/80 pt-4">
                  <span className="text-xs text-slate-500">
                    By {course.instructor?.name || 'Instructor'}
                  </span>

                  <div className="flex items-center space-x-2">
                    <PermissionGate permission="courses.publish">
                      <button
                        onClick={() => handlePublishToggle(course)}
                        className={`rounded-lg border px-2.5 py-1 text-xs font-semibold ${
                          course.status === 'published'
                            ? 'border-amber-500/30 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20'
                            : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                        }`}
                      >
                        {course.status === 'published'
                          ? 'Unpublish'
                          : 'Publish'}
                      </button>
                    </PermissionGate>

                    <button
                      onClick={() => handleOpenEdit(course)}
                      className="rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1 text-xs font-semibold text-slate-300 hover:bg-slate-800"
                    >
                      Edit
                    </button>

                    <PermissionGate permission="courses.delete">
                      <button
                        onClick={() => handleDelete(course)}
                        className="rounded-lg border border-rose-500/20 bg-rose-500/10 px-2.5 py-1 text-xs font-semibold text-rose-400 hover:bg-rose-500/20"
                      >
                        Delete
                      </button>
                    </PermissionGate>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {meta && meta.last_page > 1 && (
        <div className="flex items-center justify-between rounded-2xl border-t border-slate-800 bg-slate-900/60 px-6 py-4">
          <span className="text-xs text-slate-500">
            Showing page {meta.current_page} of {meta.last_page} ({meta.total}{' '}
            total)
          </span>
          <div className="flex space-x-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="rounded-lg border border-slate-800 px-3 py-1 text-xs font-semibold text-slate-300 transition-colors hover:bg-slate-800 disabled:opacity-40"
            >
              Previous
            </button>
            <button
              disabled={page >= meta.last_page}
              onClick={() => setPage((p) => p + 1)}
              className="rounded-lg border border-slate-800 px-3 py-1 text-xs font-semibold text-slate-300 transition-colors hover:bg-slate-800 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Course Creation/Edit Modal */}
      <CourseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        courseToEdit={editingCourse}
      />
    </div>
  );
}
