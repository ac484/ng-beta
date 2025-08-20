{
  "title": "Next.js Partial Prerendering API 參考與配置",
  "version": "Next.js 15+",
  "description": "完整的 PPR API 參考、配置選項和技術規範",
  "metadata": {
    "category": "API Reference",
    "complexity": "High",
    "usage": "API 參考、配置選項、技術規範、開發指南",
    "lastmod": "2025-01-17",
    "source": "Vercel Next.js Official Documentation"
  },
  "configuration_options": {
    "next_config_js": {
      "experimental.ppr": {
        "type": "string | boolean",
        "default": "false",
        "description": "啟用 Partial Prerendering 的全局配置",
        "values": {
          "incremental": "啟用 PPR，允許個別路由選擇加入",
          "false": "為整個應用禁用 PPR"
        },
        "example": "experimental: { ppr: 'incremental' }"
      }
    },
    "route_segment_config": {
      "experimental_ppr": {
        "type": "boolean",
        "default": "false (如果未明確設置)",
        "description": "明確選擇特定路由段加入 PPR",
        "applies_to": "app 目錄中的 Layouts 和 Pages",
        "inheritance": "父段設置會應用到所有子段，除非被子段覆蓋",
        "example": "export const experimental_ppr = true"
      }
    }
  },
  "dynamic_apis": {
    "cookies": {
      "import": "import { cookies } from 'next/headers'",
      "return_type": "Promise<Cookies>",
      "behavior": "組件使用此 API 會選擇加入動態渲染，除非用 Suspense 包裝",
      "usage": "const session = (await cookies()).get('session')?.value"
    },
    "headers": {
      "import": "import { headers } from 'next/headers'",
      "return_type": "Promise<Headers>",
      "behavior": "Next.js 15 中異步返回",
      "usage": "const userAgent = (await headers()).get('user-agent')"
    },
    "draftMode": {
      "import": "import { draftMode } from 'next/headers'",
      "return_type": "Promise<DraftMode>",
      "behavior": "Next.js 15 中異步返回",
      "usage": "const { isEnabled } = await draftMode()"
    }
  },
  "utility_functions": {
    "connection": {
      "import": "import { connection } from 'next/server'",
      "return_type": "Promise<void>",
      "purpose": "控制預渲染行為，標記後續代碼應從預渲染中排除",
      "usage": "await connection()",
      "suspense_requirement": "使用時需要 Suspense 邊界"
    },
    "unstable_noStore": {
      "import": "import { unstable_noStore } from 'next/cache'",
      "return_type": "void",
      "purpose": "在 try/catch 塊之前選擇退出靜態生成",
      "usage": "unstable_noStore()"
    }
  },
  "caching_apis": {
    "unstable_cacheTag": {
      "import": "import { unstable_cacheTag as cacheTag } from 'next/cache'",
      "return_type": "void",
      "purpose": "標記緩存，可通過 webhook 或服務器操作重新驗證",
      "usage": "cacheTag('articles')"
    },
    "unstable_cacheLife": {
      "import": "import { unstable_cacheLife as cacheLife } from 'next/cache'",
      "return_type": "void",
      "purpose": "設置緩存生命週期",
      "options": ["seconds", "minutes", "hours"],
      "usage": "cacheLife('hours')"
    }
  },
  "searchparams_api": {
    "type": "Promise<{ [key: string]: string | string[] | undefined }>",
    "description": "Next.js 15 中 searchParams 是 Promise",
    "usage": "const sort = (await searchParams).sort === 'true'",
    "ppr_benefits": "頁面可以預渲染，只有訪問 searchParams 值的組件會選擇加入動態渲染"
  },
  "suspense_integration": {
    "import": "import { Suspense } from 'react'",
    "purpose": "在 PPR 中定義動態邊界",
    "fallback_prop": "在動態內容加載時顯示的備用 UI",
    "dynamic_boundaries": "使用 Suspense 包裝動態組件，創建可流式傳輸的區域"
  },
  "build_and_debugging": {
    "debug_prerender": {
      "command": "next build --debug-prerender",
      "description": "啟用預渲染調試輸出",
      "features": [
        "禁用服務器代碼壓縮",
        "啟用源映射",
        "第一個錯誤後繼續構建",
        "詳細的預渲染錯誤信息"
      ],
      "usage": "僅用於開發環境，不應在生產構建中使用"
    }
  },
  "error_handling": {
    "ppr_caught_error": {
      "error_message": "Route {pathname} needs to bail out of prerendering at this point because it used {expression}",
      "solution": "在 try/catch 塊之前調用 unstable_noStore()",
      "prevention": "使用 Suspense 包裝動態組件"
    },
    "missing_suspense": {
      "error_message": "Missing Suspense boundary for component using connection()",
      "solution": "為使用 connection() 的組件添加 Suspense 邊界"
    }
  },
  "performance_considerations": {
    "static_content_optimization": "最大化靜態內容的預渲染",
    "dynamic_content_isolation": "使用 Suspense 隔離動態內容",
    "caching_strategy": "實現適當的緩存策略",
    "streaming_optimization": "優化流式傳輸性能"
  },
  "compatibility_notes": {
    "nextjs_version": "Next.js 15+",
    "react_version": "React 18+ with Suspense support",
    "experimental_status": "實驗性功能，需要明確啟用",
    "browser_support": "現代瀏覽器支持流式傳輸"
  }
}

