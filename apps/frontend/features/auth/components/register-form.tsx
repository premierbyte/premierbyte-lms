'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema } from '../schemas/auth-schemas';
import { RegisterData } from '../types';
import { useAuth } from '../hooks/use-auth';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function RegisterForm() {
  const { register: signup, isRegistering } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      username: '',
      email: '',
      phone: '',
      password: '',
      password_confirmation: '',
    },
  });

  const onSubmit = async (data: RegisterData) => {
    try {
      await signup(data);
      toast.success(
        'Registration successful! Please check your email for verification.'
      );
      router.push('/login');
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || 'Failed to register account.';
      toast.error(errorMessage);
    }
  };

  return (
    <div className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl backdrop-blur-xl">
      {/* Decorative gradient overlay */}
      <div className="pointer-events-none absolute -top-40 -right-40 h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-purple-500/10 blur-3xl" />

      <div className="relative z-10 mb-8 flex flex-col items-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 shadow-lg shadow-indigo-500/30">
          <span className="text-xl font-bold text-white">P</span>
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-100">
          Create Account
        </h2>
        <p className="mt-2 text-sm font-light text-slate-400">
          Join Premierbyte enterprise learning platform
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="relative z-10 space-y-5"
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
              className={`w-full border bg-slate-950/50 px-4 py-2.5 ${
                errors.first_name
                  ? 'border-rose-500/50 focus:border-rose-500'
                  : 'border-slate-800 focus:border-indigo-500'
              } rounded-xl text-slate-200 placeholder-slate-600 transition-all duration-300 outline-none`}
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
              className={`w-full border bg-slate-950/50 px-4 py-2.5 ${
                errors.last_name
                  ? 'border-rose-500/50 focus:border-rose-500'
                  : 'border-slate-800 focus:border-indigo-500'
              } rounded-xl text-slate-200 placeholder-slate-600 transition-all duration-300 outline-none`}
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
              className={`w-full border bg-slate-950/50 px-4 py-2.5 ${
                errors.username
                  ? 'border-rose-500/50 focus:border-rose-500'
                  : 'border-slate-800 focus:border-indigo-500'
              } rounded-xl text-slate-200 placeholder-slate-600 transition-all duration-300 outline-none`}
            />
            {errors.username && (
              <p className="mt-1 text-xs text-rose-500">
                {errors.username.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold tracking-wider text-slate-400 uppercase">
              Phone Number
            </label>
            <input
              type="text"
              placeholder="+1 (555) 019-2834"
              {...register('phone')}
              className="w-full rounded-xl border border-slate-800 bg-slate-950/50 px-4 py-2.5 text-slate-200 placeholder-slate-600 transition-all duration-300 outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-xs font-semibold tracking-wider text-slate-400 uppercase">
            Email Address
          </label>
          <input
            type="email"
            placeholder="jane@company.com"
            {...register('email')}
            className={`w-full border bg-slate-950/50 px-4 py-2.5 ${
              errors.email
                ? 'border-rose-500/50 focus:border-rose-500'
                : 'border-slate-800 focus:border-indigo-500'
            } rounded-xl text-slate-200 placeholder-slate-600 transition-all duration-300 outline-none`}
          />
          {errors.email && (
            <p className="mt-1 text-xs text-rose-500">{errors.email.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-xs font-semibold tracking-wider text-slate-400 uppercase">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••••••"
              {...register('password')}
              className={`w-full border bg-slate-950/50 px-4 py-2.5 ${
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
              className={`w-full border bg-slate-950/50 px-4 py-2.5 ${
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
        </div>

        <button
          type="submit"
          disabled={isRegistering}
          className="mt-2 flex w-full transform items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3 font-semibold text-white shadow-lg shadow-indigo-600/25 transition-all duration-300 hover:from-indigo-500 hover:to-purple-500 active:scale-[0.98] disabled:opacity-50"
        >
          {isRegistering ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          ) : (
            <span>Create Account</span>
          )}
        </button>
      </form>

      <div className="relative z-10 mt-8 border-t border-slate-800/60 pt-6 text-center">
        <p className="text-sm text-slate-400">
          Already have an account?{' '}
          <a
            href="/login"
            className="font-semibold text-indigo-400 transition-colors hover:text-indigo-300"
          >
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}
