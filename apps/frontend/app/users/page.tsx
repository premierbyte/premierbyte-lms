'use client';

import React from 'react';
import RouteGuard from '@/components/route-guard';
import { RestrictedBanner } from '@/features/licensing/components/restricted-banner';
import UserList from '@/features/users/components/user-list';

export default function UsersPage() {
  return (
    <RouteGuard requiredPermission="users.view">
      <RestrictedBanner />
      <main className="relative min-h-screen overflow-hidden bg-slate-950 px-4 py-12 text-slate-100 sm:px-6 lg:px-8">
        {/* Background ambient lighting */}
        <div className="pointer-events-none absolute top-10 left-1/3 h-[500px] w-[500px] rounded-full bg-indigo-600/10 blur-3xl" />
        <div className="pointer-events-none absolute right-1/3 bottom-10 h-[500px] w-[500px] rounded-full bg-purple-600/10 blur-3xl" />

        <div className="relative z-10">
          <UserList />
        </div>
      </main>
    </RouteGuard>
  );
}
