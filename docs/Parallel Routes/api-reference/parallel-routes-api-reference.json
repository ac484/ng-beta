{
  "title": "Next.js Parallel Routes API 參考文檔",
  "version": "Next.js 15+",
  "description": "Next.js 平行路由的完整 API 參考，包含所有可用的 API、Hooks 和配置選項",
  "metadata": {
    "category": "API Reference",
    "complexity": "Advanced",
    "usage": "API 參考、開發指南、技術文檔",
    "lastmod": "2025-01-17"
  },
  "content": {
    "file_conventions": {
      "title": "文件約定",
      "description": "平行路由使用的特殊文件約定和命名規則",
      "conventions": [
        {
          "name": "槽位目錄",
          "syntax": "@folderName",
          "description": "創建命名槽位，用於平行路由",
          "example": "@analytics, @team, @documents",
          "usage": "在 app 目錄中使用 @ 符號前綴創建槽位",
          "notes": "槽位名稱不能包含特殊字符，建議使用描述性名稱"
        },
        {
          "name": "攔截路由",
          "syntax": "(.)folder, (..)folder, (..)(..)folder, (...)folder",
          "description": "攔截路由以顯示模態框而不改變 URL",
          "examples": [
            "(.)photo - 攔截同級路由",
            "(..)photo - 攔截上一級路由",
            "(..)(..)photo - 攔截兩級上路由",
            "(...)photo - 攔截根級路由"
          ],
          "usage": "在槽位目錄內創建攔截路由文件夾"
        },
        {
          "name": "分組路由",
          "syntax": "(folderName)",
          "description": "創建不影響 URL 結構的路由分組",
          "example": "(dashboard), (auth), (marketing)",
          "usage": "組織相關功能而不改變 URL 路徑"
        }
      ]
    },
    "layout_props": {
      "title": "佈局組件 Props",
      "description": "平行路由佈局組件可用的 props 和類型定義",
      "props": [
        {
          "name": "children",
          "type": "React.ReactNode",
          "description": "隱式槽位，對應 app/page.js 的內容",
          "required": true,
          "usage": "渲染主要頁面內容",
          "example": "export default function Layout({ children }: { children: React.ReactNode }) { return <main>{children}</main> }"
        },
        {
          "name": "slotName",
          "type": "React.ReactNode",
          "description": "命名槽位的內容，對應 @slotName 目錄",
          "required": true,
          "usage": "渲染特定的命名槽位",
          "example": "export default function Layout({ children, analytics }: { children: React.ReactNode; analytics: React.ReactNode }) { return ( <div> {children} <aside>{analytics}</aside> </div> ) }"
        }
      ],
      "type_definitions": {
        "basic_layout": "interface LayoutProps { children: React.ReactNode; }",
        "with_slots": "interface LayoutProps { children: React.ReactNode; analytics: React.ReactNode; team: React.ReactNode; }",
        "conditional_slots": "interface LayoutProps { children: React.ReactNode; user?: React.ReactNode; admin?: React.ReactNode; }"
      }
    },
    "navigation_hooks": {
      "title": "導航 Hooks",
      "description": "平行路由中可用的導航相關 React Hooks",
      "hooks": [
        {
          "name": "useSelectedLayoutSegment",
          "package": "next/navigation",
          "signature": "useSelectedLayoutSegment(parallelRoutesKey?: string): string | null",
          "description": "讀取活動路由段，可選指定平行路由槽位",
          "parameters": [
            {
              "name": "parallelRoutesKey",
              "type": "string",
              "required": false,
              "description": "平行路由槽位的鍵名，如 'auth'、'analytics'"
            }
          ],
          "returns": "string | null",
          "description": "返回活動路由段名稱，如果沒有活動段則返回 null",
          "usage_examples": [
            {
              "description": "讀取當前佈局的活動段",
              "code": "const segment = useSelectedLayoutSegment()"
            },
            {
              "description": "讀取特定槽位的活動段",
              "code": "const authSegment = useSelectedLayoutSegment('auth')"
            }
          ],
          "use_cases": ["條件渲染", "導航高亮", "狀態管理", "用戶體驗優化"]
        },
        {
          "name": "useSelectedLayoutSegments",
          "package": "next/navigation",
          "signature": "useSelectedLayoutSegments(parallelRoutesKey?: string): string[]",
          "description": "讀取活動路由段數組，可選指定平行路由槽位",
          "parameters": [
            {
              "name": "parallelRoutesKey",
              "type": "string",
              "required": false,
              "description": "平行路由槽位的鍵名"
            }
          ],
          "returns": "string[]",
          "description": "返回活動路由段名稱數組，如果沒有活動段則返回空數組",
          "usage_examples": [
            {
              "description": "讀取當前佈局的所有活動段",
              "code": "const segments = useSelectedLayoutSegments()"
            },
            {
              "description": "讀取特定槽位的活動段",
              "code": "const authSegments = useSelectedLayoutSegments('auth')"
            }
          ],
          "use_cases": ["麵包屑導航", "深度導航", "路由分析", "用戶體驗追蹤"]
        },
        {
          "name": "useRouter",
          "package": "next/navigation",
          "signature": "useRouter(): AppRouterInstance",
          "description": "獲取 Next.js App Router 實例，用於編程式導航",
          "returns": "AppRouterInstance",
          "description": "返回路由器實例，包含導航方法和屬性",
          "methods": [
            {
              "name": "push",
              "signature": "push(href: string, options?: NavigateOptions): void",
              "description": "導航到新頁面",
              "usage": "router.push('/dashboard')"
            },
            {
              "name": "replace",
              "signature": "replace(href: string, options?: NavigateOptions): void",
              "description": "替換當前頁面",
              "usage": "router.replace('/login')"
            },
            {
              "name": "back",
              "signature": "back(): void",
              "description": "返回上一頁",
              "usage": "router.back()"
            },
            {
              "name": "forward",
              "signature": "forward(): void",
              "description": "前進到下一頁",
              "usage": "router.forward()"
            },
            {
              "name": "refresh",
              "signature": "refresh(): void",
              "description": "刷新當前頁面",
              "usage": "router.refresh()"
            }
          ],
          "use_cases": ["模態框關閉", "編程式導航", "表單提交後導航", "條件導航"]
        }
      ]
    },
    "link_component": {
      "title": "Link 組件",
      "description": "Next.js Link 組件在平行路由中的使用",
      "component": {
        "name": "Link",
        "package": "next/link",
        "props": [
          {
            "name": "href",
            "type": "string | URL",
            "required": true,
            "description": "目標路由路徑"
          },
          {
            "name": "prefetch",
            "type": "boolean | null",
            "required": false,
            "description": "是否預取目標頁面",
            "default": "auto"
          },
          {
            "name": "replace",
            "type": "boolean",
            "required": false,
            "description": "是否替換當前歷史記錄",
            "default": false
          },
          {
            "name": "scroll",
            "type": "boolean",
            "required": false,
            "description": "是否滾動到頁面頂部",
            "default": true
          },
          {
            "name": "shallow",
            "type": "boolean",
            "required": false,
            "description": "是否使用淺層路由",
            "default": false
          }
        ],
        "usage_examples": [
          {
            "description": "基本導航",
            "code": "<Link href=\"/dashboard\">Dashboard</Link>"
          },
          {
            "description": "模態框導航",
            "code": "<Link href=\"/login\">Open Login Modal</Link>"
          },
          {
            "description": "禁用預取",
            "code": "<Link href=\"/dashboard\" prefetch={false}>Dashboard</Link>"
          }
        ]
      }
    },
    "special_files": {
      "title": "特殊文件",
      "description": "平行路由中可用的特殊文件類型和用途",
      "files": [
        {
          "name": "default.tsx",
          "description": "當槽位沒有匹配路由時顯示的默認內容",
          "usage": "處理未匹配的槽位狀態",
          "example": "export default function Default() { return null }",
          "best_practices": [
            "為每個槽位創建 default.tsx",
            "返回 null 或默認內容",
            "考慮用戶體驗"
          ]
        },
        {
          "name": "loading.tsx",
          "description": "槽位載入時顯示的載入狀態",
          "usage": "提供用戶友好的載入體驗",
          "example": "export default function Loading() { return <LoadingSpinner /> }",
          "best_practices": [
            "使用骨架屏或載入動畫",
            "保持與主內容一致的樣式",
            "避免過於複雜的載入狀態"
          ]
        },
        {
          "name": "error.tsx",
          "description": "槽位出錯時顯示的錯誤頁面",
          "usage": "處理槽位中的錯誤和異常",
          "example": "export default function Error({ error, reset }: { error: Error; reset: () => void }) { return ( <div> <h2>Something went wrong!</h2> <button onClick={reset}>Try again</button> </div> ) }",
          "best_practices": [
            "提供有用的錯誤信息",
            "提供恢復選項",
            "記錄錯誤信息用於調試"
          ]
        },
        {
          "name": "not-found.tsx",
          "description": "槽位路由不存在時顯示的 404 頁面",
          "usage": "處理槽位中的 404 情況",
          "example": "export default function NotFound() { return <div>Slot content not found</div> }",
          "best_practices": [
            "提供清晰的錯誤信息",
            "提供導航選項",
            "保持與應用風格一致"
          ]
        }
      ]
    },
    "route_handlers": {
      "title": "路由處理器",
      "description": "在平行路由中創建 API 端點和路由處理器",
      "handlers": [
        {
          "name": "route.ts",
          "description": "創建 API 端點和路由處理器",
          "http_methods": ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"],
          "example": {
            "basic_get": "export async function GET() { return Response.json({ message: 'Hello from parallel route!' }) }",
            "with_params": "export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) { const { slug } = await params return Response.json({ slug }) }",
            "post_handler": "export async function POST(request: Request) { const body = await request.json() return Response.json({ received: body }) }"
          },
          "configuration_options": [
            {
              "name": "dynamic",
              "type": "'auto' | 'force-dynamic' | 'error' | 'force-static'",
              "description": "控制路由的動態行為",
              "default": "auto"
            },
            {
              "name": "dynamicParams",
              "type": "boolean",
              "description": "是否允許動態參數",
              "default": true
            },
            {
              "name": "revalidate",
              "type": "false | 'force-cache' | 0 | number",
              "description": "控制緩存重新驗證",
              "default": false
            },
            {
              "name": "fetchCache",
              "type": "'auto' | 'default-cache' | 'only-cache' | 'force-cache' | 'force-no-store' | 'default-no-store' | 'only-no-store'",
              "description": "控制 fetch 緩存行為",
              "default": "auto"
            },
            {
              "name": "runtime",
              "type": "'nodejs' | 'edge'",
              "description": "指定運行時環境",
              "default": "nodejs"
            },
            {
              "name": "preferredRegion",
              "type": "'auto' | 'global' | 'home' | string | string[]",
              "description": "指定首選部署區域",
              "default": "auto"
            }
          ]
        }
      ]
    },
    "middleware": {
      "title": "中間件",
      "description": "在平行路由中使用 Next.js 中間件",
      "usage": {
        "file_location": "middleware.ts (根目錄)",
        "basic_structure": "export function middleware(request: NextRequest) { // 中間件邏輯 }",
        "matcher_config": "export const config = { matcher: ['/dashboard/:path*'] }"
      },
      "examples": [
        {
          "description": "基本中間件",
          "code": "import { NextResponse } from 'next/server'\nimport type { NextRequest } from 'next/server'\n\nexport function middleware(request: NextRequest) { // 檢查認證\n  const token = request.cookies.get('token')\n  if (!token) {\n    return NextResponse.redirect(new URL('/login', request.url))\n  }\n  return NextResponse.next()\n}"
        },
        {
          "description": "條件路由重寫",
          "code": "export function middleware(request: NextRequest) { const { pathname } = request.nextUrl\n  if (pathname.startsWith('/dashboard')) {\n    return NextResponse.rewrite(new URL('/dashboard-v2' + pathname, request.url))\n  }\n  return NextResponse.next()\n}"
        }
      ]
    },
    "configuration_options": {
      "title": "配置選項",
      "description": "平行路由相關的 Next.js 配置選項",
      "options": [
        {
          "name": "experimental.ppr",
          "type": "boolean",
          "description": "啟用部分預渲染",
          "default": false,
          "usage": "在 next.config.js 中配置",
          "example": "module.exports = { experimental: { ppr: true } }"
        },
        {
          "name": "experimental.parallelRoutes",
          "type": "boolean",
          "description": "啟用平行路由功能",
          "default": true,
          "usage": "在 next.config.js 中配置",
          "example": "module.exports = { experimental: { parallelRoutes: true } }"
        }
      ]
    },
    "type_definitions": {
      "title": "TypeScript 類型定義",
      "description": "平行路由中常用的 TypeScript 類型定義",
      "types": [
        {
          "name": "React.ReactNode",
          "description": "React 組件可以渲染的任何內容",
          "usage": "槽位 props 的類型定義",
          "example": "interface SlotProps { content: React.ReactNode }"
        },
        {
          "name": "NextRequest",
          "description": "Next.js 擴展的 Request 對象",
          "usage": "中間件和路由處理器中的請求類型",
          "example": "export function middleware(request: NextRequest) { }"
        },
        {
          "name": "NextResponse",
          "description": "Next.js 擴展的 Response 對象",
          "usage": "中間件和路由處理器中的響應類型",
          "example": "return NextResponse.redirect(new URL('/login', request.url))"
        },
        {
          "name": "AppRouterInstance",
          "description": "Next.js App Router 實例類型",
          "usage": "useRouter hook 的返回類型",
          "example": "const router: AppRouterInstance = useRouter()"
        }
      ]
    }
  }
}
