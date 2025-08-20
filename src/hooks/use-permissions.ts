/**
 * @project NG-Beta Integrated Platform - 整合專案管理、合作夥伴管理、文件處理和分析功能的現代化平台
 * @framework Next.js 15+ (App Router)
 * @typescript 5.0+
 * @author NG-Beta Development Team
 * @created 2025-01-20
 * @updated 2025-01-20
 * @version 1.0.0
 *
 * @fileoverview 權限管理 Hook - 提供模組化的權限檢查和管理功能
 * @description 基於 useAuth Hook 構建的權限管理工具，提供各模組的細粒度權限檢查。
 *              支援 projects、contracts、partners、documents、analytics 等模組的權限控制。
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
 * - 模組化權限檢查
 * - 細粒度權限控制 (view, create, update, delete, manage)
 * - 基於角色的存取控制 (RBAC)
 * - 效能最佳化的權限快取
 * - TypeScript 類型安全
 *
 * @usage
 * ```typescript
 * const { projects, contracts, hasPermission } = usePermissions()
 *
 * if (projects.canCreate) {
 *   // 使用者可以建立專案
 * }
 *
 * if (contracts.canManage) {
 *   // 使用者可以管理合約
 * }
 * ```
 */

import { useMemo } from 'react';
import { useAuth } from './use-auth';
import { PERMISSIONS } from '@/lib/auth/permissions';

export function usePermissions() {
  const { permissions, hasPermission, hasAnyPermission } = useAuth();

  const modulePermissions = useMemo(
    () => ({
      projects: {
        canView: hasPermission(PERMISSIONS.PROJECTS.READ),
        canCreate: hasPermission(PERMISSIONS.PROJECTS.CREATE),
        canUpdate: hasPermission(PERMISSIONS.PROJECTS.UPDATE),
        canDelete: hasPermission(PERMISSIONS.PROJECTS.DELETE),
        canManage: hasPermission(PERMISSIONS.PROJECTS.MANAGE_ALL)
      },
      contracts: {
        canView: hasPermission(PERMISSIONS.CONTRACTS.READ),
        canCreate: hasPermission(PERMISSIONS.CONTRACTS.CREATE),
        canUpdate: hasPermission(PERMISSIONS.CONTRACTS.UPDATE),
        canDelete: hasPermission(PERMISSIONS.CONTRACTS.DELETE),
        canManage: hasPermission(PERMISSIONS.CONTRACTS.MANAGE_ALL)
      },
      partners: {
        canView: hasPermission(PERMISSIONS.PARTNERS.READ),
        canCreate: hasPermission(PERMISSIONS.PARTNERS.CREATE),
        canUpdate: hasPermission(PERMISSIONS.PARTNERS.UPDATE),
        canDelete: hasPermission(PERMISSIONS.PARTNERS.DELETE),
        canManage: hasPermission(PERMISSIONS.PARTNERS.MANAGE_ALL)
      },
      documents: {
        canView: hasPermission(PERMISSIONS.DOCUMENTS.READ),
        canCreate: hasPermission(PERMISSIONS.DOCUMENTS.CREATE),
        canUpdate: hasPermission(PERMISSIONS.DOCUMENTS.UPDATE),
        canDelete: hasPermission(PERMISSIONS.DOCUMENTS.DELETE),
        canManage: hasPermission(PERMISSIONS.DOCUMENTS.MANAGE_ALL)
      },
      analytics: {
        canView: hasPermission(PERMISSIONS.ANALYTICS.READ),
        canManage: hasPermission(PERMISSIONS.ANALYTICS.MANAGE_ALL)
      }
    }),
    [hasPermission]
  );

  return {
    permissions,
    hasPermission,
    hasAnyPermission,
    ...modulePermissions
  };
}
