{
  "title": "Next.js Server Actions 基礎概念",
  "version": "Next.js 14+",
  "description": "Server Actions 是 Next.js 14 引入的革命性功能，允許在客戶端組件中直接調用服務器端函數，無需創建 API 路由",
  "metadata": {
    "category": "Core Concepts",
    "complexity": "Medium",
    "usage": "表單處理、數據提交、服務器端邏輯執行、無 API 路由的數據操作",
    "lastmod": "2025-01-17"
  },
  "content": {
    "overview": {
      "definition": "Server Actions 是 Next.js 14+ 的功能，允許在客戶端組件中直接調用服務器端函數",
      "benefits": [
        "無需創建 API 路由",
        "自動類型安全",
        "漸進式增強",
        "內建錯誤處理",
        "SEO 友好"
      ],
      "use_cases": [
        "表單提交",
        "數據庫操作",
        "文件上傳",
        "認證邏輯",
        "第三方 API 調用"
      ]
    },
    "basic_syntax": {
      "server_action": "在服務器端組件或獨立文件中使用 'use server' 指令",
      "client_usage": "在客戶端組件中直接調用 Server Action",
      "example": {
        "server_side": "// app/actions.ts\n'use server'\n\nexport async function submitForm(formData: FormData) {\n  const name = formData.get('name')\n  // 處理邏輯\n}",
        "client_side": "// 在客戶端組件中\nimport { submitForm } from './actions'\n\n<form action={submitForm}>\n  <input name='name' />\n  <button type='submit'>Submit</button>\n</form>"
      }
    },
    "key_features": {
      "progressive_enhancement": "即使 JavaScript 被禁用，表單仍能正常工作",
      "type_safety": "完整的 TypeScript 支持，自動類型推斷",
      "error_handling": "內建錯誤處理和驗證",
      "optimistic_updates": "支持樂觀更新 UI",
      "revalidation": "自動重新驗證數據"
    }
  },
  "examples": {
    "basic_form": {
      "description": "基本的表單提交 Server Action",
      "code": {
        "server": "'use server'\n\nexport async function createPost(formData: FormData) {\n  const title = formData.get('title')\n  const content = formData.get('content')\n  \n  // 驗證\n  if (!title || !content) {\n    throw new Error('Title and content are required')\n  }\n  \n  // 保存到數據庫\n  const post = await db.posts.create({\n    title: title.toString(),\n    content: content.toString()\n  })\n  \n  revalidatePath('/posts')\n  redirect('/posts')\n}",
        "client": "<form action={createPost}>\n  <input name='title' placeholder='Post title' required />\n  <textarea name='content' placeholder='Post content' required />\n  <button type='submit'>Create Post</button>\n</form>"
      }
    }
  },
  "best_practices": [
    "使用 'use server' 指令標記 Server Actions",
    "在獨立的 actions.ts 文件中組織 Server Actions",
    "實現適當的錯誤處理和驗證",
    "使用 revalidatePath 和 revalidateTag 進行緩存管理",
    "考慮安全性，驗證所有輸入數據"
  ]
}
