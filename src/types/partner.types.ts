import { Timestamp } from 'firebase/firestore';
import { BaseEntity } from './projects.types';

export type PartnerType =
  | 'client'
  | 'vendor'
  | 'contractor'
  | 'consultant'
  | 'investor'
  | 'strategic'
  | 'other';
export type RelationshipType =
  | 'prospect'
  | 'active'
  | 'inactive'
  | 'preferred'
  | 'blacklisted';
export type PartnerStatus = 'active' | 'inactive' | 'pending' | 'suspended';

export interface ContactInfo {
  email?: string;
  phone?: string;
  website?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
  };
}

export interface Partner extends BaseEntity {
  name: string;
  type: PartnerType;
  contactInfo: ContactInfo;
  relationship: RelationshipType;
  status: PartnerStatus;
  description?: string;
  tags: string[];
  // 關聯資料
  projectIds: string[];
  documentIds: string[];
  collaborationIds: string[];
  contractIds: string[];
  // 評級和備註
  rating?: number; // 1-5
  notes?: string;
  lastContactDate?: Date;
}

export interface Collaboration extends BaseEntity {
  title: string;
  description?: string;
  type: 'project' | 'partnership' | 'joint-venture' | 'other';
  status: 'planning' | 'active' | 'completed' | 'cancelled';
  startDate: Date;
  endDate?: Date;
  // 參與者
  partnerIds: string[];
  projectId?: string;
  // 協作詳情
  responsibilities: string[];
  deliverables: string[];
  budget?: number;
  currency?: string;
}

export interface Relationship extends BaseEntity {
  fromPartnerId: string;
  toPartnerId: string;
  type:
    | 'parent'
    | 'subsidiary'
    | 'partner'
    | 'competitor'
    | 'supplier'
    | 'customer';
  strength: 'weak' | 'medium' | 'strong';
  description?: string;
  establishedDate?: Date;
}

export type CreatePartnerData = Omit<
  Partner,
  | 'id'
  | 'createdAt'
  | 'updatedAt'
  | 'projectIds'
  | 'documentIds'
  | 'collaborationIds'
  | 'contractIds'
>;
export type UpdatePartnerData = Partial<
  Omit<Partner, 'id' | 'createdAt' | 'createdBy'>
>;
export type CreateCollaborationData = Omit<
  Collaboration,
  'id' | 'createdAt' | 'updatedAt'
>;
export type CreateRelationshipData = Omit<
  Relationship,
  'id' | 'createdAt' | 'updatedAt'
>;
