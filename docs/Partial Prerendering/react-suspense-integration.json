{
  "title": "React Suspense 與 Next.js Partial Prerendering 整合",
  "version": "Next.js 15+ / React 18+",
  "description": "使用 React Suspense 在 PPR 中定義動態邊界，實現靜態內容預渲染和動態內容流式傳輸",
  "metadata": {
    "category": "React Integration",
    "complexity": "High",
    "usage": "動態邊界定義、流式傳輸、fallback UI、組件異步加載",
    "lastmod": "2025-01-17",
    "source": "Vercel Next.js Official Documentation"
  },
  "suspense_fundamentals": {
    "purpose": "在 PPR 中定義動態邊界，允許 Next.js 預渲染靜態內容和 fallback UI",
    "dynamic_boundaries": "使用 Suspense 包裝動態組件，創建可流式傳輸的區域",
    "fallback_ui": "在動態內容加載時顯示的備用 UI"
  },
  "basic_implementation": {
    "description": "基本的 Suspense 與 PPR 整合模式",
    "code_example": {
      "tsx": "import { Suspense } from 'react'\nimport StaticComponent from './StaticComponent'\nimport DynamicComponent from './DynamicComponent'\nimport Fallback from './Fallback'\n\nexport const experimental_ppr = true\n\nexport default function Page() {\n  return (\n    <>\n      <StaticComponent />\n      <Suspense fallback={<Fallback />}>\n        <DynamicComponent />\n      </Suspense>\n    </>\n  )\n}",
      "jsx": "import { Suspense } from 'react'\nimport StaticComponent from './StaticComponent'\nimport DynamicComponent from './DynamicComponent'\nimport Fallback from './Fallback'\n\nexport const experimental_ppr = true\n\nexport default function Page() {\n  return (\n    <>\n      <StaticComponent />\n      <Suspense fallback={<Fallback />}>\n        <DynamicComponent />\n      </Suspense>\n    </>\n  )\n}"
    }
  },
  "dynamic_component_wrapping": {
    "description": "使用 Suspense 包裝使用動態 API 的組件",
    "cookies_example": {
      "tsx": "import { Suspense } from 'react'\nimport { User, AvatarSkeleton } from './user'\n\nexport const experimental_ppr = true\n\nexport default function Page() {\n  return (\n    <section>\n      <h1>This will be prerendered</h1>\n      <Suspense fallback={<AvatarSkeleton />}>\n        <User />\n      </Suspense>\n    </section>\n  )\n}",
      "jsx": "import { Suspense } from 'react'\nimport { User, AvatarSkeleton } from './user'\n\nexport const experimental_ppr = true\n\nexport default function Page() {\n  return (\n    <section>\n      <h1>This will be prerendered</h1>\n      <Suspense fallback={<AvatarSkeleton />}>\n        <User />\n      </Suspense>\n    </section>\n  )\n}"
    }
  },
  "searchparams_integration": {
    "description": "處理動態 searchParams 的 Suspense 整合",
    "code_example": {
      "tsx": "import { Table, TableSkeleton } from './table'\nimport { Suspense } from 'react'\n\nexport default function Page({\n  searchParams,\n}: {\n  searchParams: Promise<{ sort: string }>\n}) {\n  return (\n    <section>\n      <h1>This will be prerendered</h1>\n      <Suspense fallback={<TableSkeleton />}>\n        <Table searchParams={searchParams} />\n      </Suspense>\n    </section>\n  )\n}",
      "jsx": "import { Table, TableSkeleton } from './table'\nimport { Suspense } from 'react'\n\nexport default function Page({ searchParams }) {\n  return (\n    <section>\n      <h1>This will be prerendered</h1>\n      <Suspense fallback={<TableSkeleton />}>\n        <Table searchParams={searchParams} />\n      </Suspense>\n    </section>\n  )\n}"
    }
  },
  "suspense_best_practices": {
    "fallback_design": "設計有意義的 fallback UI，提供良好的用戶體驗",
    "boundary_placement": "在適當的組件層級放置 Suspense 邊界",
    "error_boundaries": "結合 Error Boundaries 處理動態組件錯誤",
    "performance_optimization": "避免過度使用 Suspense，保持合理的組件粒度"
  },
  "advanced_patterns": {
    "nested_suspense": "在動態組件內部使用嵌套的 Suspense 邊界",
    "conditional_suspense": "根據條件動態決定是否使用 Suspense",
    "suspense_with_loading_states": "結合自定義加載狀態和 Suspense fallback"
  }
}

