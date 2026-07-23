'use client';

import React from 'react';
import { useAuthStore } from '@/features/auth/store/use-auth-store';
import { useLicensing } from '@/features/licensing/hooks/use-licensing';

export function Header() {
  const { user, logout } = useAuthStore();
  const { status } = useLicensing();

  const getPrimaryRole = (): string => {
    if (!user || !user.roles || user.roles.length === 0) return 'User';
    const firstRole: any = user.roles[0];
    if (typeof firstRole === 'string') return firstRole;
    if (firstRole && typeof firstRole === 'object' && 'name' in firstRole) {
      return String(firstRole.name);
    }
    return 'User';
  };

  const primaryRole = getPrimaryRole();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-800 bg-slate-900 px-6">
      {/* License Warning Badge if Restricted */}
      <div className="flex items-center gap-3">
        {status?.in_restricted_mode && (
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-400">
            <span className="h-2 w-2 animate-pulse rounded-full bg-amber-400"></span>
            Restricted License Mode
          </div>
        )}
      </div>

      {/* Right User Actions */}
      <div className="flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-end">
              <span className="text-sm font-semibold text-white">
                {user.name || `${user.first_name} ${user.last_name}`}
              </span>
              <span className="rounded border border-indigo-500/20 bg-indigo-500/10 px-2 py-0.5 text-xs font-medium text-indigo-400">
                {primaryRole}
              </span>
            </div>
            <button
              onClick={() => logout()}
              className="rounded-lg border border-slate-800 p-2 text-xs font-medium text-slate-400 transition-colors hover:bg-rose-500/10 hover:text-rose-400"
              title="Sign Out"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </button>
          </div>
        ) : (
          <a
            href="/login"
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-indigo-600/20 transition-all hover:bg-indigo-500"
          >
            Sign In
          </a>
        )}
      </div>
    </header>
  );
}
