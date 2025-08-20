{
  "title": "Next.js Parallel Routes 實作指南",
  "version": "Next.js 15+",
  "description": "Next.js 平行路由的完整實作指南，包含步驟說明、最佳實踐和常見陷阱",
  "metadata": {
    "category": "Implementation Guide",
    "complexity": "Intermediate",
    "usage": "實作指南、開發流程、最佳實踐",
    "lastmod": "2025-01-17"
  },
  "content": {
    "setup_guide": {
      "title": "設置指南",
      "description": "從零開始設置平行路由的完整流程",
      "steps": [
        {
          "step": 1,
          "title": "創建槽位目錄",
          "description": "使用 @ 符號創建命名槽位",
          "example": "app/@analytics/",
          "notes": "槽位名稱不能包含特殊字符，建議使用描述性名稱"
        },
        {
          "step": 2,
          "title": "創建佈局組件",
          "description": "在父級目錄創建 layout.tsx 文件",
          "example": "app/(dashboard)/layout.tsx",
          "notes": "佈局組件必須接受所有槽位作為 props"
        },
        {
          "step": 3,
          "title": "定義槽位 Props",
          "description": "在佈局組件中定義槽位的 TypeScript 類型",
          "example": "interface LayoutProps { children: React.ReactNode; analytics: React.ReactNode; team: React.ReactNode; }",
          "notes": "使用 React.ReactNode 類型確保類型安全"
        },
        {
          "step": 4,
          "title": "渲染槽位",
          "description": "在佈局組件中渲染所有槽位",
          "example": "return ( <div> {children} <div className=\"analytics\">{analytics}</div> <div className=\"team\">{team}</div> </div> )",
          "notes": "確保所有槽位都被正確渲染"
        }
      ]
    },
    "file_structure": {
      "title": "文件結構指南",
      "description": "平行路由的標準文件結構和命名約定",
      "structure": {
        "app_directory": {
          "description": "應用根目錄",
          "subdirectories": [
            {
              "name": "(dashboard)",
              "description": "分組路由，不影響 URL 結構",
              "files": ["layout.tsx", "page.tsx"]
            },
            {
              "name": "@analytics",
              "description": "分析模組槽位",
              "files": ["page.tsx", "loading.tsx", "error.tsx", "default.tsx"]
            },
            {
              "name": "@team",
              "description": "團隊模組槽位",
              "files": ["page.tsx", "loading.tsx", "error.tsx", "default.tsx"]
            }
          ]
        }
      },
      "naming_conventions": [
        "使用 @ 符號前綴定義槽位",
        "槽位名稱使用小寫字母和連字符",
        "避免使用特殊字符和空格",
        "使用描述性的名稱表示槽位功能"
      ]
    },
    "component_implementation": {
      "title": "組件實作",
      "description": "平行路由組件的實作細節和最佳實踐",
      "components": [
        {
          "name": "佈局組件",
          "description": "主要的佈局組件，負責渲染所有槽位",
          "implementation": {
            "props": "接受所有槽位作為 props",
            "rendering": "條件性或無條件渲染槽位",
            "styling": "為每個槽位提供適當的樣式和佈局",
            "error_handling": "處理槽位渲染錯誤"
          },
          "best_practices": [
            "使用 TypeScript 確保類型安全",
            "提供適當的默認值",
            "實現錯誤邊界",
            "優化渲染性能"
          ]
        },
        {
          "name": "槽位組件",
          "description": "每個槽位的具體內容組件",
          "implementation": {
            "content": "實現槽位的具體功能",
            "loading": "提供載入狀態",
            "error": "處理錯誤情況",
            "default": "提供默認內容"
          },
          "best_practices": [
            "保持組件職責單一",
            "實現適當的錯誤處理",
            "提供載入狀態",
            "優化組件性能"
          ]
        }
      ]
    },
    "routing_behavior": {
      "title": "路由行為",
      "description": "平行路由的路由行為和導航特性",
      "behaviors": [
        {
          "name": "客戶端導航",
          "description": "使用 Link 組件或 useRouter 進行導航",
          "behavior": "部分渲染，保持其他槽位狀態",
          "implementation": "使用 Next.js 的 Link 組件或 useRouter hook"
        },
        {
          "name": "服務器端導航",
          "description": "直接訪問 URL 或頁面刷新",
          "behavior": "完整渲染，無法確定未匹配槽位的狀態",
          "implementation": "使用 default.tsx 處理未匹配的槽位"
        },
        {
          "name": "攔截路由",
          "description": "使用特殊文件夾名稱攔截路由",
          "behavior": "顯示模態框而不改變 URL",
          "implementation": "使用 (.)、(..)、(..)(..)、(...) 約定"
        }
      ]
    },
    "state_management": {
      "title": "狀態管理",
      "description": "管理平行路由中的狀態和數據流",
      "strategies": [
        {
          "name": "共享狀態",
          "description": "多個槽位共享相同的狀態",
          "implementation": "使用 React Context、Zustand 或 Redux",
          "use_cases": ["用戶認證", "應用主題", "全局設置"]
        },
        {
          "name": "獨立狀態",
          "description": "每個槽位維護自己的狀態",
          "implementation": "使用 useState 或 useReducer",
          "use_cases": ["表單數據", "UI 狀態", "本地偏好"]
        },
        {
          "name": "同步狀態",
          "description": "槽位間狀態的同步和通信",
          "implementation": "使用事件系統或狀態提升",
          "use_cases": ["數據更新", "用戶操作", "實時同步"]
        }
      ]
    },
    "error_handling": {
      "title": "錯誤處理",
      "description": "處理平行路由中的錯誤和異常情況",
      "strategies": [
        {
          "name": "錯誤邊界",
          "description": "使用 React Error Boundary 捕獲錯誤",
          "implementation": "為每個槽位設置獨立的錯誤邊界",
          "benefits": ["錯誤隔離", "優雅降級", "用戶體驗保護"]
        },
        {
          "name": "錯誤頁面",
          "description": "為每個槽位提供錯誤頁面",
          "implementation": "創建 error.tsx 文件",
          "benefits": ["用戶友好", "錯誤信息", "恢復選項"]
        },
        {
          "name": "默認內容",
          "description": "提供默認內容作為備用",
          "implementation": "創建 default.tsx 文件",
          "benefits": ["內容可用性", "用戶體驗", "功能降級"]
        }
      ]
    },
    "performance_optimization": {
      "title": "性能優化",
      "description": "優化平行路由的性能和用戶體驗",
      "techniques": [
        {
          "name": "代碼分割",
          "description": "按需加載槽位內容",
          "implementation": "使用 React.lazy 和 Suspense",
          "benefits": ["減少初始包大小", "按需加載", "更好的性能"]
        },
        {
          "name": "預取策略",
          "description": "智能預取槽位內容",
          "implementation": "使用 Next.js Link prefetch",
          "benefits": ["更快的導航", "更好的用戶體驗", "減少等待時間"]
        },
        {
          "name": "緩存策略",
          "description": "實現適當的緩存策略",
          "implementation": "使用 SWR 或 React Query",
          "benefits": ["減少重複請求", "更快的響應", "離線支持"]
        }
      ]
    },
    "testing_strategies": {
      "title": "測試策略",
      "description": "測試平行路由的各種場景和邊界情況",
      "strategies": [
        {
          "name": "單元測試",
          "description": "測試個別組件的功能",
          "tools": "Jest, React Testing Library",
          "focus": ["組件邏輯", "Props 驗證", "事件處理"]
        },
        {
          "name": "集成測試",
          "description": "測試槽位之間的交互",
          "tools": "Cypress, Playwright",
          "focus": ["槽位通信", "狀態同步", "用戶流程"]
        },
        {
          "name": "端到端測試",
          "description": "測試完整的用戶場景",
          "tools": "E2E 測試框架",
          "focus": ["真實用戶體驗", "跨槽位導航", "錯誤處理"]
        }
      ]
    },
    "common_pitfalls": {
      "title": "常見陷阱",
      "description": "實作平行路由時常見的問題和解決方案",
      "pitfalls": [
        {
          "issue": "忘記創建 default.tsx",
          "description": "未匹配的槽位會顯示 404 錯誤",
          "solution": "為每個槽位創建 default.tsx 文件",
          "prevention": "在設置槽位時立即創建默認文件"
        },
        {
          "issue": "槽位 Props 類型錯誤",
          "description": "TypeScript 編譯錯誤或運行時錯誤",
          "solution": "正確定義所有槽位的 Props 類型",
          "prevention": "使用嚴格的 TypeScript 配置"
        },
        {
          "issue": "狀態管理複雜性",
          "description": "槽位間狀態同步變得複雜",
          "solution": "使用適當的狀態管理解決方案",
          "prevention": "在設計階段規劃狀態架構"
        },
        {
          "issue": "性能問題",
          "description": "所有槽位同時渲染導致性能問題",
          "solution": "實現懶加載和條件渲染",
          "prevention": "在早期階段考慮性能影響"
        }
      ]
    }
  }
}
