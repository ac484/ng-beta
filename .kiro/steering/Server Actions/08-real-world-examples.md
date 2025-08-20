# Next.js Server Actions 實際應用案例

**版本:** Next.js 14+  
**最後更新:** 2025-01-17  
**分類:** Real World Examples  
**複雜度:** Medium  

## 概述

Server Actions 在實際項目中的應用案例，包括博客系統、電商平台、社交媒體和企業應用。

## 博客平台

### 描述
博客平台的 Server Actions 實現

### 主要功能
- **文章管理**: 文章的創建、編輯、刪除
- **評論系統**: 評論系統
- **用戶管理**: 用戶管理
- **內容審核**: 內容審核

### 範例

#### 文章創建
```typescript
'use server'
export async function createPost(formData: FormData) {
  const sessionId = cookies().get('sessionId')?.value
  if (!sessionId) throw new Error('Unauthorized')
  
  const session = await db.session.findUnique({
    where: { id: sessionId },
    include: { user: true }
  })
  if (!session) throw new Error('Invalid session')
  
  const title = formData.get('title')
  const content = formData.get('content')
  const category = formData.get('category')
  const tags = formData.getAll('tags')
  
  if (!title || !content) {
    throw new Error('Title and content are required')
  }
  
  // 創建文章
  const post = await db.post.create({
    data: {
      title: title.toString(),
      content: content.toString(),
      category: category?.toString() || 'General',
      authorId: session.user.id,
      tags: {
        create: tags.map(tag => ({ name: tag.toString() }))
      }
    }
  })
  
  revalidatePath('/posts')
  revalidatePath(`/posts/${post.id}`)
  
  return { success: true, postId: post.id }
}
```

#### 評論系統
```typescript
'use server'
export async function addComment(postId: string, formData: FormData) {
  const sessionId = cookies().get('sessionId')?.value
  if (!sessionId) throw new Error('Unauthorized')
  
  const content = formData.get('content')
  if (!content || content.toString().trim().length < 3) {
    throw new Error('Comment must be at least 3 characters')
  }
  
  const comment = await db.comment.create({
    data: {
      content: content.toString(),
      postId,
      authorId: sessionId
    }
  })
  
  revalidatePath(`/posts/${postId}`)
  
  return { success: true, comment }
}
```

## 電商平台

### 描述
電商平台的 Server Actions 實現

### 主要功能
- **產品管理**: 產品管理
- **訂單處理**: 訂單處理
- **庫存管理**: 庫存管理
- **支付集成**: 支付集成

### 範例

#### 訂單創建
```typescript
'use server'
export async function createOrder(formData: FormData) {
  const sessionId = cookies().get('sessionId')?.value
  if (!sessionId) throw new Error('Unauthorized')
  
  const cartItems = JSON.parse(formData.get('cartItems') as string)
  const shippingAddress = JSON.parse(formData.get('shippingAddress') as string)
  const paymentMethod = formData.get('paymentMethod')
  
  if (!cartItems || cartItems.length === 0) {
    throw new Error('Cart is empty')
  }
  
  return await db.$transaction(async (tx) => {
    // 檢查庫存
    for (const item of cartItems) {
      const product = await tx.product.findUnique({
        where: { id: item.productId },
        select: { stock: true, price: true }
      })
      
      if (!product || product.stock < item.quantity) {
        throw new Error(`Insufficient stock for product ${item.productId}`)
      }
    }
    
    // 計算總價
    const total = cartItems.reduce((sum, item) => {
      const product = cartItems.find(p => p.id === item.productId)
      return sum + (product.price * item.quantity)
    }, 0)
    
    // 創建訂單
    const order = await tx.order.create({
      data: {
        userId: sessionId,
        total,
        status: 'PENDING',
        shippingAddress,
        paymentMethod: paymentMethod?.toString() || 'CREDIT_CARD',
        items: {
          create: cartItems.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price
          }))
        }
      }
    })
    
    // 更新庫存
    for (const item of cartItems) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } }
      })
    }
    
    // 清空購物車
    await tx.cartItem.deleteMany({
      where: { userId: sessionId }
    })
    
    return { success: true, orderId: order.id }
  })
}
```

