/**
 * @project NG-Beta Integrated Platform - 整合專案管理、合作夥伴管理、文件處理和分析功能的現代化平台
 * @framework Next.js 15+ (App Router)
 * @typescript 5.0+
 * @author NG-Beta Development Team
 * @created 2025-01-20
 * @updated 2025-01-20
 * @version 1.0.0
 *
 * @fileoverview 認證服務 - 提供統一的認證和權限管理服務
 * @description 整合 Clerk 認證服務，提供使用者認證、權限檢查、角色管理等功能。
 *              支援多種認證方式和細粒度的權限控制。
 *
 * @tech-stack
 * - Runtime: Node.js 20+
 * - Framework: Next.js 15 (App Router)
 * - Language: TypeScript 5.0+
 * - Auth: Clerk Authentication
 * - Database: Firebase Firestore
 * - State: Zustand + TanStack Query
 * - Validation: Zod
 *
 * @features
 * - 使用者認證和會話管理
 * - 基於角色的權限控制 (RBAC)
 * - 細粒度權限檢查
 * - 使用者資料同步
 * - 安全的 API 存取控制
 *
 * @usage
 * ```typescript
 * import { authService } from '@/features/auth/services/auth-service'
 *
 * // 檢查使用者權限
 * const hasPermission = await authService.checkPermission(userId, 'projects', 'create')
 *
 * // 獲取使用者角色
 * const userRole = await authService.getUserRole(userId)
 * ```
 */

import { auth, currentUser } from '@clerk/nextjs/server';
import { User } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

/**
 * 使用者角色定義
 */
export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  USER = 'user',
  VIEWER = 'viewer'
}

/**
 * 權限動作定義
 */
export enum PermissionAction {
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
  MANAGE = 'manage'
}

/**
 * 資源類型定義
 */
export enum ResourceType {
  PROJECTS = 'projects',
  CONTRACTS = 'contracts',
  PARTNERS = 'partners',
  DOCUMENTS = 'documents',
  ANALYTICS = 'analytics',
  USERS = 'users',
  SETTINGS = 'settings'
}

/**
 * 權限定義介面
 */
export interface Permission {
  resource: ResourceType;
  action: PermissionAction;
  scope: 'own' | 'team' | 'all';
}

/**
 * 角色權限映射
 */
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.ADMIN]: [
    // 管理員擁有所有權限
    {
      resource: ResourceType.PROJECTS,
      action: PermissionAction.MANAGE,
      scope: 'all'
    },
    {
      resource: ResourceType.CONTRACTS,
      action: PermissionAction.MANAGE,
      scope: 'all'
    },
    {
      resource: ResourceType.PARTNERS,
      action: PermissionAction.MANAGE,
      scope: 'all'
    },
    {
      resource: ResourceType.DOCUMENTS,
      action: PermissionAction.MANAGE,
      scope: 'all'
    },
    {
      resource: ResourceType.ANALYTICS,
      action: PermissionAction.MANAGE,
      scope: 'all'
    },
    {
      resource: ResourceType.USERS,
      action: PermissionAction.MANAGE,
      scope: 'all'
    },
    {
      resource: ResourceType.SETTINGS,
      action: PermissionAction.MANAGE,
      scope: 'all'
    }
  ],
  [UserRole.MANAGER]: [
    // 管理者權限
    {
      resource: ResourceType.PROJECTS,
      action: PermissionAction.MANAGE,
      scope: 'team'
    },
    {
      resource: ResourceType.CONTRACTS,
      action: PermissionAction.MANAGE,
      scope: 'team'
    },
    {
      resource: ResourceType.PARTNERS,
      action: PermissionAction.READ,
      scope: 'all'
    },
    {
      resource: ResourceType.DOCUMENTS,
      action: PermissionAction.MANAGE,
      scope: 'team'
    },
    {
      resource: ResourceType.ANALYTICS,
      action: PermissionAction.READ,
      scope: 'team'
    },
    {
      resource: ResourceType.USERS,
      action: PermissionAction.READ,
      scope: 'team'
    }
  ],
  [UserRole.USER]: [
    // 一般使用者權限
    {
      resource: ResourceType.PROJECTS,
      action: PermissionAction.MANAGE,
      scope: 'own'
    },
    {
      resource: ResourceType.CONTRACTS,
      action: PermissionAction.MANAGE,
      scope: 'own'
    },
    {
      resource: ResourceType.PARTNERS,
      action: PermissionAction.READ,
      scope: 'all'
    },
    {
      resource: ResourceType.DOCUMENTS,
      action: PermissionAction.MANAGE,
      scope: 'own'
    },
    {
      resource: ResourceType.ANALYTICS,
      action: PermissionAction.READ,
      scope: 'own'
    }
  ],
  [UserRole.VIEWER]: [
    // 檢視者權限
    {
      resource: ResourceType.PROJECTS,
      action: PermissionAction.READ,
      scope: 'own'
    },
    {
      resource: ResourceType.CONTRACTS,
      action: PermissionAction.READ,
      scope: 'own'
    },
    {
      resource: ResourceType.PARTNERS,
      action: PermissionAction.READ,
      scope: 'all'
    },
    {
      resource: ResourceType.DOCUMENTS,
      action: PermissionAction.READ,
      scope: 'own'
    },
    {
      resource: ResourceType.ANALYTICS,
      action: PermissionAction.READ,
      scope: 'own'
    }
  ]
};

/**
 * 認證服務類別
 */
export class AuthService {
  /**
   * 獲取當前認證狀態
   */
  async getAuth() {
    return auth();
  }

  /**
   * 獲取當前使用者
   */
  async getCurrentUser(): Promise<User | null> {
    return await currentUser();
  }

