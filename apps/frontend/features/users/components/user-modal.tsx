'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createUserSchema, updateUserSchema } from '../schemas/user-schemas';
import { CreateUserData, User } from '../types';
import { useUsers } from '../hooks/use-users';
import { toast } from 'sonner';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  userToEdit?: User | null;
}

export default function UserModal({
  isOpen,
  onClose,
  userToEdit,
}: UserModalProps) {
  const { createUser, updateUser, isCreating, isUpdating } = useUsers();
  const isEditing = !!userToEdit;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateUserData>({
    resolver: zodResolver(isEditing ? updateUserSchema : createUserSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      username: '',
      email: '',
      password: '',
      phone: '',
      avatar: '',
      bio: '',
      status: 'active',
      roles: ['Student'],
    },
  });

  useEffect(() => {
    if (userToEdit) {
      reset({
        first_name: userToEdit.first_name || '',
        last_name: userToEdit.last_name || '',
        username: userToEdit.username || '',
        email: userToEdit.email || '',
        password: '',
        phone: userToEdit.phone || '',
        avatar: userToEdit.avatar || '',
        bio: userToEdit.bio || '',
        status: userToEdit.status as 'active' | 'pending' | 'suspended',
        roles: userToEdit.roles || ['Student'],
      });
    } else {
      reset({
        first_name: '',
        last_name: '',
        username: '',
        email: '',
        password: '',
        phone: '',
        avatar: '',
        bio: '',
        status: 'active',
        roles: ['Student'],
      });
    }
  }, [userToEdit, reset, isOpen]);

  const selectedRoles = watch('roles') || [];

  const handleRoleToggle = (role: string) => {
    if (selectedRoles.includes(role)) {
      setValue(
        'roles',
        selectedRoles.filter((r) => r !== role)
      );
    } else {
      setValue('roles', [...selectedRoles, role]);
    }
  };

  const onSubmit = async (data: CreateUserData) => {
    try {
      if (isEditing && userToEdit) {
        const payload: Partial<CreateUserData> = { ...data };
        if (!payload.password) delete payload.password;
        await updateUser({ id: userToEdit.id, data: payload });
        toast.success('User updated successfully!');
      } else {
        await createUser(data);
        toast.success('User created successfully!');
      }
      onClose();
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || 'Failed to save user.';
      toast.error(errorMessage);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="animate-fadeIn fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl md:p-8">
        <div className="mb-6 flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-2xl font-bold text-slate-100">
              {isEditing ? 'Edit User Profile' : 'Create New User'}
            </h3>
            <p className="mt-1 text-xs text-slate-400">
              {isEditing
                ? 'Update account details, role assignments, and permissions.'
                : 'Add a new member to the platform.'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
          >
            ✕
          </button>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="max-h-[75vh] space-y-4 overflow-y-auto pr-1"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs font-semibold tracking-wider text-slate-400 uppercase">
                First Name
              </label>
              <input
                type="text"
                placeholder="Jane"
                {...register('first_name')}
                className="w-full rounded-xl border border-slate-800 bg-slate-950/50 px-4 py-2.5 text-slate-200 transition-all outline-none focus:border-indigo-500"
              />
              {errors.first_name && (
                <p className="mt-1 text-xs text-rose-500">
                  {errors.first_name.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold tracking-wider text-slate-400 uppercase">
                Last Name
              </label>
              <input
                type="text"
                placeholder="Doe"
                {...register('last_name')}
                className="w-full rounded-xl border border-slate-800 bg-slate-950/50 px-4 py-2.5 text-slate-200 transition-all outline-none focus:border-indigo-500"
              />
              {errors.last_name && (
                <p className="mt-1 text-xs text-rose-500">
                  {errors.last_name.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs font-semibold tracking-wider text-slate-400 uppercase">
                Username
              </label>
              <input
                type="text"
                placeholder="janedoe"
                {...register('username')}
                className="w-full rounded-xl border border-slate-800 bg-slate-950/50 px-4 py-2.5 text-slate-200 transition-all outline-none focus:border-indigo-500"
              />
              {errors.username && (
                <p className="mt-1 text-xs text-rose-500">
                  {errors.username.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold tracking-wider text-slate-400 uppercase">
                Email Address
              </label>
              <input
                type="email"
                placeholder="jane@example.com"
                {...register('email')}
                className="w-full rounded-xl border border-slate-800 bg-slate-950/50 px-4 py-2.5 text-slate-200 transition-all outline-none focus:border-indigo-500"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-rose-500">
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs font-semibold tracking-wider text-slate-400 uppercase">
                {isEditing
                  ? 'Password (leave blank to keep unchanged)'
                  : 'Password'}
              </label>
              <input
                type="password"
                placeholder="••••••••••••"
                {...register('password')}
                className="w-full rounded-xl border border-slate-800 bg-slate-950/50 px-4 py-2.5 text-slate-200 transition-all outline-none focus:border-indigo-500"
              />
              {errors.password && (
                <p className="mt-1 text-xs text-rose-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold tracking-wider text-slate-400 uppercase">
                Phone Number
              </label>
              <input
                type="text"
                placeholder="+1 555-0192"
                {...register('phone')}
                className="w-full rounded-xl border border-slate-800 bg-slate-950/50 px-4 py-2.5 text-slate-200 transition-all outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs font-semibold tracking-wider text-slate-400 uppercase">
                Avatar URL
              </label>
              <input
                type="text"
                placeholder="https://example.com/avatar.jpg"
                {...register('avatar')}
                className="w-full rounded-xl border border-slate-800 bg-slate-950/50 px-4 py-2.5 text-slate-200 transition-all outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold tracking-wider text-slate-400 uppercase">
                Account Status
              </label>
              <select
                {...register('status')}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-slate-200 transition-all outline-none focus:border-indigo-500"
              >
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold tracking-wider text-slate-400 uppercase">
              Role Assignments
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                'Super Admin',
                'Administrator',
                'Instructor',
                'Student',
                'Read Only',
              ].map((role) => {
                const isSelected = selectedRoles.includes(role);
                return (
                  <button
                    key={role}
                    type="button"
                    onClick={() => handleRoleToggle(role)}
                    className={`rounded-xl px-3 py-1.5 text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                        : 'border border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '}
                    {role}
                  </button>
                );
              })}
            </div>
            {errors.roles && (
              <p className="mt-1 text-xs text-rose-500">
                {errors.roles.message}
              </p>
            )}
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
                <span>{isEditing ? 'Save Changes' : 'Create User'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