#### 庫存更新
```typescript
'use server'
export async function updateInventory(productId: string, formData: FormData) {
  const sessionId = cookies().get('sessionId')?.value
  if (!sessionId) throw new Error('Unauthorized')
  
  const user = await db.user.findUnique({
    where: { id: sessionId },
    select: { role: true }
  })
  
  if (user?.role !== 'ADMIN') {
    throw new Error('Insufficient permissions')
  }
  
  const stock = Number(formData.get('stock'))
  const price = Number(formData.get('price'))
  
  if (isNaN(stock) || stock < 0) {
    throw new Error('Invalid stock quantity')
  }
  
  if (isNaN(price) || price < 0) {
    throw new Error('Invalid price')
  }
  
  const product = await db.product.update({
    where: { id: productId },
    data: { stock, price }
  })
  
  revalidatePath('/admin/products')
  revalidatePath(`/products/${productId}`)
  
  return { success: true, product }
}
```

## 社交媒體平台

### 描述
社交媒體平台的 Server Actions 實現

### 主要功能
- **帖子分享**: 分享帖子
- **用戶互動**: 用戶互動（點讚、評論、分享）
- **好友系統**: 好友系統
- **通知系統**: 通知系統

### 範例

#### 帖子互動
```typescript
'use server'
export async function toggleLike(postId: string) {
  const sessionId = cookies().get('sessionId')?.value
  if (!sessionId) throw new Error('Unauthorized')
  
  const existingLike = await db.like.findFirst({
    where: {
      postId,
      userId: sessionId
    }
  })
  
  if (existingLike) {
    // 取消點讚
    await db.like.delete({
      where: { id: existingLike.id }
    })
    
    // 減少點讚數
    await db.post.update({
      where: { id: postId },
      data: { likeCount: { decrement: 1 } }
    })
    
    revalidatePath(`/posts/${postId}`)
    return { liked: false }
  } else {
    // 添加點讚
    await db.like.create({
      data: {
        postId,
        userId: sessionId
      }
    })
    
    // 增加點讚數
    await db.post.update({
      where: { id: postId },
      data: { likeCount: { increment: 1 } }
    })
    
    // 發送通知
    const post = await db.post.findUnique({
      where: { id: postId },
      include: { author: true }
    })
    
    if (post && post.author.id !== sessionId) {
      await db.notification.create({
        data: {
          userId: post.author.id,
          type: 'LIKE',
          message: `Someone liked your post "${post.title}"`,
          relatedId: postId
        }
      })
    }
    
    revalidatePath(`/posts/${postId}`)
    return { liked: true }
  }
}
```

#### 好友請求
```typescript
'use server'
export async function sendFriendRequest(targetUserId: string) {
  const sessionId = cookies().get('sessionId')?.value
  if (!sessionId) throw new Error('Unauthorized')
  
  if (sessionId === targetUserId) {
    throw new Error('Cannot send friend request to yourself')
  }
  
  // 檢查是否已經是好友
  const existingFriendship = await db.friendship.findFirst({
    where: {
      OR: [
        { userId: sessionId, friendId: targetUserId },
        { userId: targetUserId, friendId: sessionId }
      ]
    }
  })
  
  if (existingFriendship) {
    throw new Error('Friendship already exists')
  }
  
  // 檢查是否已經發送過請求
  const existingRequest = await db.friendRequest.findFirst({
    where: {
      fromUserId: sessionId,
      toUserId: targetUserId,
      status: 'PENDING'
    }
  })
  
  if (existingRequest) {
    throw new Error('Friend request already sent')
  }
  
  // 發送好友請求
  const request = await db.friendRequest.create({
    data: {
      fromUserId: sessionId,
      toUserId: targetUserId,
      status: 'PENDING'
    }
  })
  
  // 發送通知
  await db.notification.create({
    data: {
      userId: targetUserId,
      type: 'FRIEND_REQUEST',
      message: 'You have a new friend request',
      relatedId: request.id
    }
  })
  
  revalidatePath('/friends')
  
  return { success: true, requestId: request.id }
}
```

## 企業應用

### 描述
企業應用的 Server Actions 實現

### 主要功能
- **工作流程管理**: 工作流程管理
- **文檔管理**: 文檔管理
- **報告系統**: 報告系統
- **審計追蹤**: 審計追蹤

### 範例

