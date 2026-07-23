'use client';

import React, { useState } from 'react';
import { useUsers } from '../hooks/use-users';
import { User } from '../types';
import UserModal from './user-modal';
import InviteModal from './invite-modal';
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
            { label: 'Admins', role: 'Administrator' },
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

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Search users by name, email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
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

      {/* Users Table */}
      <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/90 shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-800/80 bg-slate-950/60 text-[11px] tracking-wider text-slate-400 uppercase">
                <th className="px-6 py-4 font-semibold">User</th>
                <th className="px-6 py-4 font-semibold">Username</th>
                <th className="px-6 py-4 font-semibold">Roles</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500">
                    <div className="mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-3 border-indigo-500/20 border-t-indigo-500" />
                    Loading user directory...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500">
                    No users matching criteria.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr
                    key={user.id}
                    className="group transition-colors hover:bg-slate-800/40"
                  >
                    <td className="flex items-center space-x-3 px-6 py-4">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="h-10 w-10 rounded-full border border-slate-700 object-cover"
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-indigo-400/20 bg-gradient-to-tr from-indigo-600 to-purple-600 text-xs font-bold text-white">
                          {user.first_name?.[0]}
                          {user.last_name?.[0]}
                        </div>
                      )}
                      <div>
                        <div className="font-semibold text-slate-200 transition-colors group-hover:text-indigo-400">
                          {user.name}
                        </div>
                        <div className="text-xs text-slate-500">
                          {user.email}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 font-mono text-xs text-slate-400">
                      @{user.username}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {user.roles?.map((role) => (
                          <span
                            key={role}
                            className={`rounded-md border px-2 py-0.5 text-[10px] font-semibold ${
                              role === 'Administrator' || role === 'Super Admin'
                                ? 'border-purple-500/30 bg-purple-500/10 text-purple-400'
                                : role === 'Instructor'
                                  ? 'border-indigo-500/30 bg-indigo-500/10 text-indigo-400'
                                  : 'border-slate-700 bg-slate-800 text-slate-400'
                            }`}
                          >
                            {role}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          user.status === 'active'
                            ? 'border border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
                            : user.status === 'pending'
                              ? 'border border-amber-500/20 bg-amber-500/10 text-amber-400'
                              : 'border border-rose-500/20 bg-rose-500/10 text-rose-400'
                        }`}
                      >
                        <span
                          className={`mr-1.5 h-1.5 w-1.5 rounded-full ${user.status === 'active' ? 'bg-emerald-400' : user.status === 'pending' ? 'bg-amber-400' : 'bg-rose-400'}`}
                        />
                        {user.status}
                      </span>
                    </td>

                    <td className="space-x-2 px-6 py-4 text-right">
                      <button
                        onClick={() => handleOpenEdit(user)}
                        className="rounded-lg bg-indigo-500/10 px-3 py-1.5 text-xs font-semibold text-indigo-400 transition-all hover:bg-indigo-500/20 hover:text-indigo-300"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(user)}
                        className="rounded-lg bg-rose-500/10 px-3 py-1.5 text-xs font-semibold text-rose-400 transition-all hover:bg-rose-500/20 hover:text-rose-300"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {meta && meta.last_page > 1 && (
          <div className="flex items-center justify-between border-t border-slate-800/80 bg-slate-950/40 p-4">
            <span className="text-xs text-slate-400">
              Showing page{' '}
              <strong className="text-slate-200">{meta.current_page}</strong> of{' '}
              <strong className="text-slate-200">{meta.last_page}</strong> (
              {meta.total} total users)
            </span>
            <div className="flex space-x-2">
              <button
                disabled={meta.current_page <= 1}
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                className="rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-300 transition-all hover:bg-slate-700 disabled:opacity-40"
              >
                Previous
              </button>
              <button
                disabled={meta.current_page >= meta.last_page}
                onClick={() => setPage((p) => p + 1)}
                className="rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-300 transition-all hover:bg-slate-700 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* User Edit / Create Modal */}
      <UserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        userToEdit={editingUser}
      />

      {/* User Invite Modal */}
      <InviteModal
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
      />
    </div>
  );
}
