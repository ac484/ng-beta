{
  "title": "Next.js Server Actions 數據庫操作",
  "version": "Next.js 14+",
  "description": "使用 Server Actions 進行數據庫操作，包括 CRUD 操作、事務處理、數據驗證和緩存管理",
  "metadata": {
    "category": "Database Operations",
    "complexity": "High",
    "usage": "數據庫 CRUD 操作、數據驗證、事務處理、緩存管理、數據同步",
    "lastmod": "2025-01-17"
  },
  "content": {
    "crud_operations": {
      "description": "基本的增刪改查操作",
      "operations": {
        "create": "創建新記錄",
        "read": "讀取數據",
        "update": "更新現有記錄",
        "delete": "刪除記錄"
      },
      "examples": {
        "create": "'use server'\n\nexport async function createUser(formData: FormData) {\n  const name = formData.get('name')\n  const email = formData.get('email')\n  \n  // 驗證\n  if (!name || !email) {\n    throw new Error('Name and email are required')\n  }\n  \n  // 檢查郵箱是否已存在\n  const existingUser = await db.user.findUnique({\n    where: { email: email.toString() }\n  })\n  \n  if (existingUser) {\n    throw new Error('Email already exists')\n  }\n  \n  // 創建用戶\n  const user = await db.user.create({\n    data: {\n      name: name.toString(),\n      email: email.toString()\n    }\n  })\n  \n  revalidatePath('/users')\n  return { success: true, user }\n}",
        "read": "'use server'\nexport async function getUser(id: string) {\n  const user = await db.user.findUnique({\n    where: { id },\n    include: {\n      posts: true,\n      profile: true\n    }\n  })\n  \n  if (!user) {\n    throw new Error('User not found')\n  }\n  \n  return user\n}",
        "update": "'use server'\nexport async function updateUser(id: string, formData: FormData) {\n  const name = formData.get('name')\n  const email = formData.get('email')\n  \n  // 驗證\n  if (!name || !email) {\n    throw new Error('Name and email are required')\n  }\n  \n  // 檢查郵箱是否被其他用戶使用\n  const existingUser = await db.user.findFirst({\n    where: {\n      email: email.toString(),\n      NOT: { id }\n    }\n  })\n  \n  if (existingUser) {\n    throw new Error('Email already exists')\n  }\n  \n  // 更新用戶\n  const user = await db.user.update({\n    where: { id },\n    data: {\n      name: name.toString(),\n      email: email.toString()\n    }\n  })\n  \n  revalidatePath('/users')\n  revalidatePath(`/users/${id}`)\n  return { success: true, user }\n}",
        "delete": "'use server'\nexport async function deleteUser(id: string) {\n  // 檢查用戶是否存在\n  const user = await db.user.findUnique({\n    where: { id }\n  })\n  \n  if (!user) {\n    throw new Error('User not found')\n  }\n  \n  // 刪除相關數據（級聯刪除）\n  await db.$transaction([\n    db.post.deleteMany({ where: { authorId: id } }),\n    db.profile.deleteMany({ where: { userId: id } }),\n    db.user.delete({ where: { id } })\n  ])\n  \n  revalidatePath('/users')\n  return { success: true }\n}"
      }
    },
    "transaction_handling": {
      "description": "使用數據庫事務確保數據一致性",
      "patterns": {
        "atomic_operations": "確保多個操作要麼全部成功，要麼全部失敗",
        "rollback": "在錯誤時自動回滾所有更改",
        "data_integrity": "維護數據庫的完整性約束"
      },
      "example": "'use server'\nexport async function transferMoney(fromAccountId: string, toAccountId: string, amount: number) {\n  return await db.$transaction(async (tx) => {\n    // 檢查源賬戶餘額\n    const fromAccount = await tx.account.findUnique({\n      where: { id: fromAccountId },\n      select: { balance: true }\n    })\n    \n    if (!fromAccount || fromAccount.balance < amount) {\n      throw new Error('Insufficient funds')\n    }\n    \n    // 扣除源賬戶金額\n    await tx.account.update({\n      where: { id: fromAccountId },\n      data: { balance: { decrement: amount } }\n    })\n    \n    // 增加目標賬戶金額\n    await tx.account.update({\n      where: { id: toAccountId },\n      data: { balance: { increment: amount } }\n    })\n    \n    // 記錄交易\n    await tx.transaction.create({\n      data: {\n        fromAccountId,\n        toAccountId,\n        amount,\n        type: 'TRANSFER',\n        status: 'COMPLETED'\n      }\n    })\n    \n    return { success: true, amount }\n  })\n}"
    },
    "data_validation": {
      "description": "在數據庫操作前進行數據驗證",
      "approaches": {
        "schema_validation": "使用 Zod 等庫進行模式驗證",
        "business_rules": "實現業務邏輯驗證",
        "constraint_checking": "檢查數據庫約束"
      },
      "example": "import { z } from 'zod'\n\nconst UserSchema = z.object({\n  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name too long'),\n  email: z.string().email('Invalid email format'),\n  age: z.number().min(18, 'Must be at least 18 years old').max(120, 'Invalid age'),\n  role: z.enum(['USER', 'ADMIN', 'MODERATOR'])\n})\n\n'use server'\nexport async function createUser(formData: FormData) {\n  const rawData = {\n    name: formData.get('name'),\n    email: formData.get('email'),\n    age: Number(formData.get('age')),\n    role: formData.get('role')\n  }\n  \n  // 驗證數據\n  const result = UserSchema.safeParse(rawData)\n  if (!result.success) {\n    return { \n      success: false, \n      errors: result.error.flatten().fieldErrors \n    }\n  }\n  \n  // 檢查業務規則\n  if (result.data.role === 'ADMIN' && result.data.age < 21) {\n    return {\n      success: false,\n      errors: { role: ['Admin users must be at least 21 years old'] }\n    }\n  }\n  \n  // 檢查唯一性約束\n  const existingUser = await db.user.findUnique({\n    where: { email: result.data.email }\n  })\n  \n  if (existingUser) {\n    return {\n      success: false,\n      errors: { email: ['Email already exists'] }\n    }\n  }\n  \n  // 創建用戶\n  const user = await db.user.create({\n    data: result.data\n  })\n  \n  revalidatePath('/users')\n  return { success: true, user }\n}"
    },
    "caching_strategies": {
      "description": "使用 Next.js 緩存機制優化數據庫查詢",
      "methods": {
        "revalidatePath": "重新驗證特定路徑的緩存",
        "revalidateTag": "重新驗證特定標籤的緩存",
        "cache_control": "控制函數的緩存行為"
      },
      "example": "'use server'\nexport async function getPosts(category?: string) {\n  const posts = await db.post.findMany({\n    where: category ? { category } : {},\n    include: {\n      author: {\n        select: { name: true, avatar: true }\n      },\n      tags: true\n    },\n    orderBy: { createdAt: 'desc' }\n  })\n  \n  return posts\n}\n\nexport async function createPost(formData: FormData) {\n  const post = await db.post.create({\n    data: {\n      title: formData.get('title') as string,\n      content: formData.get('content') as string,\n      category: formData.get('category') as string,\n      authorId: formData.get('authorId') as string\n    }\n  })\n  \n  // 重新驗證相關緩存\n  revalidatePath('/posts')\n  revalidatePath(`/posts/${post.id}`)\n  revalidateTag('posts')\n  revalidateTag(`category-${post.category}`)\n  \n  return post\n}"
    }
  },
  "best_practices": [
    "始終在數據庫操作前進行數據驗證",
    "使用事務處理複雜的多步驟操作",
    "實現適當的錯誤處理和用戶反饋",
    "使用緩存策略減少重複數據庫查詢",
    "考慮數據庫性能，優化查詢語句",
    "實現適當的權限檢查和訪問控制",
    "使用參數化查詢防止 SQL 注入",
    "定期備份和維護數據庫"
  ],
  "common_patterns": {
    "user_management": "用戶註冊、登錄、權限管理",
    "content_management": "文章、評論、媒體管理",
    "e_commerce": "產品、訂單、庫存管理",
    "social_features": "好友、關注、消息管理",
    "analytics": "數據統計、報表生成"
  }
}
