export type UserRole = 'business' | 'approver' | 'finance' | 'admin';
export type ApproverLevel = 'sales_head' | 'sbu_head' | 'president' | 'ceo';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  approverLevel?: ApproverLevel;
  department: string;
  isActive: boolean;
  avatar?: string;
}

export type WorkflowStatus =
  | 'draft'
  | 'submitted'
  | 'sales_head_review'
  | 'sbu_head_review'
  | 'president_review'
  | 'finance_intervention'
  | 'ceo_review'
  | 'approved'
  | 'rejected'
  | 'revised';

export interface PriceListItem {
  id: string;
  productName: string;
  itemCode: string;
  salesVolume: number;
  git: number;
  freight: number;
  calculatedFloorPrice: number;
  budgetPrice: number;
  variance: number;
  floorPrice: number;
  remarks: string;
  isEdited: boolean;
}

export interface ApprovalStep {
  id: string;
  step: WorkflowStatus;
  label: string;
  approver?: string;
  timestamp?: string;
  comment?: string;
  action?: 'approved' | 'revised' | 'rejected';
}

export interface AuditEntry {
  id: string;
  action: string;
  user: string;
  role: string;
  timestamp: string;
  comment?: string;
  previousValue?: string;
  newValue?: string;
}

export type ItemCodeStatus = 'draft' | 'submitted_to_finance' | 'finance_approved' | 'sent_to_erp';

export interface ItemCode {
  id: string;
  code: string;
  description: string;
  uom: string;
  submittedPrice: number;
  lastPrice: number;
  variableCost?: number;
  businessContribution?: number;
  status: ItemCodeStatus;
  error?: string;
}

export interface ProductWithItemCodes {
  id: string;
  productName: string;
  approvedFloorPrice: number;
  itemCodes: ItemCode[];
  isExpanded?: boolean;
}

export type ERPStatus = 'pending' | 'in_progress' | 'success' | 'failed';

export interface ERPRecord {
  id: string;
  itemCode: string;
  productName: string;
  price: number;
  status: ERPStatus;
  lastUpdated: string;
  errorMessage?: string;
  retryCount: number;
}

export interface Notification {
  id: string;
  type: 'action_required' | 'info' | 'success' | 'warning' | 'error';
  title: string;
  description: string;
  timestamp: string;
  isRead: boolean;
  link?: string;
  role?: UserRole[];
}

export interface ApprovalMatrix {
  sales_head: string;
  sbu_head: string;
  president: string;
  ceo: string;
}

export interface FinanceReviewItem {
  id: string;
  productName: string;
  itemCode: string;
  submittedPrice: number;
  lastPrice: number;
  budgetPrice: number;
  variableCost: number;
  businessContribution: number;
  financeComment: string;
  status: 'pending' | 'approved' | 'rejected';
}
