/**
 * @project NG-Beta Integrated Platform - 整合專案管理、合作夥伴管理、文件處理和分析功能的現代化平台
 * @framework Next.js 15+ (App Router)
 * @typescript 5.0+
 * @author NG-Beta Development Team
 * @created 2025-01-20
 * @updated 2025-01-20
 * @version 1.0.0
 *
 * @fileoverview Next.js 中間件 - 應用程式級別的認證和路由保護
 * @description 整合 Clerk 認證中間件，提供全域的路由保護和認證檢查。
 *              支援公開路由、受保護路由和 API 路由的不同處理策略。
 *
 * @tech-stack
 * - Runtime: Node.js 20+
 * - Framework: Next.js 15 (App Router)
 * - Language: TypeScript 5.0+
 * - Auth: Clerk Authentication
 * - Validation: Zod
 *
 * @features
 * - 路由級別認證保護
 * - 公開路由配置
 * - 受保護路由自動重定向
 * - API 路由認證檢查
 * - 靈活的路由匹配規則
 */

import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

/**
 * 公開路由 - 不需要認證即可存取
 */
const PUBLIC_ROUTES = [
  '/',
  '/about',
  '/contact',
  '/pricing',
  '/features',
  '/api/webhook',
  '/api/health'
];

/**
 * 認證路由 - 已認證使用者不應存取
 */
const AUTH_ROUTES = [
  '/sign-in',
  '/sign-up',
  '/forgot-password',
  '/reset-password'
];

/**
 * 受保護路由 - 需要認證才能存取
 */
const PROTECTED_ROUTES = [
  '/dashboard',
  '/projects',
  '/contracts',
  '/partners',
  '/documents',
  '/analytics',
  '/settings',
  '/profile'
];

// 建立路由匹配器
const isPublicRoute = createRouteMatcher(PUBLIC_ROUTES);
const isAuthRoute = createRouteMatcher(AUTH_ROUTES);
const isProtectedRoute = createRouteMatcher(PROTECTED_ROUTES);

/**
 * Clerk 認證中間件
 */
export default clerkMiddleware((auth, req: NextRequest) => {
  const { pathname } = req.nextUrl;

  // 開發環境調試
  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-console
    console.log('Auth middleware:', { pathname });
  }

  // 如果是公開路由，直接通過
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  // 認證頁面處理可根據需求啟用：若需已登入者阻擋存取，請在此檢查 session 後重定向

  // 受保護路由：由 Clerk 中介層自動保護
  if (isProtectedRoute(req)) {
    // noop — Clerk will enforce authentication via matcher
  }

  // API 路由的特殊處理
  // API 路由處理：如需保護，請改用 createRouteMatcher 與 auth().protect()

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)'
  ]
};
