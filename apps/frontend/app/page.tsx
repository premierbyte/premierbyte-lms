'use client';

import React from 'react';
import RouteGuard from '@/components/route-guard';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { user, logout, isLoggingOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await logout();
      toast.success('Successfully logged out.');
      router.push('/login');
    } catch (error) {
      toast.error('Failed to log out.');
    }
  };

  return (
    <RouteGuard>
      <div className="relative flex min-h-screen flex-col overflow-hidden bg-slate-950 font-sans text-slate-100">
        {/* Decorative background glow */}
        <div className="pointer-events-none absolute top-0 right-1/4 h-[500px] w-[500px] rounded-full bg-indigo-500/5 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-1/4 h-[500px] w-[500px] rounded-full bg-purple-500/5 blur-3xl" />

        {/* Navigation Bar */}
        <header className="sticky top-0 z-40 w-full border-b border-slate-900 bg-slate-950/80 backdrop-blur-md">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 shadow-md shadow-indigo-500/25">
                <span className="text-base font-bold text-white">P</span>
              </div>
              <span className="text-lg font-bold tracking-tight text-slate-200">
                Premierbyte LMS
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden flex-col items-end md:flex">
                <span className="text-sm font-semibold text-slate-300">
                  {user?.name}
                </span>
                <span className="text-xs font-medium text-indigo-400">
                  {user?.roles?.[0] || 'User'}
                </span>
              </div>

              <button
                onClick={handleSignOut}
                disabled={isLoggingOut}
                className="rounded-xl border border-slate-800 px-4 py-2 text-sm font-semibold text-slate-300 transition-all duration-300 hover:border-slate-700 hover:bg-slate-900 active:scale-[0.98] disabled:opacity-50"
              >
                {isLoggingOut ? 'Signing out...' : 'Sign Out'}
              </button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="relative z-10 mx-auto w-full max-w-7xl flex-1 px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-10">
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-100 sm:text-5xl">
              Welcome back,{' '}
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                {user?.first_name}
              </span>
              !
            </h1>
            <p className="mt-2 text-lg text-slate-400">
              Here is an overview of your platform configuration and user access
              details.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* User Profile Card */}
            <div className="relative overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-900 p-6 shadow-xl">
              <h3 className="mb-6 text-lg font-bold text-slate-200">
                Active Session Details
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between border-b border-slate-800/60 py-2.5">
                  <span className="text-sm text-slate-400">Full Name</span>
                  <span className="text-sm font-semibold text-slate-200">
                    {user?.name}
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-800/60 py-2.5">
                  <span className="text-sm text-slate-400">Username</span>
                  <span className="text-sm font-semibold text-indigo-400">
                    @{user?.username}
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-800/60 py-2.5">
                  <span className="text-sm text-slate-400">Email Address</span>
                  <span className="text-sm font-semibold text-slate-200">
                    {user?.email}
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-800/60 py-2.5">
                  <span className="text-sm text-slate-400">Account Status</span>
                  <span className="rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">
                    {user?.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Roles and Permissions Card */}
            <div className="rounded-3xl border border-slate-800/80 bg-slate-900 p-6 shadow-xl lg:col-span-2">
              <h3 className="mb-6 text-lg font-bold text-slate-200">
                Assigned Security Roles & Scopes
              </h3>

              <div className="mb-6">
                <h4 className="mb-3 text-xs font-semibold tracking-wider text-slate-400 uppercase">
                  Roles
                </h4>
                <div className="flex flex-wrap gap-2">
                  {user?.roles?.map((role) => (
                    <span
                      key={role}
                      className="rounded-xl border border-indigo-500/25 bg-indigo-500/10 px-3.5 py-1.5 text-sm font-semibold text-indigo-400 shadow-sm"
                    >
                      {role}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="mb-3 text-xs font-semibold tracking-wider text-slate-400 uppercase">
                  Granted Permissions
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {user?.permissions && user.permissions.length > 0 ? (
                    user.permissions.map((perm) => (
                      <span
                        key={perm}
                        className="rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1 text-xs font-medium text-slate-400"
                      >
                        {perm}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-slate-500 italic">
                      No direct permissions. Role permissions inherit
                      implicitly.
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </RouteGuard>
  );
}
