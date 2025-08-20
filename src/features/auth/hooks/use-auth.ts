/**
 * @project NG-Beta Integrated Platform - 現代化整合平台
 * @framework Next.js 15+ (App Router)
 * @typescript 5.0+
 * @author NG-Beta Development Team
 * @created 2025-01-17
 * @updated 2025-01-17
 * @version 1.0.0
 *
 * @fileoverview 認證相關的 React Hooks
 * @description 提供使用者認證狀態管理、權限檢查和角色驗證的自定義 hooks，
 *              整合 Clerk 認證服務，支援多層級權限控制和模組存取管理
 *
 * @tech-stack
 * - Runtime: Node.js 20+
 * - Framework: Next.js 15 (App Router)
 * - Language: TypeScript 5.0+
 * - Auth: Clerk Authentication
 * - State: React Hooks + useMemo
 * - Validation: Zod (via auth-service)
 *
 * @features
 * - 使用者認證狀態管理
 * - 角色基礎權限控制 (RBAC)
 * - 資源存取權限檢查
 * - 模組級別存取控制
 * - 即時權限狀態更新
 *
 * @dependencies
 * - @clerk/nextjs: Clerk 認證服務
 * - react: React hooks
 * - ../services/auth-service: 認證服務類型定義
 *
 * @environment
 * - Node: >=20.0.0
 * - Package Manager: pnpm
 * - Build Tool: Turbopack
 */

'use client';

import { useAuth as useClerkAuth, useUser } from '@clerk/nextjs';
import { useMemo } from 'react';
import {
  PermissionAction,
  ResourceType,
  UserRole
} from '../services/auth-service';

/**
 * 使用者認證 Hook
 */
export function useAuth() {
  const { isSignedIn, userId, isLoaded } = useClerkAuth();
  const { user } = useUser();

  const userRole = useMemo(() => {
    if (!user) return UserRole.VIEWER;

    return (user.publicMetadata?.role as UserRole) || UserRole.USER;
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
