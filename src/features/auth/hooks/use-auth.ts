/**
 * @project NG-Beta Integrated Platform
 * @fileoverview 認證相關的 React Hooks
 * @description 提供認證狀態管理和權限檢查的 hooks
 */

'use client';

import { useUser, useAuth as useClerkAuth } from '@clerk/nextjs';
import { useMemo } from 'react';
import {
  UserRole,
  ResourceType,
  PermissionAction
} from '../services/auth-service';

/**
 * 使用者認證 Hook
 */
export function useAuth() {
  const { isSignedIn, userId, isLoaded } = useClerkAuth();
  const { user } = useUser();

  const userRole = useMemo(() => {
    if (!user) return UserRole.VIEWER;

    return (
      (user.publicMetadata?.role as UserRole) ||
      (user.privateMetadata?.role as UserRole) ||
      UserRole.USER
    );
  }, [user]);

  const isAdmin = useMemo(() => {
    return userRole === UserRole.ADMIN;
  }, [userRole]);

  const isManager = useMemo(() => {
    return userRole === UserRole.ADMIN || userRole === UserRole.MANAGER;
  }, [userRole]);

  return {
    isSignedIn,
    userId,
    user,
    userRole,
    isAdmin,
    isManager,
    isLoaded
  };
}

/**
 * 權限檢查 Hook
 */
export function usePermissions() {
  const { userRole } = useAuth();

  const checkPermission = useMemo(() => {
    return (
      resource: ResourceType,
      action: PermissionAction,
      scope: 'own' | 'team' | 'all' = 'own'
    ): boolean => {
      // 這裡實作權限檢查邏輯
      // 暫時簡化實作，實際應該使用 authService
      if (userRole === UserRole.ADMIN) {
        return true;
      }

      if (userRole === UserRole.MANAGER) {
        return scope !== 'all' || resource === ResourceType.PARTNERS;
      }

      if (userRole === UserRole.USER) {
        return scope === 'own';
      }

      return action === PermissionAction.READ && scope === 'own';
    };
  }, [userRole]);

  const canAccess = useMemo(() => {
    return (resource: ResourceType): boolean => {
      return checkPermission(resource, PermissionAction.READ, 'own');
    };
  }, [checkPermission]);

  const canCreate = useMemo(() => {
    return (resource: ResourceType): boolean => {
      return checkPermission(resource, PermissionAction.CREATE, 'own');
    };
  }, [checkPermission]);

  const canUpdate = useMemo(() => {
    return (
      resource: ResourceType,
      scope: 'own' | 'team' | 'all' = 'own'
    ): boolean => {
      return checkPermission(resource, PermissionAction.UPDATE, scope);
    };
  }, [checkPermission]);

  const canDelete = useMemo(() => {
    return (
      resource: ResourceType,
      scope: 'own' | 'team' | 'all' = 'own'
    ): boolean => {
      return checkPermission(resource, PermissionAction.DELETE, scope);
    };
  }, [checkPermission]);

  const moduleAccess = useMemo(() => {
    return {
      projects: canAccess(ResourceType.PROJECTS),
      contracts: canAccess(ResourceType.CONTRACTS),
      partners: canAccess(ResourceType.PARTNERS),
      documents: canAccess(ResourceType.DOCUMENTS),
      analytics: canAccess(ResourceType.ANALYTICS),
      settings: canAccess(ResourceType.SETTINGS)
    };
  }, [canAccess]);

  return {
    checkPermission,
    canAccess,
    canCreate,
    canUpdate,
    canDelete,
    moduleAccess
  };
}