  /**
   * 獲取使用者 ID
   */
  async getUserId(): Promise<string | null> {
    const { userId } = await auth();
    return userId;
  }

  /**
   * 檢查使用者是否已認證
   */
  async isAuthenticated(): Promise<boolean> {
    const { userId } = await auth();
    return !!userId;
  }

  /**
   * 要求使用者認證，如果未認證則重定向到登入頁面
   */
  async requireAuth(): Promise<string> {
    const { userId } = await auth();

    if (!userId) {
      redirect('/sign-in');
    }

    return userId;
  }

  /**
   * 獲取使用者角色
   */
  async getUserRole(userId?: string): Promise<UserRole> {
    const targetUserId = userId || (await this.getUserId());

    if (!targetUserId) {
      return UserRole.VIEWER;
    }

    const user = await currentUser();

    if (!user) {
      return UserRole.VIEWER;
    }

    // 從 Clerk 的 publicMetadata 或 privateMetadata 中獲取角色
    const role =
      (user.publicMetadata?.role as UserRole) ||
      (user.privateMetadata?.role as UserRole) ||
      UserRole.USER;

    return role;
  }

  /**
   * 檢查使用者是否具有特定角色
   */
  async hasRole(role: UserRole, userId?: string): Promise<boolean> {
    const userRole = await this.getUserRole(userId);
    return userRole === role;
  }

  /**
   * 檢查使用者是否為管理員
   */
  async isAdmin(userId?: string): Promise<boolean> {
    return await this.hasRole(UserRole.ADMIN, userId);
  }

  /**
   * 檢查使用者是否為管理者
   */
  async isManager(userId?: string): Promise<boolean> {
    const userRole = await this.getUserRole(userId);
    return userRole === UserRole.ADMIN || userRole === UserRole.MANAGER;
  }

  /**
   * 獲取使用者權限列表
   */
  async getUserPermissions(userId?: string): Promise<Permission[]> {
    const userRole = await this.getUserRole(userId);
    return ROLE_PERMISSIONS[userRole] || [];
  }

  /**
   * 檢查使用者是否具有特定權限
   */
  async checkPermission(
    resource: ResourceType,
    action: PermissionAction,
    scope: 'own' | 'team' | 'all' = 'own',
    userId?: string
  ): Promise<boolean> {
    const permissions = await this.getUserPermissions(userId);

    return permissions.some((permission) => {
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
  }

  /**
   * 要求特定權限，如果沒有權限則拋出錯誤
   */
  async requirePermission(
    resource: ResourceType,
    action: PermissionAction,
    scope: 'own' | 'team' | 'all' = 'own',
    userId?: string
  ): Promise<void> {
    const hasPermission = await this.checkPermission(
      resource,
      action,
      scope,
      userId
    );

    if (!hasPermission) {
      throw new Error(
        `Insufficient permissions: ${action} ${resource} (${scope})`
      );
    }
  }

  /**
   * 檢查使用者是否可以存取特定資源
   */
  async canAccess(resource: ResourceType, userId?: string): Promise<boolean> {
    return await this.checkPermission(
      resource,
      PermissionAction.READ,
      'own',
      userId
    );
  }

  /**
   * 檢查使用者是否可以建立特定資源
   */
  async canCreate(resource: ResourceType, userId?: string): Promise<boolean> {
    return await this.checkPermission(
      resource,
      PermissionAction.CREATE,
      'own',
      userId
    );
  }

  /**
   * 檢查使用者是否可以更新特定資源
   */
  async canUpdate(
    resource: ResourceType,
    scope: 'own' | 'team' | 'all' = 'own',
    userId?: string
  ): Promise<boolean> {
    return await this.checkPermission(
      resource,
      PermissionAction.UPDATE,
      scope,
      userId
    );
  }

  /**
   * 檢查使用者是否可以刪除特定資源
   */
  async canDelete(
    resource: ResourceType,
    scope: 'own' | 'team' | 'all' = 'own',
    userId?: string
  ): Promise<boolean> {
    return await this.checkPermission(
      resource,
      PermissionAction.DELETE,
      scope,
      userId
    );
  }

  /**
   * 獲取使用者的模組存取權限
   */
  async getModuleAccess(userId?: string): Promise<{
    projects: boolean;
    contracts: boolean;
    partners: boolean;
    documents: boolean;
    analytics: boolean;
    settings: boolean;
  }> {
    return {
      projects: await this.canAccess(ResourceType.PROJECTS, userId),
      contracts: await this.canAccess(ResourceType.CONTRACTS, userId),
      partners: await this.canAccess(ResourceType.PARTNERS, userId),
      documents: await this.canAccess(ResourceType.DOCUMENTS, userId),
      analytics: await this.canAccess(ResourceType.ANALYTICS, userId),
      settings: await this.canAccess(ResourceType.SETTINGS, userId)
    };
  }

  /**
   * 更新使用者角色 (僅管理員可用)
   */
  async updateUserRole(
    targetUserId: string,
    newRole: UserRole,
    adminUserId?: string
  ): Promise<void> {
    // 檢查執行者是否為管理員
    const isAdminUser = await this.isAdmin(adminUserId);

    if (!isAdminUser) {
      throw new Error('Only administrators can update user roles');
    }

    // 這裡需要實作更新 Clerk 使用者 metadata 的邏輯
    // 由於這需要 Clerk 的 server-side API，暫時留空
    // TODO: 實作 Clerk 使用者角色更新
    // eslint-disable-next-line no-console
    console.log(`Updating user ${targetUserId} role to ${newRole}`);
  }
}

/**
 * 認證服務實例
 */
export const authService = new AuthService();

/**
 * 導出預設服務
 */
export default authService;
