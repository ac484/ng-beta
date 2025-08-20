{
  "title": "Next.js Server Actions 表單處理",
  "version": "Next.js 14+",
  "description": "使用 Server Actions 處理各種表單場景，包括複雜表單、文件上傳、多步驟表單和表單驗證",
  "metadata": {
    "category": "Form Handling",
    "complexity": "Medium",
    "usage": "表單提交、數據收集、文件上傳、表單驗證、用戶輸入處理",
    "lastmod": "2025-01-17"
  },
  "content": {
    "basic_form_submission": {
      "description": "基本的表單提交和處理",
      "patterns": {
        "form_action": "使用 form action 屬性綁定 Server Action",
        "formData": "通過 FormData 獲取表單數據",
        "progressive_enhancement": "即使 JavaScript 被禁用也能正常工作"
      },
      "example": {
        "server_action": "'use server'\n\nexport async function handleContactForm(formData: FormData) {\n  const name = formData.get('name')\n  const email = formData.get('email')\n  const message = formData.get('message')\n  \n  // 驗證\n  if (!name || !email || !message) {\n    throw new Error('All fields are required')\n  }\n  \n  // 發送郵件或保存到數據庫\n  await sendContactEmail({\n    name: name.toString(),\n    email: email.toString(),\n    message: message.toString()\n  })\n  \n  redirect('/thank-you')\n}",
        "client_form": "<form action={handleContactForm}>\n  <div>\n    <label htmlFor='name'>Name:</label>\n    <input type='text' id='name' name='name' required />\n  </div>\n  <div>\n    <label htmlFor='email'>Email:</label>\n    <input type='email' id='email' name='email' required />\n  </div>\n  <div>\n    <label htmlFor='message'>Message:</label>\n    <textarea id='message' name='message' required />\n  </div>\n  <button type='submit'>Send Message</button>\n</form>"
      }
    },
    "file_upload": {
      "description": "處理文件上傳的 Server Action",
      "implementation": {
        "file_handling": "使用 FormData 處理文件上傳",
        "validation": "驗證文件類型和大小",
        "storage": "保存文件到本地或雲存儲"
      },
      "example": "'use server'\n\nexport async function uploadFile(formData: FormData) {\n  const file = formData.get('file') as File\n  \n  if (!file) {\n    throw new Error('No file uploaded')\n  }\n  \n  // 驗證文件類型\n  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif']\n  if (!allowedTypes.includes(file.type)) {\n    throw new Error('Invalid file type')\n  }\n  \n  // 驗證文件大小 (5MB)\n  if (file.size > 5 * 1024 * 1024) {\n    throw new Error('File too large')\n  }\n  \n  // 保存文件\n  const bytes = await file.arrayBuffer()\n  const buffer = Buffer.from(bytes)\n  \n  const fileName = `${Date.now()}-${file.name}`\n  const filePath = path.join(process.cwd(), 'uploads', fileName)\n  \n  await fs.writeFile(filePath, buffer)\n  \n  return { success: true, fileName }\n}"
    },
    "multi_step_forms": {
      "description": "處理多步驟表單的複雜場景",
      "patterns": {
        "state_management": "使用 URL 參數或會話管理表單狀態",
        "step_validation": "每步進行驗證，只有通過才能進入下一步",
        "data_persistence": "在步驟間保持已輸入的數據"
      },
      "example": "'use server'\n\nexport async function handleStep1(formData: FormData) {\n  const personalInfo = {\n    firstName: formData.get('firstName'),\n    lastName: formData.get('lastName'),\n    email: formData.get('email')\n  }\n  \n  // 驗證第一步\n  if (!personalInfo.firstName || !personalInfo.lastName || !personalInfo.email) {\n    throw new Error('All personal information fields are required')\n  }\n  \n  // 保存到會話或臨時存儲\n  await saveToSession('step1', personalInfo)\n  \n  redirect('/form/step2')\n}\n\nexport async function handleStep2(formData: FormData) {\n  const addressInfo = {\n    street: formData.get('street'),\n    city: formData.get('city'),\n    zipCode: formData.get('zipCode')\n  }\n  \n  // 獲取第一步的數據\n  const personalInfo = await getFromSession('step1')\n  \n  // 合併並保存所有數據\n  const completeData = { ...personalInfo, ...addressInfo }\n  await saveToDatabase(completeData)\n  \n  redirect('/form/complete')\n}"
    },
    "form_validation": {
      "description": "實現客戶端和服務器端的表單驗證",
      "approaches": {
        "client_validation": "使用 HTML5 驗證屬性和 JavaScript 驗證",
        "server_validation": "在 Server Action 中進行最終驗證",
        "real_time_validation": "使用 useFormState 實現實時驗證"
      },
      "example": "import { useFormState } from 'react-dom'\nimport { createPost } from './actions'\n\nconst initialState = {\n  message: null,\n  errors: {}\n}\n\nfunction PostForm() {\n  const [state, formAction] = useFormState(createPost, initialState)\n  \n  return (\n    <form action={formAction}>\n      <div>\n        <label htmlFor='title'>Title:</label>\n        <input \n          type='text' \n          id='title' \n          name='title' \n          required \n          aria-describedby='title-error'\n        />\n        {state.errors?.title && (\n          <div id='title-error' className='error'>\n            {state.errors.title}\n          </div>\n        )}\n      </div>\n      \n      <div>\n        <label htmlFor='content'>Content:</label>\n        <textarea \n          id='content' \n          name='content' \n          required \n          aria-describedby='content-error'\n        />\n        {state.errors?.content && (\n          <div id='content-error' className='error'>\n            {state.errors.content}\n          </div>\n        )}\n      </div>\n      \n      <button type='submit'>Create Post</button>\n      \n      {state.message && (\n        <div className='message'>{state.message}</div>\n      )}\n    </form>\n  )\n}"
    }
  },
  "best_practices": [
    "使用 HTML5 驗證屬性提供基本驗證",
    "在服務器端進行最終驗證",
    "提供清晰的錯誤消息和用戶反饋",
    "實現漸進式增強，確保無 JavaScript 環境下也能工作",
    "使用適當的 ARIA 屬性提升可訪問性",
    "考慮表單的用戶體驗和流程設計"
  ],
  "common_patterns": {
    "contact_forms": "聯繫表單、反饋表單",
    "registration_forms": "用戶註冊、登錄表單",
    "data_entry_forms": "數據輸入、編輯表單",
    "file_upload_forms": "文件上傳、圖片上傳",
    "search_forms": "搜索、過濾表單"
  }
}
