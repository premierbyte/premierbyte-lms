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
    <header className="h-16 bg-slate-900 border-b border-slate-800 px-6 flex items-center justify-between sticky top-0 z-30">
      {/* License Warning Badge if Restricted */}
      <div className="flex items-center gap-3">
        {status?.in_restricted_mode && (
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full text-amber-400 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
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
              <span className="text-xs px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 font-medium border border-indigo-500/20">
                {primaryRole}
              </span>
            </div>
            <button
              onClick={() => logout()}
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors text-xs font-medium border border-slate-800"
              title="Sign Out"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-semibold transition-all shadow-md shadow-indigo-600/20"
          >
            Sign In
          </a>
        )}
      </div>
    </header>
  );
}