#### 工作流程審批
```typescript
'use server'
export async function approveWorkflow(workflowId: string, formData: FormData) {
  const sessionId = cookies().get('sessionId')?.value
  if (!sessionId) throw new Error('Unauthorized')
  
  const user = await db.user.findUnique({
    where: { id: sessionId },
    include: { role: true, permissions: true }
  })
  
  if (!user) throw new Error('User not found')
  
  const workflow = await db.workflow.findUnique({
    where: { id: workflowId },
    include: { steps: true, currentStep: true }
  })
  
  if (!workflow) throw new Error('Workflow not found')
  
  // 檢查用戶是否有權限審批當前步驟
  const currentStep = workflow.steps.find(s => s.id === workflow.currentStepId)
  if (!currentStep || !currentStep.approvers.includes(user.id)) {
    throw new Error('Insufficient permissions to approve this step')
  }
  
  const comment = formData.get('comment')?.toString() || ''
  
  return await db.$transaction(async (tx) => {
    // 記錄審批
    await tx.approval.create({
      data: {
        workflowId,
        stepId: workflow.currentStepId,
        approverId: user.id,
        status: 'APPROVED',
        comment,
        timestamp: new Date()
      }
    })
    
    // 檢查是否所有審批人都已審批
    const approvals = await tx.approval.count({
      where: {
        stepId: workflow.currentStepId,
        status: 'APPROVED'
      }
    })
    
    if (approvals >= currentStep.requiredApprovals) {
      // 移動到下一步
      const nextStep = workflow.steps.find(s => s.order === currentStep.order + 1)
      
      if (nextStep) {
        await tx.workflow.update({
          where: { id: workflowId },
          data: { currentStepId: nextStep.id }
        })
      } else {
        // 工作流程完成
        await tx.workflow.update({
          where: { id: workflowId },
          data: { status: 'COMPLETED', completedAt: new Date() }
        })
      }
    }
    
    // 記錄審計日誌
    await tx.auditLog.create({
      data: {
        userId: user.id,
        action: 'WORKFLOW_APPROVAL',
        resourceType: 'WORKFLOW',
        resourceId: workflowId,
        details: `Approved step: ${currentStep.name}`
      }
    })
    
    revalidatePath('/workflows')
    revalidatePath(`/workflows/${workflowId}`)
    
    return { success: true }
  })
}
```

#### 文檔上傳
```typescript
'use server'
export async function uploadDocument(formData: FormData) {
  const sessionId = cookies().get('sessionId')?.value
  if (!sessionId) throw new Error('Unauthorized')
  
  const file = formData.get('file') as File
  const category = formData.get('category')
  const description = formData.get('description')
  
  if (!file) throw new Error('No file uploaded')
  
  // 驗證文件類型
  const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Invalid file type. Only PDF and Word documents are allowed.')
  }
  
  // 驗證文件大小 (10MB)
  if (file.size > 10 * 1024 * 1024) {
    throw new Error('File too large. Maximum size is 10MB.')
  }
  
  // 生成唯一文件名
  const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
  
  // 保存文件到雲存儲
  const fileUrl = await uploadToCloudStorage(file, fileName)
  
  // 保存文檔記錄到數據庫
  const document = await db.document.create({
    data: {
      fileName: file.name,
      fileUrl,
      fileSize: file.size,
      mimeType: file.type,
      category: category?.toString() || 'General',
      description: description?.toString() || '',
      uploadedBy: sessionId,
      status: 'ACTIVE'
    }
  })
  
  // 記錄審計日誌
  await db.auditLog.create({
    data: {
      userId: sessionId,
      action: 'DOCUMENT_UPLOAD',
      resourceType: 'DOCUMENT',
      resourceId: document.id,
      details: `Uploaded document: ${file.name}`
    }
  })
  
  revalidatePath('/documents')
  
  return { success: true, documentId: document.id, fileName: file.name }
}
```

## 實現模式

### 事務管理
使用數據庫事務確保數據一致性

### 錯誤處理
實現全面的錯誤處理和用戶反饋

### 驗證
在服務器端進行數據驗證

### 緩存
使用適當的緩存策略

### 安全
實現權限檢查和輸入驗證

### 審計日誌
記錄重要操作以備審計

## 最佳實踐

1. 根據業務需求設計 Server Actions
2. 實現適當的錯誤處理和用戶反饋
3. 使用事務處理複雜操作
4. 實現權限檢查和訪問控制
5. 記錄審計日誌
6. 優化性能和緩存策略
7. 測試所有邊界情況
8. 文檔化 API 和業務邏輯
