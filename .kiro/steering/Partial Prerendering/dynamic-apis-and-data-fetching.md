{
  "title": "Next.js Partial Prerendering 中的動態 API 和數據獲取",
  "version": "Next.js 15+",
  "description": "在 PPR 環境中使用動態 API、處理異步數據獲取和優化渲染性能",
  "metadata": {
    "category": "Data Fetching",
    "complexity": "High",
    "usage": "動態 API 整合、異步數據獲取、緩存策略、性能優化",
    "lastmod": "2025-01-17",
    "source": "Vercel Next.js Official Documentation"
  },
  "dynamic_apis": {
    "cookies_api": {
      "description": "使用 next/headers 中的 cookies API 訪問請求 cookies",
      "code_example": {
        "tsx": "import { cookies } from 'next/headers'\n\nexport async function User() {\n  const session = (await cookies()).get('session')?.value\n  return '...'\n}",
        "jsx": "import { cookies } from 'next/headers'\n\nexport async function User() {\n  const session = (await cookies()).get('session')?.value\n  return '...'\n}"
      },
      "behavior": "組件使用此 API 會選擇加入動態渲染，除非用 Suspense 包裝"
    },
    "headers_api": {
      "description": "訪問請求頭信息",
      "behavior": "Next.js 15 中異步返回 Promise<Headers>",
      "usage": "await headers() 獲取請求頭"
    },
    "draft_mode_api": {
      "description": "訪問草稿模式狀態",
      "behavior": "Next.js 15 中異步返回 Promise<DraftMode>",
      "usage": "await draftMode() 獲取草稿模式狀態"
    }
  },
  "connection_utility": {
    "description": "next/server 中的 connection() 工具函數",
    "purpose": "控制預渲染行為，標記後續代碼應從預渲染中排除",
    "usage": "await connection() 告知 Next.js 排除後續代碼的預渲染",
    "code_example": {
      "tsx": "import { connection } from 'next/server'\n\nexport default async function Page() {\n  await connection()\n  // 從這裡開始的代碼將被排除在預渲染之外\n  const token = await getDataFrom3rdParty()\n  validateToken(token)\n  return ...\n}"
    },
    "suspense_requirement": "使用 connection() 時需要 Suspense 邊界"
  },
  "caching_strategies": {
    "use_cache_directive": {
      "description": "使用 'use cache' 指令標記可緩存的異步函數",
      "purpose": "允許數據在預渲染中包含，同時支持重新驗證",
      "code_example": {
        "before": "async function getRecentArticles() {\n  return db.query(...)\n}",
        "after": "async function getRecentArticles() {\n  'use cache'\n  cacheTag('articles')\n  cacheLife('hours')\n  return db.query(...)\n}"
      }
    },
    "cache_tag": {
      "description": "使用 unstable_cacheTag 標記緩存",
      "usage": "可通過 webhook 或服務器操作重新驗證"
    },
    "cache_life": {
      "description": "使用 unstable_cacheLife 設置緩存生命週期",
      "options": ["seconds", "minutes", "hours"],
      "impact": "影響預渲染能力和客戶端路由緩存"
    }
  },
  "searchparams_handling": {
    "description": "處理動態 searchParams 參數",
    "async_behavior": "Next.js 15 中 searchParams 是 Promise",
    "component_integration": {
      "tsx": "export async function Table({\n  searchParams,\n}: {\n  searchParams: Promise<{ sort: string }>\n}) {\n  const sort = (await searchParams).sort === 'true'\n  return '...'\n}",
      "jsx": "export async function Table({ searchParams }) {\n  const sort = (await searchParams).sort === 'true'\n  return '...'\n}"
    },
    "ppr_benefits": "頁面可以預渲染，只有訪問 searchParams 值的組件會選擇加入動態渲染"
  },
  "performance_optimization": {
    "selective_dynamic_rendering": "只有必要的組件選擇加入動態渲染",
    "static_shell_optimization": "最大化靜態內容的預渲染",
    "streaming_benefits": "動態內容並行流式傳輸",
    "caching_balance": "平衡緩存和預渲染需求"
  },
  "best_practices": {
    "api_access_patterns": "在適當的組件層級訪問動態 API",
    "suspense_integration": "使用 Suspense 包裝動態組件",
    "caching_strategy": "根據數據特性選擇適當的緩存策略",
    "error_handling": "實現適當的錯誤邊界和錯誤處理"
  }
}

