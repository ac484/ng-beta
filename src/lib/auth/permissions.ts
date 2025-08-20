/**
 * @project NG-Beta Integrated Platform - 整合專案管理、合作夥伴管理、文件處理和分析功能的現代化平台
 * @framework Next.js 15+ (App Router)
 * @typescript 5.0+
 * @author NG-Beta Development Team
 * @created 2025-01-20
 * @updated 2025-01-20
 * @version 1.0.0
 *
 * @fileoverview 權限管理系統 - 定義角色、權限和權限檢查邏輯
 * @description 提供完整的權限管理系統，包含預定義的權限、角色配置和權限檢查函數。
 *              支援基於角色的存取控制 (RBAC) 和細粒度的權限管理。
 *
 * @tech-stack
 * - Runtime: Node.js 20+
 * - Framework: Next.js 15 (App Router)
 * - Language: TypeScript 5.0+
 * - Styling: Tailwind CSS 4.0+
 * - Database: Firebase Firestore
 * - Auth: Clerk Authentication
 * - State: Zustand + TanStack Query
 * - HTTP: Server Actions + Route Handlers
 * - Validation: Zod
 * - Testing: Jest + React Testing Library
 *
 * @environment
 * - Node: >=20.0.0
 * - Package Manager: pnpm
 * - Build Tool: Turbopack
 *
 * @features
 * - 預定義權限常數 (PERMISSIONS)
 * - 角色配置 (ROLES)
 * - 權限檢查函數 (hasPermission, hasAnyPermission, hasAllPermissions)
 * - 支援萬用字元權限 (*, manage)
 * - 範圍權限控制 (own, team, all)
 *
 * @usage
 * ```typescript
 * import { PERMISSIONS, ROLES, hasPermission } from '@/lib/auth/permissions'
 *
 * // 檢查使用者權限
 * const canCreateProject = hasPermission(userPermissions, PERMISSIONS.PROJECTS.CREATE)
 *
 * // 獲取角色權限
 * const adminPermissions = ROLES.ADMIN.permissions
 * ```
 */

import { Permission } from '@/types/auth.types';

// 預定義的權限
export const PERMISSIONS = {
  PROJECTS: {
    CREATE: { resource: 'projects', action: 'create', scope: 'own' },
    READ: { resource: 'projects', action: 'read', scope: 'own' },
    UPDATE: { resource: 'projects', action: 'update', scope: 'own' },
    DELETE: { resource: 'projects', action: 'delete', scope: 'own' },
    MANAGE_ALL: { resource: 'projects', action: 'manage', scope: 'all' }
  },
  CONTRACTS: {
    CREATE: { resource: 'contracts', action: 'create', scope: 'own' },
    READ: { resource: 'contracts', action: 'read', scope: 'own' },
    UPDATE: { resource: 'contracts', action: 'update', scope: 'own' },
    DELETE: { resource: 'contracts', action: 'delete', scope: 'own' },
    MANAGE_ALL: { resource: 'contracts', action: 'manage', scope: 'all' }
  },
  PARTNERS: {
    CREATE: { resource: 'partners', action: 'create', scope: 'own' },
    READ: { resource: 'partners', action: 'read', scope: 'all' },
    UPDATE: { resource: 'partners', action: 'update', scope: 'own' },
    DELETE: { resource: 'partners', action: 'delete', scope: 'own' },
    MANAGE_ALL: { resource: 'partners', action: 'manage', scope: 'all' }
  },
  DOCUMENTS: {
    CREATE: { resource: 'documents', action: 'create', scope: 'own' },
    READ: { resource: 'documents', action: 'read', scope: 'own' },
    UPDATE: { resource: 'documents', action: 'update', scope: 'own' },
    DELETE: { resource: 'documents', action: 'delete', scope: 'own' },
    MANAGE_ALL: { resource: 'documents', action: 'manage', scope: 'all' }
  },
  ANALYTICS: {
    READ: { resource: 'analytics', action: 'read', scope: 'own' },
    MANAGE_ALL: { resource: 'analytics', action: 'manage', scope: 'all' }
  }
} as const;

// 預定義的角色
export const ROLES = {
  ADMIN: {
    name: 'Administrator',
    permissions: [
      PERMISSIONS.PROJECTS.MANAGE_ALL,
      PERMISSIONS.CONTRACTS.MANAGE_ALL,
      PERMISSIONS.PARTNERS.MANAGE_ALL,
      PERMISSIONS.DOCUMENTS.MANAGE_ALL,
      PERMISSIONS.ANALYTICS.MANAGE_ALL
    ]
  },
  MANAGER: {
    name: 'Project Manager',
    permissions: [
      PERMISSIONS.PROJECTS.CREATE,
      PERMISSIONS.PROJECTS.READ,
      PERMISSIONS.PROJECTS.UPDATE,
      PERMISSIONS.PROJECTS.DELETE,
      PERMISSIONS.CONTRACTS.CREATE,
      PERMISSIONS.CONTRACTS.READ,
      PERMISSIONS.CONTRACTS.UPDATE,
      PERMISSIONS.PARTNERS.READ,
      PERMISSIONS.DOCUMENTS.CREATE,
      PERMISSIONS.DOCUMENTS.READ,
      PERMISSIONS.DOCUMENTS.UPDATE,
      PERMISSIONS.ANALYTICS.READ
    ]
  },
  USER: {
    name: 'Regular User',
    permissions: [
      PERMISSIONS.PROJECTS.CREATE,
      PERMISSIONS.PROJECTS.READ,
      PERMISSIONS.PROJECTS.UPDATE,
      PERMISSIONS.CONTRACTS.READ,
      PERMISSIONS.PARTNERS.READ,
      PERMISSIONS.DOCUMENTS.CREATE,
      PERMISSIONS.DOCUMENTS.READ,
      PERMISSIONS.ANALYTICS.READ
    ]
  }
} as const;

// 權限檢查函數
export function hasPermission(
  userPermissions: Permission[],
  requiredPermission: Permission
): boolean {
  return userPermissions.some(
    (permission) =>
      (permission.resource === requiredPermission.resource ||
        permission.resource === '*') &&
      (permission.action === requiredPermission.action ||
        permission.action === '*' ||
        permission.action === 'manage') &&
      (permission.scope === requiredPermission.scope ||
        permission.scope === 'all')
  );
}

// 檢查多個權限
export function hasAnyPermission(
  userPermissions: Permission[],
  requiredPermissions: Permission[]
): boolean {
  return requiredPermissions.some((permission) =>
    hasPermission(userPermissions, permission)
  );
}

// 檢查所有權限
export function hasAllPermissions(
  userPermissions: Permission[],
  requiredPermissions: Permission[]
): boolean {
  return requiredPermissions.every((permission) =>
    hasPermission(userPermissions, permission)
  );
}
