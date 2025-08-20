/**
 * @project NG-Beta Integrated Platform
 * @fileoverview 權限管理相關的 React Hooks
 * @description 提供細粒度的權限檢查和管理功能
 */

'use client';

import { useMemo } from 'react';
import { useAuth } from './use-auth';
import {
  UserRole,
  ResourceType,
  PermissionAction,
  ROLE_PERMISSIONS
} from '../services/auth-service';

/**
 * 權限管理 Hook
 */
export function usePermissions() {
  const { userRole, isLoaded } = useAuth();

  // 獲取使用者權限列表
  const userPermissions = useMemo(() => {
    if (!isLoaded) return [];
    return ROLE_PERMISSIONS[userRole] || [];
  }, [userRole, isLoaded]);

  // 檢查特定權限
  const hasPermission = useMemo(() => {
    return (
      resource: ResourceType,
      action: PermissionAction,
      scope: 'own' | 'team' | 'all' = 'own'
    ): boolean => {
      if (!isLoaded) return false;

      return userPermissions.some((permission) => {
        // 檢查資源類型
        if (permission.resource !== resource) {
          return false;
        }

        // 檢查動作權限
        if (
          permission.action !== action &&
          permission.action !== PermissionAction.MANAGE
        ) {
          return false;
        }

        // 檢查範圍權限
        if (permission.scope === 'all') {
          return true; // 'all' 包含所有範圍
        }

        if (
          permission.scope === 'team' &&
          (scope === 'team' || scope === 'own')
        ) {
          return true; // 'team' 包含 'own'
        }

        if (permission.scope === 'own' && scope === 'own') {
          return true;
        }

        return false;
      });
    };
  }, [userPermissions, isLoaded]);

  // 資源存取權限
  const canAccess = useMemo(() => {
    return (resource: ResourceType): boolean => {
      return hasPermission(resource, PermissionAction.READ, 'own');
    };
  }, [hasPermission]);

  const canCreate = useMemo(() => {
    return (resource: ResourceType): boolean => {
      return hasPermission(resource, PermissionAction.CREATE, 'own');
    };
  }, [hasPermission]);

  const canUpdate = useMemo(() => {
    return (
      resource: ResourceType,
      scope: 'own' | 'team' | 'all' = 'own'
    ): boolean => {
      return hasPermission(resource, PermissionAction.UPDATE, scope);
    };
  }, [hasPermission]);

  const canDelete = useMemo(() => {
    return (
      resource: ResourceType,
      scope: 'own' | 'team' | 'all' = 'own'
    ): boolean => {
      return hasPermission(resource, PermissionAction.DELETE, scope);
    };
  }, [hasPermission]);

  const canManage = useMemo(() => {
    return (
      resource: ResourceType,
      scope: 'own' | 'team' | 'all' = 'own'
    ): boolean => {
      return hasPermission(resource, PermissionAction.MANAGE, scope);
    };
  }, [hasPermission]);

  // 模組存取權限
  const modulePermissions = useMemo(() => {
    return {
      projects: {
        access: canAccess(ResourceType.PROJECTS),
        create: canCreate(ResourceType.PROJECTS),
        update: canUpdate(ResourceType.PROJECTS),
        delete: canDelete(ResourceType.PROJECTS),
        manage: canManage(ResourceType.PROJECTS)
      },
      contracts: {
        access: canAccess(ResourceType.CONTRACTS),
        create: canCreate(ResourceType.CONTRACTS),
        update: canUpdate(ResourceType.CONTRACTS),
        delete: canDelete(ResourceType.CONTRACTS),
        manage: canManage(ResourceType.CONTRACTS)
      },
      partners: {
        access: canAccess(ResourceType.PARTNERS),
        create: canCreate(ResourceType.PARTNERS),
        update: canUpdate(ResourceType.PARTNERS),
        delete: canDelete(ResourceType.PARTNERS),
        manage: canManage(ResourceType.PARTNERS)
      },
      documents: {
        access: canAccess(ResourceType.DOCUMENTS),
        create: canCreate(ResourceType.DOCUMENTS),
        update: canUpdate(ResourceType.DOCUMENTS),
        delete: canDelete(ResourceType.DOCUMENTS),
        manage: canManage(ResourceType.DOCUMENTS)
      },
      analytics: {
        access: canAccess(ResourceType.ANALYTICS),
        create: canCreate(ResourceType.ANALYTICS),
        update: canUpdate(ResourceType.ANALYTICS),
        delete: canDelete(ResourceType.ANALYTICS),
        manage: canManage(ResourceType.ANALYTICS)
      },
      settings: {
        access: canAccess(ResourceType.SETTINGS),
        create: canCreate(ResourceType.SETTINGS),
        update: canUpdate(ResourceType.SETTINGS),
        delete: canDelete(ResourceType.SETTINGS),
        manage: canManage(ResourceType.SETTINGS)
      }
    };
  }, [canAccess, canCreate, canUpdate, canDelete, canManage]);

  // 角色檢查
  const isAdmin = useMemo(() => {
    return userRole === UserRole.ADMIN;
  }, [userRole]);

  const isManager = useMemo(() => {
    return userRole === UserRole.ADMIN || userRole === UserRole.MANAGER;
  }, [userRole]);

  const isUser = useMemo(() => {
    return userRole === UserRole.USER;
  }, [userRole]);

  const isViewer = useMemo(() => {
    return userRole === UserRole.VIEWER;
  }, [userRole]);

  return {
    userRole,
    userPermissions,
    hasPermission,
    canAccess,
    canCreate,
    canUpdate,
    canDelete,
    canManage,
    modulePermissions,
    isAdmin,
    isManager,
    isUser,
    isViewer,
    isLoaded
  };
}

/**
 * 特定資源權限 Hook
 */
export function useResourcePermissions(resource: ResourceType) {
  const {
    hasPermission,
    canAccess,
    canCreate,
    canUpdate,
    canDelete,
    canManage
  } = usePermissions();

  return useMemo(
    () => ({
      access: canAccess(resource),
      create: canCreate(resource),
      updateOwn: canUpdate(resource, 'own'),
      updateTeam: canUpdate(resource, 'team'),
      updateAll: canUpdate(resource, 'all'),
      deleteOwn: canDelete(resource, 'own'),
      deleteTeam: canDelete(resource, 'team'),
      deleteAll: canDelete(resource, 'all'),
      manageOwn: canManage(resource, 'own'),
      manageTeam: canManage(resource, 'team'),
      manageAll: canManage(resource, 'all'),
      hasPermission: (
        action: PermissionAction,
        scope: 'own' | 'team' | 'all' = 'own'
      ) => hasPermission(resource, action, scope)
    }),
    [
      resource,
      hasPermission,
      canAccess,
      canCreate,
      canUpdate,
      canDelete,
      canManage
    ]
  );
}
