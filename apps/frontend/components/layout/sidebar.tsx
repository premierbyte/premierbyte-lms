'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/features/auth/store/use-auth-store';
import { hasPermission, hasRole } from '@/components/rbac/permission-gate';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  permission?: string;
  role?: string[];
}

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuthStore();

  const navItems: NavItem[] = [
    {
      label: 'Dashboard',
      href: '/',
      icon: (
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
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
    },
    {
      label: 'Courses Directory',
      href: '/courses',
      permission: 'courses.view',
      role: ['Super Admin', 'Admin', 'Instructor'],
      icon: (
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
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
      ),
    },
    {
      label: 'Users Directory',
      href: '/users',
      permission: 'users.view',
      role: ['Super Admin', 'Admin', 'Instructor'],
      icon: (
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
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ),
    },
    {
      label: 'Category Tree',
      href: '/categories',
      permission: 'categories.view',
      role: ['Super Admin', 'Admin', 'Instructor'],
      icon: (
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
            d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
          />
        </svg>
      ),
    },
    {
      label: 'Organization Settings',
      href: '/settings/organization',
      permission: 'organizations.view',
      role: ['Super Admin', 'Admin'],
      icon: (
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
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
      ),
    },
  ];

  const visibleItems = navItems.filter((item) => {
    if (!item.permission && !item.role) return true;
    if (item.permission && hasPermission(user, item.permission)) return true;
    if (item.role && item.role.some((r) => hasRole(user, r))) return true;
    return false;
  });

  return (
    <aside className="sticky top-0 flex h-screen w-64 flex-col border-r border-slate-800 bg-slate-900 text-slate-300">
      {/* Brand Header */}
      <div className="flex items-center gap-3 border-b border-slate-800 p-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-xl font-bold text-white shadow-lg shadow-indigo-500/30">
          P
        </div>
        <div>
          <h1 className="text-base leading-tight font-bold tracking-wide text-white">
            Premierbyte
          </h1>
          <p className="text-xs font-medium text-indigo-400">LMS Platform</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1.5 overflow-y-auto p-4">
        <div className="px-3 py-2 text-xs font-semibold tracking-wider text-slate-500 uppercase">
          Main Navigation
        </div>
        {visibleItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Sidebar Footer User Badge */}
      {user && (
        <div className="border-t border-slate-800 bg-slate-900/60 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 bg-slate-800 text-sm font-semibold text-indigo-400">
              {user.first_name?.[0] || user.name?.[0] || 'U'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-white">
                {user.name || `${user.first_name} ${user.last_name}`}
              </p>
              <p className="truncate text-xs text-indigo-400">{user.email}</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
