'use client';

import React from 'react';
import { useAuthStore } from '@/features/auth/store/use-auth-store';
import { User } from '@/features/auth/types';

export function hasRole(user: User | null, roleName: string): boolean {
  if (!user || !user.roles || user.roles.length === 0) return false;

  return user.roles.some((r: any) => {
    const name = typeof r === 'string' ? r : r?.name;
    return (
      typeof name === 'string' && name.toLowerCase() === roleName.toLowerCase()
    );
  });
}

export function hasPermission(
  user: User | null,
  permissionName: string
): boolean {
  if (!user) return false;

  // Super Admin & Admin bypass specific permission requirements
  if (hasRole(user, 'Super Admin') || hasRole(user, 'Admin')) {
    return true;
  }

  if (!user.permissions || user.permissions.length === 0) return false;

  return user.permissions.some((p: any) => {
    const name = typeof p === 'string' ? p : p?.name;
    return (
      typeof name === 'string' &&
      name.toLowerCase() === permissionName.toLowerCase()
    );
  });
}

interface PermissionGateProps {
  permission: string;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export function PermissionGate({
  permission,
  fallback = null,
  children,
}: PermissionGateProps) {
  const { user } = useAuthStore();

  if (!hasPermission(user, permission)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

interface RoleGateProps {
  role: string | string[];
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export function RoleGate({ role, fallback = null, children }: RoleGateProps) {
  const { user } = useAuthStore();

  const rolesToCheck = Array.isArray(role) ? role : [role];
  const allowed = rolesToCheck.some((r) => hasRole(user, r));

  if (!allowed) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
