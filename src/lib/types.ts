export type TaskStatus = 'Pending' | 'In Progress' | 'Completed';

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  lastUpdated: string;
  subTasks: Task[];
  value: number; // This will now be calculated as quantity * unitPrice
  quantity: number;
  unitPrice: number;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  tasks: Task[];
  value: number;
}
