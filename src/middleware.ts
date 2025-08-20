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
  const isSignedIn = !!auth().userId;

  // 開發環境調試
  if (process.env.NODE_ENV === 'development') {
    console.log('Auth middleware:', {
      pathname,
      isSignedIn,
      userId: auth().userId
    });
  }

  // 如果是公開路由，直接通過
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  // 如果使用者已登入但訪問認證頁面，重定向到儀表板
  if (isSignedIn && isAuthRoute(req)) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // 如果使用者未登入但訪問受保護路由，重定向到登入頁面
  if (!isSignedIn && isProtectedRoute(req)) {
    const signInUrl = new URL('/sign-in', req.url);
    signInUrl.searchParams.set('redirect_url', pathname);
    return NextResponse.redirect(signInUrl);
  }

  // API 路由的特殊處理
  if (pathname.startsWith('/api/') && !isSignedIn) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

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
