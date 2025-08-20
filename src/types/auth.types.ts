/**
 * @project NG-Beta Integrated Platform - 整合專案管理、合作夥伴管理、文件處理和分析功能的現代化平台
 * @framework Next.js 15+ (App Router)
 * @typescript 5.0+
 * @author NG-Beta Development Team
 * @created 2025-01-20
 * @updated 2025-01-20
 * @version 1.0.0
 *
 * @fileoverview 認證系統類型定義 - 定義使用者認證、權限管理和角色控制的核心類型
 * @description 提供完整的認證系統類型定義，包含使用者角色、權限控制、使用者資料和認證狀態管理。
 *              支援基於角色的存取控制 (RBAC)，實現細粒度的權限管理系統。
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
 * - 基於角色的存取控制 (RBAC)
 * - 細粒度權限管理 (resource, action, scope)
 * - 多模組權限支援 (projects, contracts, partners, documents, analytics)
 * - 使用者資料管理
 * - 認證狀態追蹤
 *
 * @usage
 * ```typescript
 * import { UserProfile, Permission, AuthState } from '@/types/auth.types'
 *
 * const userPermission: Permission = {
 *   resource: 'projects',
 *   action: 'create',
 *   scope: 'team'
 * }
 * ```
 */

/**
 * 使用者角色定義
 * @description 定義使用者角色及其關聯的權限集合
 */
export interface UserRole {
  /** 角色唯一識別碼 */
  id: string;
  /** 角色名稱 (如: admin, manager, user) */
  name: string;
  /** 角色擁有的權限列表 */
  permissions: Permission[];
}

/**
 * 權限定義
 * @description 定義細粒度的權限控制，支援資源、動作和範圍的組合
 */
export interface Permission {
  /** 資源類型: 'projects', 'contracts', 'partners', 'documents', 'analytics' */
  resource: string;
  /** 動作類型: 'create', 'read', 'update', 'delete', 'manage' */
  action: string;
  /** 權限範圍: 'own', 'team', 'all' */
  scope: string;
}

/**
 * 使用者資料定義
 * @description 完整的使用者資料結構，包含基本資訊和權限設定
 */
export interface UserProfile {
  /** 使用者唯一識別碼 */
  id: string;
  /** 使用者電子郵件 */
  email: string;
  /** 使用者顯示名稱 */
  name: string;
  /** 使用者頭像 URL (可選) */
  avatar?: string;
  /** 使用者角色 */
  role: string;
  /** 使用者權限列表 */
  permissions: Permission[];
  /** 帳號建立時間 */
  createdAt: Date;
  /** 最後更新時間 */
  updatedAt: Date;
}

/**
 * 認證狀態類型
 * @description 定義認證系統的三種狀態
 */
export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

/**
 * 認證狀態管理
 * @description 全域認證狀態的結構定義，用於狀態管理
 */
export interface AuthState {
  /** 當前使用者資料 (null 表示未登入) */
  user: UserProfile | null;
  /** 認證狀態 */
  status: AuthStatus;
  /** 使用者權限快取 */
  permissions: Permission[];
}
