{
  "title": "Next.js Parallel Routes 實例與範例",
  "version": "Next.js 15+",
  "description": "Next.js 平行路由的實用範例、代碼示例和常見使用場景",
  "metadata": {
    "category": "Examples",
    "complexity": "Intermediate",
    "usage": "實用範例、代碼參考、開發指南",
    "lastmod": "2025-01-17"
  },
  "content": {
    "basic_examples": {
      "title": "基礎範例",
      "description": "平行路由的基本實現和常見模式",
      "examples": [
        {
          "name": "基本佈局組件",
          "description": "創建包含多個槽位的佈局組件",
          "code": {
            "typescript": "export default function Layout({ children, team, analytics }: { children: React.ReactNode; analytics: React.ReactNode; team: React.ReactNode }) { return ( <> {children} {team} {analytics} </> ) }",
            "javascript": "export default function Layout({ children, team, analytics }) { return ( <> {children} {team} {analytics} </> ) }",
            "file_structure": "app/ (dashboard)/    @portfolio/           # Portfolio 模組槽    @partners/            # PartnerVerse 模組槽    @documents/           # DocuParse 模組槽    @analytics/           # 分析模組槽    layout.tsx            # 儀表板佈局    page.tsx              # 儀表板首頁"
          }
        },
        {
          "name": "條件渲染基於用戶角色",
          "description": "根據用戶角色條件性渲染不同的佈局",
          "code": {
            "typescript": "import { checkUserRole } from '@/lib/auth'\n\nexport default function Layout({ user, admin }: { user: React.ReactNode; admin: React.ReactNode }) { const role = checkUserRole() return role === 'admin' ? admin : user }",
            "javascript": "import { checkUserRole } from '@/lib/auth'\n\nexport default function Layout({ user, admin }) { const role = checkUserRole() return role === 'admin' ? admin : user }"
          }
        }
      ]
    },
    "modal_examples": {
      "title": "模態框範例",
      "description": "使用平行路由實現模態框和彈出層",
      "examples": [
        {
          "name": "模態框佈局",
          "description": "創建模態框佈局組件",
          "code": {
            "typescript": "import Link from 'next/link'\n\nexport default function Layout({ auth, children }: { auth: React.ReactNode; children: React.ReactNode }) { return ( <> <nav> <Link href=\"/login\">Open modal</Link> </nav> <div>{auth}</div> <div>{children}</div> </> ) }",
            "javascript": "import Link from 'next/link'\n\nexport default function Layout({ auth, children }) { return ( <> <nav> <Link href=\"/login\">Open modal</Link> </nav> <div>{auth}</div> <div>{children}</div> </> ) }"
          }
        },
        {
          "name": "模態框內容",
          "description": "模態框內容組件",
          "code": {
            "typescript": "import { Modal } from '@/app/ui/modal'\nimport { Login } from '@/app/ui/login'\n\nexport default function Page() { return ( <Modal> <Login /> </Modal> ) }",
            "javascript": "import { Modal } from '@/app/ui/modal'\nimport { Login } from '@/app/ui/login'\n\nexport default function Page() { return ( <Modal> <Login /> </Modal> ) }"
          }
        },
        {
          "name": "關閉模態框",
          "description": "使用 Link 組件關閉模態框",
          "code": {
            "typescript": "import Link from 'next/link'\n\nexport function Modal({ children }: { children: React.ReactNode }) { return ( <> <Link href=\"/\">Close modal</Link> <div>{children}</div> </> ) }",
            "javascript": "import Link from 'next/link'\n\nexport function Modal({ children }) { return ( <> <Link href=\"/\">Close modal</Link> <div>{children}</div> </> ) }"
          }
        },
        {
          "name": "使用 useRouter 關閉模態框",
          "description": "使用 useRouter hook 編程式關閉模態框",
          "code": {
            "typescript": "'use client'\n\nimport { useRouter } from 'next/navigation'\n\nexport function Modal({ children }: { children: React.ReactNode }) { const router = useRouter()\n\n  return ( <> <button onClick={() => { router.back() }}> Close modal </button> <div>{children}</div> </> ) }",
            "javascript": "'use client'\n\nimport { useRouter } from 'next/navigation'\n\nexport function Modal({ children }) { const router = useRouter()\n\n  return ( <> <button onClick={() => { router.back() }}> Close modal </button> <div>{children}</div> </> ) }"
          }
        }
      ]
    },
    "tab_navigation": {
      "title": "標籤導航範例",
      "description": "創建獨立的標籤導航系統",
      "examples": [
        {
          "name": "標籤組佈局",
          "description": "在平行路由槽內創建獨立的標籤導航",
          "code": {
            "typescript": "import Link from 'next/link'\n\nexport default function Layout({ children }: { children: React.ReactNode }) { return ( <> <nav> <Link href=\"/page-views\">Page Views</Link> <Link href=\"/visitors\">Visitors</Link> </nav> <div>{children}</div> </> ) }",
            "javascript": "import Link from 'next/link'\n\nexport default function Layout({ children }) { return ( <> <nav> <Link href=\"/page-views\">Page Views</Link> <Link href=\"/visitors\">Visitors</Link> </nav> <div>{children}</div> </> ) }"
          }
        }
      ]
    },
    "default_handling": {
      "title": "預設處理範例",
      "description": "處理未匹配槽位的預設內容",
      "examples": [
        {
          "name": "預設空內容",
          "description": "確保槽位預設渲染 null",
          "code": {
            "typescript": "export default function Default() { return null }",
            "javascript": "export default function Default() { return null }"
          }
        },
        {
          "name": "空頁面組件",
          "description": "返回 null 的頁面組件",
          "code": {
            "typescript": "export default function Page() { return null }",
            "javascript": "export default function Page() { return null }"
          }
        },
        {
          "name": "捕獲所有路由",
          "description": "處理任何頁面的捕獲所有路由",
          "code": {
            "typescript": "export default function CatchAll() { return null }",
            "javascript": "export default function CatchAll() { return null }"
          }
        }
      ]
    },
    "navigation_hooks": {
      "title": "導航 Hook 範例",
      "description": "使用導航相關的 React hooks",
      "examples": [
        {
          "name": "useSelectedLayoutSegment",
          "description": "讀取活動路由段",
          "code": {
            "typescript": "'use client'\n\nimport { useSelectedLayoutSegment } from 'next/navigation'\n\nexport default function Layout({ auth }: { auth: React.ReactNode }) { const loginSegment = useSelectedLayoutSegment('auth') // ... }",
            "javascript": "'use client'\n\nimport { useSelectedLayoutSegment } from 'next/navigation'\n\nexport default function Layout({ auth }) { const loginSegment = useSelectedLayoutSegment('auth') // ... }"
          }
        }
      ]
    }
  }
}
