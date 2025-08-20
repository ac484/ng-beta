{
  "title": "Next.js Parallel Routes 進階模式",
  "version": "Next.js 15+",
  "description": "Next.js 平行路由的進階使用模式、複雜場景和最佳實踐",
  "metadata": {
    "category": "Advanced Patterns",
    "complexity": "Advanced",
    "usage": "進階架構、複雜場景、性能優化",
    "lastmod": "2025-01-17"
  },
  "content": {
    "intercepting_routes": {
      "title": "攔截路由模式",
      "description": "使用攔截路由實現複雜的導航行為",
      "patterns": [
        {
          "name": "同級攔截",
          "description": "使用 (.) 攔截同級路由",
          "convention": "(.)folder",
          "usage": "攔截同一級別的路由，用於顯示模態框而不改變 URL",
          "example": "app/@modal/(.)photo/page.tsx 攔截 app/photo/page.tsx"
        },
        {
          "name": "上一級攔截",
          "description": "使用 (..) 攔截上一級路由",
          "convention": "(..)folder",
          "usage": "攔截上一級的路由，即使文件系統層級不同",
          "example": "app/feed/@modal/(..)photo/page.tsx 攔截 app/photo/page.tsx"
        },
        {
          "name": "多級上攔截",
          "description": "使用 (..)(..) 攔截多級上路由",
          "convention": "(..)(..)folder",
          "usage": "攔截兩級以上的路由",
          "example": "app/feed/@modal/(..)(..)photo/page.tsx 攔截 app/photo/page.tsx"
        },
        {
          "name": "根級攔截",
          "description": "使用 (...) 攔截根級路由",
          "convention": "(...)folder",
          "usage": "攔截從根 app 目錄開始的路由",
          "example": "app/feed/@modal/(...)photo/page.tsx 攔截 app/photo/page.tsx"
        }
      ]
    },
    "conditional_rendering": {
      "title": "條件渲染模式",
      "description": "根據不同條件動態渲染平行路由槽位",
      "patterns": [
        {
          "name": "用戶角色條件渲染",
          "description": "根據用戶權限渲染不同的槽位內容",
          "implementation": "在佈局組件中檢查用戶角色，返回對應的槽位內容",
          "use_cases": ["管理員儀表板", "用戶權限控制", "多租戶應用"]
        },
        {
          "name": "功能標誌條件渲染",
          "description": "根據功能標誌控制槽位的顯示",
          "implementation": "使用環境變數或配置控制槽位的渲染",
          "use_cases": ["A/B 測試", "功能發布控制", "實驗性功能"]
        },
        {
          "name": "設備類型條件渲染",
          "description": "根據設備類型渲染不同的槽位",
          "implementation": "使用客戶端檢測或服務器端檢測",
          "use_cases": ["響應式設計", "移動端優化", "桌面端增強"]
        }
      ]
    },
    "state_management": {
      "title": "狀態管理模式",
      "description": "管理平行路由槽位之間的狀態共享和同步",
      "patterns": [
        {
          "name": "共享狀態槽位",
          "description": "多個槽位共享相同的狀態",
          "implementation": "使用 React Context、Zustand 或 Redux",
          "use_cases": ["購物車狀態", "用戶偏好設置", "應用主題"]
        },
        {
          "name": "槽位間通信",
          "description": "不同槽位之間的數據傳遞",
          "implementation": "使用事件系統、狀態提升或共享存儲",
          "use_cases": ["表單驗證", "數據同步", "用戶操作反饋"]
        },
        {
          "name": "異步狀態同步",
          "description": "處理槽位間的異步數據同步",
          "implementation": "使用 SWR、React Query 或自定義 hooks",
          "use_cases": ["實時數據更新", "緩存同步", "離線同步"]
        }
      ]
    },
    "performance_optimization": {
      "title": "性能優化模式",
      "description": "優化平行路由的性能和用戶體驗",
      "patterns": [
        {
          "name": "懶加載槽位",
          "description": "按需加載槽位內容",
          "implementation": "使用 React.lazy 和 Suspense",
          "use_cases": ["大型應用", "複雜儀表板", "按需功能"]
        },
        {
          "name": "預取策略",
          "description": "智能預取槽位內容",
          "implementation": "使用 Next.js Link prefetch 或自定義預取邏輯",
          "use_cases": ["用戶行為預測", "關鍵路徑優化", "緩存策略"]
        },
        {
          "name": "虛擬化渲染",
          "description": "處理大量數據的槽位",
          "implementation": "使用 react-window 或 react-virtualized",
          "use_cases": ["數據表格", "長列表", "複雜圖表"]
        }
      ]
    },
    "error_boundaries": {
      "title": "錯誤邊界模式",
      "description": "處理平行路由中的錯誤和異常情況",
      "patterns": [
        {
          "name": "槽位級錯誤邊界",
          "description": "為每個槽位設置獨立的錯誤邊界",
          "implementation": "使用 React Error Boundary 組件",
          "use_cases": ["隔離錯誤", "優雅降級", "用戶體驗保護"]
        },
        {
          "name": "降級渲染",
          "description": "當槽位出錯時提供備用內容",
          "implementation": "使用 try-catch 或錯誤邊界的 fallback",
          "use_cases": ["服務不可用", "數據加載失敗", "組件崩潰"]
        },
        {
          "name": "錯誤恢復",
          "description": "自動恢復出錯的槽位",
          "implementation": "使用重試機制或狀態重置",
          "use_cases": ["網絡錯誤", "臨時故障", "用戶操作錯誤"]
        }
      ]
    },
    "accessibility_patterns": {
      "title": "無障礙訪問模式",
      "description": "確保平行路由的可訪問性和用戶體驗",
      "patterns": [
        {
          "name": "焦點管理",
          "description": "管理多個槽位之間的焦點導航",
          "implementation": "使用 React useRef 和 focus 管理",
          "use_cases": ["鍵盤導航", "屏幕閱讀器", "焦點陷阱"]
        },
        {
          "name": "ARIA 標籤",
          "description": "為槽位提供適當的 ARIA 標籤",
          "implementation": "使用 role、aria-label 等屬性",
          "use_cases": ["語義化標籤", "屏幕閱讀器支持", "無障礙導航"]
        },
        {
          "name": "鍵盤快捷鍵",
          "description": "提供鍵盤快捷鍵操作槽位",
          "implementation": "使用 useEffect 和事件監聽器",
          "use_cases": ["快速導航", "無障礙操作", "效率提升"]
        }
      ]
    },
    "testing_patterns": {
      "title": "測試模式",
      "description": "測試平行路由的各種場景和邊界情況",
      "patterns": [
        {
          "name": "單元測試",
          "description": "測試個別槽位組件的功能",
          "implementation": "使用 Jest 和 React Testing Library",
          "use_cases": ["組件邏輯", "Props 驗證", "事件處理"]
        },
        {
          "name": "集成測試",
          "description": "測試槽位之間的交互",
          "implementation": "使用 Cypress 或 Playwright",
          "use_cases": ["槽位通信", "狀態同步", "用戶流程"]
        },
        {
          "name": "端到端測試",
          "description": "測試完整的用戶場景",
          "implementation": "使用 E2E 測試框架",
          "use_cases": ["真實用戶體驗", "跨槽位導航", "錯誤處理"]
        }
      ]
    }
  }
}
