/**
 * @project NG-Beta - Next.js 15 Integrated Dashboard Platform
 * @framework Next.js 15+ (App Router)
 * @typescript 5.7+
 * @author NG-Beta Development Team
 * @created 2025-01-17
 * @updated 2025-01-17
 * @version 1.0.0
 * 
 * @fileoverview 全域導航和 UI 類型定義
 * @description 定義應用程式中導航元件、選單項目和頁腳的核心類型介面，
 * 支援多層級導航結構、圖示整合、快捷鍵和外部連結功能。
 * 
 * @tech-stack
 * - Runtime: Node.js 20+
 * - Framework: Next.js 15 (App Router)
 * - Language: TypeScript 5.7+
 * - Styling: Tailwind CSS 4.0+
 * - Icons: @tabler/icons-react + Lucide React
 * - Auth: Clerk Authentication
 * - State: Zustand + React Context
 * - Validation: Zod
 * - Testing: Jest + React Testing Library
 * 
 * @environment
 * - Node: >=20.0.0
 * - Package Manager: pnpm
 * - Build Tool: Turbopack
 * 
 * @exports
 * - NavItem: 基礎導航項目介面
 * - NavItemWithChildren: 必須包含子項目的導航項目
 * - NavItemWithOptionalChildren: 可選子項目的導航項目
 * - FooterItem: 頁腳項目介面
 * - MainNavItem: 主導航項目類型別名
 * - SidebarNavItem: 側邊欄導航項目類型別名
 */

import { Icons } from '@/components/icons';

/**
 * 基礎導航項目介面
 * @description 定義導航選單項目的基本結構，支援圖示、快捷鍵、外部連結等功能
 */
export interface NavItem {
  /** 顯示標題 */
  title: string;
  /** 導航 URL 路徑 */
  url: string;
  /** 是否禁用該項目 */
  disabled?: boolean;
  /** 是否為外部連結 */
  external?: boolean;
  /** 鍵盤快捷鍵組合 [修飾鍵, 主鍵] */
  shortcut?: [string, string];
  /** 圖示名稱，對應 Icons 組件中的鍵值 */
  icon?: keyof typeof Icons;
  /** 標籤文字（用於徽章或狀態顯示） */
  label?: string;
  /** 項目描述文字 */
  description?: string;
  /** 是否為當前活動項目 */
  isActive?: boolean;
  /** 子導航項目列表 */
  items?: NavItem[];
}

/**
 * 必須包含子項目的導航項目介面
 * @description 擴展 NavItem，強制要求包含子項目，用於多層級導航結構
 */
export interface NavItemWithChildren extends NavItem {
  /** 必須包含的子導航項目列表 */
  items: NavItemWithChildren[];
}

/**
 * 可選子項目的導航項目介面
 * @description 擴展 NavItem，子項目為可選，適用於靈活的導航結構
 */
export interface NavItemWithOptionalChildren extends NavItem {
  /** 可選的子導航項目列表 */
  items?: NavItemWithChildren[];
}

/**
 * 頁腳項目介面
 * @description 定義頁腳區域的連結群組結構
 */
export interface FooterItem {
  /** 群組標題 */
  title: string;
  /** 該群組下的連結項目列表 */
  items: {
    /** 連結標題 */
    title: string;
    /** 連結 URL */
    href: string;
    /** 是否為外部連結 */
    external?: boolean;
  }[];
}

/**
 * 主導航項目類型
 * @description 主要導航欄使用的項目類型，支援可選子項目
 */
export type MainNavItem = NavItemWithOptionalChildren;

/**
 * 側邊欄導航項目類型
 * @description 側邊欄導航使用的項目類型，必須包含子項目以支援分組顯示
 */
export type SidebarNavItem = NavItemWithChildren;
