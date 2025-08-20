import { z } from 'zod';

export const contractCreateSchema = z.object({
  title: z.string().min(1, '合約標題為必填').max(100, '標題不能超過100字元'),
  description: z.string().max(1000, '描述不能超過1000字元').optional(),
  type: z
    .enum(['service', 'partnership', 'nda', 'employment', 'vendor', 'other'])
    .default('service'),
  status: z
    .enum(['draft', 'pending', 'active', 'completed', 'cancelled', 'expired'])
    .default('draft'),
  startDate: z.date(),
  endDate: z.date().optional(),
  value: z.number().min(0).optional(),
  currency: z.string().length(3).optional(), // ISO 4217 currency code
  projectId: z.string().optional(),
  partnerId: z.string().optional(),
  documentId: z.string().optional(),
  reminderDays: z.array(z.number().min(1)).default([30, 7, 1]) // 提前幾天提醒
});

export const contractUpdateSchema = contractCreateSchema.partial();

export const contractMilestoneCreateSchema = z.object({
  contractId: z.string().min(1, '合約ID為必填'),
  title: z.string().min(1, '里程碑標題為必填').max(100, '標題不能超過100字元'),
  description: z.string().max(500, '描述不能超過500字元').optional(),
  dueDate: z.date(),
  completed: z.boolean().default(false),
  completedDate: z.date().optional(),
  value: z.number().min(0).optional()
});

export const contractMilestoneUpdateSchema = contractMilestoneCreateSchema
  .partial()
  .omit({ contractId: true });

// AI 分析結果的 schema
export const contractAnalysisSchema = z.object({
  extractedText: z.string().optional(),
  summary: z.string().max(2000).optional(),
  keyTerms: z.array(z.string()).default([]),
  riskLevel: z.enum(['low', 'medium', 'high']).optional(),
  suggestedActions: z.array(z.string()).default([]),
  importantDates: z
    .array(
      z.object({
        date: z.date(),
        description: z.string(),
        type: z.enum(['start', 'end', 'milestone', 'reminder'])
      })
    )
    .default([])
});

export type ContractCreateInput = z.infer<typeof contractCreateSchema>;
export type ContractUpdateInput = z.infer<typeof contractUpdateSchema>;
export type ContractMilestoneCreateInput = z.infer<
  typeof contractMilestoneCreateSchema
>;
export type ContractMilestoneUpdateInput = z.infer<
  typeof contractMilestoneUpdateSchema
>;
export type ContractAnalysisInput = z.infer<typeof contractAnalysisSchema>;
