import { z } from 'zod';

const contactInfoSchema = z.object({
  email: z.string().email('請輸入有效的電子郵件').optional(),
  phone: z.string().max(20, '電話號碼不能超過20字元').optional(),
  website: z.string().url('請輸入有效的網址').optional(),
  address: z
    .object({
      street: z.string().max(100).optional(),
      city: z.string().max(50).optional(),
      state: z.string().max(50).optional(),
      country: z.string().max(50).optional(),
      zipCode: z.string().max(20).optional()
    })
    .optional()
});

export const partnerCreateSchema = z.object({
  name: z.string().min(1, '夥伴名稱為必填').max(100, '名稱不能超過100字元'),
  type: z
    .enum([
      'client',
      'vendor',
      'contractor',
      'consultant',
      'investor',
      'strategic',
      'other'
    ])
    .default('client'),
  contactInfo: contactInfoSchema.default({}),
  relationship: z
    .enum(['prospect', 'active', 'inactive', 'preferred', 'blacklisted'])
    .default('prospect'),
  status: z
    .enum(['active', 'inactive', 'pending', 'suspended'])
    .default('active'),
  description: z.string().max(1000, '描述不能超過1000字元').optional(),
  tags: z.array(z.string()).default([]),
  rating: z.number().min(1).max(5).optional(),
  notes: z.string().max(2000, '備註不能超過2000字元').optional(),
  lastContactDate: z.date().optional()
});

export const partnerUpdateSchema = partnerCreateSchema.partial();

export const collaborationCreateSchema = z.object({
  title: z.string().min(1, '協作標題為必填').max(100, '標題不能超過100字元'),
  description: z.string().max(1000, '描述不能超過1000字元').optional(),
  type: z
    .enum(['project', 'partnership', 'joint-venture', 'other'])
    .default('project'),
  status: z
    .enum(['planning', 'active', 'completed', 'cancelled'])
    .default('planning'),
  startDate: z.date(),
  endDate: z.date().optional(),
  partnerIds: z.array(z.string()).min(1, '至少需要一個合作夥伴'),
  projectId: z.string().optional(),
  responsibilities: z.array(z.string()).default([]),
  deliverables: z.array(z.string()).default([]),
  budget: z.number().min(0).optional(),
  currency: z.string().length(3).optional()
});

export const collaborationUpdateSchema = collaborationCreateSchema.partial();

export const relationshipCreateSchema = z.object({
  fromPartnerId: z.string().min(1, '來源夥伴ID為必填'),
  toPartnerId: z.string().min(1, '目標夥伴ID為必填'),
  type: z
    .enum([
      'parent',
      'subsidiary',
      'partner',
      'competitor',
      'supplier',
      'customer'
    ])
    .default('partner'),
  strength: z.enum(['weak', 'medium', 'strong']).default('medium'),
  description: z.string().max(500, '描述不能超過500字元').optional(),
  establishedDate: z.date().optional()
});

export const relationshipUpdateSchema = relationshipCreateSchema
  .partial()
  .omit({
    fromPartnerId: true,
    toPartnerId: true
  });

// 夥伴搜尋和篩選的 schema
export const partnerSearchSchema = z.object({
  query: z.string().optional(),
  type: z
    .enum([
      'client',
      'vendor',
      'contractor',
      'consultant',
      'investor',
      'strategic',
      'other'
    ])
    .optional(),
  status: z.enum(['active', 'inactive', 'pending', 'suspended']).optional(),
  relationship: z
    .enum(['prospect', 'active', 'inactive', 'preferred', 'blacklisted'])
    .optional(),
  tags: z.array(z.string()).optional(),
  rating: z
    .object({
      min: z.number().min(1).max(5).optional(),
      max: z.number().min(1).max(5).optional()
    })
    .optional(),
  sortBy: z
    .enum(['name', 'createdAt', 'updatedAt', 'rating', 'lastContactDate'])
    .default('updatedAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  limit: z.number().min(1).max(100).default(20),
  offset: z.number().min(0).default(0)
});

export type PartnerCreateInput = z.infer<typeof partnerCreateSchema>;
export type PartnerUpdateInput = z.infer<typeof partnerUpdateSchema>;
export type CollaborationCreateInput = z.infer<
  typeof collaborationCreateSchema
>;
export type CollaborationUpdateInput = z.infer<
  typeof collaborationUpdateSchema
>;
export type RelationshipCreateInput = z.infer<typeof relationshipCreateSchema>;
export type RelationshipUpdateInput = z.infer<typeof relationshipUpdateSchema>;
export type PartnerSearchInput = z.infer<typeof partnerSearchSchema>;
