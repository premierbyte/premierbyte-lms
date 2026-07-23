'use client';

import React from 'react';
import Link from 'next/link';
import RouteGuard from '@/components/route-guard';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { useLicensing } from '@/features/licensing/hooks/use-licensing';
import { useOrganization } from '@/features/organizations/hooks/use-organization';
import { useCategories } from '@/features/categories/hooks/use-categories';
import { useUsers } from '@/features/users/hooks/use-users';
import { FeatureGate } from '@/features/licensing/components/feature-gate';
import { hasPermission } from '@/components/rbac/permission-gate';

export default function Home() {
  const { user } = useAuth();
  const { status: licenseStatus } = useLicensing();
  const { organization } = useOrganization();
  const { categories } = useCategories('tree');
  const { users, meta: usersMeta } = useUsers({ per_page: 10 });

  const totalUsersCount = usersMeta?.total ?? (users?.length || 0);

  return (
    <RouteGuard>
      <div className="space-y-8">
        {/* Welcome Banner */}
        <div className="relative overflow-hidden rounded-2xl border border-indigo-500/20 bg-gradient-to-r from-indigo-900/60 via-purple-900/40 to-slate-900 p-8 shadow-xl">
          <div className="relative z-10">
            <h1 className="text-3xl font-extrabold text-white">
              Welcome back,{' '}
              <span className="text-indigo-400">
                {user?.first_name || user?.name || 'Administrator'}
              </span>
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-300">
              Overview of system metrics, active domain modules, organization
              profile, and security scope permissions across the Premierbyte LMS
              platform.
            </p>
          </div>
        </div>

        {/* System Overview Stats Grid */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          {/* User Management Metric */}
          <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900 p-5 shadow-lg">
            <div>
              <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
                Total Users
              </p>
              <p className="mt-1 text-2xl font-bold text-white">
                {totalUsersCount}
              </p>
              <p className="mt-1 text-xs font-medium text-indigo-400">
                Directory Accounts
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-indigo-500/20 bg-indigo-500/10 text-indigo-400">
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
          </div>

          {/* Categories Tree Metric */}
          <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900 p-5 shadow-lg">
            <div>
              <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
                Root Categories
              </p>
              <p className="mt-1 text-2xl font-bold text-white">
                {categories?.length || 0}
              </p>
              <p className="mt-1 text-xs font-medium text-purple-400">
                Nested Taxonomy Trees
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-purple-500/20 bg-purple-500/10 text-purple-400">
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                />
              </svg>
            </div>
          </div>

          {/* Organization Metric */}
          <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900 p-5 shadow-lg">
            <div>
              <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
                Organization
              </p>
              <p className="mt-1 max-w-[140px] truncate text-lg font-bold text-white">
                {organization?.name || 'Premierbyte'}
              </p>
              <p className="mt-1 text-xs font-medium text-emerald-400">
                {organization?.locale || 'en'} •{' '}
                {organization?.timezone || 'UTC'}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
          </div>

          {/* Licensing Metric */}
          <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900 p-5 shadow-lg">
            <div>
              <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
                Licensing Status
              </p>
              <p className="mt-1 text-lg font-bold text-white">
                {licenseStatus?.in_restricted_mode ? 'Restricted' : 'Active'}
              </p>
              <p className="mt-1 text-xs font-medium text-amber-400">
                {licenseStatus?.status || 'Commercial SDK'}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/10 text-amber-400">
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Module Shortcut Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* User Management Card */}
          {hasPermission(user, 'users.view') && (
            <div className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white">
                    Users Directory
                  </h3>
                  <span className="rounded-md border border-indigo-500/20 bg-indigo-500/10 px-2.5 py-1 text-xs font-semibold text-indigo-400">
                    RBAC Protected
                  </span>
                </div>
                <p className="mb-6 text-sm leading-relaxed text-slate-400">
                  Manage platform user accounts, assign roles (Admin,
                  Instructor, Student), filter directory records, and invite
                  users via email.
                </p>
              </div>
              <Link
                href="/users"
                className="w-full rounded-xl bg-indigo-600 py-2.5 text-center text-sm font-semibold text-white shadow-md shadow-indigo-600/20 transition-all hover:bg-indigo-500"
              >
                Open Users Directory →
              </Link>
            </div>
          )}

          {/* Category Tree Card */}
          {hasPermission(user, 'categories.view') && (
            <div className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white">
                    Category Taxonomy
                  </h3>
                  <span className="rounded-md border border-purple-500/20 bg-purple-500/10 px-2.5 py-1 text-xs font-semibold text-purple-400">
                    Nested Trees
                  </span>
                </div>
                <p className="mb-6 text-sm leading-relaxed text-slate-400">
                  Organize learning material into self-referential categories
                  with circular parent protection and sort order rank
                  reordering.
                </p>
              </div>
              <Link
                href="/categories"
                className="w-full rounded-xl bg-purple-600 py-2.5 text-center text-sm font-semibold text-white shadow-md shadow-purple-600/20 transition-all hover:bg-purple-500"
              >
                Open Category Tree →
              </Link>
            </div>
          )}

          {/* Organization Settings Card */}
          {hasPermission(user, 'organizations.view') && (
            <div className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white">
                    Organization & Branding
                  </h3>
                  <span className="rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-400">
                    Feature Gated
                  </span>
                </div>
                <p className="mb-6 text-sm leading-relaxed text-slate-400">
                  Manage organization profile details, primary & secondary
                  branding color palettes, logo assets, and regional
                  localization.
                </p>
              </div>
              <Link
                href="/settings/organization"
                className="w-full rounded-xl bg-emerald-600 py-2.5 text-center text-sm font-semibold text-white shadow-md shadow-emerald-600/20 transition-all hover:bg-emerald-500"
              >
                Manage Organization →
              </Link>
            </div>
          )}
        </div>

        {/* Feature Flags Section */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
          <h3 className="mb-4 text-lg font-bold text-white">
            Commercial Feature Flags Status
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <FeatureGate
              feature="organizations"
              fallback={
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 opacity-60">
                  <span className="text-xs font-semibold text-slate-500 uppercase">
                    Disabled
                  </span>
                  <h4 className="mt-1 font-bold text-slate-400">
                    Multi-Organization Module
                  </h4>
                  <p className="mt-1 text-xs text-slate-500">
                    Requires Organization feature flag.
                  </p>
                </div>
              }
            >
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4">
                <span className="text-xs font-semibold text-emerald-400 uppercase">
                  Active
                </span>
                <h4 className="mt-1 font-bold text-white">
                  Multi-Organization Module
                </h4>
                <p className="mt-1 text-xs text-emerald-300/80">
                  White-label organization profiles active.
                </p>
              </div>
            </FeatureGate>

            <FeatureGate
              feature="advanced_reports"
              fallback={
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 opacity-60">
                  <span className="text-xs font-semibold text-slate-500 uppercase">
                    Disabled
                  </span>
                  <h4 className="mt-1 font-bold text-slate-400">
                    Advanced Analytics
                  </h4>
                  <p className="mt-1 text-xs text-slate-500">
                    Requires Advanced Reports license flag.
                  </p>
                </div>
              }
            >
              <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/10 p-4">
                <span className="text-xs font-semibold text-indigo-400 uppercase">
                  Active
                </span>
                <h4 className="mt-1 font-bold text-white">
                  Advanced Analytics
                </h4>
                <p className="mt-1 text-xs text-indigo-300/80">
                  Full analytics reporting enabled.
                </p>
              </div>
            </FeatureGate>

            <FeatureGate
              feature="certificates"
              fallback={
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 opacity-60">
                  <span className="text-xs font-semibold text-slate-500 uppercase">
                    Disabled
                  </span>
                  <h4 className="mt-1 font-bold text-slate-400">
                    Certificates Engine
                  </h4>
                  <p className="mt-1 text-xs text-slate-500">
                    Requires Certificates feature flag.
                  </p>
                </div>
              }
            >
              <div className="rounded-xl border border-purple-500/20 bg-purple-500/10 p-4">
                <span className="text-xs font-semibold text-purple-400 uppercase">
                  Active
                </span>
                <h4 className="mt-1 font-bold text-white">
                  Certificates Engine
                </h4>
                <p className="mt-1 text-xs text-purple-300/80">
                  PDF certificate generator active.
                </p>
              </div>
            </FeatureGate>
          </div>
        </div>
      </div>
    </RouteGuard>
  );
}
