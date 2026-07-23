'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { inviteUserSchema } from '../schemas/user-schemas';
import { InviteUserData } from '../types';
import { useUsers } from '../hooks/use-users';
import { toast } from 'sonner';

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InviteModal({ isOpen, onClose }: InviteModalProps) {
  const { inviteUser, isInviting } = useUsers();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InviteUserData>({
    resolver: zodResolver(inviteUserSchema),
    defaultValues: {
      email: '',
      role: 'Student',
    },
  });

  const onSubmit = async (data: InviteUserData) => {
    try {
      await inviteUser(data);
      toast.success(`Invitation sent to ${data.email}`);
      reset();
      onClose();
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || 'Failed to send invitation.';
      toast.error(errorMessage);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="animate-fadeIn fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl md:p-8">
        <div className="mb-6 flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-xl font-bold text-slate-100">Invite User</h3>
            <p className="mt-1 text-xs text-slate-400">
              Send an invitation email to join Premierbyte LMS.
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
              Recipient Email
            </label>
            <input
              type="email"
              placeholder="colleague@academy.com"
              {...register('email')}
              className="w-full rounded-xl border border-slate-800 bg-slate-950/50 px-4 py-2.5 text-slate-200 transition-all outline-none focus:border-indigo-500"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-rose-500">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold tracking-wider text-slate-400 uppercase">
              Assigned Role
            </label>
            <select
              {...register('role')}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-slate-200 transition-all outline-none focus:border-indigo-500"
            >
              <option value="Instructor">Instructor</option>
              <option value="Student">Student</option>
              <option value="Administrator">Administrator</option>
            </select>
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
              disabled={isInviting}
              className="flex transform items-center space-x-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:from-indigo-500 hover:to-purple-500 active:scale-95 disabled:opacity-50"
            >
              {isInviting ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                <span>Send Invitation</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
