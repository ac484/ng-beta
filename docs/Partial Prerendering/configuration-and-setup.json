{
  "title": "Next.js Partial Prerendering 配置與設置",
  "version": "Next.js 15+",
  "description": "詳細的 PPR 配置指南，包括全局設置、路由級別配置和最佳實踐",
  "metadata": {
    "category": "Configuration",
    "complexity": "Medium",
    "usage": "項目配置、路由設置、實驗性功能啟用",
    "lastmod": "2025-01-17",
    "source": "Vercel Next.js Official Documentation"
  },
  "global_configuration": {
    "next_config_js": {
      "description": "在 next.config.js/ts 中啟用 PPR",
      "code_examples": {
        "typescript": "import type { NextConfig } from 'next'\n\nconst nextConfig: NextConfig = {\n  experimental: {\n    ppr: 'incremental',\n  },\n}\n\nexport default nextConfig",
        "javascript": "/** @type {import('next').NextConfig} */\nconst nextConfig = {\n  experimental: {\n    ppr: 'incremental',\n  },\n}\n\nmodule.exports = nextConfig"
      },
      "options": {
        "incremental": "啟用 PPR，允許個別路由選擇加入",
        "false": "為整個應用禁用 PPR"
      }
    }
  },
  "route_level_configuration": {
    "experimental_ppr_export": {
      "description": "在路由段中明確選擇加入 PPR",
      "usage": "在 layout.tsx 或 page.tsx 文件頂部導出",
      "code_examples": {
        "layout": "export const experimental_ppr = true\n\nexport default function Layout({ children }: { children: React.ReactNode }) {\n  // ...\n}",
        "page": "export const experimental_ppr = true\n\nexport default function Page() {\n  // ...\n}"
      },
      "inheritance": "父段設置會應用到所有子段，除非被子段覆蓋",
      "override": "子段可以設置 experimental_ppr = false 來禁用 PPR"
    }
  },
  "installation_requirements": {
    "nextjs_version": "npm install next@canary",
    "react_version": "React 18+ with Suspense support",
    "experimental_features": "需要啟用實驗性功能標誌"
  },
  "configuration_best_practices": {
    "incremental_adoption": "使用 'incremental' 選項進行漸進式採用",
    "route_specific_control": "在需要 PPR 的路由中明確導出 experimental_ppr",
    "testing_environment": "在開發環境中測試 PPR 功能",
    "production_considerations": "確保生產環境支持流式傳輸"
  }
}

