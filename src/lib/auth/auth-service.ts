/**
 * @project NG-Beta Integrated Platform - 整合專案管理、合作夥伴管理、文件處理和分析功能的現代化平台
 * @framework Next.js 15+ (App Router)
 * @typescript 5.0+
 * @author NG-Beta Development Team
 * @created 2025-01-20
 * @updated 2025-01-20
 * @version 1.0.0
 *
 * @fileoverview 認證服務層 - 提供伺服器端認證功能和使用者資料管理
 * @description 整合 Clerk 認證服務的伺服器端功能，提供使用者資料獲取、認證檢查和權限管理。
 *              支援 Server Components 和 Server Actions 中的認證需求。
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
 * - 伺服器端使用者資料獲取
 * - 認證狀態檢查和驗證
 * - 基於角色的權限管理
 * - Clerk 使用者資料轉換
 * - TypeScript 類型安全
 *
 * @usage
 * ```typescript
 * // 在 Server Component 中使用
 * const user = await getCurrentUser()
 * if (!user) redirect('/sign-in')
 *
 * // 在 Server Action 中使用
 * const user = await requireAuth()
 * ```
 */

import { auth, currentUser } from '@clerk/nextjs/server';
import { UserProfile, Permission } from '@/types/auth.types';
import { ROLES } from './permissions';

export async function getCurrentUser(): Promise<UserProfile | null> {
  try {
    const user = await currentUser();
    if (!user) return null;

    const role = (user.publicMetadata?.role as string) || 'USER';
    const roleConfig = ROLES[role as keyof typeof ROLES] || ROLES.USER;

    return {
      id: user.id,
      email: user.emailAddresses[0]?.emailAddress || '',
      name: user.fullName || user.firstName || 'User',
      avatar: user.imageUrl,
      role,
      permissions: [...roleConfig.permissions] as Permission[],
      createdAt:
        typeof user.createdAt === 'number'
          ? new Date(user.createdAt)
          : user.createdAt || new Date(),
      updatedAt:
        typeof user.updatedAt === 'number'
          ? new Date(user.updatedAt)
          : user.updatedAt || new Date()
    };
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

export async function requireAuth(): Promise<UserProfile> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('Authentication required');
  }
  return user;
}

export async function getAuthUserId(): Promise<string> {
  const { userId } = await auth();
  if (!userId) {
    throw new Error('Authentication required');
  }
  return userId;
}
