import { z } from 'zod';

export const documentCreateSchema = z.object({
  originalName: z.string().min(1, '檔案名稱為必填'),
  type: z
    .enum([
      'contract',
      'proposal',
      'report',
      'presentation',
      'image',
      'spreadsheet',
      'other'
    ])
    .optional(),
  projectId: z.string().optional(),
  partnerId: z.string().optional(),
  contractId: z.string().optional(),
  tags: z.array(z.string()).default([]),
  description: z.string().max(1000, '描述不能超過1000字元').optional(),
  isPublic: z.boolean().default(false)
});

export const documentUpdateSchema = z.object({
  type: z
    .enum([
      'contract',
      'proposal',
      'report',
      'presentation',
      'image',
      'spreadsheet',
      'other'
    ])
    .optional(),
  projectId: z.string().optional(),
  partnerId: z.string().optional(),
  contractId: z.string().optional(),
  tags: z.array(z.string()).optional(),
  description: z.string().max(1000, '描述不能超過1000字元').optional(),
  isPublic: z.boolean().optional()
});

export const documentShareCreateSchema = z.object({
  documentId: z.string().min(1, '文件ID為必填'),
  sharedWith: z.string().min(1, '分享對象為必填'), // userId or email
  permissions: z.enum(['view', 'edit', 'admin']).default('view'),
  expiresAt: z.date().optional()
});

export const documentShareUpdateSchema = documentShareCreateSchema
  .partial()
  .omit({
    documentId: true,
    sharedWith: true
  });

// 檔案上傳驗證
export const fileUploadSchema = z
  .object({
    file: z.instanceof(File, '請選擇一個檔案'),
    maxSize: z.number().default(10 * 1024 * 1024), // 10MB
    allowedTypes: z
      .array(z.string())
      .default([
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'image/jpeg',
        'image/png',
        'image/gif',
        'text/plain'
      ])
  })
  .refine((data) => data.file.size <= data.maxSize, {
    message: '檔案大小不能超過10MB',
    path: ['file']
  })
  .refine((data) => data.allowedTypes.includes(data.file.type), {
    message: '不支援的檔案類型',
    path: ['file']
  });

// AI 處理結果的 schema
export const documentAnalysisSchema = z.object({
  extractedText: z.string().optional(),
  summary: z.string().max(2000).optional(),
  keywords: z.array(z.string()).default([]),
  entities: z
    .array(
      z.object({
        type: z.enum([
          'person',
          'organization',
          'location',
          'date',
          'money',
          'other'
        ]),
        text: z.string(),
        confidence: z.number().min(0).max(1)
      })
    )
    .default([]),
  processingStatus: z
    .enum(['pending', 'processing', 'completed', 'failed'])
    .default('pending'),
  language: z.string().optional(),
  pageCount: z.number().min(1).optional(),
  wordCount: z.number().min(0).optional()
});

// 文件搜尋和篩選的 schema
export const documentSearchSchema = z.object({
  query: z.string().optional(),
  type: z
    .enum([
      'contract',
      'proposal',
      'report',
      'presentation',
      'image',
      'spreadsheet',
      'other'
    ])
    .optional(),
  projectId: z.string().optional(),
  partnerId: z.string().optional(),
  contractId: z.string().optional(),
  tags: z.array(z.string()).optional(),
  isPublic: z.boolean().optional(),
  processingStatus: z
    .enum(['pending', 'processing', 'completed', 'failed'])
    .optional(),
  dateRange: z
    .object({
      from: z.date().optional(),
      to: z.date().optional()
    })
    .optional(),
  sizeRange: z
    .object({
      min: z.number().min(0).optional(),
      max: z.number().min(0).optional()
    })
    .optional(),
  sortBy: z
    .enum(['originalName', 'createdAt', 'updatedAt', 'size'])
    .default('updatedAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  limit: z.number().min(1).max(100).default(20),
  offset: z.number().min(0).default(0)
});

export type DocumentCreateInput = z.infer<typeof documentCreateSchema>;
export type DocumentUpdateInput = z.infer<typeof documentUpdateSchema>;
export type DocumentShareCreateInput = z.infer<
  typeof documentShareCreateSchema
>;
export type DocumentShareUpdateInput = z.infer<
  typeof documentShareUpdateSchema
>;
export type FileUploadInput = z.infer<typeof fileUploadSchema>;
export type DocumentAnalysisInput = z.infer<typeof documentAnalysisSchema>;
export type DocumentSearchInput = z.infer<typeof documentSearchSchema>;
