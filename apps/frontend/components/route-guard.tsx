'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/hooks/use-auth';

interface RouteGuardProps {
  children: React.ReactNode;
  requiredRole?: string;
  requiredPermission?: string;
}

export default function RouteGuard({
  children,
  requiredRole,
  requiredPermission,
}: RouteGuardProps) {
  const { isAuthenticated, isLoading, hasRole, hasPermission } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center space-y-4 bg-slate-950">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-500/20 border-t-indigo-500" />
        <p className="text-sm font-medium tracking-wide text-slate-400">
          Authenticating session...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect via useEffect
  }

  // Role check
  if (requiredRole && !hasRole(requiredRole)) {
    return <ForbiddenView type="role" value={requiredRole} />;
  }

  // Permission check
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <ForbiddenView type="permission" value={requiredPermission} />;
  }

  return <>{children}</>;
}

function ForbiddenView({
  type,
  value,
}: {
  type: 'role' | 'permission';
  value: string;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-4">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 p-8 text-center shadow-2xl">
        {/* Decorative gradient */}
        <div className="pointer-events-none absolute -top-40 -right-40 h-80 w-80 rounded-full bg-rose-500/10 blur-3xl" />

        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-rose-500/10 text-rose-400">
          <svg
            className="h-8 w-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m0-8v6m0 5h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <h2 className="text-2xl font-extrabold tracking-tight text-slate-100">
          Access Denied
        </h2>
        <p className="mt-3 text-sm text-slate-400">
          Your account does not possess the necessary {type} ({value}) to access
          this page.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            onClick={() => window.history.back()}
            className="rounded-xl bg-slate-800 px-6 py-2.5 text-sm font-semibold text-slate-200 transition-all duration-300 hover:bg-slate-700"
          >
            Go Back
          </button>
          <a
            href="/"
            className="rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition-all duration-300 hover:from-indigo-500 hover:to-purple-500"
          >
            Return Home
          </a>
        </div>
      </div>
    </div>
  );
}
