{
  "title": "Next.js Server Actions 高級模式",
  "version": "Next.js 14+",
  "description": "Server Actions 的高級使用模式，包括樂觀更新、錯誤處理、驗證、緩存管理和安全性最佳實踐",
  "metadata": {
    "category": "Advanced Patterns",
    "complexity": "High",
    "usage": "複雜表單處理、數據驗證、錯誤處理、緩存策略、安全性實現",
    "lastmod": "2025-01-17"
  },
  "content": {
    "optimistic_updates": {
      "description": "在服務器響應前立即更新 UI，提升用戶體驗",
      "implementation": {
        "useOptimistic": "使用 useOptimistic hook 實現樂觀更新",
        "example": "const [optimisticPosts, addOptimisticPost] = useOptimistic(\n  posts,\n  (state, newPost) => [newPost, ...state]\n)\n\nconst handleSubmit = async (formData: FormData) => {\n  const newPost = {\n    id: Date.now(),\n    title: formData.get('title'),\n    content: formData.get('content')\n  }\n  \n  addOptimisticPost(newPost)\n  await createPost(formData)\n}"
      }
    },
    "error_handling": {
      "description": "實現健壯的錯誤處理和用戶反饋",
      "patterns": {
        "try_catch": "使用 try-catch 捕獲和處理錯誤",
        "error_boundaries": "實現錯誤邊界組件",
        "user_feedback": "提供清晰的錯誤消息和恢復選項"
      },
      "example": "'use server'\n\nexport async function createPost(formData: FormData) {\n  try {\n    const title = formData.get('title')\n    const content = formData.get('content')\n    \n    if (!title || !content) {\n      throw new Error('Title and content are required')\n    }\n    \n    const post = await db.posts.create({\n      title: title.toString(),\n      content: content.toString()\n    })\n    \n    revalidatePath('/posts')\n    return { success: true, post }\n  } catch (error) {\n    return { \n      success: false, \n      error: error instanceof Error ? error.message : 'Unknown error' \n    }\n  }\n}"
    },
    "validation": {
      "description": "實現服務器端和客戶端驗證",
      "approaches": {
        "server_validation": "在 Server Action 中進行最終驗證",
        "client_validation": "在客戶端進行即時驗證",
        "schema_validation": "使用 Zod 等庫進行模式驗證"
      },
      "example": "import { z } from 'zod'\n\nconst PostSchema = z.object({\n  title: z.string().min(1, 'Title is required').max(100, 'Title too long'),\n  content: z.string().min(10, 'Content must be at least 10 characters')\n})\n\n'use server'\nexport async function createPost(formData: FormData) {\n  const rawData = {\n    title: formData.get('title'),\n    content: formData.get('content')\n  }\n  \n  const result = PostSchema.safeParse(rawData)\n  if (!result.success) {\n    return { success: false, errors: result.error.flatten() }\n  }\n  \n  // 處理驗證後的數據\n  const post = await db.posts.create(result.data)\n  revalidatePath('/posts')\n  return { success: true, post }\n}"
    },
    "caching_strategies": {
      "description": "使用 Next.js 緩存機制優化性能",
      "methods": {
        "revalidatePath": "重新驗證特定路徑的緩存",
        "revalidateTag": "重新驗證特定標籤的緩存",
        "cache": "控制函數的緩存行為"
      },
      "example": "'use server'\nexport async function updatePost(id: string, formData: FormData) {\n  const post = await db.posts.update(id, {\n    title: formData.get('title'),\n    content: formData.get('content')\n  })\n  \n  // 重新驗證相關緩存\n  revalidatePath('/posts')\n  revalidatePath(`/posts/${id}`)\n  revalidateTag('posts')\n  \n  return post\n}"
    }
  },
  "security_considerations": {
    "input_validation": "始終驗證和清理所有輸入數據",
    "authentication": "在 Server Actions 中檢查用戶權限",
    "csrf_protection": "Next.js 自動提供 CSRF 保護",
    "rate_limiting": "實現請求頻率限制",
    "sql_injection": "使用參數化查詢防止 SQL 注入"
  },
  "performance_optimization": {
    "streaming": "使用流式響應處理長時間運行的操作",
    "background_processing": "將耗時操作移到後台任務",
    "caching": "合理使用緩存減少重複計算",
    "database_optimization": "優化數據庫查詢和連接"
  }
}
