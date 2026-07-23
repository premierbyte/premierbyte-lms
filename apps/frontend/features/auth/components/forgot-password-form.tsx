'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { forgotPasswordSchema } from '../schemas/auth-schemas';
import { authApi } from '../api/auth';
import { toast } from 'sonner';

export default function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ email: string }>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (data: { email: string }) => {
    setIsLoading(true);
    try {
      await authApi.getCsrfCookie();
      await authApi.forgotPassword(data.email);
      setIsSuccess(true);
      toast.success('Password reset email sent!');
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || 'Failed to send password reset link.';
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
          Reset Password
        </h2>
        <p className="mt-2 text-center text-sm text-slate-400">
          We will send you an email link to securely reset your password.
        </p>
      </div>

      {isSuccess ? (
        <div className="relative z-10 rounded-2xl border border-slate-800/80 bg-slate-950/40 p-6 py-6 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-slate-200">Email Sent</h3>
          <p className="mt-2 text-sm text-slate-400">
            Please check your inbox. We have sent instructions on how to reset
            your password.
          </p>
          <a
            href="/login"
            className="mt-6 inline-block rounded-xl bg-slate-800 px-6 py-2.5 text-sm font-semibold text-slate-200 transition-all duration-300 hover:bg-slate-700"
          >
            Back to Login
          </a>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="relative z-10 space-y-6"
        >
          <div>
            <label className="mb-2 block text-xs font-semibold tracking-wider text-slate-400 uppercase">
              Email Address
            </label>
            <input
              type="email"
              placeholder="name@company.com"
              {...register('email')}
              className={`w-full border bg-slate-950/50 px-4 py-3 ${
                errors.email
                  ? 'border-rose-500/50 focus:border-rose-500'
                  : 'border-slate-800 focus:border-indigo-500'
              } rounded-xl text-slate-200 placeholder-slate-600 transition-all duration-300 outline-none`}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-rose-500">
                {errors.email.message}
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
              <span>Send Reset Link</span>
            )}
          </button>
        </form>
      )}

      {!isSuccess && (
        <div className="relative z-10 mt-8 border-t border-slate-800/60 pt-6 text-center">
          <p className="text-sm text-slate-400">
            Remembered your password?{' '}
            <a
              href="/login"
              className="font-semibold text-indigo-400 transition-colors hover:text-indigo-300"
            >
              Sign in
            </a>
          </p>
        </div>
      )}
    </div>
  );
}
