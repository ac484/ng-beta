/**
 * @project NG-Beta Integrated Platform - 整合專案管理、合作夥伴管理、文件處理和分析功能的現代化平台
 * @framework Next.js 15+ (App Router)
 * @typescript 5.0+
 * @author NG-Beta Development Team
 * @created 2025-01-20
 * @updated 2025-01-20
 * @version 1.0.0
 *
 * @fileoverview 認證狀態管理 Hook - 提供統一的使用者認證狀態和權限檢查功能
 * @description 整合 Clerk 認證服務的 React Hook，提供使用者資料、認證狀態和權限檢查功能。
 *              支援基於角色的存取控制 (RBAC)，並提供便利的權限檢查方法。
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
 * - 整合 Clerk 認證服務
 * - 使用者資料管理和狀態追蹤
 * - 基於角色的權限檢查
 * - 細粒度權限控制 (resource, action, scope)
 * - TypeScript 類型安全
 *
 * @usage
 * ```typescript
 * const { user, isSignedIn, hasPermission } = useAuth()
 *
 * if (hasPermission({ resource: 'projects', action: 'create', scope: 'own' })) {
 *   // 使用者有建立專案的權限
 * }
 * ```
 */

import { useUser } from '@clerk/nextjs';
import { useMemo } from 'react';
import { UserProfile, Permission } from '@/types/auth.types';
import { ROLES, hasPermission, hasAnyPermission } from '@/lib/auth/permissions';

export function useAuth() {
  const { user, isLoaded, isSignedIn } = useUser();

  const userProfile = useMemo((): UserProfile | null => {
    if (!user || !isSignedIn) return null;

    // 從 Clerk 用戶元數據中獲取角色，預設為 USER
    const role = (user.publicMetadata?.role as string) || 'USER';
    const roleConfig = ROLES[role as keyof typeof ROLES] || ROLES.USER;

    return {
      id: user.id,
      email: user.emailAddresses[0]?.emailAddress || '',
      name: user.fullName || user.firstName || 'User',
      avatar: user.imageUrl,
      role,
      permissions: [...roleConfig.permissions] as Permission[],
      createdAt: user.createdAt || new Date(),
      updatedAt: user.updatedAt || new Date()
    };
  }, [user, isSignedIn]);

  const permissions = userProfile?.permissions || [];

  return {
    user: userProfile,
    isLoaded,
    isSignedIn: !!userProfile,
    permissions,
    // 權限檢查方法
    hasPermission: (permission: Permission) =>
      hasPermission(permissions, permission),
    hasAnyPermission: (requiredPermissions: Permission[]) =>
      hasAnyPermission(permissions, requiredPermissions)
  };
}
