import { z } from 'zod';

export const projectCreateSchema = z.object({
  title: z.string().min(1, '專案標題為必填').max(100, '標題不能超過100字元'),
  description: z
    .string()
    .min(1, '專案描述為必填')
    .max(1000, '描述不能超過1000字元'),
  status: z
    .enum(['planning', 'active', 'on-hold', 'completed', 'cancelled'])
    .default('planning'),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  startDate: z.date(),
  endDate: z.date().optional(),
  progress: z.number().min(0).max(100).default(0),
  tags: z.array(z.string()).default([]),
  partnerId: z.string().optional()
});

export const projectUpdateSchema = projectCreateSchema.partial();

export const taskCreateSchema = z.object({
  title: z.string().min(1, '任務標題為必填').max(100, '標題不能超過100字元'),
  description: z.string().max(500, '描述不能超過500字元').optional(),
  status: z.enum(['todo', 'in-progress', 'completed']).default('todo'),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  dueDate: z.date().optional(),
  assignedTo: z.string().optional(),
  projectId: z.string().min(1, '專案ID為必填')
});

export const taskUpdateSchema = taskCreateSchema
  .partial()
  .omit({ projectId: true });

export const subtaskCreateSchema = z.object({
  title: z.string().min(1, '子任務標題為必填').max(100, '標題不能超過100字元'),
  description: z.string().max(300, '描述不能超過300字元').optional(),
  completed: z.boolean().default(false),
  taskId: z.string().min(1, '任務ID為必填'),
  aiGenerated: z.boolean().default(false)
});

export const subtaskUpdateSchema = subtaskCreateSchema
  .partial()
  .omit({ taskId: true });

export type ProjectCreateInput = z.infer<typeof projectCreateSchema>;
export type ProjectUpdateInput = z.infer<typeof projectUpdateSchema>;
export type TaskCreateInput = z.infer<typeof taskCreateSchema>;
export type TaskUpdateInput = z.infer<typeof taskUpdateSchema>;
export type SubtaskCreateInput = z.infer<typeof subtaskCreateSchema>;
export type SubtaskUpdateInput = z.infer<typeof subtaskUpdateSchema>;
