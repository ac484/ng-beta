import { BaseEntity } from './projects.types';

export type ContractStatus =
  | 'draft'
  | 'pending'
  | 'active'
  | 'completed'
  | 'cancelled'
  | 'expired';
export type ContractType =
  | 'service'
  | 'partnership'
  | 'nda'
  | 'employment'
  | 'vendor'
  | 'other';

export interface Contract extends BaseEntity {
  title: string;
  description?: string;
  type: ContractType;
  status: ContractStatus;
  startDate: Date;
  endDate?: Date;
  value?: number;
  currency?: string;
  // AI 處理結果
  extractedText?: string;
  summary?: string;
  keyTerms: string[];
  riskLevel?: 'low' | 'medium' | 'high';
  // 關聯資料
  projectId?: string;
  partnerId?: string;
  documentId?: string;
  // 提醒設定
  reminderDays?: number[];
  nextReminderDate?: Date;
}

export interface ContractMilestone extends BaseEntity {
  contractId: string;
  title: string;
  description?: string;
  dueDate: Date;
  completed: boolean;
  completedDate?: Date;
  value?: number;
}

export type CreateContractData = Omit<
  Contract,
  'id' | 'createdAt' | 'updatedAt' | 'keyTerms'
>;
export type UpdateContractData = Partial<
  Omit<Contract, 'id' | 'createdAt' | 'createdBy'>
>;
export type CreateMilestoneData = Omit<
  ContractMilestone,
  'id' | 'createdAt' | 'updatedAt'
>;
