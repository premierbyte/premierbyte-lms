'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '../schemas/auth-schemas';
import { LoginCredentials } from '../types';
import { useAuth } from '../hooks/use-auth';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function LoginForm() {
  const { login, isLoggingIn } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      remember: false,
    },
  });

  const onSubmit = async (data: LoginCredentials) => {
    try {
      await login(data);
      toast.success('Successfully logged in!');
      router.push('/');
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || 'Invalid email or password.';
      toast.error(errorMessage);
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
          Welcome Back
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          Access your enterprise learning dashboard
        </p>
      </div>

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
            } focus:ring-opacity-50 rounded-xl text-slate-200 placeholder-slate-600 transition-all duration-300 outline-none focus:ring-1`}
          />
          {errors.email && (
            <p className="mt-1 text-xs text-rose-500">{errors.email.message}</p>
          )}
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="block text-xs font-semibold tracking-wider text-slate-400 uppercase">
              Password
            </label>
            <a
              href="/forgot-password"
              className="text-xs font-semibold text-indigo-400 transition-colors hover:text-indigo-300"
            >
              Forgot Password?
            </a>
          </div>
          <input
            type="password"
            placeholder="••••••••••••"
            {...register('password')}
            className={`w-full border bg-slate-950/50 px-4 py-3 ${
              errors.password
                ? 'border-rose-500/50 focus:border-rose-500'
                : 'border-slate-800 focus:border-indigo-500'
            } focus:ring-opacity-50 rounded-xl text-slate-200 placeholder-slate-600 transition-all duration-300 outline-none focus:ring-1`}
          />
          {errors.password && (
            <p className="mt-1 text-xs text-rose-500">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="remember"
            {...register('remember')}
            className="h-4 w-4 rounded border-slate-800 bg-slate-950/50 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-slate-900"
          />
          <label
            htmlFor="remember"
            className="ml-2 cursor-pointer text-sm text-slate-400 select-none"
          >
            Remember me on this device
          </label>
        </div>

        <button
          type="submit"
          disabled={isLoggingIn}
          className="flex w-full transform items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3.5 font-semibold text-white shadow-lg shadow-indigo-600/25 transition-all duration-300 hover:from-indigo-500 hover:to-purple-500 active:scale-[0.98] disabled:opacity-50"
        >
          {isLoggingIn ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          ) : (
            <span>Sign In</span>
          )}
        </button>
      </form>

      <div className="relative z-10 mt-8 border-t border-slate-800/60 pt-6 text-center">
        <p className="text-sm text-slate-400">
          Don't have an account?{' '}
          <a
            href="/register"
            className="font-semibold text-indigo-400 transition-colors hover:text-indigo-300"
          >
            Register here
          </a>
        </p>
      </div>
    </div>
  );
}
