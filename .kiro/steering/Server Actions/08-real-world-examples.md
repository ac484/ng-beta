{
  "title": "Next.js Server Actions 實際應用案例",
  "version": "Next.js 14+",
  "description": "Server Actions 在實際項目中的應用案例，包括博客系統、電商平台、社交媒體和企業應用",
  "metadata": {
    "category": "Real World Examples",
    "complexity": "Medium",
    "usage": "實際項目應用、最佳實踐參考、架構設計、代碼實現",
    "lastmod": "2025-01-17"
  },
  "content": {
    "blog_platform": {
      "description": "博客平台的 Server Actions 實現",
      "features": {
        "post_management": "文章的創建、編輯、刪除",
        "comment_system": "評論系統",
        "user_management": "用戶管理",
        "content_moderation": "內容審核"
      },
      "examples": {
        "post_creation": "'use server'\nexport async function createPost(formData: FormData) {\n  const sessionId = cookies().get('sessionId')?.value\n  if (!sessionId) throw new Error('Unauthorized')\n  \n  const session = await db.session.findUnique({\n    where: { id: sessionId },\n    include: { user: true }\n  })\n  if (!session) throw new Error('Invalid session')\n  \n  const title = formData.get('title')\n  const content = formData.get('content')\n  const category = formData.get('category')\n  const tags = formData.getAll('tags')\n  \n  if (!title || !content) {\n    throw new Error('Title and content are required')\n  }\n  \n  // 創建文章\n  const post = await db.post.create({\n    data: {\n      title: title.toString(),\n      content: content.toString(),\n      category: category?.toString() || 'General',\n      authorId: session.user.id,\n      tags: {\n        create: tags.map(tag => ({ name: tag.toString() }))\n      }\n    }\n  })\n  \n  revalidatePath('/posts')\n  revalidatePath(`/posts/${post.id}`)\n  \n  return { success: true, postId: post.id }\n}",
        "comment_system": "'use server'\nexport async function addComment(postId: string, formData: FormData) {\n  const sessionId = cookies().get('sessionId')?.value\n  if (!sessionId) throw new Error('Unauthorized')\n  \n  const content = formData.get('content')\n  if (!content || content.toString().trim().length < 3) {\n    throw new Error('Comment must be at least 3 characters')\n  }\n  \n  const comment = await db.comment.create({\n    data: {\n      content: content.toString(),\n      postId,\n      authorId: sessionId\n    }\n  })\n  \n  revalidatePath(`/posts/${postId}`)\n  \n  return { success: true, comment }\n}"
      }
    },
    "e_commerce_platform": {
      "description": "電商平台的 Server Actions 實現",
      "features": {
        "product_management": "產品管理",
        "order_processing": "訂單處理",
        "inventory_management": "庫存管理",
        "payment_integration": "支付集成"
      },
      "examples": {
        "order_creation": "'use server'\nexport async function createOrder(formData: FormData) {\n  const sessionId = cookies().get('sessionId')?.value\n  if (!sessionId) throw new Error('Unauthorized')\n  \n  const cartItems = JSON.parse(formData.get('cartItems') as string)\n  const shippingAddress = JSON.parse(formData.get('shippingAddress') as string)\n  const paymentMethod = formData.get('paymentMethod')\n  \n  if (!cartItems || cartItems.length === 0) {\n    throw new Error('Cart is empty')\n  }\n  \n  return await db.$transaction(async (tx) => {\n    // 檢查庫存\n    for (const item of cartItems) {\n      const product = await tx.product.findUnique({\n        where: { id: item.productId },\n        select: { stock: true, price: true }\n      })\n      \n      if (!product || product.stock < item.quantity) {\n        throw new Error(`Insufficient stock for product ${item.productId}`)\n      }\n    }\n    \n    // 計算總價\n    const total = cartItems.reduce((sum, item) => {\n      const product = cartItems.find(p => p.id === item.productId)\n      return sum + (product.price * item.quantity)\n    }, 0)\n    \n    // 創建訂單\n    const order = await tx.order.create({\n      data: {\n        userId: sessionId,\n        total,\n        status: 'PENDING',\n        shippingAddress,\n        paymentMethod: paymentMethod?.toString() || 'CREDIT_CARD',\n        items: {\n          create: cartItems.map(item => ({\n            productId: item.productId,\n            quantity: item.quantity,\n            price: item.price\n          }))\n        }\n      }\n    })\n    \n    // 更新庫存\n    for (const item of cartItems) {\n      await tx.product.update({\n        where: { id: item.productId },\n        data: { stock: { decrement: item.quantity } }\n      })\n    }\n    \n    // 清空購物車\n    await tx.cartItem.deleteMany({\n      where: { userId: sessionId }\n    })\n    \n    return { success: true, orderId: order.id }\n  })\n}",
        "inventory_update": "'use server'\nexport async function updateInventory(productId: string, formData: FormData) {\n  const sessionId = cookies().get('sessionId')?.value\n  if (!sessionId) throw new Error('Unauthorized')\n  \n  const user = await db.user.findUnique({\n    where: { id: sessionId },\n    select: { role: true }\n  })\n  \n  if (user?.role !== 'ADMIN') {\n    throw new Error('Insufficient permissions')\n  }\n  \n  const stock = Number(formData.get('stock'))\n  const price = Number(formData.get('price'))\n  \n  if (isNaN(stock) || stock < 0) {\n    throw new Error('Invalid stock quantity')\n  }\n  \n  if (isNaN(price) || price < 0) {\n    throw new Error('Invalid price')\n  }\n  \n  const product = await db.product.update({\n    where: { id: productId },\n    data: { stock, price }\n  })\n  \n  revalidatePath('/admin/products')\n  revalidatePath(`/products/${productId}`)\n  \n  return { success: true, product }\n}"
      }
    },
    "social_media_platform": {
      "description": "社交媒體平台的 Server Actions 實現",
      "features": {
        "post_sharing": "分享帖子",
        "user_interactions": "用戶互動（點讚、評論、分享）",
        "friend_system": "好友系統",
        "notification_system": "通知系統"
      },
      "examples": {
        "post_interaction": "'use server'\nexport async function toggleLike(postId: string) {\n  const sessionId = cookies().get('sessionId')?.value\n  if (!sessionId) throw new Error('Unauthorized')\n  \n  const existingLike = await db.like.findFirst({\n    where: {\n      postId,\n      userId: sessionId\n    }\n  })\n  \n  if (existingLike) {\n    // 取消點讚\n    await db.like.delete({\n      where: { id: existingLike.id }\n    })\n    \n    // 減少點讚數\n    await db.post.update({\n      where: { id: postId },\n      data: { likeCount: { decrement: 1 } }\n    })\n    \n    revalidatePath(`/posts/${postId}`)\n    return { liked: false }\n  } else {\n    // 添加點讚\n    await db.like.create({\n      data: {\n        postId,\n        userId: sessionId\n      }\n    })\n    \n    // 增加點讚數\n    await db.post.update({\n      where: { id: postId },\n      data: { likeCount: { increment: 1 } }\n    })\n    \n    // 發送通知\n    const post = await db.post.findUnique({\n      where: { id: postId },\n      include: { author: true }\n    })\n    \n    if (post && post.author.id !== sessionId) {\n      await db.notification.create({\n        data: {\n          userId: post.author.id,\n          type: 'LIKE',\n          message: `Someone liked your post "${post.title}"`,\n          relatedId: postId\n        }\n      })\n    }\n    \n    revalidatePath(`/posts/${postId}`)\n    return { liked: true }\n  }\n}",
        "friend_request": "'use server'\nexport async function sendFriendRequest(targetUserId: string) {\n  const sessionId = cookies().get('sessionId')?.value\n  if (!sessionId) throw new Error('Unauthorized')\n  \n  if (sessionId === targetUserId) {\n    throw new Error('Cannot send friend request to yourself')\n  }\n  \n  // 檢查是否已經是好友\n  const existingFriendship = await db.friendship.findFirst({\n    where: {\n      OR: [\n        { userId: sessionId, friendId: targetUserId },\n        { userId: targetUserId, friendId: sessionId }\n      ]\n    }\n  })\n  \n  if (existingFriendship) {\n    throw new Error('Friendship already exists')\n  }\n  \n  // 檢查是否已經發送過請求\n  const existingRequest = await db.friendRequest.findFirst({\n    where: {\n      fromUserId: sessionId,\n      toUserId: targetUserId,\n      status: 'PENDING'\n    }\n  })\n  \n  if (existingRequest) {\n    throw new Error('Friend request already sent')\n  }\n  \n  // 發送好友請求\n  const request = await db.friendRequest.create({\n    data: {\n      fromUserId: sessionId,\n      toUserId: targetUserId,\n      status: 'PENDING'\n    }\n  })\n  \n  // 發送通知\n  await db.notification.create({\n    data: {\n      userId: targetUserId,\n      type: 'FRIEND_REQUEST',\n      message: 'You have a new friend request',\n      relatedId: request.id\n    }\n  })\n  \n  revalidatePath('/friends')\n  \n  return { success: true, requestId: request.id }\n}"
      }
    },
    "enterprise_application": {
      "description": "企業應用的 Server Actions 實現",
      "features": {
        "workflow_management": "工作流程管理",
        "document_management": "文檔管理",
        "reporting_system": "報告系統",
        "audit_trail": "審計追蹤"
      },
      "examples": {
        "workflow_approval": "'use server'\nexport async function approveWorkflow(workflowId: string, formData: FormData) {\n  const sessionId = cookies().get('sessionId')?.value\n  if (!sessionId) throw new Error('Unauthorized')\n  \n  const user = await db.user.findUnique({\n    where: { id: sessionId },\n    include: { role: true, permissions: true }\n  })\n  \n  if (!user) throw new Error('User not found')\n  \n  const workflow = await db.workflow.findUnique({\n    where: { id: workflowId },\n    include: { steps: true, currentStep: true }\n  })\n  \n  if (!workflow) throw new Error('Workflow not found')\n  \n  // 檢查用戶是否有權限審批當前步驟\n  const currentStep = workflow.steps.find(s => s.id === workflow.currentStepId)\n  if (!currentStep || !currentStep.approvers.includes(user.id)) {\n    throw new Error('Insufficient permissions to approve this step')\n  }\n  \n  const comment = formData.get('comment')?.toString() || ''\n  \n  return await db.$transaction(async (tx) => {\n    // 記錄審批\n    await tx.approval.create({\n      data: {\n        workflowId,\n        stepId: workflow.currentStepId,\n        approverId: user.id,\n        status: 'APPROVED',\n        comment,\n        timestamp: new Date()\n      }\n    })\n    \n    // 檢查是否所有審批人都已審批\n    const approvals = await tx.approval.count({\n      where: {\n        stepId: workflow.currentStepId,\n        status: 'APPROVED'\n      }\n    })\n    \n    if (approvals >= currentStep.requiredApprovals) {\n      // 移動到下一步\n      const nextStep = workflow.steps.find(s => s.order === currentStep.order + 1)\n      \n      if (nextStep) {\n        await tx.workflow.update({\n          where: { id: workflowId },\n          data: { currentStepId: nextStep.id }\n        })\n      } else {\n        // 工作流程完成\n        await tx.workflow.update({\n          where: { id: workflowId },\n          data: { status: 'COMPLETED', completedAt: new Date() }\n        })\n      }\n    }\n    \n    // 記錄審計日誌\n    await tx.auditLog.create({\n      data: {\n        userId: user.id,\n        action: 'WORKFLOW_APPROVAL',\n        resourceType: 'WORKFLOW',\n        resourceId: workflowId,\n        details: `Approved step: ${currentStep.name}`\n      }\n    })\n    \n    revalidatePath('/workflows')\n    revalidatePath(`/workflows/${workflowId}`)\n    \n    return { success: true }\n  })\n}",
        "document_upload": "'use server'\nexport async function uploadDocument(formData: FormData) {\n  const sessionId = cookies().get('sessionId')?.value\n  if (!sessionId) throw new Error('Unauthorized')\n  \n  const file = formData.get('file') as File\n  const category = formData.get('category')\n  const description = formData.get('description')\n  \n  if (!file) throw new Error('No file uploaded')\n  \n  // 驗證文件類型\n  const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']\n  if (!allowedTypes.includes(file.type)) {\n    throw new Error('Invalid file type. Only PDF and Word documents are allowed.')\n  }\n  \n  // 驗證文件大小 (10MB)\n  if (file.size > 10 * 1024 * 1024) {\n    throw new Error('File too large. Maximum size is 10MB.')\n  }\n  \n  // 生成唯一文件名\n  const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`\n  \n  // 保存文件到雲存儲\n  const fileUrl = await uploadToCloudStorage(file, fileName)\n  \n  // 保存文檔記錄到數據庫\n  const document = await db.document.create({\n    data: {\n      fileName: file.name,\n      fileUrl,\n      fileSize: file.size,\n      mimeType: file.type,\n      category: category?.toString() || 'General',\n      description: description?.toString() || '',\n      uploadedBy: sessionId,\n      status: 'ACTIVE'\n    }\n  })\n  \n  // 記錄審計日誌\n  await db.auditLog.create({\n    data: {\n      userId: sessionId,\n      action: 'DOCUMENT_UPLOAD',\n      resourceType: 'DOCUMENT',\n      resourceId: document.id,\n      details: `Uploaded document: ${file.name}`\n    }\n  })\n  \n  revalidatePath('/documents')\n  \n  return { success: true, documentId: document.id, fileName: file.name }\n}"
      }
    }
  },
  "implementation_patterns": {
    "transaction_management": "使用數據庫事務確保數據一致性",
    "error_handling": "實現全面的錯誤處理和用戶反饋",
    "validation": "在服務器端進行數據驗證",
    "caching": "使用適當的緩存策略",
    "security": "實現權限檢查和輸入驗證",
    "audit_logging": "記錄重要操作以備審計"
  },
  "best_practices": [
    "根據業務需求設計 Server Actions",
    "實現適當的錯誤處理和用戶反饋",
    "使用事務處理複雜操作",
    "實現權限檢查和訪問控制",
    "記錄審計日誌",
    "優化性能和緩存策略",
    "測試所有邊界情況",
    "文檔化 API 和業務邏輯"
  ]
}
