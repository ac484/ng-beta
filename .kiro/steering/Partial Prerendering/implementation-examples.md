{
  "title": "Next.js Partial Prerendering 實現示例",
  "version": "Next.js 15+",
  "description": "完整的 PPR 實現示例、代碼模式和最佳實踐",
  "metadata": {
    "category": "Implementation Examples",
    "complexity": "Medium",
    "usage": "代碼示例、實現模式、最佳實踐、學習參考",
    "lastmod": "2025-01-17",
    "source": "Vercel Next.js Official Documentation"
  },
  "basic_implementation": {
    "simple_page_with_ppr": {
      "description": "基本的 PPR 頁面實現",
      "file": "app/page.tsx",
      "code": {
        "tsx": "import { Suspense } from 'react'\nimport StaticComponent from './StaticComponent'\nimport DynamicComponent from './DynamicComponent'\nimport Fallback from './Fallback'\n\nexport const experimental_ppr = true\n\nexport default function Page() {\n  return (\n    <>\n      <StaticComponent />\n      <Suspense fallback={<Fallback />}>\n        <DynamicComponent />\n      </Suspense>\n    </>\n  )\n}",
        "jsx": "import { Suspense } from 'react'\nimport StaticComponent from './StaticComponent'\nimport DynamicComponent from './DynamicComponent'\nimport Fallback from './Fallback'\n\nexport const experimental_ppr = true\n\nexport default function Page() {\n  return (\n    <>\n      <StaticComponent />\n      <Suspense fallback={<Fallback />}>\n        <DynamicComponent />\n      </Suspense>\n    </>\n  )\n}"
      },
      "components": {
        "StaticComponent": "靜態組件，在構建時預渲染",
        "DynamicComponent": "動態組件，在請求時流式傳輸",
        "Fallback": "加載時的備用 UI"
      }
    },
    "layout_with_ppr": {
      "description": "啟用 PPR 的佈局組件",
      "file": "app/layout.tsx",
      "code": {
        "tsx": "export const experimental_ppr = true\n\nexport default function Layout({ children }: { children: React.ReactNode }) {\n  return (\n    <html>\n      <body>{children}</body>\n    </html>\n  )\n}",
        "jsx": "export const experimental_ppr = true\n\nexport default function Layout({ children }) {\n  return (\n    <html>\n      <body>{children}</body>\n    </html>\n  )\n}"
      }
    }
  },
  "dynamic_api_integration": {
    "cookies_component": {
      "description": "使用 cookies API 的動態組件",
      "file": "app/components/User.tsx",
      "code": {
        "tsx": "import { cookies } from 'next/headers'\n\nexport async function User() {\n  const session = (await cookies()).get('session')?.value\n  return (\n    <div>\n      <h2>User Profile</h2>\n      <p>Session: {session || 'No session'}</p>\n    </div>\n  )\n}",
        "jsx": "import { cookies } from 'next/headers'\n\nexport async function User() {\n  const session = (await cookies()).get('session')?.value\n  return (\n    <div>\n      <h2>User Profile</h2>\n      <p>Session: {session || 'No session'}</p>\n    </div>\n  )\n}"
      },
      "usage": "在頁面中用 Suspense 包裝此組件以啟用 PPR"
    },
    "searchparams_component": {
      "description": "處理 searchParams 的動態組件",
      "file": "app/components/Table.tsx",
      "code": {
        "tsx": "export async function Table({\n  searchParams,\n}: {\n  searchParams: Promise<{ sort: string }>\n}) {\n  const sort = (await searchParams).sort === 'true'\n  return (\n    <table>\n      <thead>\n        <tr>\n          <th>Column 1</th>\n          <th>Column 2</th>\n        </tr>\n      </thead>\n      <tbody>\n        <tr>\n          <td>Data 1</td>\n          <td>Data 2</td>\n        </tr>\n      </tbody>\n    </table>\n  )\n}",
        "jsx": "export async function Table({ searchParams }) {\n  const sort = (await searchParams).sort === 'true'\n  return (\n    <table>\n      <thead>\n        <tr>\n          <th>Column 1</th>\n          <th>Column 2</th>\n        </tr>\n      </thead>\n      <tbody>\n        <tr>\n          <td>Data 1</td>\n          <td>Data 2</td>\n        </tr>\n      </tbody>\n    </table>\n  )\n}"
      }
    }
  },
  "suspense_integration": {
    "user_profile_page": {
      "description": "使用 Suspense 的用戶資料頁面",
      "file": "app/profile/page.tsx",
      "code": {
        "tsx": "import { Suspense } from 'react'\nimport { User, AvatarSkeleton } from './components/User'\n\nexport const experimental_ppr = true\n\nexport default function ProfilePage() {\n  return (\n    <section>\n      <h1>User Profile</h1>\n      <Suspense fallback={<AvatarSkeleton />}>\n        <User />\n      </Suspense>\n    </section>\n  )\n}",
        "jsx": "import { Suspense } from 'react'\nimport { User, AvatarSkeleton } from './components/User'\n\nexport const experimental_ppr = true\n\nexport default function ProfilePage() {\n  return (\n    <section>\n      <h1>User Profile</h1>\n      <Suspense fallback={<AvatarSkeleton />}>\n        <User />\n      </Suspense>\n    </section>\n  )\n}"
      }
    },
    "data_table_page": {
      "description": "使用 Suspense 的數據表格頁面",
      "file": "app/dashboard/page.tsx",
      "code": {
        "tsx": "import { Table, TableSkeleton } from './components/Table'\nimport { Suspense } from 'react'\n\nexport default function DashboardPage({\n  searchParams,\n}: {\n  searchParams: Promise<{ sort: string }>\n}) {\n  return (\n    <section>\n      <h1>Dashboard</h1>\n      <Suspense fallback={<TableSkeleton />}>\n        <Table searchParams={searchParams} />\n      </Suspense>\n    </section>\n  )\n}",
        "jsx": "import { Table, TableSkeleton } from './components/Table'\nimport { Suspense } from 'react'\n\nexport default function DashboardPage({ searchParams }) {\n  return (\n    <section>\n      <h1>Dashboard</h1>\n      <Suspense fallback={<TableSkeleton />}>\n        <Table searchParams={searchParams} />\n      </Suspense>\n    </section>\n  )\n}"
      }
    }
  },
  "caching_examples": {
    "cached_data_fetching": {
      "description": "使用 'use cache' 指令的數據獲取",
      "file": "app/lib/data.ts",
      "code": {
        "before": "async function getRecentArticles() {\n  return db.query(...)\n}",
        "after": "import { unstable_cacheTag as cacheTag } from 'next/cache'\nimport { unstable_cacheLife as cacheLife } from 'next/cache'\n\nasync function getRecentArticles() {\n  'use cache'\n  // 可通過 webhook 或服務器操作重新驗證\n  cacheTag('articles')\n  // 緩存將在一小時後自動重新驗證\n  cacheLife('hours')\n  return db.query(...)\n}"
      }
    },
    "cached_metadata": {
      "description": "使用緩存的元數據生成",
      "file": "app/blog/[slug]/page.tsx",
      "code": {
        "tsx": "import { cms } from '@/lib/cms'\n\nexport async function generateMetadata({ params }: { params: { slug: string } }) {\n  'use cache'\n  const { title } = await cms.getPageData(`/blog/${params.slug}`)\n  return { title }\n}\n\nasync function getPageText({ params }: { params: { slug: string } }) {\n  'use cache'\n  const { text } = await cms.getPageData(`/blog/${params.slug}`)\n  return text\n}\n\nexport default async function BlogPost({ params }: { params: { slug: string } }) {\n  const text = await getPageText({ params })\n  return <article>{text}</article>\n}"
      }
    }
  },
  "connection_utility_examples": {
    "third_party_integration": {
      "description": "使用 connection() 的第三方整合",
      "file": "app/api/third-party/page.tsx",
      "code": {
        "tsx": "import { connection } from 'next/server'\nimport { Suspense } from 'react'\n\nasync function ThirdPartyData() {\n  await connection()\n  // 從這裡開始的代碼將被排除在預渲染之外\n  const token = await getDataFrom3rdParty()\n  validateToken(token)\n  return <div>Third party data loaded</div>\n}\n\nexport default function Page() {\n  return (\n    <Suspense fallback={<div>Loading third party data...</div>}>\n      <ThirdPartyData />\n    </Suspense>\n  )\n}"
      }
    }
  },
  "fallback_components": {
    "avatar_skeleton": {
      "description": "頭像加載時的骨架屏",
      "file": "app/components/AvatarSkeleton.tsx",
      "code": {
        "tsx": "export function AvatarSkeleton() {\n  return (\n    <div className='animate-pulse'>\n      <div className='w-16 h-16 bg-gray-300 rounded-full'></div>\n      <div className='mt-2 w-24 h-4 bg-gray-300 rounded'></div>\n    </div>\n  )\n}",
        "jsx": "export function AvatarSkeleton() {\n  return (\n    <div className='animate-pulse'>\n      <div className='w-16 h-16 bg-gray-300 rounded-full'></div>\n      <div className='mt-2 w-24 h-4 bg-gray-300 rounded'></div>\n    </div>\n  )\n}"
      }
    },
    "table_skeleton": {
      "description": "表格加載時的骨架屏",
      "file": "app/components/TableSkeleton.tsx",
      "code": {
        "tsx": "export function TableSkeleton() {\n  return (\n    <div className='animate-pulse'>\n      <div className='w-full h-8 bg-gray-300 rounded mb-4'></div>\n      <div className='space-y-2'>\n        {[...Array(5)].map((_, i) => (\n          <div key={i} className='w-full h-6 bg-gray-300 rounded'></div>\n        ))}\n      </div>\n    </div>\n  )\n}",
        "jsx": "export function TableSkeleton() {\n  return (\n    <div className='animate-pulse'>\n      <div className='w-full h-8 bg-gray-300 rounded mb-4'></div>\n      <div className='space-y-2'>\n        {[...Array(5)].map((_, i) => (\n          <div key={i} className='w-full h-6 bg-gray-300 rounded'></div>\n        ))}\n      </div>\n    </div>\n  )\n}"
      }
    }
  },
  "project_structure": {
    "recommended_layout": {
      "description": "推薦的 PPR 項目結構",
      "structure": {
        "app/": {
          "layout.tsx": "根佈局，啟用 PPR",
          "page.tsx": "首頁",
          "components/": {
            "User.tsx": "動態用戶組件",
            "Table.tsx": "動態表格組件",
            "AvatarSkeleton.tsx": "頭像骨架屏",
            "TableSkeleton.tsx": "表格骨架屏"
          },
          "lib/": {
            "data.ts": "數據獲取函數"
          }
        },
        "next.config.ts": "Next.js 配置，啟用 PPR"
      }
    }
  }
}

