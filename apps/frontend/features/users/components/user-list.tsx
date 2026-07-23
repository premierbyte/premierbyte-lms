'use client';

import React, { useState } from 'react';
import { useUsers } from '../hooks/use-users';
import { User } from '../types';
import UserModal from './user-modal';
import InviteModal from './invite-modal';
import { PermissionGate } from '@/components/rbac/permission-gate';
import { toast } from 'sonner';

export default function UserList() {
  const [roleFilter, setRoleFilter] = useState<string>('');
  const [search, setSearch] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isInviteOpen, setIsInviteOpen] = useState<boolean>(false);

  const { users, meta, isLoading, deleteUser } = useUsers({
    role: roleFilter || undefined,
    search: search || undefined,
    page,
    per_page: 10,
  });

  const handleOpenCreate = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user: User) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleDelete = async (user: User) => {
    if (confirm(`Are you sure you want to delete user ${user.name}?`)) {
      try {
        await deleteUser(user.id);
        toast.success(`User ${user.name} deleted.`);
      } catch (error: any) {
        toast.error(error?.response?.data?.message || 'Failed to delete user.');
      }
    }
  };

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      {/* Top Action Header */}
      <div className="flex flex-col justify-between gap-4 rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl backdrop-blur-xl md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-100">
            User Management
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Manage platform accounts, role assignments, instructors, and
            students.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <PermissionGate permission="users.create">
            <button
              onClick={() => setIsInviteOpen(true)}
              className="flex items-center space-x-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-xs font-semibold text-slate-200 shadow-md transition-all hover:bg-slate-700"
            >
              <span>✉ Invite Member</span>
            </button>
            <button
              onClick={handleOpenCreate}
              className="flex transform items-center space-x-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-indigo-600/25 transition-all hover:from-indigo-500 hover:to-purple-500 active:scale-95"
            >
              <span>+ Add New User</span>
            </button>
          </PermissionGate>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-slate-800/80 bg-slate-900/50 p-4 sm:flex-row">
        {/* Role Tabs */}
        <div className="flex w-full space-x-1 rounded-xl border border-slate-800/80 bg-slate-950 p-1 sm:w-auto">
          {[
            { label: 'All Users', role: '' },
            { label: 'Instructors', role: 'Instructor' },
            { label: 'Students', role: 'Student' },
            { label: 'Admins', role: 'Admin' },
          ].map((tab) => (
            <button
              key={tab.role}
              onClick={() => {
                setRoleFilter(tab.role);
                setPage(1);
              }}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
                roleFilter === tab.role
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Search users..."
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
      </div>

      {/* Users Table */}
      <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl">
        <table className="w-full text-left text-sm text-slate-400">
          <thead className="border-b border-slate-800 bg-slate-950/60 text-xs font-semibold tracking-wider text-slate-400 uppercase">
            <tr>
              <th className="px-6 py-4">User Details</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Role Scopes</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {isLoading ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-slate-500">
                  Loading user records...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-slate-500">
                  No users found matching current filters.
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr
                  key={u.id}
                  className="transition-colors hover:bg-slate-800/30"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-700 bg-slate-800 font-bold text-indigo-400">
                        {u.first_name?.[0] || u.name?.[0] || 'U'}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-200">
                          {u.name || `${u.first_name} ${u.last_name}`}
                        </div>
                        <div className="text-xs text-slate-500">
                          {u.email} •{' '}
                          <span className="text-indigo-400">@{u.username}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        u.status === 'active'
                          ? 'border border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
                          : u.status === 'pending'
                            ? 'border border-amber-500/20 bg-amber-500/10 text-amber-400'
                            : 'border border-rose-500/20 bg-rose-500/10 text-rose-400'
                      }`}
                    >
                      {u.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {Array.isArray(u.roles) && u.roles.length > 0 ? (
                        u.roles.map((r: any) => {
                          const roleName = typeof r === 'string' ? r : r.name;
                          return (
                            <span
                              key={roleName}
                              className="rounded border border-slate-700 bg-slate-800 px-2 py-0.5 text-xs font-medium text-slate-300"
                            >
                              {roleName}
                            </span>
                          );
                        })
                      ) : (
                        <span className="text-xs text-slate-600">Student</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleOpenEdit(u)}
                        className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
                      >
                        Edit
                      </button>
                      <PermissionGate permission="users.delete">
                        <button
                          onClick={() => handleDelete(u)}
                          className="rounded-lg border border-rose-500/20 bg-rose-500/10 px-3 py-1.5 text-xs font-medium text-rose-400 transition-colors hover:bg-rose-500/20"
                        >
                          Delete
                        </button>
                      </PermissionGate>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination Footer */}
        {meta && meta.last_page > 1 && (
          <div className="flex items-center justify-between border-t border-slate-800 bg-slate-950/60 px-6 py-4">
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
      </div>

      {/* User Modals */}
      <UserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        userToEdit={editingUser}
      />
      <InviteModal
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
      />
    </div>
  );
}
