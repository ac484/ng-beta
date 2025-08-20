export interface Contact {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
}

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  status: 'Completed' | 'Pending' | 'Failed';
  description: string;
}

export interface ComplianceDocument {
  id: string;
  name: string;
  status: 'Valid' | 'Expiring Soon' | 'Expired';
  expiryDate: string;
  fileUrl: string;
}

export interface PerformanceReview {
    id: string;
    date: string;
    rating: number; // 1-5
    notes: string;
    reviewer: string;
}

export interface Contract {
    id: string;
    title: string;
    startDate: string;
    endDate: string;
    status: 'Active' | 'Expired' | 'Terminated';
    fileUrl: string;
}

export interface Partner {
  id?: string;
  name: string;
  logoUrl: string;
  category: 'Technology' | 'Reseller' | 'Service' | 'Consulting' | 'Subcontractor' | 'Supplier' | 'Equipment';
  status: 'Active' | 'Inactive' | 'Pending';
  overview: string;
  website: string;
  contacts: Contact[];
  transactions: Transaction[];
  joinDate: string;
  performanceReviews: PerformanceReview[];
  complianceDocuments: ComplianceDocument[];
  contracts: Contract[];
}

export type WorkflowNode = {
  id: string;
  type: 'start' | 'end' | 'task' | 'decision';
  label: string;
  position: { x: number; y: number };
};

export type WorkflowEdge = {
  id: string;
  source: string;
  target: string;
  label?: string;
};

export type Workflow = {
  id?: string;
  name: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  partnerId?: string;
};
