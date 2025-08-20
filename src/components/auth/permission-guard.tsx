'use client';

import { ReactNode } from 'react';
import { usePermissions } from '@/hooks/use-permissions';
import { Permission } from '@/types/auth.types';

interface PermissionGuardProps {
  children: ReactNode;
  permission?: Permission;
  permissions?: Permission[];
  requireAll?: boolean;
  fallback?: ReactNode;
}

export function PermissionGuard({
  children,
  permission,
  permissions,
  requireAll = false,
  fallback = null
}: PermissionGuardProps) {
  const { hasPermission, hasAnyPermission } = usePermissions();

  // 單一權限檢查
  if (permission && !hasPermission(permission)) {
    return <>{fallback}</>;
  }

  // 多權限檢查
  if (permissions) {
    const hasAccess = requireAll
      ? permissions.every((p) => hasPermission(p))
      : hasAnyPermission(permissions);

    if (!hasAccess) {
      return <>{fallback}</>;
    }
  }

  return <>{children}</>;
}
