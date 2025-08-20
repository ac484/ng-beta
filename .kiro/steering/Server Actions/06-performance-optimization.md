{
  "title": "Next.js Server Actions 性能優化",
  "version": "Next.js 14+",
  "description": "優化 Server Actions 的性能，包括緩存策略、流式處理、並發控制和資源管理",
  "metadata": {
    "category": "Performance Optimization",
    "complexity": "High",
    "usage": "性能優化、緩存管理、並發控制、資源優化、響應時間改善",
    "lastmod": "2025-01-17"
  },
  "content": {
    "caching_strategies": {
      "description": "實現有效的緩存策略提升性能",
      "methods": {
        "revalidatePath": "重新驗證特定路徑的緩存",
        "revalidateTag": "重新驗證特定標籤的緩存",
        "cache_function": "控制函數的緩存行為",
        "unstable_cache": "使用實驗性緩存功能"
      },
      "examples": {
        "selective_revalidation": "'use server'\nexport async function updatePost(postId: string, formData: FormData) {\n  const post = await db.post.update({\n    where: { id: postId },\n    data: {\n      title: formData.get('title') as string,\n      content: formData.get('content') as string\n    }\n  })\n  \n  // 選擇性重新驗證緩存\n  revalidatePath('/posts')\n  revalidatePath(`/posts/${postId}`)\n  revalidateTag('posts')\n  revalidateTag(`post-${postId}`)\n  revalidateTag(`category-${post.category}`)\n  \n  return post\n}",
        "cache_control": "'use server'\nexport async function getExpensiveData(params: SearchParams) {\n  // 緩存昂貴的計算結果\n  const cacheKey = `expensive-${JSON.stringify(params)}`\n  \n  const cached = await unstable_cache(\n    async () => {\n      // 執行昂貴的計算\n      const result = await performExpensiveCalculation(params)\n      return result\n    },\n    [cacheKey],\n    {\n      tags: ['expensive-data'],\n      revalidate: 3600 // 1 hour\n    }\n  )()\n  \n  return cached\n}"
      }
    },
    "streaming_and_async": {
      "description": "使用流式處理和異步操作優化響應時間",
      "patterns": {
        "streaming_response": "使用流式響應處理長時間運行的操作",
        "background_processing": "將耗時操作移到後台任務",
        "parallel_execution": "並行執行多個操作"
      },
      "example": "'use server'\nexport async function processLargeDataset(formData: FormData) {\n  const file = formData.get('file') as File\n  \n  if (!file) {\n    throw new Error('No file uploaded')\n  }\n  \n  // 立即返回響應，在後台處理數據\n  const processingId = generateId()\n  \n  // 啟動後台處理\n  processInBackground(processingId, file)\n  \n  return { \n    success: true, \n    processingId,\n    message: 'File processing started' \n  }\n}\n\nasync function processInBackground(id: string, file: File) {\n  try {\n    // 處理大文件\n    const result = await processFile(file)\n    \n    // 保存結果\n    await db.processingResult.create({\n      data: {\n        id,\n        status: 'COMPLETED',\n        result: JSON.stringify(result)\n      }\n    })\n  } catch (error) {\n    // 記錄錯誤\n    await db.processingResult.create({\n      data: {\n        id,\n        status: 'FAILED',\n        error: error instanceof Error ? error.message : 'Unknown error'\n      }\n    })\n  }\n}"
    },
    "database_optimization": {
      "description": "優化數據庫查詢和連接管理",
      "techniques": {
        "query_optimization": "優化 SQL 查詢和索引",
        "connection_pooling": "使用連接池管理數據庫連接",
        "batch_operations": "批量處理多個操作",
        "selective_loading": "只加載需要的數據"
      },
      "example": "'use server'\nexport async function getOptimizedPosts(category?: string, page = 1, limit = 10) {\n  const offset = (page - 1) * limit\n  \n  // 並行執行多個查詢\n  const [posts, totalCount] = await Promise.all([\n    db.post.findMany({\n      where: category ? { category } : {},\n      select: {\n        id: true,\n        title: true,\n        excerpt: true,\n        createdAt: true,\n        author: {\n          select: {\n            id: true,\n            name: true,\n            avatar: true\n          }\n        },\n        _count: {\n          select: {\n            comments: true,\n            likes: true\n          }\n        }\n      },\n      orderBy: { createdAt: 'desc' },\n      skip: offset,\n      take: limit\n    }),\n    db.post.count({\n      where: category ? { category } : {}\n    })\n  ])\n  \n  return {\n    posts,\n    pagination: {\n      page,\n      limit,\n      total: totalCount,\n      totalPages: Math.ceil(totalCount / limit)\n    }\n  }\n}"
    },
    "concurrency_control": {
      "description": "控制並發操作避免資源競爭",
      "patterns": {
        "rate_limiting": "限制請求頻率",
        "semaphore": "使用信號量控制並發數量",
        "queue_system": "實現隊列系統處理請求"
      },
      "example": "import { Semaphore } from 'async-sema'\n\n// 限制同時處理的文件數量\nconst fileProcessingSemaphore = new Semaphore(3)\n\n'use server'\nexport async function processMultipleFiles(formData: FormData) {\n  const files = formData.getAll('files') as File[]\n  \n  if (files.length === 0) {\n    throw new Error('No files uploaded')\n  }\n  \n  // 並行處理文件，但限制並發數量\n  const results = await Promise.all(\n    files.map(async (file) => {\n      return await fileProcessingSemaphore.acquire(async () => {\n        try {\n          const result = await processFile(file)\n          return { success: true, fileName: file.name, result }\n        } catch (error) {\n          return { \n            success: false, \n            fileName: file.name, \n            error: error instanceof Error ? error.message : 'Unknown error' \n          }\n        }\n      })\n    })\n  )\n  \n  return { results }\n}"
    },
    "memory_management": {
      "description": "優化內存使用和資源管理",
      "techniques": {
        "streaming_processing": "使用流式處理大文件",
        "chunked_operations": "分塊處理大量數據",
        "garbage_collection": "及時釋放不需要的資源"
      },
      "example": "'use server'\nexport async function processLargeFile(formData: FormData) {\n  const file = formData.get('file') as File\n  \n  if (!file) {\n    throw new Error('No file uploaded')\n  }\n  \n  // 分塊處理大文件\n  const chunkSize = 1024 * 1024 // 1MB chunks\n  const chunks = Math.ceil(file.size / chunkSize)\n  const results = []\n  \n  for (let i = 0; i < chunks; i++) {\n    const start = i * chunkSize\n    const end = Math.min(start + chunkSize, file.size)\n    const chunk = file.slice(start, end)\n    \n    // 處理每個塊\n    const chunkResult = await processChunk(chunk, i)\n    results.push(chunkResult)\n    \n    // 定期清理內存\n    if (i % 10 === 0) {\n      global.gc?.()\n    }\n  }\n  \n  // 合併結果\n  const finalResult = mergeResults(results)\n  \n  return { success: true, result: finalResult }\n}"
    }
  },
  "monitoring_and_metrics": {
    "description": "監控 Server Actions 的性能指標",
    "metrics": {
      "response_time": "響應時間",
      "throughput": "吞吐量",
      "error_rate": "錯誤率",
      "resource_usage": "資源使用情況"
    },
    "tools": {
      "next_analytics": "Next.js 內建分析",
      "custom_metrics": "自定義性能指標",
      "apm_tools": "應用性能監控工具"
    }
  },
  "best_practices": [
    "使用適當的緩存策略減少重複計算",
    "實現流式處理處理長時間運行的操作",
    "優化數據庫查詢和連接管理",
    "控制並發數量避免資源競爭",
    "監控性能指標識別瓶頸",
    "使用分塊處理處理大文件",
    "實現適當的錯誤處理和重試機制",
    "定期清理不需要的緩存和資源"
  ],
  "performance_patterns": {
    "lazy_loading": "延遲加載非關鍵資源",
    "prefetching": "預取可能需要的數據",
    "compression": "使用壓縮減少傳輸大小",
    "cdn_integration": "使用 CDN 加速靜態資源",
    "database_indexing": "優化數據庫索引提升查詢性能"
  }
}
