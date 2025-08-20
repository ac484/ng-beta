{
  "title": "Next.js Parallel Routes 故障排除",
  "version": "Next.js 15+",
  "description": "Next.js 平行路由的常見問題、錯誤解決方案和調試指南",
  "metadata": {
    "category": "Troubleshooting",
    "complexity": "Intermediate",
    "usage": "問題解決、錯誤修復、調試指南",
    "lastmod": "2025-01-17"
  },
  "content": {
    "common_errors": {
      "title": "常見錯誤",
      "description": "平行路由開發中常見的錯誤和解決方案",
      "errors": [
        {
          "error": "TypeError: Cannot read properties of undefined",
          "description": "嘗試訪問未定義的槽位 prop",
          "causes": [
            "忘記在佈局組件中定義槽位 prop",
            "槽位目錄結構不正確",
            "TypeScript 類型定義錯誤"
          ],
          "solutions": [
            "確保所有槽位都在佈局組件中定義為 props",
            "檢查槽位目錄結構是否正確",
            "驗證 TypeScript 類型定義",
            "使用可選鏈操作符 (?.) 安全訪問"
          ],
          "example": {
            "problem": "export default function Layout({ children, analytics }) { return <div>{analytics}</div> }",
            "solution": "export default function Layout({ children, analytics }: { children: React.ReactNode; analytics: React.ReactNode }) { return <div>{analytics}</div> }"
          }
        },
        {
          "error": "404 Not Found for unmatched routes",
          "description": "未匹配的槽位顯示 404 錯誤",
          "causes": [
            "缺少 default.tsx 文件",
            "槽位目錄結構不正確",
            "路由配置錯誤"
          ],
          "solutions": [
            "為每個槽位創建 default.tsx 文件",
            "檢查槽位目錄結構",
            "驗證路由配置",
            "使用 catch-all 路由處理未匹配情況"
          ],
          "example": {
            "problem": "缺少 default.tsx 文件",
            "solution": "創建 app/@analytics/default.tsx 並返回 null 或默認內容"
          }
        },
        {
          "error": "Hydration mismatch between server and client",
          "description": "服務器端和客戶端渲染不匹配",
          "causes": [
            "條件渲染邏輯不一致",
            "動態內容在服務器和客戶端不同",
            "狀態管理問題"
          ],
          "solutions": [
            "使用 useEffect 處理客戶端特定的邏輯",
            "確保服務器和客戶端渲染邏輯一致",
            "使用 suppressHydrationWarning 處理已知的不匹配",
            "檢查狀態管理的一致性"
          ],
          "example": {
            "problem": "服務器和客戶端渲染不同的內容",
            "solution": "使用 useEffect 和 useState 管理客戶端狀態"
          }
        }
      ]
    },
    "routing_issues": {
      "title": "路由問題",
      "description": "平行路由中的路由相關問題和解決方案",
      "issues": [
        {
          "issue": "槽位不正確渲染",
          "description": "槽位內容沒有按預期顯示",
          "causes": [
            "佈局組件沒有正確渲染槽位",
            "槽位組件返回 null 或 undefined",
            "條件渲染邏輯錯誤"
          ],
          "solutions": [
            "檢查佈局組件中的槽位渲染邏輯",
            "驗證槽位組件是否正確返回內容",
            "調試條件渲染邏輯",
            "使用 console.log 或 React DevTools 檢查組件狀態"
          ],
          "debugging_steps": [
            "檢查瀏覽器控制台的錯誤信息",
            "使用 React DevTools 檢查組件樹",
            "驗證槽位 props 是否正確傳遞",
            "檢查槽位組件的返回值"
          ]
        },
        {
          "issue": "攔截路由不工作",
          "description": "攔截路由沒有按預期攔截目標路由",
          "causes": [
            "攔截路由文件夾名稱不正確",
            "攔截路由位置錯誤",
            "目標路由不存在或路徑錯誤"
          ],
          "solutions": [
            "檢查攔截路由的文件夾名稱約定",
            "確保攔截路由在正確的位置",
            "驗證目標路由是否存在",
            "檢查文件系統路徑結構"
          ],
          "debugging_steps": [
            "檢查文件系統結構",
            "驗證攔截路由約定",
            "測試目標路由是否可訪問",
            "檢查 Next.js 路由日誌"
          ]
        },
        {
          "issue": "導航後槽位狀態丟失",
          "description": "導航到新頁面後槽位的狀態或內容丟失",
          "causes": [
            "缺少 default.tsx 文件",
            "服務器端渲染無法確定槽位狀態",
            "狀態管理配置錯誤"
          ],
          "solutions": [
            "為每個槽位創建 default.tsx 文件",
            "實現適當的狀態持久化",
            "使用 localStorage 或 sessionStorage 保存狀態",
            "實現狀態恢復邏輯"
          ],
          "debugging_steps": [
            "檢查是否所有槽位都有 default.tsx",
            "驗證狀態管理配置",
            "檢查瀏覽器存儲",
            "測試狀態恢復邏輯"
          ]
        }
      ]
    },
    "performance_issues": {
      "title": "性能問題",
      "description": "平行路由中的性能相關問題和優化方案",
      "issues": [
        {
          "issue": "頁面加載緩慢",
          "description": "包含多個槽位的頁面加載速度慢",
          "causes": [
            "所有槽位同時加載",
            "大型組件沒有代碼分割",
            "缺少適當的緩存策略"
          ],
          "solutions": [
            "實現懶加載和代碼分割",
            "使用 React.lazy 和 Suspense",
            "實現適當的緩存策略",
            "優化組件大小和依賴"
          ],
          "optimization_techniques": [
            "使用 React.memo 避免不必要的重新渲染",
            "實現虛擬化渲染處理大量數據",
            "使用 Next.js 的預取功能",
            "優化圖片和靜態資源"
          ]
        },
        {
          "issue": "內存使用過高",
          "description": "應用使用過多內存",
          "causes": [
            "組件沒有正確清理",
            "事件監聽器沒有移除",
            "大型對象沒有釋放"
          ],
          "solutions": [
            "在 useEffect 中正確清理副作用",
            "移除事件監聽器",
            "使用 useCallback 和 useMemo 優化",
            "實現適當的組件卸載邏輯"
          ],
          "debugging_steps": [
            "使用 Chrome DevTools 檢查內存使用",
            "檢查組件生命週期",
            "驗證清理邏輯",
            "監控內存洩漏"
          ]
        }
      ]
    },
    "state_management_issues": {
      "title": "狀態管理問題",
      "description": "平行路由中狀態管理相關的問題和解決方案",
      "issues": [
        {
          "issue": "槽位間狀態不同步",
          "description": "不同槽位的狀態不一致",
          "causes": [
            "狀態管理工具配置錯誤",
            "槽位間通信機制缺失",
            "狀態更新時機不正確"
          ],
          "solutions": [
            "檢查狀態管理工具的配置",
            "實現適當的槽位間通信機制",
            "使用事件系統或狀態提升",
            "確保狀態更新的一致性"
          ],
          "implementation_examples": [
            "使用 React Context 共享狀態",
            "實現事件發射和監聽",
            "使用狀態提升到共同祖先",
            "實現狀態同步邏輯"
          ]
        },
        {
          "issue": "狀態更新導致無限循環",
          "description": "狀態更新觸發無限的重新渲染",
          "causes": [
            "useEffect 依賴項配置錯誤",
            "狀態更新邏輯有問題",
            "組件重新渲染觸發狀態更新"
          ],
          "solutions": [
            "檢查 useEffect 的依賴項",
            "使用 useCallback 和 useMemo 優化",
            "實現適當的狀態更新條件",
            "使用 useRef 避免不必要的更新"
          ],
          "debugging_steps": [
            "檢查 useEffect 依賴項",
            "使用 React DevTools 檢查渲染次數",
            "添加 console.log 追蹤狀態更新",
            "檢查組件重新渲染的原因"
          ]
        }
      ]
    },
    "debugging_techniques": {
      "title": "調試技術",
      "description": "調試平行路由問題的有效技術和工具",
      "techniques": [
        {
          "name": "React DevTools",
          "description": "使用 React DevTools 檢查組件樹和狀態",
          "usage": [
            "檢查組件層次結構",
            "查看 props 和 state",
            "追蹤組件重新渲染",
            "檢查 hooks 狀態"
          ],
          "benefits": ["可視化組件結構", "實時狀態檢查", "性能分析", "調試友好"]
        },
        {
          "name": "Console 調試",
          "description": "使用 console 語句進行調試",
          "usage": [
            "console.log 檢查值",
            "console.error 記錄錯誤",
            "console.warn 記錄警告",
            "console.table 顯示數據"
          ],
          "best_practices": [
            "使用描述性的日誌信息",
            "在關鍵點添加日誌",
            "使用不同的日誌級別",
            "清理生產環境的調試代碼"
          ]
        },
        {
          "name": "Network 調試",
          "description": "使用瀏覽器開發工具檢查網絡請求",
          "usage": [
            "檢查 API 請求",
            "驗證請求參數",
            "檢查響應數據",
            "分析請求時序"
          ],
          "benefits": ["檢查數據獲取", "驗證 API 調用", "分析性能", "調試錯誤"]
        }
      ]
    },
    "testing_issues": {
      "title": "測試問題",
      "description": "測試平行路由時常見的問題和解決方案",
      "issues": [
        {
          "issue": "測試環境配置問題",
          "description": "測試環境無法正確模擬平行路由",
          "causes": [
            "測試工具配置不正確",
            "缺少必要的測試設置",
            "模擬對象不完整"
          ],
          "solutions": [
            "配置適當的測試環境",
            "創建必要的測試設置",
            "實現完整的模擬對象",
            "使用適當的測試工具"
          ],
          "testing_tools": [
            "Jest 和 React Testing Library",
            "Cypress 進行端到端測試",
            "MSW 模擬 API 請求",
            "Testing Library 的 render 方法"
          ]
        },
        {
          "issue": "槽位間交互測試困難",
          "description": "測試槽位之間的交互和通信",
          "causes": [
            "測試隔離過於嚴格",
            "缺少集成測試策略",
            "模擬對象不完整"
          ],
          "solutions": [
            "實現適當的集成測試",
            "創建完整的測試場景",
            "使用適當的測試工具",
            "實現端到端測試"
          ],
          "testing_strategies": [
            "單元測試個別組件",
            "集成測試槽位交互",
            "端到端測試用戶流程",
            "性能測試關鍵路徑"
          ]
        }
      ]
    },
    "deployment_issues": {
      "title": "部署問題",
      "description": "部署平行路由應用時的常見問題和解決方案",
      "issues": [
        {
          "issue": "構建錯誤",
          "description": "構建過程中出現錯誤",
          "causes": [
            "TypeScript 編譯錯誤",
            "依賴項版本衝突",
            "環境變數配置錯誤"
          ],
          "solutions": [
            "修復 TypeScript 錯誤",
            "解決依賴項衝突",
            "檢查環境變數配置",
            "驗證構建配置"
          ],
          "debugging_steps": [
            "檢查構建日誌",
            "驗證 TypeScript 配置",
            "檢查 package.json",
            "驗證環境變數"
          ]
        },
        {
          "issue": "運行時錯誤",
          "description": "部署後應用出現運行時錯誤",
          "causes": [
            "環境變數缺失",
            "API 端點配置錯誤",
            "構建產物問題"
          ],
          "solutions": [
            "檢查環境變數配置",
            "驗證 API 端點",
            "重新構建和部署",
            "檢查運行時日誌"
          ],
          "monitoring": [
            "設置錯誤監控",
            "記錄運行時日誌",
            "監控性能指標",
            "設置告警機制"
          ]
        }
      ]
    }
  }
}
