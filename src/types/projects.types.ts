import { Timestamp } from 'firebase/firestore';

export type ProjectStatus =
  | 'planning'
  | 'active'
  | 'on-hold'
  | 'completed'
  | 'cancelled';
export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export interface BaseEntity {
  id: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy: string;
  updatedBy: string;
}

export interface Project extends BaseEntity {
  title: string;
  description: string;
  status: ProjectStatus;
  priority: Priority;
  startDate: Date;
  endDate?: Date;
  progress: number;
  tags: string[];
  // 關聯資料
  partnerId?: string;
  documentIds: string[];
  taskIds: string[];
  contractIds: string[];
}

export interface Task extends BaseEntity {
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'completed';
  priority: Priority;
  dueDate?: Date;
  assignedTo?: string;
  projectId: string;
  subtaskIds: string[];
}

export interface Subtask extends BaseEntity {
  title: string;
  description?: string;
  completed: boolean;
  taskId: string;
  aiGenerated?: boolean;
}

export type CreateProjectData = Omit<
  Project,
  'id' | 'createdAt' | 'updatedAt' | 'documentIds' | 'taskIds' | 'contractIds'
>;
export type UpdateProjectData = Partial<
  Omit<Project, 'id' | 'createdAt' | 'createdBy'>
>;
export type CreateTaskData = Omit<
  Task,
  'id' | 'createdAt' | 'updatedAt' | 'subtaskIds'
>;
export type CreateSubtaskData = Omit<Subtask, 'id' | 'createdAt' | 'updatedAt'>;
