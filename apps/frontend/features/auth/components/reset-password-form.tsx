'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { resetPasswordSchema } from '../schemas/auth-schemas';
import { ResetPasswordData } from '../types';
import { authApi } from '../api/auth';
import { useSearchParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function ResetPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get('token') || '';
  const email = searchParams.get('email') || '';

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ResetPasswordData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token: token,
      email: email,
      password: '',
      password_confirmation: '',
    },
  });

  // Keep form values in sync with search params when they load
  useEffect(() => {
    if (token) setValue('token', token);
    if (email) setValue('email', email);
  }, [token, email, setValue]);

  const onSubmit = async (data: ResetPasswordData) => {
    setIsLoading(true);
    try {
      await authApi.getCsrfCookie();
      await authApi.resetPassword(data);
      toast.success(
        'Your password has been successfully reset. Please sign in with your new password.'
      );
      router.push('/login');
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || 'Failed to reset your password.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl backdrop-blur-xl">
      {/* Decorative gradient overlay */}
      <div className="pointer-events-none absolute -top-40 -right-40 h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-purple-500/10 blur-3xl" />

      <div className="relative z-10 mb-8 flex flex-col items-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 shadow-lg shadow-indigo-500/30">
          <span className="text-xl font-bold text-white">P</span>
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-100">
          New Password
        </h2>
        <p className="mt-2 text-center text-sm text-slate-400">
          Define a secure password containing numbers and special characters.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="relative z-10 space-y-6"
      >
        <input type="hidden" {...register('token')} />
        <input type="hidden" {...register('email')} />

        <div>
          <label className="mb-2 block text-xs font-semibold tracking-wider text-slate-400 uppercase">
            New Password
          </label>
          <input
            type="password"
            placeholder="••••••••••••"
            {...register('password')}
            className={`w-full border bg-slate-950/50 px-4 py-3 ${
              errors.password
                ? 'border-rose-500/50 focus:border-rose-500'
                : 'border-slate-800 focus:border-indigo-500'
            } rounded-xl text-slate-200 placeholder-slate-600 transition-all duration-300 outline-none`}
          />
          {errors.password && (
            <p className="mt-1 text-xs text-rose-500">
              {errors.password.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-xs font-semibold tracking-wider text-slate-400 uppercase">
            Confirm Password
          </label>
          <input
            type="password"
            placeholder="••••••••••••"
            {...register('password_confirmation')}
            className={`w-full border bg-slate-950/50 px-4 py-3 ${
              errors.password_confirmation
                ? 'border-rose-500/50 focus:border-rose-500'
                : 'border-slate-800 focus:border-indigo-500'
            } rounded-xl text-slate-200 placeholder-slate-600 transition-all duration-300 outline-none`}
          />
          {errors.password_confirmation && (
            <p className="mt-1 text-xs text-rose-500">
              {errors.password_confirmation.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="flex w-full transform items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3.5 font-semibold text-white shadow-lg shadow-indigo-600/25 transition-all duration-300 hover:from-indigo-500 hover:to-purple-500 active:scale-[0.98] disabled:opacity-50"
        >
          {isLoading ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          ) : (
            <span>Update Password</span>
          )}
        </button>
      </form>
    </div>
  );
}
