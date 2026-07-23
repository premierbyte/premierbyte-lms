'use client';

import React from 'react';
import RouteGuard from '@/components/route-guard';
import UserList from '@/features/users/components/user-list';

export default function UsersPage() {
  return (
    <RouteGuard requiredPermission="users.view">
      <div className="w-full">
        <UserList />
      </div>
    </RouteGuard>
  );
}
