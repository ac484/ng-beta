/**
 * @project NG-Beta Integrated Platform - 整合專案管理、合作夥伴管理、文件處理和分析功能的現代化平台
 * @framework Next.js 15+ (App Router)
 * @typescript 5.0+
 * @author NG-Beta Development Team
 * @created 2025-01-20
 * @updated 2025-01-20
 * @version 1.0.0
 *
 * @fileoverview 登入頁面 - Clerk 認證系統的登入介面
 * @description 提供使用者登入功能，整合 Clerk 認證服務，支援多種登入方式和自定義樣式。
 *              使用 Next.js 15 App Router 的動態路由和 Clerk 的最新 API。
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
 * - Clerk 登入元件整合
 * - 自定義樣式和外觀
 * - 動態路由支援
 * - 響應式設計
 * - 無障礙訊息支援
 *
 * @usage
 * 此頁面透過 Next.js 動態路由自動處理 /sign-in 路徑
 * 使用者登入成功後會自動重定向到儀表板
 */

import { SignIn } from '@clerk/nextjs';

export const dynamic = 'force-dynamic';

export default function SignInPage() {
  return (
    <SignIn
      appearance={{
        elements: {
          rootBox: 'mx-auto',
          card: 'shadow-lg'
        }
      }}
      path='/sign-in'
      routing='path'
      signUpUrl='/sign-up'
      forceRedirectUrl='/dashboard'
    />
  );
}
