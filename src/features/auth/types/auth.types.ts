/**
 * @project NG-Beta Integrated Platform
 * @fileoverview 認證相關的 TypeScript 類型定義
 * @description 定義認證、權限、角色等相關的類型和介面
 */

import { User } from '@clerk/nextjs/server';

/**
 * 使用者角色枚舉
 */
export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  USER = 'user',
  VIEWER = 'viewer'
}

/**
 * 權限動作枚舉
 */
export enum PermissionAction {
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
  MANAGE = 'manage'
}

/**
 * 資源類型枚舉
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
 * 權限範圍類型
 */
export type PermissionScope = 'own' | 'team' | 'all';

/**
 * 權限定義介面
 */
export interface Permission {
  resource: ResourceType;
  action: PermissionAction;
  scope: PermissionScope;
}

/**
 * 使用者資訊介面
 */
export interface UserInfo {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
  permissions: Permission[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 認證狀態介面
 */
export interface AuthState {
  isSignedIn: boolean;
  userId: string | null;
  user: User | null;
  userRole: UserRole;
  isAdmin: boolean;
  isManager: boolean;
  isLoaded: boolean;
}

/**
 * 權限檢查結果介面
 */
export interface PermissionCheck {
  hasPermission: boolean;
  reason?: string;
}

/**
 * 模組權限介面
 */
export interface ModulePermissions {
  access: boolean;
  create: boolean;
  update: boolean;
  delete: boolean;
  manage: boolean;
}

/**
 * 所有模組權限介面
 */
export interface AllModulePermissions {
  projects: ModulePermissions;
  contracts: ModulePermissions;
  partners: ModulePermissions;
  documents: ModulePermissions;
  analytics: ModulePermissions;
  settings: ModulePermissions;
}

/**
 * 角色權限映射類型
 */
export type RolePermissionMap = Record<UserRole, Permission[]>;

/**
 * 認證中間件配置介面
 */
export interface AuthMiddlewareConfig {
  publicRoutes?: string[];
  ignoredRoutes?: string[];
  afterSignInUrl?: string;
  afterSignUpUrl?: string;
  debug?: boolean;
}

/**
 * 路由保護配置介面
 */
export interface RouteProtectionConfig {
  requireAuth?: boolean;
  requiredRole?: UserRole;
  requiredPermissions?: Permission[];
  redirectTo?: string;
}

/**
 * 使用者會話資訊介面
 */
export interface UserSession {
  userId: string;
  email: string;
  name: string;
  role: UserRole;
  permissions: Permission[];
  sessionId: string;
  expiresAt: Date;
}

/**
 * 權限檢查函數類型
 */
export type PermissionChecker = (
  resource: ResourceType,
  action: PermissionAction,
  scope?: PermissionScope
) => boolean;

/**
 * 角色檢查函數類型
 */
export type RoleChecker = (role: UserRole) => boolean;

/**
 * 認證事件類型
 */
export type AuthEvent =
  | 'sign-in'
  | 'sign-out'
  | 'role-changed'
  | 'permissions-updated'
  | 'session-expired';

/**
 * 認證事件處理器類型
 */
export type AuthEventHandler = (event: AuthEvent, data?: any) => void;

/**
 * 導出所有類型
 */
export type {
  User,
  Permission,
  UserInfo,
  AuthState,
  PermissionCheck,
  ModulePermissions,
  AllModulePermissions,
  RolePermissionMap,
  AuthMiddlewareConfig,
  RouteProtectionConfig,
  UserSession,
  PermissionChecker,
  RoleChecker,
  AuthEventHandler
};

export { UserRole, PermissionAction, ResourceType };
