import { BaseEntity } from './projects.types';

export type DocumentType =
  | 'contract'
  | 'proposal'
  | 'report'
  | 'presentation'
  | 'image'
  | 'spreadsheet'
  | 'other';
export type ProcessingStatus =
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed';

export interface ExtractedEntity {
  type: 'person' | 'organization' | 'location' | 'date' | 'money' | 'other';
  text: string;
  confidence: number;
}

export interface Document extends BaseEntity {
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  type?: DocumentType;
  // AI 處理結果
  extractedText?: string;
  summary?: string;
  keywords: string[];
  entities: ExtractedEntity[];
  processingStatus: ProcessingStatus;
  // 關聯資料
  projectId?: string;
  partnerId?: string;
  contractId?: string;
  // 元數據
  tags: string[];
  description?: string;
  version?: number;
  isPublic?: boolean;
}

export interface DocumentVersion extends BaseEntity {
  documentId: string;
  version: number;
  filename: string;
  url: string;
  size: number;
  changeLog?: string;
}

export interface DocumentShare extends BaseEntity {
  documentId: string;
  sharedWith: string; // userId or email
  permissions: 'view' | 'edit' | 'admin';
  expiresAt?: Date;
  accessCount: number;
  lastAccessedAt?: Date;
}

export type CreateDocumentData = Omit<
  Document,
  | 'id'
  | 'createdAt'
  | 'updatedAt'
  | 'keywords'
  | 'entities'
  | 'processingStatus'
>;
export type UpdateDocumentData = Partial<
  Omit<Document, 'id' | 'createdAt' | 'createdBy'>
>;
export type CreateDocumentVersionData = Omit<
  DocumentVersion,
  'id' | 'createdAt' | 'updatedAt'
>;
export type CreateDocumentShareData = Omit<
  DocumentShare,
  'id' | 'createdAt' | 'updatedAt' | 'accessCount'
>;
